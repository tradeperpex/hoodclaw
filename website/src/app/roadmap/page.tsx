export const metadata = {
  title: "Roadmap — The Agent Company",
  description: "What we've built, what's next, and where The Agent Company is heading.",
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
    description: "the company comes online — five agents running 24/7 on solana.",
    items: [
      "exec, claim, buyback, burn, lp agents deployed",
      "on-chain proof of work for every cycle",
      "real-time activity feed and stats dashboard",
      "exec reasoning log after every cycle",
      "multi-agent chat interface",
      "technical documentation",
    ],
  },
  {
    id: "02",
    title: "deeper mind",
    status: "active",
    description: "richer inter-agent reasoning. full transparency into every decision and handoff.",
    items: [
      "per-agent reasoning history explorer",
      "agent-to-agent decision timeline with before/after state",
      "strategy weighting and tuning",
      "advanced analytics and cycle breakdowns",
      "agent activity heatmap",
    ],
  },
  {
    id: "03",
    title: "launch platform",
    status: "upcoming",
    description: "let anyone deploy their own five-agent company for any token.",
    items: [
      "one-click company + token deployment",
      "custom strategy profiles per agent",
      "agent configuration dashboard",
      "shared infrastructure and shared agent intelligence",
    ],
  },
  {
    id: "04",
    title: "ecosystem",
    status: "upcoming",
    description: "a network of agent companies, interacting and evolving across chains.",
    items: [
      "cross-company agent communication",
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
          {done} of {phases.length} phases shipped. every phase is a step toward token companies that run themselves entirely.
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
