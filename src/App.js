import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import NoticePage from "./pages/NoticePage";
import SchedulePage from "./pages/SchedulePage";
import EvaluationPage from "./pages/EvaluationPage";
import StudentMain from "./pages/StudentMain";   // 챗봇, 강의추천 있는 곳
import ProfDashboard from "./pages/ProfDashboard"; // 위험군 대시보드
import AdminPage from "./pages/AdminPage";       // 분석 실행 버튼

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/notice" />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/evaluation" element={<EvaluationPage />} />
        {/* 없는 경로는 notice로 redirect */}
        <Route path="*" element={<Navigate to="/notice" />} />

        {/* 챗봇 및 중도 이탈방지 관련부분 */}
        {/* 학생이 로그인하면 들어가는 메인 화면 */}
        <Route path="/student" element={<StudentMain />} />

        {/* === [3] 교수용 (위험군 대시보드) === */}
        <Route path="/professor" element={<ProfDashboard />} />

        {/* === [4] 관리자용 (분석 실행) === */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;
