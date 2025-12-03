import React from "react";

const schedules = [
  { id: 1, title: "개강", date: "2026-03-02" },
  { id: 2, title: "중간고사", date: "2026-05-10" },
  { id: 3, title: "기말고사", date: "2026-06-20" },
];

const Schedule = () => (
  <section className="schedule">
    <h2>학사 일정</h2>
    <ul>
      {schedules.map((s) => (
        <li key={s.id}>
          <span className="calendar-icon material-symbols-outlined">
            calendar_month
          </span>
          <span className="schedule-title">{s.title}</span>
          <span className="schedule-date">{s.date}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default Schedule;
