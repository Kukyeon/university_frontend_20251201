import React, { useEffect, useState } from "react";
import { getScheduleList, deleteSchedule } from "../../api/scheduleApi";

const ScheduleList = ({ onSelect, onEdit }) => {
  const [schedules, setSchedules] = useState([]);

  const fetchList = async () => {
    const data = await getScheduleList();
    setSchedules(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      await deleteSchedule(id);
      fetchList();
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div>
      <table border="1" className="room--table">
        <thead>
          <tr className="first--tr">
            <th>ID</th>
            <th>날짜</th>
            <th>내용</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td onClick={() => onSelect(s.id)} style={{ cursor: "pointer" }}>
                {s.startDay} ~ {s.endDay}
              </td>
              <td>{s.information}</td>
              <td>
                <button onClick={() => onEdit(s.id)}>수정</button>
                <button onClick={() => handleDelete(s.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleList;
