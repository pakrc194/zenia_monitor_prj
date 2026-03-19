import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Sidebar.css";

const NAV_ITEMS = [
  { path: "/dashboard",  icon: "⬡", label: "대시보드" },
  { path: "/devices",    icon: "◈", label: "장비 목록" },
  { path: "/inspection", icon: "◉", label: "검사 현황" },
  { path: "/alarms",     icon: "◬", label: "알람" },
];

export default function Sidebar({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("ko-KR", { hour12: false }));
      setDate(now.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="sidebar">
      {/* 로고 */}
      <div className="sidebar-logo" onClick={() => navigate("/dashboard")}>
        <span className="logo-icon">▣</span>
        <div>
          <div className="logo-title">VISION<span>MES</span></div>
          <div className="logo-sub">MONITORING v2.5</div>
        </div>
      </div>

      {/* 시스템 상태 */}
      <div className="sidebar-system">
        <div className="sys-dot" />
        <span>시스템 정상 운영 중</span>
      </div>

      {/* 네비게이션 */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.path}
            className={`nav-item ${isActive(item.path) ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {isActive(item.path) && <span className="nav-indicator" />}
          </button>
        ))}
      </nav>

      {/* 하단 - 유저 정보 + 시간 */}
      <div className="sidebar-footer">
        {/* 시간 */}
        <div className="footer-clock">
          <div className="footer-time">{time}</div>
          <div className="footer-date">{date}</div>
        </div>

        {/* 구분선 */}
        <div className="footer-divider" />

        {/* 유저 정보 */}
        <div className="footer-user">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || "사용자"}</div>
            <div className="user-role">{user?.role || "OPERATOR"}</div>
          </div>
          <button className="logout-btn" onClick={onLogout} title="로그아웃">
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}
