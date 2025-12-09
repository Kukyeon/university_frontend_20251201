import React, { useState } from "react";
import CourseListPage from "./CourseListPage";
import ProfCourse from "../components/Course/ProfCourse";
import ProfEvaluation from "../components/Course/ProfEvalution";
import AllCourse from "../components/Course/AllCourse";

const CoursePage = () => {
  const [activeTab, setActiveTab] = useState("전체 강의 조회");

  const menuItems = ["전체 강의 조회", "내 강의 조회", "내 강의 평가"];

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
          {activeTab === "전체 강의 조회" && <AllCourse />}
          {activeTab === "내 강의 조회" && <ProfCourse />}
          {activeTab === "내 강의 평가" && <ProfEvaluation />}
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
