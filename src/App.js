import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NoticePage from "./pages/NoticePage";

import EvaluationPage from "./pages/EvaluationPage";
import VideoRoomApp from "./VideoRoomApp";
import StudentSchedulePage from "./pages/StudentSchedulePage";
import ProfessorSchedulePage from "./pages/ProfessorSchedulePage";
import CounselingRecordPage from "./pages/CounselingRecordPage";
import Home from "./pages/Home";
import Header from "./components/Home/Header";
import Footer from "./components/Home/Footer";
import StudentMain from "./pages/StudentMain"; // 챗봇, 강의추천 있는 곳
import ProfDashboard from "./pages/ProfDashboard"; // 위험군 대시보드
import AdminPage from "./pages/AdminPage"; // 분석 실행 버튼
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import { useEffect, useState } from "react";
import api from "./api/axiosConfig";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null); // 즉시 로그아웃 상태로 전환
  };
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("로그인 필요");
      setUser(null);
      return;
    }
    const fetchMe = async () => {
      try {
        const res = await api.get("/user/me");
        setUser(res.data); // 사용자 정보 저장
        console.log(res.data);
      } catch (err) {
        console.log("로그인 필요");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  if (loading) return <div>로딩중..</div>;
  return (
    <div className="App">
      {!isLoginPage && <Header user={user} logout={logout} />}
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/My"
          element={
            <ProtectedRoute user={user}>
              <MyPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="/videoroom" element={<VideoRoomApp />} />
        {/* <Route path="/" element={<Navigate to="/notice" />} /> */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Home user={user} logout={logout} />
            </ProtectedRoute>
          }
        />
        <Route path="/notice" element={<NoticePage />} />

        <Route path="/evaluation" element={<EvaluationPage />} />

        {/* 임시 테스트 중*/}
        <Route
          path="/student"
          element={<StudentSchedulePage studentId={1} professorId={1} />}
        />
        <Route
          path="/professor"
          element={<ProfessorSchedulePage professorId={1} />}
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
