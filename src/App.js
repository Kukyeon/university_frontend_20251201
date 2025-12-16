import "./App.css";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import NoticePage from "./pages/NoticePage";
import NoticeDetail from "./components/Notice/NoticeDetail";
import NoticeForm from "./components/Notice/NoticeForm";
import EvaluationPage from "./pages/EvaluationPage";
import AcademicPage from "./pages/AcademicPage";
import Academic from "./pages/Academic";
import CounselingRecordPage from "./pages/CounselingRecordPage";
import Home from "./pages/Home";
import StudentMain from "./pages/StudentMain"; // 챗봇, 강의추천 있는 곳
import ProfDashboard from "./pages/ProfDashboard"; // 위험군 대시보드
import AdminPage from "./pages/AdminPage"; // 분석 실행 버튼
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import { useEffect, useState } from "react";
import api from "./api/axiosConfig";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

import AcademicRegistration from "./pages/AcademicRegistration";
import ScheduleForm from "./components/Schedule/ScheduleForm";
import AdminSubjectPage from "./pages/AdminSubjectPage";
import GradePage from "./pages/GradePage";
import StudentSchedulePage from "./pages/StudentSchedulePage";
import ProfessorSchedulePage from "./pages/ProfessorSchedulePage";
import StudentCounselingDetail from "./components/Schedule/StudentCounselingDetail";
import ProfessorCounselingDetail from "./components/Counseling/ProfessorCounselingDetail";
import CounselingRecordForm from "./components/Counseling/CounselingRecordForm";
import CoursePage from "./pages/CoursePage";
import Sugang from "./pages/Sugang";
import CourseStudentList from "./components/Course/CourseStudentList";
import VideoRoom from "./components/Schedule/VideoRoom";
import VideoRoomApp from "./VideoRoomApp";
import MainLayout from "./components/Layout/MainLayout";
import { ModalProvider } from "./components/ModalContext";
import CoursePlanPage from "./components/Course/CoursePlanPage";

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
    <ModalProvider>
      {" "}
      <div className="App">
        <Routes>
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
          <Route
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
          />
          <Route
            path="/course"
            element={
              <ProtectedRoute user={user} role={role}>
                {loading ? (
                  <div>로딩중...</div>
                ) : (
                  <CoursePage user={user} role={role} />
                )}
              </ProtectedRoute>
            }
          />
          <Route path="/course/:courseId" element={<CourseStudentList />} />
          <Route
            path="/sugang"
            element={
              <ProtectedRoute user={user} role={role}>
                {loading ? (
                  <div>로딩중...</div>
                ) : (
                  <Sugang user={user} role={role} />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/registration"
            element={
              <ProtectedRoute user={user} role={role} roleRequired="staff">
                {loading ? (
                  <div>로딩중...</div>
                ) : (
                  <AcademicRegistration user={user} role={role} />
                )}
              </ProtectedRoute>
            }
          />
          <Route path="/videoroom" element={<VideoRoomApp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <Home user={user} logout={logout} role={role} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/professor/videoroom/:scheduleId"
            element={
              <ProtectedRoute user={user} role={role} roleRequired="professor">
                <VideoRoom
                  professorId={user?.id}
                  userRole={role}
                  userName={user?.name}
                  onFinish={() => {
                    navigate(-1);
                  }}
                />
              </ProtectedRoute>
            }
          />
          {/* 상담 / 화상 회의 */}
          <Route
            path="/records"
            element={<CounselingRecordPage user={user} />}
          />
          <Route
            path="/student-schedule"
            element={
              // <ProtectedRoute user={user} role={role} roleRequired="STUDENT">
              <StudentSchedulePage user={user} role={role} />
              // </ProtectedRoute>
            }
          />
          {/* 학생용 상세 보기 */}
          <Route
            path="/student/counseling/detail/:scheduleId"
            element={<StudentCounselingDetail user={user} />}
          />
          {/* 교수용 상세 보기 (권한 설정 필요) */}
          <Route
            path="/professor/counseling/detail/:scheduleId"
            element={<ProfessorCounselingDetail />}
          />
          {/* 2. 교수용 상담 기록 작성/수정 폼 (새로 추가) */}
          <Route
            path="/professor/counseling/write/:scheduleId"
            element={<CounselingRecordForm />}
          />
          <Route
            path="/professor-schedule"
            element={
              // <ProtectedRoute user={user} role={role} roleRequired="PROFESSOR">
              <ProfessorSchedulePage user={user} role={role} />
              // </ProtectedRoute>
            }
          />
          {/* 공지사항, 학사일정 상세/등록/수정  */}
          <Route path="/notice" element={<NoticePage role={role} />} />
          <Route path="/notice/:id" element={<NoticeDetail role={role} />} />
          <Route path="/notice/write" element={<NoticeForm />} />
          <Route path="/notice/edit/:id" element={<NoticeForm />} />
          {/* 📚 학사일정 및 공지사항 통합 페이지 */}
          <Route path="/academicPage" element={<AcademicPage role={role} />} />
          {/* 일정 등록 및 수정 폼 (ScheduleForm) */}
          <Route path="/admin/schedule/write" element={<ScheduleForm />} />
          <Route path="/admin/schedule/edit/:id" element={<ScheduleForm />} />
          {/* 강의 평가 */}
          <Route path="/evaluation" element={<EvaluationPage user={user} />} />
          {/* 상담 / 화상 회의 */}
          <Route
            path="/records"
            element={<CounselingRecordPage user={user} />}
          />
          <Route
            path="/student-schedule"
            element={
              // <ProtectedRoute user={user} role={role} roleRequired="STUDENT">
              <StudentSchedulePage user={user} role={role} />
              // </ProtectedRoute>
            }
          />
          {/* 학생용 상세 보기 */}
          <Route
            path="/student/counseling/detail/:scheduleId"
            element={<StudentCounselingDetail />}
          />
          {/* 교수용 상세 보기 (권한 설정 필요) */}
          <Route
            path="/professor/counseling/detail/:scheduleId"
            element={<ProfessorCounselingDetail />}
          />
          {/* 2. 교수용 상담 기록 작성/수정 폼 (새로 추가) */}
          <Route
            path="/professor/counseling/write/:scheduleId"
            element={<CounselingRecordForm />}
          />
          <Route
            path="/professor-schedule"
            element={
              // <ProtectedRoute user={user} role={role} roleRequired="PROFESSOR">
              <ProfessorSchedulePage user={user} role={role} />
              // </ProtectedRoute>
            }
          />
          {/* 없는 경로는 home으로 redirect */}
          <Route path="*" element={<Navigate to="/" />} />
          element={<MainLayout user={user} role={role} logout={logout} />}
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
          <Route
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
          />
          <Route
            path="/course"
            element={
              <ProtectedRoute user={user} role={role}>
                {loading ? (
                  <div>로딩중...</div>
                ) : (
                  <CoursePage user={user} role={role} />
                )}
              </ProtectedRoute>
            }
          />
          <Route path="/course/:courseId" element={<CourseStudentList />} />
          <Route
            path="/sugang"
            element={
              <ProtectedRoute user={user} role={role}>
                {loading ? (
                  <div>로딩중...</div>
                ) : (
                  <Sugang user={user} role={role} />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/registration"
            element={
              <ProtectedRoute user={user} role={role} roleRequired="staff">
                {loading ? (
                  <div>로딩중...</div>
                ) : (
                  <AcademicRegistration user={user} role={role} />
                )}
              </ProtectedRoute>
            }
          />
          <Route path="/videoroom" element={<VideoRoomApp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <Home user={user} logout={logout} role={role} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/professor/videoroom/:scheduleId"
            element={
              <ProtectedRoute user={user} role={role} roleRequired="professor">
                <VideoRoom
                  professorId={user?.id}
                  userRole={role}
                  userName={user?.name}
                  onFinish={() => {
                    navigate(-1);
                  }}
                />
              </ProtectedRoute>
            }
          />
          {/* 상담 / 화상 회의 */}
          <Route
            path="/records"
            element={<CounselingRecordPage user={user} />}
          />
          <Route
            path="/student-schedule"
            element={
              // <ProtectedRoute user={user} role={role} roleRequired="STUDENT">
              <StudentSchedulePage user={user} role={role} />
              // </ProtectedRoute>
            }
          />
          {/* 학생용 상세 보기 */}
          <Route
            path="/student/counseling/detail/:scheduleId"
            element={<StudentCounselingDetail user={user} />}
          />
          {/* 교수용 상세 보기 (권한 설정 필요) */}
          <Route
            path="/professor/counseling/detail/:scheduleId"
            element={<ProfessorCounselingDetail />}
          />
          {/* 2. 교수용 상담 기록 작성/수정 폼 (새로 추가) */}
          <Route
            path="/professor/counseling/write/:scheduleId"
            element={<CounselingRecordForm />}
          />
          <Route
            path="/professor-schedule"
            element={
              // <ProtectedRoute user={user} role={role} roleRequired="PROFESSOR">
              <ProfessorSchedulePage user={user} role={role} />
              // </ProtectedRoute>
            }
          />
          {/* 공지사항, 학사일정 상세/등록/수정  */}
          <Route path="/notice" element={<NoticePage role={role} />} />
          <Route path="/notice/:id" element={<NoticeDetail role={role} />} />
          <Route path="/notice/write" element={<NoticeForm />} />
          <Route path="/notice/edit/:id" element={<NoticeForm />} />
          {/* 📚 학사일정 및 공지사항 통합 페이지 */}
          <Route path="/academicPage" element={<AcademicPage role={role} />} />
          {/* 일정 등록 및 수정 폼 (ScheduleForm) */}
          <Route path="/admin/schedule/write" element={<ScheduleForm />} />
          <Route path="/admin/schedule/edit/:id" element={<ScheduleForm />} />
          {/* 강의 평가 */}
          <Route path="/evaluation" element={<EvaluationPage user={user} />} />
          {/* 상담 / 화상 회의 */}
          <Route
            path="/records"
            element={<CounselingRecordPage user={user} />}
          />
          <Route
            path="/student-schedule"
            element={
              // <ProtectedRoute user={user} role={role} roleRequired="STUDENT">
              <StudentSchedulePage user={user} role={role} />
              // </ProtectedRoute>
            }
          />
          {/* 학생용 상세 보기 */}
          <Route
            path="/student/counseling/detail/:scheduleId"
            element={<StudentCounselingDetail />}
          />
          {/* 교수용 상세 보기 (권한 설정 필요) */}
          <Route
            path="/professor/counseling/detail/:scheduleId"
            element={<ProfessorCounselingDetail />}
          />
          {/* 2. 교수용 상담 기록 작성/수정 폼 (새로 추가) */}
          <Route
            path="/professor/counseling/write/:scheduleId"
            element={<CounselingRecordForm />}
          />
          <Route
            path="/professor-schedule"
            element={
              // <ProtectedRoute user={user} role={role} roleRequired="PROFESSOR">
              <ProfessorSchedulePage user={user} role={role} />
              // </ProtectedRoute>
            }
          />
          {/* 없는 경로는 home으로 redirect */}
          <Route path="*" element={<Navigate to="/" />} />
          {/* 챗봇 및 중도 이탈방지 관련부분 */}
          {/* 챗봇페이지 */}
          <Route
            path="/student/chatbot"
            element={<StudentMain user={user} />}
          />
          {/* === [3] 교수용 (위험군 대시보드) === */}
          <Route
            path="/professor/dashboard"
            element={<ProfDashboard user={user} />}
          />
          {/* === [4] 관리자용 (분석 실행) === */}
          <Route path="/admin" element={<AdminPage user={user} />} />
          <Route
            path="/admin/dashboard/risk-list"
            element={<AdminDashboard user={user} />}
          />
          <Route
            path="/admin/subject"
            element={<AdminSubjectPage user={user} />}
          />
          <Route path="/grade" element={<GradePage user={user} />} />
          {/* 4. 강의계획서 (별도 페이지) */}
          <Route
            path="/course/syllabus/:subjectId"
            element={<CoursePlanPage user={user} role={role} />}
          />
          <Route
            path="/login"
            element={<Login setUser={setUser} setRole={setRole} />}
          />
        </Routes>
      </div>
    </ModalProvider>
  );
}

export default App;
