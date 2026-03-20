import React, { useEffect, useState } from 'react'
import api from '../data/api'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDate, formatDay } from '../utils/formatDate';

export default function UserDetail() {
    const navigate = useNavigate();
    const {username} = useParams();
    const [form, setForm] = useState({
        username: "",
        name:"",
        role: "user"
    })

    useEffect(()=>{
        const fecthUserDetail = async () => {
            const response = await api.get(`/users/detail/${username}`)
            console.log("fecthUserDetail", response)
            setForm(response)
        }
        fecthUserDetail();
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(form)
        const response = await api.post(`/users/modify/${username}`,form)
        if(response==0) {
            alert("수정 실패")
        } else {
            alert("수정 완료")
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
                    <div>{form.username}</div>
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">이름</label>
                <div className="input-wrapper">
                <div>{form.name}</div>
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">권한</label>
                <div className="input-wrapper">
                <select className="select-input" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                    <option value="user">회원</option>
                    <option value="admin">관리자</option>
                    <option value="idle">휴면</option>
                </select>
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">가입일</label>
                <label className="">{formatDay(form.createdAt)}</label>
            </div>
            {form.expiredAt && <div className="form-group">
                <label className="form-label">만료일</label>
                <label className="">{formatDay(form.expiredAt)}</label>
            </div>}

            <button className="login-btn" type="submit">
                회원 수정
            </button>
        </form>
    </div>
  )
}
