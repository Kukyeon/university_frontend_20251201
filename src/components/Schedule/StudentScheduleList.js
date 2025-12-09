import React, { useState, useEffect } from "react";
import { getStudentSchedules, cancelAppointment } from "../../api/scheduleApi";

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  const date = new Date(dateTimeStr);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}-${day} ${hours}:${minutes}`;
};

const StudentScheduleList = ({ studentId, onSelect }) => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    if (!studentId) return;

    const fetchSchedules = async () => {
      try {
        const data = await getStudentSchedules();
        setSchedules(data);
        console.log("API 응답 데이터 구조 (첫 번째 항목):", data[0]);
      } catch (error) {
        console.error("학생 상담 일정 조회 실패:", error.message);
      }
    };

    fetchSchedules();
  }, [studentId]);

  const handleCancel = async (scheduleId) => {
    if (window.confirm("예약을 취소하시겠습니까?")) {
      try {
        await cancelAppointment(scheduleId);
        alert("예약이 취소되었습니다.");

        setSchedules((prev) =>
          prev.map((s) =>
            s.id === scheduleId ? { ...s, status: "취소됨" } : s
          )
        );
      } catch (error) {
        console.error("예약 취소 실패:", error.message);
      }
    }
  };
  if (!studentId) {
    return <div>로그인이 필요합니다.</div>;
  }

  if (schedules.length === 0) {
    return <div>예약된 상담 일정이 없습니다.</div>;
  }
  return (
    <div>
      <h3>나의 상담 일정</h3>
      <ul>
        {schedules.map((s) => (
          <li key={s.id || s.scheduleId} style={{ marginBottom: "5px" }}>
            <span
              onClick={() => onSelect(s.scheduleId || s.id)}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              {formatDateTime(s.startTime)} ~ {formatDateTime(s.endTime)} |
              {s.status}
            </span>
            <button
              onClick={() => handleCancel(s.scheduleId || s.id)}
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
