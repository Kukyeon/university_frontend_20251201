import React, { useState } from "react";
import StudentScheduleList from "../components/Schedule/StudentScheduleList";
import BookAppointment from "../components/Schedule/BookAppointment";
import CounselingRoomWrapper from "../components/CounselingRoom/CounselingRoomWrapper";
import ScheduleDetail from "../components/Schedule/ScheduleDetail";

// 로그인된 학생 ID (임시)
const CURRENT_STUDENT_ID = 1;

const StudentSchedulePage = () => {
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [inRoom, setInRoom] = useState(false);
  const [viewDetail, setViewDetail] = useState(false);

  const handleSelect = (scheduleId) => {
    setSelectedScheduleId(scheduleId);
    setViewDetail(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      {!inRoom && !viewDetail && (
        <>
          <h1>학생 상담 일정</h1>
          <StudentScheduleList
            studentId={CURRENT_STUDENT_ID}
            onSelect={handleSelect}
          />
          <BookAppointment studentId={CURRENT_STUDENT_ID} professorId={1} />
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
          <ScheduleDetail id={selectedScheduleId} />
          <button onClick={() => setInRoom(true)} style={{ marginTop: "10px" }}>
            상담 시작
          </button>
        </div>
      )}

      {inRoom && selectedScheduleId && (
        <CounselingRoomWrapper
          scheduleId={selectedScheduleId}
          onFinish={() => {
            setInRoom(false);
            setViewDetail(false);
            setSelectedScheduleId(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentSchedulePage;
