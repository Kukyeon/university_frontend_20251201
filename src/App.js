import "./App.css";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import NoticePage from "./pages/NoticePage";

import EvaluationPage from "./pages/EvaluationPage";
import VideoRoomApp from "./VideoRoomApp";
import StudentSchedulePage from "./pages/StudentSchedulePage";
import ProfessorSchedulePage from "./pages/ProfessorSchedulePage";
import CounselingRecordPage from "./pages/CounselingRecordPage";

function App() {
  return (
    <div className="App">
      <nav>
        <Link to="/videoroom">회의</Link>
      </nav>
      <Routes>
        <Route path="/videoroom" element={<VideoRoomApp />} />
        <Route path="/" element={<Navigate to="/notice" />} />
        <Route path="/notice" element={<NoticePage />} />

        <Route path="/evaluation" element={<EvaluationPage />} />
        {/* 없는 경로는 notice로 redirect */}
        <Route path="*" element={<Navigate to="/notice" />} />

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
      </Routes>
    </div>
  );
}

export default App;
