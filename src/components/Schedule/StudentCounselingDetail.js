import React, { useEffect, useState } from "react";
import { getStudentCounselingRecord } from "../../api/scheduleApi";

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

  if (loading) return <div>상담 기록 상세 로딩 중...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!record || !record.schedule)
    return <div>상담 상세 정보가 존재하지 않습니다.</div>;

  const schedule = record.schedule;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "5px",
        backgroundColor: "#fff",
      }}
    >
      <h3>상담 상세 내용</h3>
      <p>
        <strong>현재 상태:</strong> {schedule.status}
      </p>
      <p>
        <strong>일자 및 시간:</strong>{" "}
        {new Date(schedule.startTime).toLocaleString()} ~{" "}
        {new Date(schedule.endTime).toLocaleString()}
      </p>
      <p>
        <strong>상담 교수:</strong> {schedule.professorName || "조회 필요"}
      </p>
      <p>
        <strong>학생 이름:</strong> {schedule.studentName || "조회 필요"}
      </p>

      {(schedule.status === "확인됨" || schedule.status === "CONFIRMED") && (
        <button
          onClick={() =>
            onStartCounseling({
              scheduleId: schedule.id,
              professorId: schedule.professorId,
            })
          }
          style={{ marginTop: "10px" }}
        >
          🎥 상담 시작
        </button>
      )}
    </div>
  );
};

export default StudentCounselingDetail;
