import React, { useState, useEffect } from "react";
import { getStudentSchedules, cancelAppointment } from "../../api/scheduleApi";
import "../../pages/SchedulePage.css"; // 💡 이 파일을 import 해야 합니다.

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  const date = new Date(dateTimeStr);
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
};

const StudentScheduleList = ({ studentId, onSelect, listRefreshKey }) => {
  // key props를 refreshKey로 받음
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
  }, [studentId, listRefreshKey]);

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

  // 💡 클래스 적용
  if (!studentId)
    return <div className="info-message">로그인이 필요합니다.</div>;
  if (schedules.length === 0)
    return <div className="info-message">예약된 상담 일정이 없습니다.</div>;

  return (
    <div className="schedule-list-container">
      <h3 className="list-section-title">나의 상담 일정</h3>
      <ul className="schedule-list">
        {schedules.map((s) => (
          // 💡 클래스 적용
          <li key={s.scheduleId} className={`schedule-item status-${s.status}`}>
            <span
              onClick={() => {
                // 🚨 콘솔에 찍히는지 확인
                const scheduleId = s.scheduleId;
                const profId = s.professorId || s.profId || s.professor?.id;
                onSelect(scheduleId, s.profId);
                console.log("--- 항목 클릭됨 ---", scheduleId, profId);
              }}
              className="schedule-info-clickable" // 💡 클래스 적용
            >
              {s.professorName && (
                <span className="professor-name">
                  {s.professorName} 교수님 |{" "}
                </span>
              )}
              <span className="schedule-time">
                {formatDateTime(s.startTime)} ~ {formatDateTime(s.endTime)}
              </span>
              | <span className="schedule-status">{s.status}</span>
            </span>
            <button
              onClick={() => handleCancel(s.scheduleId)}
              className="cancel-btn" // 💡 클래스 적용
              disabled={s.status !== "확인됨" && s.status !== "COMPLETED"}
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
