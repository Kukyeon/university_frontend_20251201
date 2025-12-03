import "./App.css";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import NoticePage from "./pages/NoticePage";
import SchedulePage from "./pages/SchedulePage";
import EvaluationPage from "./pages/EvaluationPage";
import VideoRoomApp from "./VideoRoomApp";
import Home from "./pages/Home";
import Header from "./components/Home/Header";
import Footer from "./components/Home/Footer";
import { useState } from "react";

function App() {
  const [user, setUser] = useState({
    name: "박시우",
    id: "2023000001",
  }); // 로그인 상태 예시
  return (
    <div className="App">
      <nav>
        <Link to="/videoroom">회의</Link>
      </nav>
    <Header user={user} />
      <Routes>
        <Route path="/videoroom" element={<VideoRoomApp />} />
        {/* <Route path="/" element={<Navigate to="/notice" />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/evaluation" element={<EvaluationPage />} />
        {/* 없는 경로는 home으로 redirect */}
        <Route path="/" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
