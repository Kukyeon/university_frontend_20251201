import React, { useState } from "react";
import StudentScheduleList from "../components/Schedule/StudentScheduleList";
import BookAppointment from "../components/Schedule/BookAppointment";
import StudentCounselingDetail from "../components/Schedule/StudentCounselingDetail";
import VideoRoom from "../components/Schedule/VideoRoom";

const StudentSchedulePage = ({ user, role }) => {
  const studentId = user?.id;
  const studentName = user?.name; // 학생 이름 추가
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [inRoom, setInRoom] = useState(false);
  const [viewDetail, setViewDetail] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState(null);
  const [professorId, setProfessorId] = useState(null);

  React.useEffect(() => {
    console.log("--- StudentSchedulePage 상태 변경 ---");
    console.log(
      `inRoom: ${inRoom}, selectedScheduleId: ${selectedScheduleId}, professorId: ${professorId}`
    );
    console.log(
      `VideoRoom 렌더링 조건 충족: ${!!(
        inRoom &&
        selectedScheduleId &&
        professorId
      )}`
    );
    if (!professorId && selectedScheduleId) {
      console.error(
        "🚨 경고: scheduleId는 있으나 professorId가 아직 null입니다!"
      );
    }
  }, [inRoom, selectedScheduleId, professorId]);

  const handleSelect = (scheduleId, profId) => {
    setSelectedScheduleId(scheduleId);
    setViewDetail(true);
    setScheduleStatus(null);
    setProfessorId(profId);
  };

  const handleProfessorIdLoaded = (profId) => {
    if (profId) {
      setProfessorId(profId);
    }
  };

  const canStartCounseling = (status) =>
    status === "확인됨" || status === "CONFIRMED";

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
            onStartCounseling={() => setInRoom(true)}
            onProfessorIdLoaded={handleProfessorIdLoaded}
          />
        </div>
      )}

      {inRoom && selectedScheduleId && professorId && (
        <VideoRoom
          scheduleId={selectedScheduleId}
          studentId={studentId}
          professorId={professorId}
          userRole={role}
          userName={studentName}
          onFinish={() => {
            setInRoom(false);
            setViewDetail(false);
            setSelectedScheduleId(null);
            setScheduleStatus(null);
            setProfessorId(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentSchedulePage;
