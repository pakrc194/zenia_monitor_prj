import { useEffect, useState } from "react";
import "./Login.css";
import api from "../data/api";

const DEV_ACCOUNTS = [
  { label: "admin", username: "admin", password: "zenia" },
  { label: "user01", username: "user01", password: "1234" },
];

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showDevPanel, setShowDevPanel] = useState(false);

  // 로고 두 번 클릭 감지
  const handleLogoClick = () => {
    const next = logoClickCount + 1;
    setLogoClickCount(next);
    if (next >= 2) {
      setShowDevPanel(true);
      setLogoClickCount(0);
    }
  };

  // 계정 선택 시 자동 입력
  const handleSelectAccount = (account) => {
    setForm({ username: account.username, password: account.password });
    setShowDevPanel(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", form);

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("myInfo", JSON.stringify(response));

      await new Promise(r => setTimeout(r, 600));
      onLogin(response);
    } catch (e) {
      console.log(e);
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-grid" />

      <div className="login-box">
        {/* 로고 — 두 번 클릭 시 개발용 패널 */}
        <div className="login-logo" onClick={handleLogoClick} style={{ cursor: "pointer", userSelect: "none" }}>
          <span className="login-logo-icon">▣</span>
          <div>
            <div className="login-logo-title">VISION<span>MES</span></div>
            <div className="login-logo-sub">MONITORING SYSTEM v2.5</div>
          </div>
        </div>

        {/* 개발용 계정 선택 패널 */}
        {showDevPanel && (
          <div style={{
            margin: "0 0 16px",
            padding: "10px",
            border: "1px dashed #555",
            borderRadius: 6,
            background: "rgba(255,255,255,0.04)",
          }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 8, letterSpacing: "0.08em" }}>
              DEV — 계정 선택
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {DEV_ACCOUNTS.map((acc) => (
                <button
                  key={acc.username}
                  onClick={() => handleSelectAccount(acc)}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid #444",
                    borderRadius: 4,
                    color: "#ccc",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "monospace",
                  }}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="login-header">
          <h1 className="login-title">로그인</h1>
          <p className="login-desc">계정 정보를 입력하여 시스템에 접속하세요</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">아이디</label>
            <div className="input-wrapper">
              <span className="input-icon">◈</span>
              <input
                className="form-input"
                type="text"
                placeholder="아이디를 입력하세요"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <div className="input-wrapper">
              <span className="input-icon">◉</span>
              <input
                className="form-input"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div className="login-error">
              <span>⚠</span> {error}
            </div>
          )}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? <span className="login-loading">접속 중...</span> : "시스템 접속"}
          </button>
        </form>

        <div className="login-footer">
          <span className="login-footer-dot" />
          VISION MES — SECURE ACCESS
          <span className="login-footer-dot" />
        </div>
      </div>
    </div>
  );
}