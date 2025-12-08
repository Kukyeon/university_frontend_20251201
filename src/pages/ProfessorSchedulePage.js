// src/pages/ProfessorSchedulePage.js (수정된 파일)

import React, { useState } from "react";
import ProfessorAvailability from "../components/Schedule/ProfessorAvailability";
import ProfessorAvailabilityList from "../components/Schedule/ProfessorAvailabilityList"; // ⭐️ 새로 추가
import StudentScheduleList from "../components/Schedule/StudentScheduleList";
// import StudentScheduleList from "../components/Schedule/StudentScheduleList"; // (주: 예약 현황 대신 가능 시간 목록을 우선 확인)

const ProfessorSchedulePage = ({ professorId }) => {
  // 등록 후 목록을 갱신하기 위한 상태
  const [refreshKey, setRefreshKey] = useState(0);

  // onSaved 발생 시 refreshKey를 변경하여 목록 컴포넌트가 재렌더링되도록 트리거
  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div style={{ padding: "20px" }}>
      <h1>교수 상담 관리</h1>

      {/* 1. 가능 시간 등록 컴포넌트 (등록 성공 시 handleRefresh 호출) */}
      <ProfessorAvailability
        professorId={professorId}
        onSaved={handleRefresh} // ⭐️ onSaved 이벤트 핸들러 추가
      />

      {/* 2. 등록된 가능 시간 목록 컴포넌트 */}
      <h2>등록된 상담 가능 시간 목록</h2>
      <ProfessorAvailabilityList
        professorId={professorId}
        // ⭐️ key를 사용하여 목록 갱신을 강제합니다.
        key={refreshKey}
      />

      {/* (주: 예약 현황을 보려면 아래 주석을 해제하세요.) */}
      <h2>예약 현황</h2>
      <StudentScheduleList
        studentId={null} // null이면 교수 전체 예약 확인 가능
        key={refreshKey} // 갱신 키 공유
      />
    </div>
  );
};

export default ProfessorSchedulePage;
