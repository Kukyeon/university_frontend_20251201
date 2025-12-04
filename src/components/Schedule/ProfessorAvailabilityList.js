// src/components/Schedule/ProfessorAvailabilityList.js (새로 생성)

import React, { useState, useEffect } from "react";
import { getProfessorAvailability } from "../../api/scheduleApi";

// 날짜/시간 포맷팅 함수 (MM-DD HH:mm)
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  const date = new Date(dateTimeStr);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}-${day} ${hours}:${minutes}`;
};

const ProfessorAvailabilityList = ({ professorId }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!professorId) {
      setError("교수 ID가 정의되지 않았습니다.");
      setLoading(false);
      return;
    }

    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        // GET /api/schedules/professor/{profId} 호출
        const data = await getProfessorAvailability(professorId);
        setSlots(data);
      } catch (err) {
        console.error("교수 가능 시간 목록 조회 실패:", err);
        setError("가능 시간 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [professorId]); // professorId가 변경될 때 또는 key가 변경되어 재렌더링될 때 호출

  if (loading) return <div>⏳ 로딩 중...</div>;
  if (error) return <div style={{ color: "red" }}>🚨 {error}</div>;

  return (
    <div style={{ marginTop: "10px" }}>
      {slots.length === 0 ? (
        <p>등록된 상담 가능 시간이 없습니다.</p>
      ) : (
        <ul>
          {slots.map((slot) => (
            <li
              key={slot.id}
              style={{
                marginBottom: "5px",
                fontWeight: slot.booked ? "bold" : "normal",
                color: slot.booked ? "gray" : "green",
              }}
            >
              {formatDateTime(slot.startTime)} ~ {formatDateTime(slot.endTime)}
              (ID: {slot.id}) — **상태:** {slot.booked ? "예약됨" : "예약 가능"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfessorAvailabilityList;
