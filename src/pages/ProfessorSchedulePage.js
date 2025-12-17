import React from "react";
import ProfessorAvailabilityManager from "../components/Schedule/ProfessorAvailabilityManager"; // 🚨 [수정] 새 관리 컴포넌트 임포트
import ProfessorScheduleList from "../components/Schedule/ProfessorScheduleList";

import "../pages/SchedulePage.css";

// import CounselingRecordBoard from "../components/Counseling/CounselingRecordBoard";

const ProfessorSchedulePage = ({ user, role }) => {
  const professorId = user?.id;
  // role 기반 권한 검사는 상위 컴포넌트에서 처리한다고 가정
  if (role?.toLowerCase() !== "professor" || !professorId) {
    return (
      <div className="error-message">상담 관리는 교수만 접근 가능합니다.</div>
    );
  }

  return (
    <div className="schedule-page-container">
      <h2>🧑‍🏫 교수 상담 관리 페이지</h2>

      {/* 🚨 [수정] 달력 기반 관리 컴포넌트 렌더링 */}
      <ProfessorAvailabilityManager professorId={user.id} />

      <hr className="divider" />

      {/* 학생들의 예약 요청 목록 (기존 코드 유지) */}
      <ProfessorScheduleList professorId={user.id} />

      <hr className="divider" />

      {/* 상담 기록 조회 컴포넌트 (기존 코드 유지)
      <CounselingRecordBoard /> */}
    </div>
  );
};

export default ProfessorSchedulePage;
