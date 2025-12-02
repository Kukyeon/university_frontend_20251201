import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import NoticePage from "./pages/NoticePage";
import SchedulePage from "./pages/SchedulePage";
import EvaluationPage from "./pages/EvaluationPage";
import VideoRoomPage from "./pages/VideoRoomPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/videoroom" element={<VideoRoomPage />} />
        <Route path="/" element={<Navigate to="/notice" />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/evaluation" element={<EvaluationPage />} />
        {/* 없는 경로는 notice로 redirect */}
        <Route path="*" element={<Navigate to="/notice" />} />
      </Routes>
    </div>
  );
}

export default App;
