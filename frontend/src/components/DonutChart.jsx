export default function DonutChart({ ok, ng, size = 100 }) {
  const total = ok + ng;
  const okPct = total ? ok / total : 1;
  const r = 36;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const okDash = circ * okPct;
  const ngDash = circ * (1 - okPct);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-base)" strokeWidth="10" />
      {/* OK arc */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="var(--ok-color)"
        strokeWidth="10"
        strokeDasharray={`${okDash} ${circ - okDash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        opacity="0.85"
      />
      {/* NG arc */}
      {ng > 0 && (
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="var(--ng-color)"
          strokeWidth="10"
          strokeDasharray={`${ngDash} ${circ - ngDash}`}
          strokeLinecap="round"
          transform={`rotate(${-90 + 360 * okPct} ${cx} ${cy})`}
          opacity="0.85"
        />
      )}
      {/* Center text */}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="14" fontFamily="var(--font-mono)" fill="var(--text-primary)" fontWeight="bold">
        {total ? Math.round(okPct * 100) : 100}%
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fontFamily="var(--font-cond)" fill="var(--text-muted)" letterSpacing="0.08em">
        OK RATE
      </text>
    </svg>
  );
}
