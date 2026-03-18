import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DeviceList from "./pages/DeviceList";
import DeviceDetail from "./pages/DeviceDetail";
import Inspection from "./pages/Inspection";
import InspectionDetail from "./pages/InspectionDetail";
import Alarms from "./pages/Alarms";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
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
