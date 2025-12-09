import React, { useState, useEffect } from "react";
import { saveRecord, getStudentCounselingRecord } from "../../api/scheduleApi";

const StudentCounselingDetail = ({ scheduleId, studentId, onStatusLoaded }) => {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!scheduleId) return;

    const fetchRecord = async () => {
      setLoading(true);
      setError(null);
      try {
        // API 호출: /api/schedules/records/{scheduleId}
        const data = await getStudentCounselingRecord(scheduleId, studentId);
        setRecord(data);

        if (onStatusLoaded && data.schedule) {
          onStatusLoaded(data.schedule.status);
        }
      } catch (err) {
        console.error("상담 기록 조회 실패:", err);
        setError("상담 기록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [scheduleId, studentId, onStatusLoaded]);

  if (loading) return <div>상담 기록 상세 로딩 중...</div>;
  if (error) return <div style={{ color: "red" }}>에러: {error}</div>;
  if (!record || !record.schedule)
    return <div>상담 상세 정보가 존재하지 않습니다.</div>;

  // 백엔드에서 DTO를 통해 정보를 전달받는다고 가정
  const schedule = record.schedule;

  return (
    <div
      style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "5px" }}
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
      {/* 교수 이름과 학생 이름은 CounselingSchedule DTO나 Record DTO에 포함되어야 함 */}
      <p>
        <strong>상담 교수:</strong>{" "}
        {record.schedule.professorName || "조회 필요"}
      </p>
      <p>
        <strong>학생 이름:</strong> {record.schedule.studentName || "조회 필요"}
      </p>
      <p>
        <strong>상담 내용:</strong>
      </p>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          whiteSpace: "pre-wrap",
          backgroundColor: "#f9f9f9",
        }}
      >
        {record.notes || "저장된 상담 내용이 없습니다."}
      </div>
      {record.keywords && (
        <p>
          <strong>키워드:</strong> {record.keywords}
        </p>
      )}
    </div>
  );
};

export default StudentCounselingDetail;
