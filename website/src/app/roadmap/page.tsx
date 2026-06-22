export const metadata = {
  title: "Roadmap — AgentClaw",
  description: "What we've built, what's next, and where AgentClaw is heading.",
};

interface Phase {
  id: string;
  title: string;
  status: "completed" | "active" | "upcoming";
  description: string;
  items: string[];
}

const phases: Phase[] = [
  {
    id: "01",
    title: "foundation",
    status: "completed",
    description: "the autonomous agent — live on solana, running 24/7.",
    items: [
      "single-agent buyback & burn engine",
      "on-chain proof of work",
      "real-time dashboard",
      "ai reasoning after every cycle",
      "technical documentation",
    ],
  },
  {
    id: "02",
    title: "deeper mind",
    status: "active",
    description: "richer reasoning. full transparency into every decision.",
    items: [
      "reasoning history explorer",
      "decision timeline with before/after state",
      "strategy weighting and tuning",
      "advanced analytics & cycle breakdowns",
    ],
  },
  {
    id: "03",
    title: "launch platform",
    status: "upcoming",
    description: "let anyone deploy their own agent-managed token.",
    items: [
      "one-click agent + token deployment",
      "custom strategy profiles",
      "agent configuration dashboard",
      "shared infrastructure",
    ],
  },
  {
    id: "04",
    title: "ecosystem",
    status: "upcoming",
    description: "a network of single-agent tokens, interacting and evolving.",
    items: [
      "agent-to-agent communication",
      "community strategy marketplace",
      "multi-chain expansion",
      "open-source agent sdk",
    ],
  },
];

const STATUS: Record<Phase["status"], string> = {
  completed: "done",
  active: "in progress",
  upcoming: "upcoming",
};

export default function RoadmapPage() {
  const done = phases.filter((p) => p.status === "completed").length;

  return (
    <div className="page">
      <section>
        <div className="page-label">roadmap</div>
        <h1 className="page-title">what comes next</h1>
        <p className="page-sub">
          {done} of {phases.length} phases shipped. every phase is a step toward tokens that manage themselves.
        </p>
      </section>

      {phases.map((phase) => (
        <section key={phase.id} className="phase-block">
          <div className="phase-head">
            <span className="phase-name">phase {phase.id} — {phase.title}</span>
            <span className="phase-status">{STATUS[phase.status]}</span>
          </div>
          <p className="phase-desc">{phase.description}</p>
          <div className="phase-items">
            {phase.items.map((item, i) => (
              <div
                key={i}
                className={`phase-item${phase.status === "completed" ? " done" : ""}`}
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
