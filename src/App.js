import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NoticePage from "./pages/NoticePage";
import NoticeDetail from "./components/Notice/NoticeDetail";
import NoticeForm from "./components/Notice/NoticeForm";
import EvaluationPage from "./pages/EvaluationPage";
import VideoRoomApp from "./VideoRoomApp";
import AcademicPage from "./pages/AcademicPage";
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
import AdminDashboard from "./pages/AdminDashboard";
import ScheduleForm from "./components/Schedule/ScheduleForm";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
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
      setLoading(false);
      return;
    }
    const fetchMe = async () => {
      try {
        const res = await api.get("/user/me");
        setUser(res.data.user); // 사용자 정보 저장
        setRole(res.data.role);
        console.log(res.data.user);
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
              <MyPage user={user} role={role} />
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
        {/* 공지사항, 학사일정 상세/등록/수정  */}
        <Route path="/notice" element={<NoticePage role={role} />} />
        <Route path="/notice/:id" element={<NoticeDetail />} />
        <Route path="/notice/write" element={<NoticeForm />} />
        <Route path="/notice/edit/:id" element={<NoticeForm />} />

        {/* 📚 학사일정 및 공지사항 통합 페이지 */}
        <Route path="/academic" element={<AcademicPage role={role} />} />

        {/* 일정 등록 및 수정 폼 (ScheduleForm) */}
        <Route path="/admin/schedule/write" element={<ScheduleForm />} />
        <Route path="/admin/schedule/edit/:id" element={<ScheduleForm />} />

        {/* 강의 평가 */}
        <Route path="/evaluation" element={<EvaluationPage user={user} />} />
        {/* 화상 회의 */}
        <Route path="/records" element={<CounselingRecordPage user={user} />} />

        {/* 없는 경로는 home으로 redirect */}
        <Route path="/" element={<Navigate to="/" />} />

        {/* 챗봇 및 중도 이탈방지 관련부분 */}
        {/* 학생이 로그인하면 들어가는 메인 화면 */}
        <Route path="/student" element={<StudentMain user={user} />} />

        {/* === [3] 교수용 (위험군 대시보드) === */}
        <Route path="/professor" element={<ProfDashboard user={user} />} />

        {/* === [4] 관리자용 (분석 실행) === */}
        <Route path="/admin" element={<AdminPage user={user} />} />
        <Route
          path="/admin/dashboard/risk-list"
          element={<AdminDashboard user={user} />}
        />
      </Routes>
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;
