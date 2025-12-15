import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StudentScheduleList from "../components/Schedule/StudentScheduleList";
import BookAppointment from "../components/Schedule/BookAppointment";
import StudentCounselingDetail from "../components/Schedule/StudentCounselingDetail";
import VideoRoom from "../components/Schedule/VideoRoom";
import "./SchedulePage.css"; // 💡 CSS 파일을 여기에 import 해야 합니다.

const StudentSchedulePage = ({ user, role }) => {
  const studentId = user?.id;
  const studentName = user?.name || `학생-${studentId}`;

  // 🔥 URL 파라미터 관리
  const [searchParams, setSearchParams] = useSearchParams();
  const scheduleIdFromUrl = searchParams.get("scheduleId");
  const professorIdFromUrl = searchParams.get("professorId");

  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [inRoom, setInRoom] = useState(false);
  const [viewDetail, setViewDetail] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState(null);
  const [professorId, setProfessorId] = useState(null);

  // ✅ URL에 scheduleId가 있으면 자동으로 화상 상담 입장
  useEffect(() => {
    if (scheduleIdFromUrl && professorIdFromUrl) {
      setSelectedScheduleId(scheduleIdFromUrl);
      setProfessorId(professorIdFromUrl);
      setInRoom(true);
      setViewDetail(false);
    }
  }, [scheduleIdFromUrl, professorIdFromUrl]);

  // 📌 디버그 로그 (유지)
  useEffect(() => {
    console.log("--- StudentSchedulePage 상태 변경 ---");
    console.log(
      `inRoom: ${inRoom}, selectedScheduleId: ${selectedScheduleId}, professorId: ${professorId}`
    );
    if (!professorId && selectedScheduleId) {
      console.error(
        "🚨 경고: scheduleId는 있으나 professorId가 아직 null입니다!"
      );
    }
  }, [inRoom, selectedScheduleId, professorId]);

  // 📌 일정 선택
  const handleSelect = (scheduleId, profId) => {
    setSelectedScheduleId(scheduleId);
    setProfessorId(profId);
    setViewDetail(true);
    setInRoom(false);
    setScheduleStatus(null);
  };

  // 📌 StudentCounselingDetail에서 교수 ID 보완
  const handleProfessorIdLoaded = (profId) => {
    if (profId) {
      setProfessorId(profId);
    }
  };

  // 🔥 상담 시작 → URL에 scheduleId + professorId 기록
  const handleStartCounseling = ({ scheduleId, professorId }) => {
    setSearchParams({
      scheduleId,
      professorId,
    });
  };

  // 🔥 상담 종료 → URL & 상태 초기화
  const handleFinishCounseling = () => {
    setSearchParams({});
    setInRoom(false);
    setViewDetail(false);
    setSelectedScheduleId(null);
    setProfessorId(null);
    setScheduleStatus(null);
  };

  if (role !== "student") {
    return (
      // 💡 인라인 스타일 제거 및 클래스 적용
      <div className="access-denied-message">접근 권한이 없습니다.</div>
    );
  }

  return (
    // 💡 전체 컨테이너 클래스 적용
    <div className="page-container">
      {/* 💡 메인 내용 카드 클래스 적용 */}
      <div className="page-card main-content-card">
        {/* 📌 목록 화면 */}
        {!inRoom && !viewDetail && (
          <>
            <h1 className="card-title">학생 상담 일정</h1>
            <StudentScheduleList
              studentId={studentId}
              onSelect={handleSelect}
            />
            <BookAppointment studentId={studentId} />
          </>
        )}

        {/* 📌 상담 상세 */}
        {!inRoom && viewDetail && selectedScheduleId && (
          <div>
            <button
              onClick={() => setViewDetail(false)}
              className="btn-back" // 💡 클래스 적용
            >
              목록으로 돌아가기
            </button>

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
          </div>
        )}

        {/* 🎥 화상 상담 */}
        {inRoom && selectedScheduleId && professorId && (
          <VideoRoom
            scheduleId={selectedScheduleId} // ⭐ 교수와 동일한 room
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
