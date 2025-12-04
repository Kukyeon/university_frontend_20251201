import React, { useState } from "react";

import NoticePage from "./NoticePage";

import AcademicCalendar from "../components/Schedule/AcademicCalendar";

const AcademicPage = () => {
  const [selectedTab, setSelectedTab] = useState("calendar");

  return (
    <div style={{ display: "flex" }}>
      {/* 사이드 네비게이션 (좌측 탭 메뉴) */}
      <div style={{ width: "200px", paddingRight: "20px" }}>
        <h3>공지사항</h3>

        {/*  공지사항 탭 */}
        <div
          onClick={() => setSelectedTab("notice")}
          style={{
            cursor: "pointer",
            padding: "10px 0",
            borderBottom: "1px solid #ddd",
            fontWeight: selectedTab === "notice" ? "bold" : "normal",
            color: selectedTab === "notice" ? "#007bff" : "inherit",
          }}
        >
          공지사항
        </div>

        {/*  학사일정 탭 */}
        <div
          onClick={() => setSelectedTab("calendar")}
          style={{
            cursor: "pointer",
            padding: "10px 0",
            fontWeight: selectedTab === "calendar" ? "bold" : "normal",
            color: selectedTab === "calendar" ? "#007bff" : "inherit",
          }}
        >
          학사일정
        </div>
      </div>

      {/* 2. 메인 컨텐츠 영역 */}
      <div style={{ flexGrow: 1, paddingLeft: "20px" }}>
        {selectedTab === "notice" && <NoticePage />}
        {selectedTab === "calendar" && <AcademicCalendar />}
      </div>
    </div>
  );
};

export default AcademicPage;
