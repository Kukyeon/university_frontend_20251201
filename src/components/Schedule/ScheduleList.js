import React, { useState, useEffect } from "react";
import { getScheduleList, deleteSchedule } from "../../api/scheduleApi";

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
      alert("일정 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [onActionComplete]); // CRUD 작업 완료 시 목록 갱신

  const handleDelete = async (id) => {
    if (window.confirm("정말로 일정을 삭제하시겠습니까?")) {
      try {
        await deleteSchedule(id);
        alert("일정이 삭제되었습니다.");
        fetchSchedules(); // 목록 갱신
      } catch (error) {
        console.error("일정 삭제 실패:", error.message);
        alert("일정 삭제에 실패했습니다. (ID: " + id + ")");
      }
    }
  };

  if (loading) return <div>학사 일정 로딩 중...</div>;
  if (schedules.length === 0) return <div>등록된 학사 일정이 없습니다.</div>;

  return (
    <div>
      <table border="1" style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>시작일</th>
            <th>종료일</th>
            <th>내용</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.id}>
              <td>{s.startDay}</td> <td>{s.endDay}</td> <td>{s.information}</td>{" "}
              <td>
                <button
                  onClick={() => onSelect(s.id, "edit")}
                  style={{ marginRight: "5px" }}
                >
                  수정
                </button>
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
