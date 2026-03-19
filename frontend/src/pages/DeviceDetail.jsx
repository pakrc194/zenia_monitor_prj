import { useParams, useNavigate } from "react-router-dom";
import { DEVICES } from "../data/mockData";
import api from "../data/api";
import { useEffect, useState } from "react";
import { formatDate, formatDay } from "../utils/formatDate";
import { STATUS_LABEL } from "../utils/constants";
import HourlyChart from "../components/HourlyChart";


function GaugeBar({ value, max = 100, warn = 70, danger = 85 }) {
  const pct = Math.min((value / max) * 100, 100);
  const color =
    pct >= danger ? "var(--ng-color)" :
    pct >= warn   ? "var(--warn-color)" :
                    "var(--ok-color)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 8, background: "var(--bg-base)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width .4s" }} />
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color, minWidth: 38, textAlign: "right" }}>
        {value}{max === 100 ? "%" : "°C"}
      </span>
    </div>
  );
}

function MetricCard({ label, value, unit, warn, danger, icon }) {
  const numVal = parseFloat(value);
  const color =
    numVal >= danger ? "var(--ng-color)" :
    numVal >= warn   ? "var(--warn-color)" :
                       "var(--ok-color)";
  return (
    <div className="card" style={{ borderTop: `2px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className="stat-label">{label}</div>
        <span style={{ fontSize: 18, color, opacity: 0.6 }}>{icon}</span>
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 32, color, marginTop: 8, lineHeight: 1 }}>
        {value}
        <span style={{ fontSize: 14, marginLeft: 3, color: "var(--text-muted)" }}>{unit}</span>
      </div>
      <div style={{ marginTop: 10 }}>
        <GaugeBar value={numVal} warn={warn} danger={danger} max={unit === "°C" ? 100 : 100} />
      </div>
    </div>
  );
}

export default function DeviceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [device, setDevice] = useState({})
  const [deviceStatusList, setDeviceStatusList] = useState([])
  const [latest, setLatest] = useState({})

  useEffect(()=>{
    const fetchDeviceDetail = async() => {
        const response = await api.get(`/device/detail/${id}`)
        setDevice(response)
    }
    const fetchStatusList = async() => {
        const response = await api.get(`/device/status/list/${id}`)
        setDeviceStatusList(response)
        setLatest(response[0])
    }
    fetchDeviceDetail();
    fetchStatusList();
  },[])

//   const device = DEVICES.find(d => d.id === id);

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

  // 가장 최신 로그
  //const latest = deviceStatusList[0];

  return (
    <div className="page">
      {/* 헤더 */}
      <div className="page-header">
        <button onClick={() => navigate("/devices")} style={backBtnStyle}>← 목록</button>
        <div className="page-title-icon">◈</div>
        <h1 className="page-title">{device.name}</h1>
        <span className={`badge ${device.status}`} style={{ marginLeft: 8 }}>
          <span className="badge-dot" />
          {STATUS_LABEL[device.status]}
        </span>
      </div>

      {/* 장비 기본 정보 */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>장비 정보</div>
        <div style={{ display: "flex", gap: 40 }}>
          {[
            { label: "위치",     value: device.location, mono: false },
            { label: "IP",  value: device.ipAddress,       mono: true },
            { label: "유형",  value: device.type,       mono: false },
            { label: "제조일자",  value: formatDay(device.createdAt), mono: true },
          ].map(row => (
            <div key={row.label}>
              <div style={{ fontFamily: "var(--font-cond)", fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                {row.label}
              </div>
              <div style={{ fontFamily: row.mono ? "var(--font-mono)" : "var(--font-ui)", fontSize: 14, color: row.mono ? "var(--text-mono)" : "var(--text-primary)", fontWeight: 500 }}>
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 실시간 메트릭 (최신 로그 기준) */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <MetricCard label="CPU 사용량"  value={latest.cpuUsage}    unit="%" warn={70} danger={85} icon="⬡" />
        <MetricCard label="메모리 사용량" value={latest.memoryUsage} unit="%" warn={75} danger={90} icon="◫" />
        <MetricCard label="온도"        value={latest.temperature}   unit="°C" warn={65} danger={75} icon="◉" />
      </div>

      {/* 상태 로그 리스트 */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">상태 체크 로그</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
            최근 {deviceStatusList.length}건
          </span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>시각</th>
              <th>상태</th>
              <th>CPU</th>
              <th style={{ width: "20%" }}>CPU 게이지</th>
              <th>메모리</th>
              <th style={{ width: "20%" }}>메모리 게이지</th>
              <th>온도</th>
            </tr>
          </thead>
          <tbody>
            {deviceStatusList.map((log, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 11, whiteSpace: "nowrap" }}>{formatDate(log.statusAt)}</td>
                <td>
                  <span className={`badge ${log.status}`}>
                    <span className="badge-dot" />
                    {STATUS_LABEL[log.status]}
                  </span>
                </td>
                <td>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 13,
                    color: log.cpuUsage >= 85 ? "var(--ng-color)" : log.cpuUsage >= 70 ? "var(--warn-color)" : "var(--ok-color)"
                  }}>{log.cpuUsage}%</span>
                </td>
                <td><GaugeBar value={log.cpuUsage} warn={70} danger={85} /></td>
                <td>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 13,
                    color: log.memoryUsage >= 90 ? "var(--ng-color)" : log.memoryUsage >= 75 ? "var(--warn-color)" : "var(--ok-color)"
                  }}>{log.memoryUsage}%</span>
                </td>
                <td><GaugeBar value={log.memoryUsage} warn={75} danger={90} /></td>
                <td>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 13,
                    color: log.temperature >= 75 ? "var(--ng-color)" : log.temperature >= 65 ? "var(--warn-color)" : "var(--ok-color)"
                  }}>{log.temperature}°C</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
