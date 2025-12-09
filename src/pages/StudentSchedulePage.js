import React, { useState } from "react";
import StudentScheduleList from "../components/Schedule/StudentScheduleList";
import BookAppointment from "../components/Schedule/BookAppointment";
import CounselingRoomWrapper from "../components/Counseling/CounselingRoomWrapper";
import StudentCounselingDetail from "../components/Schedule/StudentCounselingDetail";

const StudentSchedulePage = ({ user, role }) => {
  const studentId = user?.id;
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [inRoom, setInRoom] = useState(false);
  const [viewDetail, setViewDetail] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState(null);

  const handleSelect = (scheduleId) => {
    console.log(`[DEBUG] 상세 보기 클릭! ID: ${scheduleId}`);
    setSelectedScheduleId(scheduleId);
    setViewDetail(true);
    setScheduleStatus(null);
  };

  const canStartCounseling = (status) => {
    // 백엔드에서 '확인됨' 또는 'CONFIRMED'일 때만 시작 가능하다고 가정
    return status === "확인됨" || status === "CONFIRMED";
  };

  if (role !== "student") {
    return (
      <div style={{ padding: "20px", color: "red" }}>접근 권한이 없습니다.</div>
    );
  }
  return (
    <div style={{ padding: "20px" }}>
      {!inRoom && !viewDetail && (
        <>
          <h1>학생 상담 일정</h1>
          <StudentScheduleList studentId={studentId} onSelect={handleSelect} />
          <BookAppointment studentId={studentId} />
        </>
      )}

      {!inRoom && viewDetail && selectedScheduleId && (
        <div>
          <button
            onClick={() => setViewDetail(false)}
            style={{ marginBottom: "10px" }}
          >
            목록으로 돌아가기
          </button>
          <StudentCounselingDetail
            scheduleId={selectedScheduleId}
            studentId={studentId}
            onStatusLoaded={setScheduleStatus}
          />
          {scheduleStatus && canStartCounseling(scheduleStatus) && (
            <button
              onClick={() => setInRoom(true)}
              style={{ marginTop: "10px" }}
            >
              🎥 상담 시작
            </button>
          )}
        </div>
      )}

      {inRoom && selectedScheduleId && (
        <CounselingRoomWrapper
          scheduleId={selectedScheduleId}
          onFinish={() => {
            setInRoom(false);
            setViewDetail(false);
            setSelectedScheduleId(null);
            setScheduleStatus(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentSchedulePage;
