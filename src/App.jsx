import { Routes, Route } from "react-router-dom";
import DashboardPage from "./features/dashboard/pages/dashboardPage";
import LoginPage from "./features/auth/pages/LoginPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage/>} />
    </Routes>
  )
}