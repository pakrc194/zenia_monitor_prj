import StatCard from "../components/StatCard";
import HourlyChart from "../components/HourlyChart";
import { SUMMARY, ALARMS, DEVICES } from "../data/mockData";
import { useEffect, useState } from "react";
import api from "../data/api";
import { STATUS_LABEL } from "../utils/constants";

export default function Dashboard() {
  const recentAlarms = ALARMS.slice(0, 5);

  const [deviceList, setDeviceList] = useState([]);

  useEffect(()=>{
    const fecthDeviceList = async () => {
      const response = await api.get("/device/list")
      // console.log(response)
      setDeviceList(response)
    }
    fecthDeviceList();
  },[])

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-icon">⬡</div>
        <h1 className="page-title">대시보드</h1>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
          마지막 갱신: 2025-03-18 14:32:01
        </span>
      </div>

      {/* KPI row */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        <StatCard
          icon="◈"
          label="전체 장비"
          value={deviceList.length}
          color="var(--accent-cyan)"
          sub={`운영 중 ${deviceList.filter(d => d.status !== "idle").length}대`}
        />
        <StatCard
          icon="◉"
          label="위험 장비"
          value={SUMMARY.ng}
          color="var(--ng-color)"
          sub="즉시 확인 필요"
          subColor="var(--ng-color)"
        />
        <StatCard
          icon="◬"
          label="활성 알람"
          value={SUMMARY.alarms}
          color="var(--warn-color)"
          sub="Critical 기준"
        />
        <StatCard
          icon="◫"
          label="금일 총 검사"
          value={SUMMARY.totalInspections.toLocaleString()}
          color="var(--accent-blue)"
          sub="OK 96.0% | NG 4.0%"
        />
      </div>

      {/* Hourly chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <HourlyChart />
      </div>

      {/* Device status + Recent alarms */}
      <div className="grid-2">
        {/* Device status */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 14 }}>장비 상태</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>장비명</th>
                <th>위치</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {deviceList.map(d => (
                <tr key={d.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{d.name}</div>
                    <div className="mono" style={{ fontSize: 10, marginTop: 1 }}>{d.id}</div>
                  </td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 12 }}>{d.location}</td>
                  <td>
                    <span className={`badge ${d.status}`}>
                      <span className="badge-dot" />
                      {STATUS_LABEL[d.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent alarms */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 14 }}>최근 알람</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentAlarms.map(a => (
              <div key={a.id} style={{
                padding: "10px 12px",
                background: "var(--bg-base)",
                borderRadius: 6,
                borderLeft: `3px solid ${a.severity === "critical" ? "var(--ng-color)" : a.severity === "warning" ? "var(--warn-color)" : "var(--accent-blue)"}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 12 }}>{a.device}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>{a.time.split(" ")[1]}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{a.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
