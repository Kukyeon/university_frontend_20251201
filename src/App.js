import "./App.css";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import NoticePage from "./pages/NoticePage";

import EvaluationPage from "./pages/EvaluationPage";
import VideoRoomApp from "./VideoRoomApp";
import StudentSchedulePage from "./pages/StudentSchedulePage";
import ProfessorSchedulePage from "./pages/ProfessorSchedulePage";
import CounselingRecordPage from "./pages/CounselingRecordPage";
import Home from "./pages/Home";
import Header from "./components/Home/Header";
import Footer from "./components/Home/Footer";
import { useState } from "react";
import StudentMain from "./pages/StudentMain"; // 챗봇, 강의추천 있는 곳
import ProfDashboard from "./pages/ProfDashboard"; // 위험군 대시보드
import AdminPage from "./pages/AdminPage"; // 분석 실행 버튼
import Login from "./pages/Login";
import NoticeDetail from "./components/Notice/NoticeDetail";
import NoticeForm from "./components/Notice/NoticeForm";
import ScheduleManagerPage from "./pages/ScheduleManagerPage";

function App() {
  const [user, setUser] = useState({
    name: "박시우",
    id: "2023000001",
  }); // 로그인 상태 예시
  const isLoginPage = window.location.pathname === "/login";

  //상담 테스트 용
  const currentUserId = user.id;
  const studentTargetId = currentUserId;
  const professorTargetId = currentUserId;
  //상담 테스트용

  return (
    <div className="App">
      {!isLoginPage && <Header user={user} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/videoroom" element={<VideoRoomApp />} />
        {/* <Route path="/" element={<Navigate to="/notice" />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/notice/:id" element={<NoticeDetail />} />
        <Route path="/notice/write" element={<NoticeForm />} />
        <Route path="/notice/edit/:id" element={<NoticeForm />} />

        <Route path="/evaluation" element={<EvaluationPage />} />
        <Route path="/academic-schedule" element={<ScheduleManagerPage />} />
        {/* 상담 관련*/}
        <Route
          path="/counseling/student"
          element={
            <StudentSchedulePage
              studentId={studentTargetId}
              professorId={professorTargetId}
            />
          }
        />
        <Route
          path="/counseling/professor"
          element={<ProfessorSchedulePage professorId={professorTargetId} />}
        />
        <Route path="/records" element={<CounselingRecordPage />} />

        {/* 없는 경로는 home으로 redirect */}
        <Route path="/" element={<Navigate to="/" />} />

        {/* 챗봇 및 중도 이탈방지 관련부분 */}
        {/* 학생이 로그인하면 들어가는 메인 화면 */}
        <Route path="/student" element={<StudentMain />} />

        {/* === [3] 교수용 (위험군 대시보드) === */}
        <Route path="/professor" element={<ProfDashboard />} />

        {/* === [4] 관리자용 (분석 실행) === */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;
