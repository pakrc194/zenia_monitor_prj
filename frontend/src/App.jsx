import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";
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
import UserList from "./pages/UserList";

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const getValidToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  const decoded = decodeToken(token);
  if (!decoded) return false;

  const isExpired = decoded.exp * 1000 < Date.now();
  if (isExpired) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("myInfo");
    return false;
  }

  return true;
};

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

function AppInner() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (getValidToken()) {
      const savedUser = localStorage.getItem("myInfo");
      if (savedUser) setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userInfo) => {
    localStorage.setItem("myInfo", JSON.stringify(userInfo));
    setUser(userInfo);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("myInfo");
    setUser(null);
    navigate("/login");
  };

  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={
        user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
      } />
      <Route path="/" element={
        user ? <div className="app-shell">
          <Sidebar user={user} onLogout={handleLogout} />
          <main className="main-content">
            <Outlet />
          </main>
        </div> : <Navigate to="/login" replace />
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"      element={<Dashboard />} />
        <Route path="devices"        element={<DeviceList />} />
        <Route path="devices/:id"    element={<DeviceDetail />} />
        <Route path="inspection"     element={<Inspection />} />
        <Route path="inspection/:id" element={<InspectionDetail />} />
        <Route path="alarms"         element={<Alarms />} />
        <Route path="users"          element={<UserList />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}