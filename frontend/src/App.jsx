import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DeviceList from "./pages/DeviceList";
import DeviceDetail from "./pages/DeviceDetail";
import Inspection from "./pages/Inspection";
import InspectionDetail from "./pages/InspectionDetail";
import Alarms from "./pages/Alarms";
import "./App.css";
import api from "./data/api";

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin  = (userInfo) => setUser(userInfo);
  const handleLogout = async () => {
    const response = await api.post("/auth/logout")
    console.log(response)
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("myInfo");
    setUser(null)
  };

  useEffect(()=>{
    const token = localStorage.getItem("accessToken")
    if(token) {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if(isExpired) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } else {
        let myInfo = JSON.parse(localStorage.getItem("myInfo"))
        // console.log(myInfo)
        setUser(myInfo)
      }
    }
  },[])


  // 로그인 안 된 상태
  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/"               element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"      element={<Dashboard />} />
            <Route path="/devices"        element={<DeviceList />} />
            <Route path="/devices/:id"    element={<DeviceDetail />} />
            <Route path="/inspection"     element={<Inspection />} />
            <Route path="/inspection/:id" element={<InspectionDetail />} />
            <Route path="/alarms"         element={<Alarms />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
