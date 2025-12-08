import "./App.css";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
import AdminDashboard from "./pages/AdminDashboard";
import AdminSubjectPage from "./pages/AdminSubjectPage";
import GradePage from "./pages/GradePage";
import EnrollmentPage from "./pages/EnrollmentPage";
import CourseListPage from "./pages/CourseListPage";
import EnrollmentHistoryPage from "./pages/EnrollmentHistoryPage";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null); // 즉시 로그아웃 상태로 전환
    setRole(null); // ← role 초기화
    navigate("/login");
  };
  useEffect(() => {
    if (!token) {
      console.log("로그인 필요");
      setUser(null);
      setRole(null);
      setLoading(false);
      return;
    }
    api
      .get("/user/me")
      .then((res) => {
        console.log("로로로롤로!" + res.data);
        setUser(res.data.user);
        setRole(res.data.role);
      })
      .catch(() => {
        setUser(null);
        setRole(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);
  if (loading) return <div>로딩중..</div>;
  return (
    <div className="App">
      {!isLoginPage && <Header user={user} role={role} logout={logout} />}
      <Routes>
        <Route
          path="/login"
          element={<Login setUser={setUser} setRole={setRole} />}
        />
        <Route
          path="/My"
          element={
            <ProtectedRoute user={user}>
              {loading ? (
                <div>로딩중...</div>
              ) : (
                <MyPage user={user} role={role} />
              )}
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/academic"
          element={
            <ProtectedRoute user={user} role={role} roleRequired="staff">
              {loading ? (
                <div>로딩중...</div>
              ) : (
                <Academic user={user} role={role} />
              )}
            </ProtectedRoute>
          }
        /> */}
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
        {/* <Route
          path="/student"
          element={<StudentSchedulePage studentId={1} professorId={1} />}
        /> */}
        {/* <Route
          path="/professor"
          element={<ProfessorSchedulePage professorId={1} />}
        /> */}
        <Route path="/records" element={<CounselingRecordPage />} />
        {/* 없는 경로는 home으로 redirect */}
        <Route path="/" element={<Navigate to="/" />} />

        {/* 챗봇 및 중도 이탈방지 관련부분 */}
        {/* 학생이 로그인하면 들어가는 메인 화면 */}
        <Route path="/student" element={<StudentMain user={user} />} />

        {/* === [3] 교수용 (위험군 대시보드) === */}
        <Route path="/professor" element={<ProfDashboard user={user} />} />

        {/* === [4] 관리자용 (분석 실행) === */}
        <Route path="/admin" element={<AdminPage user={user} />} />
        <Route path="/admin/dashboard/risk-list" element={<AdminDashboard user={user} />} />

        {/* 수강신청 관련부분 */} 
        {/* 1. 전체 강좌 조회 */}
        <Route path="/student/course-list" element={<CourseListPage />} />
        
        {/* 2. 수강신청 (예비수강신청도 이 컴포넌트 재사용 가능) */}
        <Route path="/student/enrollment" element={<EnrollmentPage />} />
        
        {/* 3. 수강신청 내역 조회 (별도 페이지) */}
        <Route path="/student/enrollment-history" element={<EnrollmentHistoryPage />} />

       
      </Routes>
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;
