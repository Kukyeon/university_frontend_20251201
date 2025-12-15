import React, { useState, useEffect } from "react";
import { getStudentSchedules, cancelAppointment } from "../../api/scheduleApi";

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  const date = new Date(dateTimeStr);
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
};

const StudentScheduleList = ({ studentId, onSelect }) => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    if (!studentId) return;
    const fetchSchedules = async () => {
      try {
        const data = await getStudentSchedules(studentId);
        setSchedules(data);
        console.log("🔥 조회된 스케줄 목록:", data);
      } catch (err) {
        console.error("학생 상담 일정 조회 실패:", err.message);
      }
    };
    fetchSchedules();
  }, [studentId]);

  const handleCancel = async (scheduleId) => {
    if (!window.confirm("예약을 취소하시겠습니까?")) return;
    try {
      await cancelAppointment(scheduleId);
      setSchedules((prev) =>
        prev.map((s) => (s.id === scheduleId ? { ...s, status: "취소됨" } : s))
      );
      alert("예약이 취소되었습니다.");
    } catch (err) {
      console.error("예약 취소 실패:", err.message);
    }
  };

  if (!studentId) return <div>로그인이 필요합니다.</div>;
  if (schedules.length === 0) return <div>예약된 상담 일정이 없습니다.</div>;

  return (
    <div>
      <h3>나의 상담 일정</h3>
      <ul>
        {schedules.map((s) => (
          <li key={s.id} style={{ marginBottom: "5px" }}>
            <span
              onClick={() => {
                // 🚨 콘솔에 찍히는지 확인
                const profId = s.professorId || s.profId || s.professor?.id;
                onSelect(s.scheduleId, s.profId);
                console.log("--- 항목 클릭됨 ---", s.id, profId);
              }}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              {s.professorName && <span>{s.professorName} 교수님 | </span>}
              {formatDateTime(s.startTime)} ~ {formatDateTime(s.endTime)} |{" "}
              {s.status}
            </span>
            <button
              onClick={() => handleCancel(s.scheduleId)}
              style={{ marginLeft: "10px" }}
              disabled={s.status !== "확인됨"}
            >
              취소
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentScheduleList;
