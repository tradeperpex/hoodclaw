import { NextResponse } from "next/server";
import { runCycle } from "@/lib/agent/run";
import { saveAgentCycle, getStats } from "@/lib/agent/db";
import { generateThoughtForCycle } from "@/lib/agent/thought";

export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isCronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization") ?? "";
  const vercelCron = request.headers.get("x-vercel-cron") === "1";

  if (secret && auth === `Bearer ${secret}`) return true;
  if (process.env.VERCEL === "1" && vercelCron) return true;
  return false;
}

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runCycle();
    console.log("Cron result:", JSON.stringify(result));

    if (result.ok) {
      const isSkipped = "skipped" in result && result.skipped;
      const stats = await getStats();
      const strategy = "strategy" in result ? result.strategy : undefined;

      const thought = await generateThoughtForCycle({
        claimed: "claimed" in result ? result.claimed : undefined,
        boughtBackSol: "boughtBackSol" in result ? result.boughtBackSol : undefined,
        burnedTokens: "burnedTokens" in result ? result.burnedTokens : undefined,
        lpSol: "lpSol" in result ? result.lpSol : undefined,
        treasurySol: result.treasurySol,
        skipped: isSkipped,
        totalClaimed: stats?.total_claimed ?? 0,
        totalBurned: stats?.total_burned ?? 0,
        totalBoughtBack: stats?.total_bought_back ?? 0,
        strategy,
      });

      console.log(`[thought] "${thought.text}"`);

      await saveAgentCycle({
        claimed: "claimed" in result ? result.claimed : undefined,
        creatorShare: "creatorShare" in result ? result.creatorShare : undefined,
        boughtBackSol: "boughtBackSol" in result ? result.boughtBackSol : undefined,
        burnedTokens: "burnedTokens" in result ? result.burnedTokens : undefined,
        lpSol: "lpSol" in result ? result.lpSol : undefined,
        treasurySol: result.treasurySol,
        skipped: isSkipped,
        thought: thought.text,
        strategy,
        txs: "txs" in result ? result.txs : undefined,
      });

      return NextResponse.json({ ok: true, result });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[Cron] Fejl:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
