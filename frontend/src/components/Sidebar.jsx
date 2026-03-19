import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Sidebar.css";

const NAV_ITEMS = [
  { path: "/dashboard",  icon: "⬡", label: "대시보드" },
  { path: "/devices",    icon: "◈", label: "장비 목록" },
  { path: "/inspection", icon: "◉", label: "검사 현황" },
  { path: "/alarms",     icon: "◬", label: "알람" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("ko-KR", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  });

  // 현재 경로가 nav 항목의 path로 시작하면 active
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo"  onClick={() => navigate("/dashboard")}>
        <span className="logo-icon">▣</span>
        <div>
          <div className="logo-title">VISION<span>MES</span></div>
          <div className="logo-sub">MONITORING v2.5</div>
        </div>
      </div>

      <div className="sidebar-system">
        <div className="sys-dot" />
        <span>시스템 정상 운영 중</span>
      </div>

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

      <div className="sidebar-footer">
        <div className="footer-time">{time}</div>
        <div className="footer-date">{today}</div>
      </div>
    </aside>
  );
}
