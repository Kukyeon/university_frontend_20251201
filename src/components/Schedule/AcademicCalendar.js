// src/components/Schedule/AcademicCalendar.js (수정 버튼 등 제거)

import React, { useState, useEffect } from "react";
import { getScheduleList } from "../../api/scheduleApi";

const AcademicCalendar = () => {
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await getScheduleList();
        setSchedule(data);
      } catch (error) {
        console.error("학사일정 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  // ... (groupAndFormatSchedule 함수 유지)
  const groupAndFormatSchedule = (data) => {
    const grouped = data.reduce((acc, item) => {
      const month = item.startDay.substring(5, 7);
      const monthKey = `${Number(month)}월`;

      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }

      const start = item.startDay.substring(5);
      const end = item.endDay.substring(5);

      acc[monthKey].push({
        id: item.id,
        period: start === end ? start : `${start}~${end}`,
        content: item.information,
      });
      return acc;
    }, {});

    return grouped;
  };

  const groupedSchedule = groupAndFormatSchedule(schedule);

  if (isLoading) return <div>학사일정 로딩 중...</div>;
  if (schedule.length === 0) return <div>등록된 학사 일정이 없습니다.</div>;

  return (
    <div>
      <h2>🗓️ 전체 학사일정</h2>
      <p style={{ color: "#666" }}>학교 전체 학사 일정을 확인할 수 있습니다.</p>
      <table
        border="1"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ border: "1px solid #ddd" }}>
            <th
              style={{
                width: "10%",
                textAlign: "center",
                backgroundColor: "#eaf4ff",
                padding: "10px",
                borderRight: "1px solid #ddd",
              }}
            >
              월
            </th>
            <th
              style={{
                width: "25%",
                backgroundColor: "#eaf4ff",
                padding: "10px",
                borderRight: "1px solid #ddd",
              }}
            >
              기간
            </th>
            <th
              style={{
                width: "65%",
                backgroundColor: "#eaf4ff",
                padding: "10px",
              }}
            >
              일정 내용
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedSchedule).map(([month, events]) =>
            events.map((event, index) => (
              <tr key={event.id || index}>
                {index === 0 && (
                  <td
                    rowSpan={events.length}
                    style={{
                      textAlign: "center",
                      verticalAlign: "top",
                      border: "1px solid #ddd",
                      fontWeight: "bold",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    {month}
                  </td>
                )}
                <td style={{ padding: "8px", border: "1px solid #eee" }}>
                  {event.period}
                </td>
                <td style={{ padding: "8px", border: "1px solid #eee" }}>
                  {event.content}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AcademicCalendar;
