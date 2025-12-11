import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();
  const getSchedules = async () => {
    try {
      const res = await api.get("/schedule/latest"); // 백엔드 상위 5개
      setSchedules(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("학사일정 조회 실패", err);
    }
  };
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const month = d.getMonth() + 1; // 0부터 시작이라 +1
    const day = d.getDate();
    return `${month}/${day}`; // 원하는 형식
  };
  const handleClickSchedule = (scheduleId) => {
    // 공지 클릭 시, noticeId 전달
    navigate("/academicPage", {
      state: { view: "detail", scheduleId: scheduleId },
    });
  };
  useEffect(() => {
    getSchedules();
  }, []);
  return (
    <section className="schedule">
      <h2>학사 일정</h2>
      <ul>
        {schedules.map((s) => (
          <li key={s.id} onClick={() => handleClickSchedule(s.id)}>
            <span className="calendar-icon material-symbols-outlined">
              calendar_month
            </span>
            <span className="schedule-title">{s.information}</span>
            <span className="schedule-date">
              {formatDate(s.startDay)} - {formatDate(s.endDay)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Schedule;
