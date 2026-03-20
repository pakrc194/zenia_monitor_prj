import { useEffect, useState } from "react";
import api from "../data/api";
import { formatDate, formatDay } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { ROLE_LABEL, STATUS_LABEL } from "../utils/constants";

const FILTER_OPTIONS = ["전체", "관리자", "회원", "휴면"];

export default function UserList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState([]);

  useEffect(()=>{
    const fecthDeviceList = async () => {
      const response = await api.get("/users/list")
      // console.log(response)
      setUserList(response)
    }
    fecthDeviceList();
  },[])

  const filtered = userList?.filter(d => {
    const matchStatus = filter === "전체" || ROLE_LABEL[d.role] === filter;
    const matchSearch = d.username.includes(search) || d.name.includes(search) || d.role.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-icon">♣</div>
        <h1 className="page-title">회원 관리</h1>
      </div>

      {/* Summary badges */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {Object.entries({ user: "회원", admin: "관리자", idle: "휴면" }).map(([k, v]) => {
          const count = userList?.filter(d => d.role === k).length;
          return (
            <div key={k} className="card" style={{ padding: "12px 16px", flex: 1 }}>
              <div className="stat-label">{v}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, color:
                k === "user" ? "var(--ok-color)" :
                k === "ERROR" ? "var(--ng-color)" :
                k === "admin" ? "var(--warn-color)" : "var(--text-muted)"
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
            placeholder="아이디, 이름, 권한 검색..."
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
              <th>아이디</th>
              <th>이름</th>
              <th>권한</th>
              <th>가입일</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((d,k) => (
              <tr key={k} style={{cursor: "pointer"}} onClick={()=>navigate(`/users/detail/${d.username}`)}>
                
                <td className="mono" style={{ fontWeight: 500 }}>{d.username}</td>
                <td style={{ color: "var(--text-secondary)" }}>{d.name}</td>
                <td>
                  <span className={`badge ${d.role}`}>
                    {ROLE_LABEL[d.role]}
                  </span>
                </td>
                <td className="mono" style={{ fontSize: 11 }}>{formatDay(d.createdAt)}</td>
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
          {filtered?.length} / {userList?.length} 회원 표시 중
        </div>
        <button
                onClick={() => navigate("/users/signup")}
                style={{
                  padding: "4px 10px",
                  borderRadius: 5,
                  border: "1px solid",
                  borderColor: "var(--accent-cyan)",
                  background: "rgba(0,212,255,.1)",
                  color: "var(--accent-cyan)",
                  fontFamily: "var(--font-cond)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                회원 추가
        </button>
      </div>
    </div>
  );
}
