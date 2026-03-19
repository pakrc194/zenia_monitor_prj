import { useEffect, useState } from "react";
import api from "../data/api";
import { formatDate } from "../utils/formatDate";

const SEV_CONFIG = {
  CRITICAL: { label: "CRITICAL", color: "var(--ng-color)", bg: "rgba(255,61,87,.1)" },
  WARNING:  { label: "WARNING",  color: "var(--warn-color)", bg: "rgba(255,145,0,.08)" },
  INFO:     { label: "INFO",     color: "var(--accent-blue)", bg: "rgba(33,150,243,.08)" },
};

const FILTER_OPTIONS = ["전체", "CRITICAL", "WARNING", "INFO"];

export default function Alarms() {
  const [filter, setFilter] = useState("전체");
  const [alarms, setAlarms] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    setIsLoading(true);
    const fecthAlarms = async () => {
      const response = await api.get("/alarm/list")
      setAlarms(response)
      setIsLoading(false);
    }
    fecthAlarms();
  },[])

  if(isLoading) {
    return <div>불러오는중..</div>
  }


  const filtered = alarms?.filter(a =>
    filter === "전체" || SEV_CONFIG[a.level].label === filter
  );

  const counts = {
    CRITICAL: alarms?.filter(a => a.level === "CRITICAL").length,
    WARNING:  alarms?.filter(a => a.level === "WARNING").length,
    INFO:     alarms?.filter(a => a.level === "INFO").length,
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-icon">◬</div>
        <h1 className="page-title">알람 목록</h1>
      </div>

      {/* Severity summary */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        {Object.entries(SEV_CONFIG).map(([k, cfg]) => (
          <div className="card" key={k} style={{ borderTop: `2px solid ${cfg.color}` }}>
            <div className="stat-label">{cfg.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 30, color: cfg.color, marginTop: 6 }}>
              {counts[k]}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        {/* Filter toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span className="section-title">알람 리스트</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 5,
                  border: "1px solid",
                  borderColor: filter === opt ? "var(--accent-cyan)" : "var(--border-bright)",
                  background: filter === opt ? "rgba(0,212,255,.1)" : "transparent",
                  color: filter === opt ? "var(--accent-cyan)" : "var(--text-muted)",
                  fontFamily: "var(--font-cond)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>발생 시각</th>
              <th>장비</th>
              <th>등급</th>
              <th>내용</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a,k) => {
              const cfg = SEV_CONFIG[a.level];
              return (
                <tr key={k}>
                  <td className="mono" style={{ fontSize: 11, whiteSpace: "nowrap" }}>{formatDate(a.alarmAt)}</td>
                  <td style={{ fontWeight: 500, whiteSpace: "nowrap", fontSize: 12 }}>{a.name}</td>
                  <td>
                    <span style={{
                      display: "inline-block",
                      padding: "2px 7px",
                      borderRadius: 4,
                      background: cfg.bg,
                      color: cfg.color,
                      fontFamily: "var(--font-cond)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      border: `1px solid ${cfg.color}30`,
                    }}>
                      {cfg.label}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 12 }}>{a.message}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)", padding: 32 }}>
                  표시할 알람이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
          총 {filtered.length}건 표시 중 (최신순 정렬)
        </div>
      </div>
    </div>
  );
}
