import React, { useState } from "react";
import NoticePage from "./NoticePage";
import AcademicCalendar from "../components/Schedule/AcademicCalendar";
import ScheduleManagerPage from "./ScheduleManagerPage";
import { useLocation } from "react-router-dom";

const AcademicPage = ({ role }) => {
  const location = useLocation();
  const { state } = location;
  const [activeTab, setActiveTab] = useState(
    state?.view === "detail" && state?.noticeId
      ? "notice"
      : state?.view === "detail" && state?.scheduleId
      ? "calendar"
      : "notice"
  );
  return (
    <div className="academic-page-container">
      {/* 사이드바 */}
      <aside className="academic-sidebar">
        <h2>학사 정보</h2>
        <ul>
          <li
            className={activeTab === "notice" ? "active" : ""}
            onClick={() => setActiveTab("notice")}
          >
            공지사항
          </li>
          <li
            className={activeTab === "calendar" ? "active" : ""}
            onClick={() => setActiveTab("calendar")}
          >
            학사일정
          </li>
          {role === "staff" && (
            <li
              className={activeTab === "schedule-manager" ? "active" : ""}
              onClick={() => setActiveTab("schedule-manager")}
            >
              학사일정 관리
            </li>
          )}
        </ul>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="academic-content">
        <div className="mypage-card">
          {activeTab === "notice" && <NoticePage role={role} />}
          {activeTab === "calendar" && <AcademicCalendar />}
          {activeTab === "schedule-manager" && role === "staff" && (
            <ScheduleManagerPage />
          )}
        </div>
      </main>
    </div>
  );
};

export default AcademicPage;
