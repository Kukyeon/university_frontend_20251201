import React, { useEffect, useState } from "react";
import CourseListPage from "../components/Sugang/CourseListPage";
import EnrollmentPage from "../components/Sugang/EnrollmentPage";
import EnrollmentHistoryPage from "../components/Sugang/EnrollmentHistoryPage";
import "./Sugang.css";

const Sugang = ({ role }) => {
  const [activeTab, setActiveTab] = useState("강의 시간표 조회");
  const [pageHeader, setPageHeader] = useState(activeTab);
  const menuItems = ["강의 시간표 조회", "수강 신청", "수강 신청 내역 조회"];
  console.log(role);
  useEffect(() => {
    setPageHeader(activeTab);
  }, [activeTab]);
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
          <h2>{pageHeader}</h2>
          {/* 여기에 activeTab에 따라 다른 내용 렌더링 */}
          {activeTab === "강의 시간표 조회" && <CourseListPage />}
          {activeTab === "수강 신청" && (
            <EnrollmentPage setPageHeader={setPageHeader} />
          )}
          {activeTab === "수강 신청 내역 조회" && (
            <EnrollmentHistoryPage
              setPageHeader={setPageHeader}
              setActiveTab={setActiveTab}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Sugang;
