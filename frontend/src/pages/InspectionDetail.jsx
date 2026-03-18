import { useParams, useNavigate } from "react-router-dom";
import { DEVICES, INSPECTIONS_BY_DEVICE, ALARMS } from "../data/mockData";
import DonutChart from "../components/DonutChart";

export default function InspectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const device = DEVICES.find(d => d.id === id);
  const stats = INSPECTIONS_BY_DEVICE[id] || { ok: 0, ng: 0 };
  const total = stats.ok + stats.ng;
  const okRate = total ? (stats.ok / total * 100).toFixed(1) : "0.0";
  const ngRate = total ? (stats.ng / total * 100).toFixed(1) : "0.0";

  // 해당 장비 관련 알람
  const relatedAlarms = ALARMS.filter(a => device && a.device === device.name)
    .sort((a, b) => b.time.localeCompare(a.time));

  const SEV = {
    critical: { label: "CRITICAL", color: "var(--ng-color)",   bg: "rgba(255,61,87,.1)" },
    warning:  { label: "WARNING",  color: "var(--warn-color)", bg: "rgba(255,145,0,.08)" },
    info:     { label: "INFO",     color: "var(--accent-blue)",bg: "rgba(33,150,243,.08)" },
  };

  if (!device) {
    return (
      <div className="page">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: 12 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ng-color)" }}>장비를 찾을 수 없습니다: {id}</div>
          <button onClick={() => navigate("/inspection")} style={backBtnStyle}>← 목록으로</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button onClick={() => navigate("/inspection")} style={backBtnStyle}>← 목록</button>
        <div className="page-title-icon">◉</div>
        <h1 className="page-title">{device.name} 검사 상세</h1>
        <span className="mono" style={{ marginLeft: 8, fontSize: 12, color: "var(--text-muted)" }}>{device.id}</span>
      </div>

      {/* 통계 카드 */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="card" style={{ borderTop: "2px solid var(--accent-blue)" }}>
          <div className="stat-label">총 검사</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--accent-blue)", marginTop: 6 }}>{total.toLocaleString()}</div>
        </div>
        <div className="card" style={{ borderTop: "2px solid var(--ok-color)" }}>
          <div className="stat-label">OK</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--ok-color)", marginTop: 6 }}>{stats.ok.toLocaleString()}</div>
        </div>
        <div className="card" style={{ borderTop: "2px solid var(--ng-color)" }}>
          <div className="stat-label">NG</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--ng-color)", marginTop: 6 }}>{stats.ng.toLocaleString()}</div>
        </div>
        <div className="card" style={{ borderTop: "2px solid var(--warn-color)" }}>
          <div className="stat-label">NG율</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 28,
            color: parseFloat(ngRate) > 8 ? "var(--ng-color)" : parseFloat(ngRate) > 4 ? "var(--warn-color)" : "var(--ok-color)",
            marginTop: 6 }}>{ngRate}%</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* 도넛 차트 */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>OK / NG 비율</div>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <DonutChart ok={stats.ok} ng={stats.ng} size={140} />
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--font-cond)", fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em" }}>OK</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ok-color)" }}>{okRate}%</span>
                </div>
                <div className="prog-bar"><div className="prog-fill" style={{ width: `${okRate}%`, background: "var(--ok-color)" }} /></div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--font-cond)", fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em" }}>NG</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ng-color)" }}>{ngRate}%</span>
                </div>
                <div className="prog-bar"><div className="prog-fill" style={{ width: `${ngRate}%`, background: "var(--ng-color)" }} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* 장비 기본 정보 */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>장비 정보</div>
          {[
            { label: "위치",       value: device.location },
            { label: "상태",       value: device.status === "ok" ? "정상" : device.status === "ng" ? "NG 발생" : device.status === "warn" ? "경고" : "유휴" },
            { label: "마지막 확인", value: device.lastSeen },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontFamily: "var(--font-cond)", fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em" }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 관련 알람 */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>관련 알람 ({relatedAlarms.length}건)</div>
        {relatedAlarms.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 24, fontFamily: "var(--font-mono)", fontSize: 12 }}>
            관련 알람 없음
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>알람 ID</th><th>발생 시각</th><th>등급</th><th>내용</th></tr>
            </thead>
            <tbody>
              {relatedAlarms.map(a => {
                const cfg = SEV[a.severity];
                return (
                  <tr key={a.id}>
                    <td className="mono" style={{ fontSize: 11 }}>{a.id}</td>
                    <td className="mono" style={{ fontSize: 11 }}>{a.time}</td>
                    <td>
                      <span style={{ display: "inline-block", padding: "2px 7px", borderRadius: 4,
                        background: cfg.bg, color: cfg.color, fontFamily: "var(--font-cond)",
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", border: `1px solid ${cfg.color}30` }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: 12 }}>{a.message}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const backBtnStyle = {
  background: "var(--bg-card)",
  border: "1px solid var(--border-bright)",
  borderRadius: 6,
  color: "var(--text-secondary)",
  fontFamily: "var(--font-cond)",
  fontSize: 12,
  padding: "5px 12px",
  cursor: "pointer",
  letterSpacing: "0.05em",
};
