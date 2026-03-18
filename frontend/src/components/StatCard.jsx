export default function StatCard({ icon, label, value, color, sub, subColor }) {
  return (
    <div className="card stat-card" style={{ borderTop: `2px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value" style={{ color, marginTop: 8 }}>{value}</div>
          {sub && (
            <div className="stat-delta" style={{ color: subColor || "var(--text-muted)" }}>{sub}</div>
          )}
        </div>
        <div style={{
          fontSize: 22,
          color,
          opacity: 0.5,
          lineHeight: 1,
          marginTop: 2,
        }}>{icon}</div>
      </div>
    </div>
  );
}
