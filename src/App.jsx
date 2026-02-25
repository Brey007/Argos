import { Routes, Route } from "react-router-dom";
import DashboardPage from "./features/dashboard/pages/dashboardPage";

export default function App() {
  return (
    <Routes>
      <Route path="/Dashboard" element={<DashboardPage />} />
    </Routes>
  )
}