import { Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

const DEFAULT_RPC = "https://api.mainnet-beta.solana.com";

function loadKeypair(secret: string): Keypair {
  if (!secret || secret.trim() === "") {
    throw new Error("AGENT_PRIVATE_KEY env mangler. Sæt base58 eller JSON array.");
  }
  try {
    const decoded = bs58.decode(secret);
    return Keypair.fromSecretKey(decoded);
  } catch {
    const arr = JSON.parse(secret) as number[];
    return Keypair.fromSecretKey(new Uint8Array(arr));
  }
}

function parseRpcUrl(raw: string | undefined): string {
  const url = (raw ?? DEFAULT_RPC).trim();
  if (!url) throw new Error("RPC_URL mangler");
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error(`RPC_URL skal starte med http:// eller https://. Fik: "${url.slice(0, 50)}..."`);
  }
  return url;
}

export type AgentConfig = {
  rpcUrl: string;
  agentKeypair: Keypair;
  mint: PublicKey;
  minClaimSol: number;
  cycleIntervalMs: number;
  rpcDelayMs: number;
};

let _config: AgentConfig | null = null;

/**
 * Lazy-loaded so build/SSG doesn't crash when env vars are missing.
 * pump.fun / PumpSwap are fully on-chain — no API key required. The agent
 * wallet is the coin creator and collects its own creator fees.
 */
export function getConfig(): AgentConfig {
  if (_config) return _config;
  const rpcRaw = process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL || DEFAULT_RPC;
  _config = {
    rpcUrl: parseRpcUrl(rpcRaw),
    agentKeypair: loadKeypair(process.env.AGENT_PRIVATE_KEY ?? ""),
    mint: new PublicKey(process.env.MINT_ADDRESS ?? "11111111111111111111111111111111"),
    minClaimSol: parseFloat(process.env.MIN_CLAIM_SOL ?? "0.01"),
    cycleIntervalMs: parseInt(process.env.CYCLE_INTERVAL_MS ?? "60000", 10),
    rpcDelayMs: parseInt(process.env.RPC_DELAY_MS ?? "200", 10),
  };
  return _config;
}
