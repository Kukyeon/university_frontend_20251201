import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NoticePage from "./pages/NoticePage";
import NoticeWritePage from "./pages/NoticeWritePage";
import NoticeUpdatePage from "./pages/NoticeUpdatePage";
import SchedulePage from "./pages/SchedulePage";
import ScheduleWritePage from "./pages/ScheduleWritePage";
import ScheduleUpdatePage from "./pages/ScheduleUpdatePage";
import EvaluationPage from "./pages/EvaluationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/notice" />} />

        <Route
          path="/evaluation/:subjectId"
          element={
            <EvaluationPage
              dto={
                {
                  /* 여기에 강의 DTO 객체 */
                }
              }
            />
          }
        />

        <Route path="/notice" element={<NoticePage />} />
        <Route path="/notice/write" element={<NoticeWritePage />} />
        <Route path="/notice/update/:id" element={<NoticeUpdatePage />} />

        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/schedule/write" element={<ScheduleWritePage />} />
        <Route path="/schedule/update/:id" element={<ScheduleUpdatePage />} />
      </Routes>
    </Router>
  );
}

export default App;
