/**
 * The Agent Company agent – core cycle logic.
 * Én autonom agent: collect creator fees (pump.fun) → 100% buyback + burn
 * (+ LP via PumpSwap hvis token er graduated til AMM).
 *
 * Handel kører direkte on-chain:
 *  - Bonding curve (pre-graduation): @pump-fun/pump-sdk buy instructions.
 *  - PumpSwap AMM (post-graduation):  @pump-fun/pump-swap-sdk swap + deposit.
 * Ingen API-nøgle nødvendig — agent-wallet er coin creator.
 */

import { Connection, ComputeBudgetProgram, Keypair, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  createBurnInstruction,
  getAccount,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import BN from "bn.js";
import { OnlinePumpSdk, PumpSdk, getBuyTokenAmountFromSolAmount } from "@pump-fun/pump-sdk";
import { OnlinePumpAmmSdk, PumpAmmSdk, canonicalPumpPoolPda } from "@pump-fun/pump-swap-sdk";
import { getConfig } from "./config";

const LAMPORTS_PER_SOL = 1e9;
const COMMITMENT = "confirmed" as const;
const SLIPPAGE_PCT = 5;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export type TxRecord = { sig: string; type: "claim" | "buyback" | "burn" | "lp-buy" | "lp-deposit"; time: string };

export type Strategy = {
  name: string;
  buybackFraction: number;
  lpFraction: number;
};

const STRATEGIES: (Strategy & { weight: number })[] = [
  { name: "burn-heavy",  buybackFraction: 0.85, lpFraction: 0.15, weight: 30 },
  { name: "balanced",    buybackFraction: 0.50, lpFraction: 0.50, weight: 25 },
  { name: "lp-focus",    buybackFraction: 0.15, lpFraction: 0.85, weight: 20 },
  { name: "full-burn",   buybackFraction: 1.0,  lpFraction: 0.0,  weight: 15 },
  { name: "full-lp",     buybackFraction: 0.0,  lpFraction: 1.0,  weight: 10 },
];

function pickStrategy(): Strategy {
  const totalWeight = STRATEGIES.reduce((sum, s) => sum + s.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const s of STRATEGIES) {
    roll -= s.weight;
    if (roll <= 0) return { name: s.name, buybackFraction: s.buybackFraction, lpFraction: s.lpFraction };
  }
  return STRATEGIES[0];
}

export type CycleResult =
  | { ok: true; skipped: true; reason: string; treasurySol?: number }
  | { ok: true; claimed: number; creatorShare: number; boughtBackSol: number; burnedTokens: number; lpSol: number; treasurySol?: number; txs?: TxRecord[]; strategy?: string }
  | { ok: false; error: string };

/** Er token graduated til PumpSwap AMM? (bonding curve complete eller fjernet) */
async function isGraduated(onlineSdk: OnlinePumpSdk, mint: PublicKey): Promise<boolean> {
  try {
    const bc = await onlineSdk.fetchBondingCurve(mint);
    return bc.complete;
  } catch {
    // Ingen bonding curve fundet → antag migreret til AMM.
    return true;
  }
}

export async function runCycle(): Promise<CycleResult> {
  const config = getConfig();
  const connection = new Connection(config.rpcUrl, {
    commitment: COMMITMENT,
    confirmTransactionInitialTimeout: 90_000,
  });
  const agent = config.agentKeypair;
  const user = agent.publicKey;
  const mint = config.mint;

  const onlineSdk = new OnlinePumpSdk(connection);
  const pumpSdk = new PumpSdk();
  const onlineAmm = new OnlinePumpAmmSdk(connection);
  const ammSdk = new PumpAmmSdk();

  console.log(`[${new Date().toISOString()}] Starter cyklus...`);

  // 1. Læs claimbare creator fees (begge programmer: bonding curve + AMM)
  let claimableLamports = new BN(0);
  try {
    claimableLamports = await onlineSdk.getCreatorVaultBalanceBothPrograms(user);
  } catch (err) {
    console.warn("  Kunne ikke hente creator-vault balance:", err instanceof Error ? err.message : err);
  }

  const balanceSol = claimableLamports.toNumber() / LAMPORTS_PER_SOL;

  if (balanceSol < config.minClaimSol) {
    console.log(`  For lidt at claim (${balanceSol.toFixed(4)} SOL). Spring over.`);
    return { ok: true, skipped: true, reason: "For lidt at claim", treasurySol: balanceSol };
  }

  const graduated = await isGraduated(onlineSdk, mint);
  const poolKey = graduated ? canonicalPumpPoolPda(mint) : null;
  console.log(`  Graduated: ${graduated}${poolKey ? ` (pool ${poolKey.toBase58().slice(0, 8)}…)` : ""}`);

  const txs: TxRecord[] = [];
  const now = () => new Date().toISOString();

  // 2. Collect creator fees → SOL i agent-wallet
  const claimIxs = await onlineSdk.collectCoinCreatorFeeInstructions(user);
  if (claimIxs.length > 0) {
    const claimSig = await sendIxs(connection, claimIxs, agent);
    txs.push({ sig: claimSig, type: "claim", time: now() });
    console.log(`  Claimed ${balanceSol.toFixed(4)} SOL. Tx: ${claimSig}`);
  }

  const netSol = balanceSol;

  if (netSol < 0.005) {
    console.log("  For lidt til buyback/LP. Færdig.");
    return { ok: true, claimed: netSol, creatorShare: 0, boughtBackSol: 0, burnedTokens: 0, lpSol: 0, treasurySol: netSol, txs };
  }

  // 3. Vælg strategi (LP kun muligt efter graduation til PumpSwap)
  let strategy: Strategy;
  if (graduated && poolKey) {
    strategy = pickStrategy();
    console.log(`  Strategy: ${strategy.name} (${Math.round(strategy.buybackFraction * 100)}% buyback, ${Math.round(strategy.lpFraction * 100)}% LP)`);
  } else {
    strategy = { name: "bonding-curve", buybackFraction: 1, lpFraction: 0 };
  }

  let buybackAmount = netSol * strategy.buybackFraction;
  const lpAmount = netSol * strategy.lpFraction;

  let boughtBackSol = 0;
  let burnedTokens = 0;
  let lpSol = 0;

  // 4. Add LP (PumpSwap) – fallback til buyback hvis det fejler
  if (strategy.lpFraction > 0 && graduated && poolKey) {
    try {
      const lpTxs = await doAddLp(connection, onlineAmm, ammSdk, agent, poolKey, lpAmount);
      txs.push(...lpTxs);
      lpSol = lpAmount;
    } catch (err) {
      console.warn("  [LP] Fejl ved add LP – bruger alt til buyback i stedet:", err instanceof Error ? err.message : err);
      buybackAmount += lpAmount;
    }
  }

  // 5. Buyback + burn
  if (buybackAmount > 0) {
    const { burned, sigs } = await doBuyback(connection, { onlineSdk, pumpSdk, onlineAmm, ammSdk }, agent, mint, poolKey, buybackAmount);
    txs.push(...sigs);
    burnedTokens = burned;
    boughtBackSol = buybackAmount;
  }

  return {
    ok: true,
    claimed: netSol,
    creatorShare: 0,
    boughtBackSol,
    burnedTokens,
    lpSol,
    treasurySol: netSol,
    txs,
    strategy: strategy.name,
  };
}

type Sdks = {
  onlineSdk: OnlinePumpSdk;
  pumpSdk: PumpSdk;
  onlineAmm: OnlinePumpAmmSdk;
  ammSdk: PumpAmmSdk;
};

/** SOL → token swap. Bonding curve (pump) eller PumpSwap AMM afhængigt af graduation. */
async function swapSolForToken(
  connection: Connection,
  sdks: Sdks,
  agent: Keypair,
  mint: PublicKey,
  poolKey: PublicKey | null,
  solAmount: number,
  tokenProgram: PublicKey
): Promise<string> {
  const lamports = new BN(Math.floor(solAmount * LAMPORTS_PER_SOL));
  const user = agent.publicKey;

  if (poolKey) {
    // PumpSwap AMM: køb base-tokens for et eksakt quote-input (SOL).
    const swapState = await sdks.onlineAmm.swapSolanaState(poolKey, user);
    const ixs = await sdks.ammSdk.buyQuoteInput(swapState, lamports, SLIPPAGE_PCT);
    return await sendIxs(connection, ixs, agent);
  }

  // Bonding curve: køb via pump-programmet.
  const [global, feeConfig, buyState] = await Promise.all([
    sdks.onlineSdk.fetchGlobal(),
    sdks.onlineSdk.fetchFeeConfig(),
    sdks.onlineSdk.fetchBuyState(mint, user),
  ]);

  const amount = getBuyTokenAmountFromSolAmount({
    global,
    feeConfig,
    mintSupply: buyState.bondingCurve.tokenTotalSupply,
    bondingCurve: buyState.bondingCurve,
    amount: lamports,
    quoteMint: NATIVE_MINT,
  });

  const ixs = await sdks.pumpSdk.buyInstructions({
    global,
    bondingCurveAccountInfo: buyState.bondingCurveAccountInfo,
    bondingCurve: buyState.bondingCurve,
    associatedUserAccountInfo: buyState.associatedUserAccountInfo,
    mint,
    user,
    amount,
    solAmount: lamports,
    slippage: SLIPPAGE_PCT,
    tokenProgram,
  });
  return await sendIxs(connection, ixs, agent);
}

async function doBuyback(
  connection: Connection,
  sdks: Sdks,
  agent: Keypair,
  mint: PublicKey,
  poolKey: PublicKey | null,
  solAmount: number
): Promise<{ burned: number; sigs: TxRecord[] }> {
  const sigs: TxRecord[] = [];
  const now = () => new Date().toISOString();

  const tokenProgram = await getMintTokenProgram(connection, mint);
  const agentTokenAta = getAssociatedTokenAddressSync(mint, agent.publicKey, true, tokenProgram);

  const buySig = await swapSolForToken(connection, sdks, agent, mint, poolKey, solAmount, tokenProgram);
  sigs.push({ sig: buySig, type: "buyback", time: now() });
  console.log(`  Buyback: ${solAmount.toFixed(4)} SOL → tokens`);

  await sleep(3000);

  let balance = await getTokenBalance(connection, agentTokenAta, tokenProgram);
  if (balance === BigInt(0)) {
    await sleep(3000);
    balance = await getTokenBalance(connection, agentTokenAta, tokenProgram);
  }

  if (balance > BigInt(0)) {
    console.log(`  [Burn] ${balance} tokens i wallet → brænder alt`);
    const burnIx = createBurnInstruction(agentTokenAta, mint, agent.publicKey, balance, [], tokenProgram);
    const burnSig = await sendIxs(connection, [burnIx], agent);
    sigs.push({ sig: burnSig, type: "burn", time: now() });
    console.log(`  Burned ${balance.toString()} tokens`);
    return { burned: Number(balance), sigs };
  }
  console.log("  Ingen tokens at brænde.");
  return { burned: 0, sigs };
}

/**
 * Tilføjer likviditet til PumpSwap-poolen: zapper en del af SOL'en til base-tokens,
 * og deponerer derefter resten af SOL'en + de købte tokens som en LP-position.
 */
async function doAddLp(
  connection: Connection,
  onlineAmm: OnlinePumpAmmSdk,
  ammSdk: PumpAmmSdk,
  agent: Keypair,
  pool: PublicKey,
  solAmount: number
): Promise<TxRecord[]> {
  const records: TxRecord[] = [];
  const now = () => new Date().toISOString();
  const user = agent.publicKey;

  const buySol = solAmount * 0.6;
  const depositSol = solAmount * 0.4;

  // Zap: skaf base-tokens til den ene side af positionen
  const buyState = await onlineAmm.swapSolanaState(pool, user);
  const buyIxs = await ammSdk.buyQuoteInput(buyState, new BN(Math.floor(buySol * LAMPORTS_PER_SOL)), SLIPPAGE_PCT);
  const buySig = await sendIxs(connection, buyIxs, agent);
  records.push({ sig: buySig, type: "lp-buy", time: now() });
  console.log(`  LP zap: købt tokens med ${buySol.toFixed(4)} SOL`);

  await sleep(4000);

  // Deposit: SOL (quote) + tokens (base) → LP-position
  const liqState = await onlineAmm.liquiditySolanaState(pool, user);
  const depositQuote = new BN(Math.floor(depositSol * LAMPORTS_PER_SOL));
  const { lpToken } = ammSdk.depositAutocompleteBaseAndLpTokenFromQuote(liqState, depositQuote, SLIPPAGE_PCT);
  const depositIxs = await ammSdk.depositInstructions(liqState, lpToken, SLIPPAGE_PCT);
  const depSig = await sendIxs(connection, depositIxs, agent);
  records.push({ sig: depSig, type: "lp-deposit", time: now() });
  console.log(`  Add LP: ${depositSol.toFixed(4)} SOL + tokens. Tx: ${depSig}`);

  return records;
}

/** Finder ud af om mint'en bruger SPL Token eller Token-2022. */
async function getMintTokenProgram(connection: Connection, mint: PublicKey): Promise<PublicKey> {
  const info = await connection.getAccountInfo(mint);
  if (info && info.owner.equals(TOKEN_2022_PROGRAM_ID)) return TOKEN_2022_PROGRAM_ID;
  return TOKEN_PROGRAM_ID;
}

async function getTokenBalance(connection: Connection, ata: PublicKey, tokenProgram: PublicKey): Promise<bigint> {
  try {
    const acc = await getAccount(connection, ata, "confirmed", tokenProgram);
    return acc.amount;
  } catch {
    return BigInt(0);
  }
}

/** Pakker instruktioner i en transaktion (med compute budget) og sender med retry. */
async function sendIxs(
  connection: Connection,
  instructions: TransactionInstruction[],
  signer: Keypair,
  extraSigners: Keypair[] = []
): Promise<string> {
  const tx = new Transaction().add(...instructions);
  return await sendAndConfirm(connection, tx, signer, extraSigners);
}

async function sendAndConfirm(
  connection: Connection,
  tx: Transaction,
  signer: Keypair,
  extraSigners: Keypair[] = []
): Promise<string> {
  tx.feePayer = signer.publicKey;

  const computeIx = [
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100_000 }),
    ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 }),
  ];
  tx.instructions = [...computeIx, ...tx.instructions];

  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
      tx.recentBlockhash = blockhash;
      tx.signatures = [];

      const sig = await connection.sendTransaction(tx, [signer, ...extraSigners], {
        skipPreflight: false,
        preflightCommitment: "processed",
        maxRetries: 5,
      });
      console.log(`  [Tx sendt] sig=${sig.slice(0, 16)}… forsøg ${attempt}/${maxAttempts}`);

      const result = await connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        "confirmed"
      );

      if (result.value.err) {
        throw new Error(`Tx fejlede on-chain: ${JSON.stringify(result.value.err)}`);
      }
      return sig;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isExpired = msg.includes("block height exceeded") || msg.includes("BlockheightExceeded") || msg.includes("expired");
      if (isExpired && attempt < maxAttempts) {
        console.log(`  [Forsøg ${attempt}/${maxAttempts}] Blockhash udløb – prøver igen...`);
        continue;
      }
      throw err;
    }
  }
  throw new Error("Send fejlede efter " + maxAttempts + " forsøg");
}
