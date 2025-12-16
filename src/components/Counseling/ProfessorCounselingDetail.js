// src/components/Counseling/ProfessorCounselingDetail.js

import VideoRoom from "../../components/Schedule/VideoRoom";
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  getCounselingRecord,
  saveRecord,
  updateScheduleStatus,
  // 💡 [필요] 일반 상담 일정 상세 조회를 위한 API를 여기서 import 해야 합니다.
  // 예: getProfessorScheduleDetail, getScheduleDetail 등
} from "../../api/scheduleApi";
import "../../pages/SchedulePage.css";

const ProfessorCounselingDetail = ({ user }) => {
  const { scheduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const studentId = queryParams.get("studentId");
  const profId = queryParams.get("professorId");

  // 💡 [수정] professorName 변수 선언 위치를 컴포넌트 초기 스코프로 이동 (오류 해결)
  const professorName = user?.name || "교수님";
  const viewType = queryParams.get("viewType");

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMeetingActive, setIsMeetingActive] = useState(false);

  const handleStartVideo = () => {
    if (!record) return;
    setIsMeetingActive(true);
  };

  const handleFinishMeeting = async (finalNotes) => {
    setIsMeetingActive(false);
    setLoading(true);

    try {
      if (finalNotes !== undefined && record?.keywords !== undefined) {
        await saveRecord(scheduleId, finalNotes, record.keywords);
        console.log("상담 기록 자동 저장 완료:", finalNotes);
        await updateScheduleStatus(scheduleId, "COMPLETED");
        alert("상담 기록이 성공적으로 저장되었습니다.");
      }
    } catch (err) {
      console.error("상담 기록 자동 저장 실패:", err);
      alert("상담 기록 자동 저장에 실패했습니다. 수동으로 저장해주세요.");
    }

    await fetchData();
  };

  const handleWriteRecord = () => {
    navigate(
      `/professor/counseling/write/${scheduleId}?studentId=${studentId}`
    );
  };

  // 💡 [수정/분리] API 호출 로직 분리 (viewType에 따라 분기)
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;

      // 1. '상담 기록 게시판'에서 클릭했거나, 이미 완료된 기록을 조회하는 경우
      //    (viewType=record 이거나 studentId가 존재하는 경우를 기록 조회로 가정)
      if (viewType === "record" || (studentId && viewType !== "schedule")) {
        if (!studentId) {
          throw new Error("상담 기록 조회에 필요한 학생 ID가 누락되었습니다.");
        }
        data = await getCounselingRecord(scheduleId, studentId);
      } else {
        // 2. 일반 일정 상세를 조회하는 경우 (예: 확정/진행 상담 목록에서 클릭)
        // 🚨 [주의] 이곳은 실제 '일반 상담 일정 상세 조회' API로 대체되어야 합니다.
        // 현재는 임시로 getCounselingRecord를 사용합니다.
        if (!studentId) {
          throw new Error(
            "일정 상세 조회 시 학생 ID가 필요합니다. (API 구조 확인 필요)"
          );
        }
        // 임시 대체 코드:
        data = await getCounselingRecord(scheduleId, studentId);
      }

      setRecord(data);
    } catch (err) {
      console.error("교수 상담 상세 조회 실패:", err);
      setError(
        "상담 상세 정보를 불러오는 데 실패했습니다: " +
          (err.message || "서버 연결 오류")
      );
    } finally {
      setLoading(false);
    }
  };
  const handleGoBack = () => {
    navigate("/professor-schedule");
  };
  useEffect(() => {
    if (!scheduleId) {
      setError("상담 ID가 누락되었습니다.");
      setLoading(false);
      return;
    }

    if (viewType === "record" && !studentId) {
      setError("상담 기록 조회에 필요한 학생 ID가 누락되었습니다.");
      setLoading(false);
      return;
    }

    if (!isMeetingActive) {
      fetchData();
    }
  }, [scheduleId, studentId, isMeetingActive, viewType]);

  if (isMeetingActive) {
    // professorName은 상위 스코프에 정의되어 있으므로 오류가 해결되었습니다.
    const currentProfessorName =
      record?.schedule?.professorName || professorName;

    return (
      <VideoRoom
        scheduleId={scheduleId}
        studentId={studentId}
        professorId={profId}
        onFinish={handleFinishMeeting}
        userRole="professor"
        userName={currentProfessorName}
        initialNotes={record?.notes || ""}
        initialKeywords={record?.keywords || ""}
      />
    );
  }

  // 💡 렌더링 시작
  if (loading) return <div className="loading-text">상담 상세 로딩 중...</div>;
  if (error) return <div className="error-message">에러: {error}</div>;

  if (!record || !record.schedule) {
    const isRecordView = viewType === "record";
    return (
      <div className="info-message">
        {isRecordView ? "상담 기록" : "상담 일정"} 정보가 존재하지 않습니다.
      </div>
    );
  }

  const schedule = record.schedule;
  const status = schedule.status ? schedule.status.toUpperCase() : "";

  const isConfirmed = status === "확인됨" || status === "CONFIRMED";
  const isCompleted = status === "상담 완료" || status === "COMPLETED";
  const canWriteOrEditRecord = isConfirmed || isCompleted;

  const isRecordEmpty = !record.notes && !record.keywords && isCompleted;

  // 상담 완료(COMPLETED) 상태거나 viewType이 'record'이면 기록 조회 뷰로 간주
  const isRecordView = viewType === "record" || isCompleted;

  return (
    <div className="counseling-detail-page">
      <h3 className="detail-page-title">[교수용] 상담 상세 내용</h3>

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
          <span className={`status-badge status-${status.toLowerCase()}`}>
            {schedule.status}
          </span>
        </p>
      </div>

      <hr className="detail-divider" />

      {/* 상담 기록 영역: 완료되었거나 기록 조회 시에만 표시 */}
      {(isCompleted || viewType === "record" || canWriteOrEditRecord) && (
        <>
          <h4 className="record-section-title">상담 기록 (Notes)</h4>
          <div className="counseling-notes-box">
            {record.notes ? record.notes : "저장된 상담 내용이 없습니다."}
          </div>
          {record.keywords && (
            <p className="record-keywords">
              <strong className="info-label">키워드:</strong>
              <span className="info-value keywords-value">
                {record.keywords}
              </span>
            </p>
          )}
        </>
      )}

      {/* 버튼 영역 */}
      <div className="action-buttons-group">
        {/* '상담 기록 게시판'에서 들어왔다면 화상회의 버튼 숨김 */}
        {isConfirmed && !isRecordView && (
          <button onClick={handleStartVideo} className="btn-start-video">
            🎥 화상 회의 시작
          </button>
        )}

        {/* 확정/완료 상태이거나 기록 게시판에서 온 경우 수정 가능 */}
        {canWriteOrEditRecord && (
          <button onClick={handleWriteRecord} className="btn-edit-record">
            {record.notes ? "상담 기록 수정" : "상담 기록 작성"}
          </button>
        )}

        <button onClick={handleGoBack} className="btn-edit-record">
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default ProfessorCounselingDetail;
