import React, { useState, useEffect } from "react";
import { getStudentSchedules, cancelAppointment } from "../../api/scheduleApi";

const StudentScheduleList = ({ studentId, onSelect }) => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    if (!studentId) return;

    const fetchSchedules = async () => {
      try {
        const data = await getStudentSchedules(studentId);
        setSchedules(data);
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
        setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
      } catch (error) {
        console.error("예약 취소 실패:", error.message);
      }
    }
  };

  return (
    <div>
      <h3>나의 상담 일정</h3>
      <ul>
        {schedules.map((s) => (
          <li key={s.id} style={{ marginBottom: "5px" }}>
            <span
              onClick={() => onSelect(s.id)}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              {s.startTime} ~ {s.endTime} | {s.status}
            </span>
            <button
              onClick={() => handleCancel(s.id)}
              style={{ marginLeft: "10px" }}
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
