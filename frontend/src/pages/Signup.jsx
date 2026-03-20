import React, { useState } from 'react'
import api from '../data/api'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        name:"",
        role: "user"
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(form)
        if(form.username==null || form.username=="") {
            alert("아이디 입력")
            return;
        }
        if(form.name==null || form.name=="") {
            alert("이름 입력")
            return;
        }

        const response = await api.post("/users/signup", form)
        if(response==0) {
            alert("중복 아이디입니다.")
        } else {
            alert(`${form.username} 계정이 등록되었습니다.`)
            navigate("/users")
        }
    }


  return (
    <div className="page">
        <div className="page-header">
            <div className="page-title-icon">♣</div>
            <h1 className="page-title">회원 관리</h1>
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
                <label className="form-label">이름</label>
                <div className="input-wrapper">
                <span className="input-icon">◉</span>
                <input
                    className="form-input"
                    type="text"
                    placeholder="이름를 입력하세요"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    autoComplete="current-password"
                />
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">권한</label>
                <div className="input-wrapper">
                <select className="select-input" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                    <option value="user">회원</option>
                    <option value="admin">관리자</option>
                </select>
                </div>
            </div>

            <button className="login-btn" type="submit">
                회원 등록
            </button>
        </form>
    </div>
  )
}
