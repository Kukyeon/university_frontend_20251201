import React, { useState } from "react";
import "./Academic.css";

import StudentList from "../components/Academic/StudentList";
import ProfessorList from "../components/Academic/ProfessorList";
import StudentRegister from "../components/Academic/StudentRegister";
import ProfessorRegister from "../components/Academic/ProfessorRegister";
import StaffRegister from "../components/Academic/StaffRegister";
import TuitionNotice from "../components/Academic/TuitionNotice";
import BreakManagement from "../components/Academic/BreakManagement";
import CoursePeriod from "../components/Academic/CoursePeriod";

const Academic = ({ role }) => {
  const [activeTab, setActiveTab] = useState("studentList");

  return (
    <div className="academic-page-container">
      {/* 좌측 메뉴 */}
      <aside className="academic-sidebar">
        <h2>학사관리</h2>
        <ul>
          <li
            className={activeTab === "studentList" ? "active" : ""}
            onClick={() => setActiveTab("studentList")}
          >
            학생 명단 조회
          </li>
          <li
            className={activeTab === "professorList" ? "active" : ""}
            onClick={() => setActiveTab("professorList")}
          >
            교수 명단 조회
          </li>
          <li
            className={activeTab === "studentRegister" ? "active" : ""}
            onClick={() => setActiveTab("studentRegister")}
          >
            학생 등록
          </li>
          <li
            className={activeTab === "professorRegister" ? "active" : ""}
            onClick={() => setActiveTab("professorRegister")}
          >
            교수 등록
          </li>
          <li
            className={activeTab === "staffRegister" ? "active" : ""}
            onClick={() => setActiveTab("staffRegister")}
          >
            직원 등록
          </li>
          <li
            className={activeTab === "tuitionNotice" ? "active" : ""}
            onClick={() => setActiveTab("tuitionNotice")}
          >
            등록금 고지서 발송
          </li>
          <li
            className={activeTab === "breakManagement" ? "active" : ""}
            onClick={() => setActiveTab("breakManagement")}
          >
            휴학 처리
          </li>
          <li
            className={activeTab === "coursePeriod" ? "active" : ""}
            onClick={() => setActiveTab("coursePeriod")}
          >
            수강 신청 기간 설정
          </li>
        </ul>
      </aside>

      {/* 우측 컨텐츠 */}
      <main className="academic-content">
        {activeTab === "studentList" && <StudentList />}
        {activeTab === "professorList" && <ProfessorList />}
        {activeTab === "studentRegister" && <StudentRegister />}
        {activeTab === "professorRegister" && <ProfessorRegister />}
        {activeTab === "staffRegister" && <StaffRegister />}
        {activeTab === "tuitionNotice" && <TuitionNotice />}
        {activeTab === "breakManagement" && <BreakManagement role={role} />}
        {activeTab === "coursePeriod" && <CoursePeriod />}
      </main>
    </div>
  );
};

export default Academic;
