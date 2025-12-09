import React, { useState } from "react";
import ProfCourse from "../components/Course/ProfCourse";
import ProfEvaluation from "../components/Course/ProfEvalution";
import AllCourse from "../components/Course/AllCourse";
import CourseListPage from "./CourseListPage";
import EnrollmentPage from "./EnrollmentPage";
import EnrollmentHistoryPage from "./EnrollmentHistoryPage";

const Sugang = ({ role }) => {
  const [activeTab, setActiveTab] = useState("강의 시간표 조회");

  const menuItems = ["강의 시간표 조회", "수강 신청", "수강 신청 내역 조회"];
  console.log(role);
  return (
    <div className="academic-page-container">
      {/* 사이드바 */}
      <aside className="academic-sidebar">
        <h2>수업</h2>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item}
              className={activeTab === item ? "active" : ""}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="academic-content">
        <div className="mypage-card">
          <h2>{activeTab}</h2>
          {/* 여기에 activeTab에 따라 다른 내용 렌더링 */}
          {activeTab === "강의 시간표 조회" && <CourseListPage />}
          {activeTab === "수강 신청" && <EnrollmentPage />}
          {activeTab === "수강 신청 내역 조회" && <EnrollmentHistoryPage />}
        </div>
      </main>
    </div>
  );
};

export default Sugang;
