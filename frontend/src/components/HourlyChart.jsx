import { useEffect, useState } from "react";
import api from "../data/api";
import { useParams } from "react-router-dom";

const formatHyphenDate = (date = new Date()) => {
  const yyyy = date.getFullYear();
  const mm   = String(date.getMonth() + 1).padStart(2, "0");
  const dd   = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};


export default function HourlyChart() {
  const [dayOffset, setDayOffset] = useState(0);
  const [hourlyStats, setHourlyStats] = useState([])
  const [selectedDate, setSelectedDate] = useState(formatHyphenDate())
  const {id} = useParams();

  useEffect(()=>{
    const fecthHourlyStats = async () => {
      const response = await api.get("/inspection/hourlyStats", {
        params:{
          date:selectedDate,
          deviceId: id==null? 0 : id
        }
      })
      console.log("fecthHourlyStats",response)
      setHourlyStats(response)
    }
    fecthHourlyStats();
  },[selectedDate])


  const maxVal = Math.max(...hourlyStats?.map(d => d.ok + d.ng), 1);

  const W = 780, H = 140, PAD_L = 36, PAD_B = 28, PAD_R = 12, PAD_T = 10;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_B - PAD_T;
  const barW = chartW / 24;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(r => ({
    y: PAD_T + chartH * (1 - r),
    label: Math.round(maxVal * r),
  }));



  return (
    <div>
      <div className="section-header">
        <span className="section-title">시간별 검사 현황</span>
        <div className="date-nav">
          <input type="date" value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)}/>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 480 }}>
          {/* Grid lines */}
          {yTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={PAD_L} y1={t.y} x2={W - PAD_R} y2={t.y}
                stroke="var(--border)" strokeWidth="1"
                strokeDasharray={i === 0 ? "none" : "3,4"}
              />
              <text
                x={PAD_L - 4} y={t.y + 4}
                textAnchor="end"
                fontSize="9"
                fill="var(--text-muted)"
                fontFamily="var(--font-mono)"
              >{t.label}</text>
            </g>
          ))}

          {/* Bars */}
          {hourlyStats.map((d, i) => {
            const x = PAD_L + d.hour * barW;
            const totalH = ((d.ok + d.ng) / maxVal) * chartH;
            const okH = (d.ok / maxVal) * chartH;
            const ngH = (d.ng / maxVal) * chartH;
            const bw = barW - 3;

            return (
              <g key={i}>
                {/* OK bar */}
                {d.ok > 0 && (
                  <rect
                    x={x + 1.5} y={PAD_T + chartH - totalH}
                    width={bw} height={okH}
                    fill="var(--ok-color)" opacity="0.7" rx="1"
                  />
                )}
                {/* NG bar */}
                {d.ng > 0 && (
                  <rect
                    x={x + 1.5} y={PAD_T + chartH - ngH}
                    width={bw} height={ngH}
                    fill="var(--ng-color)" opacity="0.85" rx="1"
                  />
                )}
                {/* Hour label */}
                {(
                  <text
                    x={x + barW / 2} y={H - 4}
                    textAnchor="middle"
                    fontSize="9"
                    fill="var(--text-muted)"
                    fontFamily="var(--font-mono)"
                  >{String(d.hour).padStart(2, "0")}</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
        {[
          { color: "var(--ok-color)", label: "OK" },
          { color: "var(--ng-color)", label: "NG" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-cond)", fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.08em" }}>{l.label}</span>
          </div>
        ))}
        <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
          총 {hourlyStats.reduce((a, d) => a + d.ok + d.ng, 0).toLocaleString()} 건
        </div>
      </div>
    </div>
  );
}
