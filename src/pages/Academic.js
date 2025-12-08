import React, { useState } from "react";
import "./Academic.css";

import StudentList from "../components/Academic/StudentList";
import ProfessorList from "../components/Academic/ProfessorList";
import StudentRegister from "../components/Academic/StudentRegister";

const Academic = () => {
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
        {/* {activeTab === "breakManagement" && <BreakManagement />} */}
        {/* 나머지 기능 컴포넌트는 추후 추가 */}
        {[
          "professorRegister",
          "staffRegister",
          "tuitionNotice",
          "coursePeriod",
        ].includes(activeTab) && (
          <div style={{ padding: "20px" }}>
            <h3>{activeTab}</h3>
            <p>해당 기능은 아직 준비 중입니다.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Academic;
