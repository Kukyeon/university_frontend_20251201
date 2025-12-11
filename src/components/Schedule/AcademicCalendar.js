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

  const groupAndFormatSchedule = (data) => {
    const grouped = data.reduce((acc, item) => {
      const month = item.startDay.substring(5, 7);
      const monthKey = `${Number(month)}월`;

      if (!acc[monthKey]) acc[monthKey] = [];

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
    <div className="academic-calendar">
      <h3 className="notice-page__title">학사 일정</h3>

      <table>
        <thead>
          <tr>
            <th>월</th>
            <th>기간</th>
            <th>일정 내용</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedSchedule).map(([month, events]) =>
            events.map((event, index) => (
              <tr key={event.id || index}>
                {index === 0 ? <td rowSpan={events.length}>{month}</td> : null}
                <td>{event.period}</td>
                <td>{event.content}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AcademicCalendar;
