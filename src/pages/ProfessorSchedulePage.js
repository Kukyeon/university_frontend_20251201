import React, { useState } from "react";
import ProfessorAvailability from "../components/Schedule/ProfessorAvailability";
import ProfessorAvailabilityList from "../components/Schedule/ProfessorAvailabilityList";
import ProfessorScheduleRequests from "../components/Schedule/ProfessorScheduleRequests";

const ProfessorSchedulePage = ({ user, role }) => {
  const professorId = user?.id;
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  if (role !== "professor" || !professorId) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        상담 관리는 교수만 접근 가능합니다.
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>교수 상담 관리</h1>

      <ProfessorAvailability
        professorId={professorId}
        onSaved={handleRefresh}
      />

      <h2>등록된 상담 가능 시간 목록</h2>
      <ProfessorAvailabilityList professorId={professorId} key={refreshKey} />

      <h2>예약 현황</h2>
      <ProfessorScheduleRequests professorId={professorId} key={refreshKey} />
    </div>
  );
};

export default ProfessorSchedulePage;
