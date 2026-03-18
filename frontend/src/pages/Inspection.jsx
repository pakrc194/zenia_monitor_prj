import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { INSPECTIONS_BY_DEVICE, DEVICES } from "../data/mockData";
import DonutChart from "../components/DonutChart";

const DEVICE_OPTIONS = [
  { value: "전체", label: "전체 장비" },
  ...DEVICES.map(d => ({ value: d.id, label: d.name })),
];

export default function Inspection() {
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState("전체");

  const stats = INSPECTIONS_BY_DEVICE[selectedDevice] || { ok: 0, ng: 0 };
  const total = stats.ok + stats.ng;
  const okRate = total ? (stats.ok / total * 100).toFixed(1) : "0.0";
  const ngRate = total ? (stats.ng / total * 100).toFixed(1) : "0.0";

  const deviceNg = DEVICES.map(d => {
    const s = INSPECTIONS_BY_DEVICE[d.id] || { ok: 0, ng: 0 };
    const t = s.ok + s.ng;
    return { id: d.id, name: d.name, ng: s.ng, total: t, ngRate: t ? (s.ng / t * 100).toFixed(1) : "0.0" };
  });
  const maxNg = Math.max(...deviceNg.map(d => d.ng), 1);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-icon">◉</div>
        <h1 className="page-title">검사 현황</h1>
      </div>

      <div className="grid-2-1" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="section-header">
            <span className="section-title">OK / NG 비율</span>
            <select className="select-input" value={selectedDevice} onChange={e => setSelectedDevice(e.target.value)}>
              {DEVICE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <DonutChart ok={stats.ok} ng={stats.ng} size={130} />
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "var(--font-cond)", fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em" }}>OK</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ok-color)" }}>{okRate}% — {stats.ok.toLocaleString()}건</span>
                </div>
                <div className="prog-bar"><div className="prog-fill" style={{ width: `${okRate}%`, background: "var(--ok-color)" }} /></div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "var(--font-cond)", fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em" }}>NG</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ng-color)" }}>{ngRate}% — {stats.ng.toLocaleString()}건</span>
                </div>
                <div className="prog-bar"><div className="prog-fill" style={{ width: `${ngRate}%`, background: "var(--ng-color)" }} /></div>
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--text-primary)" }}>{total.toLocaleString()}</div>
                <div className="stat-label">총 검사 수</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card" style={{ flex: 1, borderTop: "2px solid var(--ok-color)" }}>
            <div className="stat-label">OK 건수</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--ok-color)", marginTop: 6 }}>{stats.ok.toLocaleString()}</div>
          </div>
          <div className="card" style={{ flex: 1, borderTop: "2px solid var(--ng-color)" }}>
            <div className="stat-label">NG 건수</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--ng-color)", marginTop: 6 }}>{stats.ng.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* 장비별 NG - 행 클릭 시 상세로 이동 */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>장비별 NG 현황</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>장비명</th>
              <th>총 검사</th>
              <th>NG 건수</th>
              <th>NG율</th>
              <th style={{ width: "30%" }}>NG 비율</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {deviceNg.map(d => (
              <tr key={d.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/inspection/${d.id}`)}>
                <td>
                  <span style={{ fontWeight: 500 }}>{d.name}</span>
                  <span className="mono" style={{ marginLeft: 8, fontSize: 10 }}>{d.id}</span>
                </td>
                <td className="mono">{d.total.toLocaleString()}</td>
                <td>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13,
                    color: d.ng > 80 ? "var(--ng-color)" : d.ng > 30 ? "var(--warn-color)" : "var(--ok-color)" }}>
                    {d.ng.toLocaleString()}
                  </span>
                </td>
                <td className="mono" style={{ color: parseFloat(d.ngRate) > 8 ? "var(--ng-color)" : parseFloat(d.ngRate) > 4 ? "var(--warn-color)" : "var(--text-secondary)" }}>
                  {d.ngRate}%
                </td>
                <td>
                  <div style={{ flex: 1, height: 6, background: "var(--bg-base)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${(d.ng / maxNg) * 100}%`, height: "100%", borderRadius: 3, transition: "width .4s",
                      background: d.ng > 80 ? "var(--ng-color)" : d.ng > 30 ? "var(--warn-color)" : "var(--ok-color)" }} />
                  </div>
                </td>
                <td style={{ color: "var(--text-muted)", fontSize: 12 }}>상세 →</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
