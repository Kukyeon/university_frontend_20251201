import React, { useState, useEffect } from "react";
import { getScheduleList } from "../../api/scheduleApi";

const ScheduleList = ({ onSelect, onActionComplete }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const data = await getScheduleList();
      setSchedules(data);
    } catch (error) {
      console.error("일정 목록 조회 실패:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [onActionComplete]);

  if (loading) return <div>⏳ 학사 일정 로딩 중...</div>;
  if (schedules.length === 0) return <div>등록된 학사 일정이 없습니다.</div>;

  return (
    <div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          borderTop: "2px solid #333",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <th style={{ padding: "12px", width: "5%", textAlign: "center" }}>
              ID
            </th>
            <th style={{ padding: "12px", width: "20%", textAlign: "center" }}>
              날짜
            </th>
            <th style={{ padding: "12px", textAlign: "left" }}>내용</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr
              key={s.id}
              style={{ borderBottom: "1px solid #eee", cursor: "pointer" }}
              onClick={() => onSelect(s.id, "detail")}
            >
              <td style={{ padding: "8px", textAlign: "center" }}>{s.id}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>
                {s.startDay?.substring(5)}~{s.endDay?.substring(5)}
              </td>

              <td
                style={{
                  padding: "8px",
                  color: "#333",
                }}
              >
                {s.information}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleList;
