import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StudentScheduleList from "../components/Schedule/StudentScheduleList";
import BookAppointment from "../components/Schedule/BookAppointment";
import StudentCounselingDetail from "../components/Schedule/StudentCounselingDetail";
import VideoRoom from "../components/Schedule/VideoRoom";
import "./SchedulePage.css";

const StudentSchedulePage = ({ user, role }) => {
  const studentId = user?.id;
  const studentName = user?.name || `학생-${studentId}`;
  const [refreshKey, setRefreshKey] = useState(0); // 목록 갱신용 // URL 파라미터 관리

  const [searchParams, setSearchParams] = useSearchParams();
  const scheduleIdFromUrl = searchParams.get("scheduleId");
  const professorIdFromUrl = searchParams.get("professorId");

  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [inRoom, setInRoom] = useState(false);
  const [viewDetail, setViewDetail] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState(null);
  const [professorId, setProfessorId] = useState(null); // URL에 scheduleId가 있으면 자동으로 화상 상담 입장

  useEffect(() => {
    if (scheduleIdFromUrl && professorIdFromUrl) {
      setSelectedScheduleId(scheduleIdFromUrl);
      setProfessorId(professorIdFromUrl);
      setInRoom(true);
      setViewDetail(false);
    }
  }, [scheduleIdFromUrl, professorIdFromUrl]); // 📌 일정 선택 (목록에서 항목 클릭 시)

  const handleSelect = (scheduleId, profId) => {
    setSelectedScheduleId(scheduleId);
    setProfessorId(profId);
    setViewDetail(true);
    setInRoom(false);
    setScheduleStatus(null);
  }; // 📌 StudentCounselingDetail에서 교수 ID 보완 (화상 상담 진입을 위함)

  const handleProfessorIdLoaded = (profId) => {
    if (profId) {
      setProfessorId(profId);
    }
  };

  // 📌 예약 성공 시 목록 갱신
  const handleBooked = () => {
    setRefreshKey((prev) => prev + 1);
  }; // 🔥 상담 시작 → URL에 scheduleId + professorId 기록

  const handleStartCounseling = ({ scheduleId, professorId }) => {
    setSearchParams({
      scheduleId,
      professorId,
    });
  }; // 🔥 상담 종료 → URL & 상태 초기화

  const handleFinishCounseling = () => {
    setSearchParams({});
    setInRoom(false);
    setViewDetail(false);
    setSelectedScheduleId(null);
    setProfessorId(null);
    setScheduleStatus(null);
    setRefreshKey((prev) => prev + 1); // 종료 후 목록 갱신
  };

  if (role !== "student") {
    return <div className="access-denied-message">접근 권한이 없습니다.</div>;
  }

  return (
    <div className="page-container">
      <div className="page-card main-content-card">
        {/* 📌 목록 화면 */}
        {!inRoom && !viewDetail && (
          <>
            <h1 className="card-title">학생 상담 일정</h1>
            <BookAppointment studentId={studentId} onBooked={handleBooked} />

            <StudentScheduleList
              studentId={studentId}
              onSelect={handleSelect}
              listRefreshKey={refreshKey} // 예약/종료 후 목록 갱신을 위해 사용
            />
          </>
        )}
        {/* 📌 상담 상세 */}
        {!inRoom && viewDetail && selectedScheduleId && (
          <div>
            <StudentCounselingDetail
              scheduleId={selectedScheduleId}
              studentId={studentId}
              onStatusLoaded={setScheduleStatus}
              onProfessorIdLoaded={handleProfessorIdLoaded}
              onStartCounseling={() =>
                handleStartCounseling({
                  scheduleId: selectedScheduleId,
                  professorId,
                })
              }
            />
            <br></br>
            <button onClick={() => setViewDetail(false)} className="btn-back">
              목록으로 돌아가기
            </button>
          </div>
        )}
        {/* 🎥 화상 상담 */}
        {inRoom && selectedScheduleId && professorId && (
          <VideoRoom
            scheduleId={selectedScheduleId}
            studentId={studentId}
            professorId={professorId}
            userRole="student"
            userName={studentName}
            onFinish={handleFinishCounseling}
          />
        )}
      </div>
    </div>
  );
};

export default StudentSchedulePage;
