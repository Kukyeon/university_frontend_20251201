import React, { useState } from "react";
import "./Academic.css"; // 기존 스타일 그대로 사용
import College from "../components/Registration/College";
import Department from "../components/Registration/Department";
import Classroom from "../components/Registration/ClassRoom";
import Course from "../components/Registration/Course";
import CollegeTuition from "../components/Registration/CollegeTuition";
const AcademicRegistration = () => {
  const [activeTab, setActiveTab] = useState("college");
  return (
    <div className="academic-page-container">
      {/* 좌측 네비 */}
      <aside className="academic-sidebar">
        <h2>등록 관리</h2>
        <ul>
          <li
            className={activeTab === "college" ? "active" : ""}
            onClick={() => setActiveTab("college")}
          >
            단과대학
          </li>
          <li
            className={activeTab === "department" ? "active" : ""}
            onClick={() => setActiveTab("department")}
          >
            학과
          </li>
          <li
            className={activeTab === "classroom" ? "active" : ""}
            onClick={() => setActiveTab("classroom")}
          >
            강의실
          </li>
          <li
            className={activeTab === "course" ? "active" : ""}
            onClick={() => setActiveTab("course")}
          >
            강의
          </li>
          <li
            className={activeTab === "collegeTuition" ? "active" : ""}
            onClick={() => setActiveTab("collegeTuition")}
          >
            단대별 등록금
          </li>
        </ul>
      </aside>

      {/* 우측 컨텐츠 */}
      <main className="academic-content">
        {activeTab === "college" && <College />}

        {activeTab === "department" && <Department />}

        {activeTab === "classroom" && <Classroom />}

        {activeTab === "course" && <Course />}

        {activeTab === "collegeTuition" && <CollegeTuition />}
      </main>
    </div>
  );
};

export default AcademicRegistration;
