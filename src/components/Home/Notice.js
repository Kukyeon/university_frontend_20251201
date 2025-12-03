import React from "react";

const notices = [
  { id: 1, title: "2026학년도 입학 안내", date: "2025-12-01" },
  { id: 2, title: "동계 방학 일정 공지", date: "2025-11-20" },
  { id: 3, title: "학교 축제 안내", date: "2025-11-15" },
];

const Notice = () => (
  <section className="notices">
    <h2>공지사항</h2>
    <ul>
      {notices.map((n) => (
        <li key={n.id}>
          <span className="notice-title">{n.title}</span>
          <span className="notice-date">{n.date}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default Notice;
