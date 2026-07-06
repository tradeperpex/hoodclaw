export default function StatusPulse({ label = "active" }: { label?: string }) {
  return (
    <span className="status-pulse">
      <span className="status-pulse-dot" aria-hidden="true">
        <span className="status-pulse-ring" />
        <span className="status-pulse-core" />
      </span>
      <span className="status-pulse-label">{label}</span>
    </span>
  );
}
