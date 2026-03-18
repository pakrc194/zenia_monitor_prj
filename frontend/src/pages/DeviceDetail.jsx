import { useParams, useNavigate } from "react-router-dom";
import { DEVICES, INSPECTIONS_BY_DEVICE } from "../data/mockData";

const STATUS_LABEL = { ok: "정상", ng: "NG 발생", warn: "경고", idle: "유휴" };

export default function DeviceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const device = DEVICES.find(d => d.id === id);
  const stats = INSPECTIONS_BY_DEVICE[id] || { ok: 0, ng: 0 };
  const total = stats.ok + stats.ng;
  const okRate = total ? (stats.ok / total * 100).toFixed(1) : "0.0";
  const ngRate = total ? (stats.ng / total * 100).toFixed(1) : "0.0";

  if (!device) {
    return (
      <div className="page">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: 12 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ng-color)" }}>
            장비를 찾을 수 없습니다: {id}
          </div>
          <button onClick={() => navigate("/devices")} style={backBtnStyle}>← 목록으로</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button onClick={() => navigate("/devices")} style={backBtnStyle}>← 목록</button>
        <div className="page-title-icon">◈</div>
        <h1 className="page-title">{device.name}</h1>
        <span className={`badge ${device.status}`} style={{ marginLeft: 8 }}>
          <span className="badge-dot" />
          {STATUS_LABEL[device.status]}
        </span>
      </div>

      {/* 기본 정보 */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="stat-label">장비 ID</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 20, color: "var(--text-mono)", marginTop: 8 }}>{device.id}</div>
        </div>
        <div className="card">
          <div className="stat-label">위치</div>
          <div style={{ fontSize: 16, fontWeight: 500, marginTop: 8 }}>{device.location}</div>
        </div>
        <div className="card">
          <div className="stat-label">마지막 확인</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-mono)", marginTop: 8 }}>{device.lastSeen}</div>
        </div>
      </div>

      {/* 검사 통계 */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="card" style={{ borderTop: "2px solid var(--accent-blue)" }}>
          <div className="stat-label">총 검사</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--accent-blue)", marginTop: 8 }}>{total.toLocaleString()}</div>
        </div>
        <div className="card" style={{ borderTop: "2px solid var(--ok-color)" }}>
          <div className="stat-label">OK</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ok-color)", marginTop: 8 }}>{stats.ok.toLocaleString()}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{okRate}%</div>
        </div>
        <div className="card" style={{ borderTop: "2px solid var(--ng-color)" }}>
          <div className="stat-label">NG</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ng-color)", marginTop: 8 }}>{stats.ng.toLocaleString()}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{ngRate}%</div>
        </div>
      </div>

      {/* OK/NG 프로그레스 */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>OK / NG 비율</div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--font-cond)", fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em" }}>OK</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ok-color)" }}>{okRate}%</span>
          </div>
          <div className="prog-bar">
            <div className="prog-fill" style={{ width: `${okRate}%`, background: "var(--ok-color)" }} />
          </div>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--font-cond)", fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em" }}>NG</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ng-color)" }}>{ngRate}%</span>
          </div>
          <div className="prog-bar">
            <div className="prog-fill" style={{ width: `${ngRate}%`, background: "var(--ng-color)" }} />
          </div>
        </div>
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
  transition: "all .15s",
};
