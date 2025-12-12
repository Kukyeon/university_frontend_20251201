import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "./Schedule.css";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  const getSchedules = async () => {
    try {
      const res = await api.get("/schedule/latest"); // 최신 5개
      setSchedules(res.data);
    } catch (err) {
      console.error("학사일정 조회 실패", err);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${month}/${day}`;
  };

  const handleClickSchedule = (scheduleId) => {
    navigate("/academicPage", {
      state: { view: "detail", scheduleId: scheduleId },
    });
  };

  useEffect(() => {
    getSchedules();
  }, []);

  return (
    <section className="schedule">
      <h2 className="schedule__title">학사 일정</h2>
      <ul className="schedule__list">
        {schedules.map((s) => (
          <li
            key={s.id}
            className="schedule__item"
            onClick={() => handleClickSchedule(s.id)}
          >
            <span className="schedule__icon material-symbols-outlined">
              calendar_month
            </span>
            <span className="schedule__item-title">{s.information}</span>
            <span className="schedule__item-date">
              {formatDate(s.startDay)} - {formatDate(s.endDay)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Schedule;
