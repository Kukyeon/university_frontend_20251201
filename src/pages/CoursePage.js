import React, { useState } from "react";
import SectionLayout from "../components/Layout/SectionLayout";

import ProfCourse from "../components/Course/ProfCourse";
import ProfEvaluation from "../components/Course/ProfEvalution";
import AllCourse from "../components/Course/AllCourse";
import "./CoursePage.css";
import ProfDashboard from "./ProfDashboard";
const CoursePage = ({ role }) => {
  const [activeTab, setActiveTab] = useState("전체 강의 조회");

  const menuItems =
    role === "professor"
      ? ["전체 강의 조회", "내 강의 조회", "내 강의 평가", "위험 학생 조회"]
      : ["전체 강의 조회"];

  /* ===== Sidebar ===== */
  const sidebar = (
    <ul className="section-menu">
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
  );

  return (
    <SectionLayout title="수업" sidebar={sidebar}>
      {activeTab === "전체 강의 조회" && <AllCourse role={role} />}

      {role === "professor" && (
        <>
          {activeTab === "내 강의 조회" && <ProfCourse role={role} />}
          {activeTab === "내 강의 평가" && <ProfEvaluation />}
          {activeTab === "위험 학생 조회" && <ProfDashboard />}
        </>
      )}
    </SectionLayout>
  );
};

export default CoursePage;
