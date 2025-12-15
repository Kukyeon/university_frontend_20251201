import React, { useEffect, useState } from "react";
import { getStudentCounselingRecord } from "../../api/scheduleApi";
import "../../pages/SchedulePage.css";

const StudentCounselingDetail = ({
  scheduleId,
  studentId,
  onStatusLoaded,
  onStartCounseling,
  onProfessorIdLoaded,
}) => {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!scheduleId || !studentId) return;

    const fetchRecord = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStudentCounselingRecord(scheduleId);
        console.log("🔥 상세 기록 API 응답 데이터:", data);
        console.log("🔥 schedule 객체 확인:", data.schedule);
        setRecord(data);
        if (onStatusLoaded && data.schedule) {
          onStatusLoaded(data.schedule.status);
        }
        if (onProfessorIdLoaded && data.schedule?.professorId) {
          onProfessorIdLoaded(data.schedule.professorId);
          console.log("✅ Professor ID 보충 성공:", data.schedule.professorId);
        } else {
          // 🚨 professorId가 없으면 로그 출력
          console.log(
            "❌ Professor ID 누락: data.schedule.professorId 값 없음"
          );
        }
      } catch (err) {
        console.error("상담 기록 조회 실패:", err);
        setError("상담 기록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [scheduleId, studentId, onStatusLoaded, onProfessorIdLoaded]);

  // 💡 클래스 적용
  if (loading)
    return <div className="loading-text">상담 기록 상세 로딩 중...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!record || !record.schedule)
    return (
      <div className="info-message">상담 상세 정보가 존재하지 않습니다.</div>
    );

  const schedule = record.schedule;

  return (
    // 💡 클래스 적용
    <div className="counseling-detail-card">
      <h3 className="detail-section-title">상담 상세 내용</h3>

      {/* 💡 정보 목록 */}
      <div className="detail-info-group">
        <p className="detail-info-item">
          <strong className="info-label">현재 상태:</strong>
          <span className={`status-badge status-${schedule.status}`}>
            {schedule.status}
          </span>
        </p>
        <p className="detail-info-item">
          <strong className="info-label">일자 및 시간:</strong>{" "}
          <span className="info-value">
            {new Date(schedule.startTime).toLocaleString()} ~{" "}
            {new Date(schedule.endTime).toLocaleString()}
          </span>
        </p>
        <p className="detail-info-item">
          <strong className="info-label">상담 교수:</strong>{" "}
          <span className="info-value professor-name-detail">
            {schedule.professorName || "조회 필요"}
          </span>
        </p>
        <p className="detail-info-item">
          <strong className="info-label">학생 이름:</strong>{" "}
          <span className="info-value">
            {schedule.studentName || "조회 필요"}
          </span>
        </p>
      </div>

      {(schedule.status === "확인됨" || schedule.status === "CONFIRMED") && (
        <button
          onClick={() =>
            onStartCounseling({
              scheduleId: schedule.id,
              professorId: schedule.professorId,
            })
          }
          className="btn-start-counseling" // 💡 클래스 적용
        >
          🎥 상담 시작
        </button>
      )}
    </div>
  );
};

export default StudentCounselingDetail;
