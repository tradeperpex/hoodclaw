import { NextResponse } from "next/server";
import { getAgentStats } from "@/lib/agent-db";
import { sanitizeModelText } from "@/lib/agent/kie";

type FeedEntry = { time?: string; action?: string; detail?: string; sig?: string; strategy?: string };

/** Henter agent-data fra Supabase. Opdateres når du kører npm run buyback i agent/. */
export async function GET(request: Request) {
  const fresh = new URL(request.url).searchParams.get("fresh") === "1";

  try {
    const db = await getAgentStats();
    const rawFeed: FeedEntry[] = Array.isArray(db?.feed_entries) ? db.feed_entries : [];
    const feedEntries = rawFeed.map((e) =>
      e?.detail ? { ...e, detail: sanitizeModelText(e.detail) } : e,
    );
    const json = {
      thought: db?.thought ? sanitizeModelText(db.thought) : "Waiting for fees.",
      thoughtMeta: db?.thought_meta ?? "· FableClaw",
      feedEntries,
      updatedAt: db?.updated_at ?? null,
      stats: {
        treasurySol: db?.treasury_sol ?? 0,
        totalClaimed: db?.total_claimed ?? 0,
        totalCreatorShare: db?.total_creator_share ?? 0,
        totalBurned: db?.total_burned ?? 0,
        totalBoughtBack: db?.total_bought_back ?? 0,
        totalLpSol: db?.total_lp_sol ?? 0,
      },
    };
    return NextResponse.json(json, {
      headers: fresh
        ? { "Cache-Control": "no-store, max-age=0" }
        : { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30" },
    });
  } catch (err) {
    console.error("[agent-stats]", err);
    return NextResponse.json(
      { error: "Could not fetch data" },
      { status: 500 }
    );
  }
}
