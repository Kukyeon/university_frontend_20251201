import React, { useState, useEffect } from "react";
import { getStudentSchedules, cancelAppointment } from "../../api/scheduleApi";
import "../../pages/SchedulePage.css"; // 💡 이 파일을 import 해야 합니다.
import { counselingApi } from "../../api/counselingApi";

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
      } catch (err) {}
    };
    fetchSchedules();
  }, [studentId, listRefreshKey]);
  const handleEnter = async (schedule) => {
    try {
      console.log("🔹 schedule:", schedule);
      const res = await counselingApi.checkEntry(schedule.scheduleId);
      console.log("🔹 checkEntry response:", res);
      if (!res.data.canEnter) {
        alert(res.data.reason);
        return;
      }

      // 2️⃣ 실제 입장 처리 (IN_PROGRESS 전환)
      await counselingApi.enterRoom(schedule.scheduleId);
      console.log("🔹 enterRoom 성공");
      onSelect({
        ...schedule,
        id: schedule.scheduleId,
      });
      console.log("🔹 checkEntry response:", res);
      console.log(schedule.scheduleId);
    } catch (err) {
      console.error("💥 입장 오류:", err);
      alert(err.response?.data?.message || "상담 입장 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = async (scheduleId) => {
    console.log("취소 시도:", scheduleId);
    if (!window.confirm("예약을 취소하시겠습니까?")) return;
    try {
      await cancelAppointment(scheduleId);
      setSchedules((prev) =>
        prev.map((s) =>
          s.scheduleId === scheduleId ? { ...s, status: "취소됨" } : s
        )
      );

      alert("예약이 취소되었습니다.");
    } catch (err) {
      console.error("예약 취소 실패:", err.message);
    }
  };
  // 💡 클래스 적용
  if (!studentId) return <div>로그인이 필요합니다.</div>;
  if (schedules.length === 0) return <div>예약된 상담 일정이 없습니다.</div>;
  console.log(schedules);
  return (
    <>
      <h3>나의 상담 일정</h3>
      <div className="table-wrapper">
        <table className="course-table">
          <thead>
            <tr>
              <th>교수</th>
              <th>시간</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => {
              const now = new Date();
              const startTime = new Date(s.startTime);
              const endTime = new Date(s.endTime);

              const isExpired = now > endTime;

              const canEnter =
                !isExpired &&
                ((s.status === "예약 완료" && now >= startTime) ||
                  s.status === "상담 진행중");

              const canCancel =
                !isExpired &&
                (s.status === "확인중" ||
                  (s.status === "예약 완료" && now < startTime));

              return (
                <tr key={s.scheduleId}>
                  <td>{s.professorName || "정보 없음"}</td>
                  <td>
                    {formatDateTime(s.startTime)} ~ {formatDateTime(s.endTime)}
                  </td>
                  <td>
                    {s.status}
                    {canEnter && (
                      <button
                        className="btn-start"
                        onClick={() => handleEnter(s)}
                      >
                        상담
                      </button>
                    )}

                    {!canEnter && canCancel && (
                      <button
                        className="btn-cancel"
                        style={{ marginLeft: "15px", padding: 6 }}
                        onClick={() => handleCancel(s.scheduleId)}
                      >
                        취소
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StudentScheduleList;
