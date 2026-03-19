import { useEffect, useState } from "react";
import "./Login.css";
import api from "../data/api";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


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
      console.log(response)
    //   if(response==null)
    //     throw new Excpetion();

    //   const { accessToken, refreshToken } = await api.post("/auth/token", {
    //     username : response.username,
    //     password : response.password,
    //     role : response.role
    //   });

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("myInfo", JSON.stringify(response));
      
      await new Promise(r => setTimeout(r, 600));
      onLogin(response);




      // 임시 mock 로그인
      
      //onLogin({ name: form.username, role: "OPERATOR" });
    } catch (e) {
        console.log(e)
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      {/* 배경 그리드 */}
      <div className="login-grid" />

      <div className="login-box">
        {/* 로고 */}
        <div className="login-logo">
          <span className="login-logo-icon">▣</span>
          <div>
            <div className="login-logo-title">VISION<span>MES</span></div>
            <div className="login-logo-sub">MONITORING SYSTEM v2.5</div>
          </div>
        </div>

        {/* 제목 */}
        <div className="login-header">
          <h1 className="login-title">로그인</h1>
          <p className="login-desc">계정 정보를 입력하여 시스템에 접속하세요</p>
        </div>

        {/* 폼 */}
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

          {/* 에러 메시지 */}
          {error && (
            <div className="login-error">
              <span>⚠</span> {error}
            </div>
          )}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? (
              <span className="login-loading">접속 중...</span>
            ) : (
              "시스템 접속"
            )}
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
