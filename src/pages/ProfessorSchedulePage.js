import React, { useState } from "react";
import ProfessorAvailability from "../components/Schedule/ProfessorAvailability";
import ProfessorAvailabilityList from "../components/Schedule/ProfessorAvailabilityList";
import ProfessorScheduleRequests from "../components/Schedule/ProfessorScheduleRequests";
import "./SchedulePage.css"; // 💡 이 파일을 import 해야 합니다.

const ProfessorSchedulePage = ({ user, role }) => {
  const professorId = user?.id;
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  if (role !== "professor" || !professorId) {
    return (
      // 💡 클래스 적용
      <div className="access-denied-message">
        상담 관리는 교수만 접근 가능합니다.
      </div>
    );
  }

  return (
    // 💡 .page-container 적용
    <div className="page-container">
      {/* 💡 메인 내용 카드 적용 */}
      <div className="page-card professor-schedule-card">
        <h1 className="card-title">교수 상담 관리</h1>

        {/* 📌 상담 가능 시간 등록 */}
        <div className="section-container">
          <ProfessorAvailability
            professorId={professorId}
            onSaved={handleRefresh}
          />
        </div>

        {/* 📌 등록된 상담 가능 시간 목록 */}
        <div className="section-container">
          <h2 className="section-title">등록된 상담 가능 시간 목록</h2>
          <ProfessorAvailabilityList
            professorId={professorId}
            key={refreshKey}
          />
        </div>

        {/* 📌 예약 현황 */}
        <div className="section-container">
          <h2 className="section-title">예약 현황</h2>
          <ProfessorScheduleRequests
            professorId={professorId}
            key={refreshKey}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfessorSchedulePage;
