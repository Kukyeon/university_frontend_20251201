import VideoRoom from "../../components/Schedule/VideoRoom";
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getCounselingRecord, saveRecord } from "../../api/scheduleApi";
import "../../pages/SchedulePage.css";

const ProfessorCounselingDetail = () => {
  const { scheduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const studentId = queryParams.get("studentId");
  const profId = queryParams.get("professorId");

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMeetingActive, setIsMeetingActive] = useState(false);

  const handleStartVideo = () => {
    // record가 아직 로드되지 않았으면 실행하지 않습니다.
    if (!record) return;
    setIsMeetingActive(true);
  };

  const handleFinishMeeting = async (finalNotes) => {
    setIsMeetingActive(false);
    setLoading(true); // 저장 및 재요청 동안 로딩 상태 표시

    try {
      if (finalNotes !== undefined && record?.keywords !== undefined) {
        // 💡 1. VideoRoom에서 전달받은 최종 notes를 저장합니다.
        await saveRecord(scheduleId, finalNotes, record.keywords);
        console.log("상담 기록 자동 저장 완료:", finalNotes);
        alert("상담 기록이 성공적으로 저장되었습니다.");
      }
    } catch (err) {
      console.error("상담 기록 자동 저장 실패:", err);
      alert("상담 기록 자동 저장에 실패했습니다. 수동으로 저장해주세요.");
    }

    // 💡 2. 저장 후, 상세 정보(record)를 재요청하여 화면을 업데이트합니다.
    await fetchRecord();
  };

  const handleWriteRecord = () => {
    // 기록 작성/수정 페이지로 이동
    navigate(
      `/professor/counseling/write/${scheduleId}?studentId=${studentId}`
    );
  };

  const fetchRecord = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCounselingRecord(scheduleId, studentId);
      setRecord(data);
    } catch (err) {
      console.error("교수 상담 기록 조회 실패:", err);
      setError("상담 기록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!scheduleId || !studentId) {
      setError("상담 ID 또는 학생 ID가 누락되었습니다.");
      setLoading(false);
      return;
    }
    if (!isMeetingActive) {
      fetchRecord();
    }
  }, [scheduleId, studentId, isMeetingActive]); // 화상 회의 종료 후 재요청

  if (isMeetingActive) {
    const currentProfessorName = record.schedule.professorName || "교수";
    return (
      <VideoRoom
        scheduleId={scheduleId}
        studentId={studentId}
        professorId={profId}
        onFinish={handleFinishMeeting}
        userRole="professor"
        userName={currentProfessorName} // 실제 사용자 이름으로 대체 필요
        // 💡 VideoRoom에 기존 기록 notes를 전달하여 회의 중 수정 가능하게 함
        initialNotes={record?.notes || ""}
        initialKeywords={record?.keywords || ""} // 💡 키워드도 전달하여 저장 시 누락 방지
      />
    );
  }

  // 💡 클래스 적용
  if (loading) return <div className="loading-text">상담 상세 로딩 중...</div>;
  if (error) return <div className="error-message">에러: {error}</div>;
  if (!record || !record.schedule)
    return (
      <div className="info-message">상담 상세 정보가 존재하지 않습니다.</div>
    );

  const schedule = record.schedule;
  const isConfirmed =
    schedule.status === "확인됨" || schedule.status === "CONFIRMED";
  const isCompleted =
    schedule.status === "상담 완료" || schedule.status === "COMPLETED";
  const canWriteOrEditRecord = isConfirmed || isCompleted;

  return (
    // 💡 클래스 적용
    <div className="counseling-detail-page">
      <h3 className="detail-page-title">[교수용] 상담 상세 내용</h3>

      {/* 💡 정보 그룹 */}
      <div className="schedule-info-group">
        <p className="schedule-info-item">
          <strong className="info-label">학생 이름:</strong>
          <span className="info-value">
            {schedule.studentName || "정보 없음"}
          </span>
        </p>

        <p className="schedule-info-item">
          <strong className="info-label">상담 일시:</strong>
          <span className="info-value">
            {new Date(schedule.startTime).toLocaleString()} ~{" "}
            {new Date(schedule.endTime).toLocaleString()}
          </span>
        </p>

        <p className="schedule-info-item">
          <strong className="info-label">현재 상태:</strong>
          <span
            className={`status-badge status-${schedule.status.toLowerCase()}`}
          >
            {schedule.status}
          </span>
        </p>
      </div>

      <hr className="detail-divider" />

      {/* 💡 상담 기록 영역 */}
      <h4 className="record-section-title">상담 기록 (Notes)</h4>
      <div className="counseling-notes-box">
        {record.notes || "저장된 상담 내용이 없습니다."}
      </div>

      {record.keywords && (
        <p className="record-keywords">
          <strong className="info-label">키워드:</strong>
          <span className="info-value keywords-value">{record.keywords}</span>
        </p>
      )}

      {/* 💡 버튼 영역 */}
      <div className="action-buttons-group">
        {isConfirmed && (
          <button
            onClick={handleStartVideo}
            className="btn-start-video" // 💡 클래스 적용
          >
            🎥 화상 회의 시작
          </button>
        )}

        {canWriteOrEditRecord && (
          <button
            onClick={handleWriteRecord}
            className="btn-edit-record" // 💡 클래스 적용
          >
            {record.notes ? "상담 기록 수정" : "상담 기록 작성"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfessorCounselingDetail;
