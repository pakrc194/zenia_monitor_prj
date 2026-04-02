import { useEffect, useState } from "react";
import api from "../data/api";
import { formatDate } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { STATUS_LABEL } from "../utils/constants";

const FILTER_OPTIONS = ["전체", "정상", "경고", "유휴"];

export default function DeviceList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [deviceList, setDeviceList] = useState([]);

  useEffect(()=>{
    const fecthDeviceList = async () => {
      const response = await api.get("/device/list")
      console.log(response)
      setDeviceList(response)
    }
    fecthDeviceList();
  },[])

  const filtered = deviceList?.filter(d => {
    const matchStatus = filter === "전체" || STATUS_LABEL[d.status] === filter;
    const matchSearch = d.name.includes(search) || d.location.includes(search) || d.id.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-icon">◈</div>
        <h1 className="page-title">장비 목록</h1>
      </div>

      {/* Summary badges */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {Object.entries({ NORMAL: "정상", WARNING: "경고", ERROR: "위험", IDLE: "유휴" }).map(([k, v]) => {
          const count = deviceList?.filter(d => d.status === k).length;
          return (
            <div key={k} className="card" style={{ padding: "12px 16px", flex: 1 }}>
              <div className="stat-label">{v}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, color:
                k === "NORMAL" ? "var(--ok-color)" :
                k === "ERROR" ? "var(--ng-color)" :
                k === "WARNING" ? "var(--warn-color)" : "var(--text-muted)"
              }}>{count}</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        {/* Toolbar */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input
            type="text"
            placeholder="장비명, 위치, ID 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              background: "var(--bg-base)",
              border: "1px solid var(--border-bright)",
              borderRadius: 6,
              color: "var(--text-primary)",
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              padding: "6px 10px",
              outline: "none",
            }}
          />
          <select className="select-input" value={filter} onChange={e => setFilter(e.target.value)}>
            {FILTER_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>장비명</th>
              <th>위치</th>
              <th>상태</th>
              <th>마지막 확인</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map(d => (
              <tr key={d.deviceId} style={{ cursor: "pointer" }} onClick={() => navigate(`/devices/${d.deviceId}`)}>
                
                <td className="mono" style={{ fontWeight: 500 }}>{d.name}</td>
                <td style={{ color: "var(--text-secondary)" }}>{d.location}</td>
                <td>
                  <span className={`badge ${d.status}`}>
                    <span className="badge-dot" />
                    {STATUS_LABEL[d.status]}
                  </span>
                </td>
                <td className="mono" style={{ fontSize: 11 }}>{formatDate(d.statusAt)}</td>
              </tr>
            ))}
            {filtered?.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)", padding: 32 }}>
                  검색 결과가 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
          {filtered?.length} / {deviceList?.length} 장비 표시 중
        </div>
      </div>
    </div>
  );
}
