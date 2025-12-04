import React, { useState } from "react";
import ProfessorAvailability from "../components/Schedule/ProfessorAvailability";
import StudentScheduleList from "../components/Schedule/StudentScheduleList";

const ProfessorSchedulePage = ({ professorId }) => {
  const [refresh, setRefresh] = useState(false);
  const handleRefresh = () => setRefresh((f) => !f);

  return (
    <div style={{ padding: "20px" }}>
      <h1>교수 상담 관리</h1>

      <ProfessorAvailability
        professorId={professorId}
        onSaved={handleRefresh}
      />

      <h2>예약 현황</h2>
      <StudentScheduleList
        studentId={null} // null이면 교수 전체 예약 확인 가능
        key={refresh}
      />
    </div>
  );
};

export default ProfessorSchedulePage;
