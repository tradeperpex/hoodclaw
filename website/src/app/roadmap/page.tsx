export const metadata = {
  title: "Roadmap — OnlyClaw",
  description: "What we've built, what's next, and where OnlyClaw is heading.",
};

interface Phase {
  id: string;
  title: string;
  status: "completed" | "active" | "upcoming";
  description: string;
  items: string[];
  accent: string;
}

const phases: Phase[] = [
  {
    id: "01",
    title: "Foundation",
    status: "completed",
    description: "The autonomous agent — live on Solana, running 24/7.",
    accent: "#059669",
    items: [
      "Single-agent buyback & burn engine",
      "On-chain proof of work (verified TXs)",
      "Real-time dashboard with live stats",
      "AI-powered reasoning after every cycle",
      "Technical documentation",
    ],
  },
  {
    id: "02",
    title: "Deeper Mind",
    status: "active",
    description: "Richer reasoning. Full transparency into every decision the agent makes.",
    accent: "#2563EB",
    items: [
      "Reasoning history explorer",
      "Decision timeline with before/after state",
      "Strategy weighting and tuning",
      "Advanced analytics & cycle breakdowns",
    ],
  },
  {
    id: "03",
    title: "Launch Platform",
    status: "upcoming",
    description: "Let anyone deploy their own agent-managed token.",
    accent: "#7C3AED",
    items: [
      "One-click agent + token deployment",
      "Custom strategy profiles & personalities",
      "Agent configuration dashboard",
      "Shared infrastructure — no servers needed",
    ],
  },
  {
    id: "04",
    title: "Ecosystem",
    status: "upcoming",
    description: "A network of single-agent tokens, interacting and evolving.",
    accent: "#D97706",
    items: [
      "Agent-to-agent communication layer",
      "Community-driven strategy marketplace",
      "Multi-chain expansion",
      "Open-source agent SDK",
    ],
  },
];

function StatusBadge({ status }: { status: Phase["status"] }) {
  const labels = { completed: "Done", active: "In Progress", upcoming: "Upcoming" };
  return (
    <span className={`rmp-status rmp-status--${status}`}>
      {status === "active" && <span className="rmp-status-pulse" />}
      {labels[status]}
    </span>
  );
}

export default function RoadmapPage() {
  const completedCount = phases.filter((p) => p.status === "completed").length;
  const progress = Math.round((completedCount / phases.length) * 100);

  return (
    <div className="rmp">
      {/* Hero */}
      <div className="rmp-hero">
        <span className="rmp-hero-eyebrow">Roadmap</span>
        <h1 className="rmp-hero-title">
          Building the future of<br /><em>autonomous tokens.</em>
        </h1>
        <p className="rmp-hero-sub">
          Every phase is a step toward a world where tokens manage themselves.
        </p>
        <div className="rmp-progress">
          <div className="rmp-progress-bar">
            <div className="rmp-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="rmp-progress-label">
            {completedCount} of {phases.length} phases shipped — {progress}%
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="rmp-timeline">
        {phases.map((phase, idx) => (
          <div className={`rmp-phase rmp-phase--${phase.status}`} key={phase.id}>
            {/* Timeline line + dot */}
            <div className="rmp-tl">
              <div
                className={`rmp-tl-dot rmp-tl-dot--${phase.status}`}
                style={phase.status !== "upcoming" ? { background: phase.accent } : undefined}
              >
                {phase.status === "completed" && (
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7.5L5.5 10L11 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {phase.status === "active" && <span className="rmp-tl-pulse" />}
              </div>
              {idx < phases.length - 1 && <div className="rmp-tl-line" />}
            </div>

            {/* Content */}
            <div className="rmp-phase-content">
              <div className="rmp-phase-header">
                <span className="rmp-phase-id">Phase {phase.id}</span>
                <StatusBadge status={phase.status} />
              </div>
              <h2 className="rmp-phase-title">{phase.title}</h2>
              <p className="rmp-phase-desc">{phase.description}</p>
              <ul className="rmp-phase-items">
                {phase.items.map((item, i) => (
                  <li key={i} className={phase.status === "completed" ? "rmp-item--done" : ""}>
                    {phase.status === "completed" ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span className="rmp-item-bullet" style={phase.status === "active" ? { borderColor: phase.accent } : undefined} />
                    )}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
