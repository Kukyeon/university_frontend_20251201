import React, { useState } from "react";
import ProfessorAvailability from "../components/Schedule/ProfessorAvailability";
import ProfessorAvailabilityList from "../components/Schedule/ProfessorAvailabilityList"; // ⭐️ 새로 추가
import StudentScheduleList from "../components/Schedule/StudentScheduleList";
import ProfessorScheduleRequests from "../components/Schedule/ProfessorScheduleRequests";
// import StudentScheduleList from "../components/Schedule/StudentScheduleList"; // (주: 예약 현황 대신 가능 시간 목록을 우선 확인)

const ProfessorSchedulePage = ({ user, role }) => {
  // 등록 후 목록을 갱신하기 위한 상태
  const professorId = user?.id;
  const [refreshKey, setRefreshKey] = useState(0);

  // onSaved 발생 시 refreshKey를 변경하여 목록 컴포넌트가 재렌더링되도록 트리거
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

      {/* 1. 가능 시간 등록 컴포넌트  */}
      <ProfessorAvailability
        professorId={professorId}
        onSaved={handleRefresh}
      />

      {/* 2. 등록된 가능 시간 목록 컴포넌트 */}
      <h2>등록된 상담 가능 시간 목록</h2>
      <ProfessorAvailabilityList professorId={professorId} key={refreshKey} />

      <h2>예약 현황</h2>
      <ProfessorScheduleRequests professorId={professorId} key={refreshKey} />
    </div>
  );
};

export default ProfessorSchedulePage;
