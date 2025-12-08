// src/components/Schedule/BookAppointment.js

import React, { useState, useEffect } from "react";
import {
  getProfessorAvailability,
  bookAppointment,
} from "../../api/scheduleApi";

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

const BookAppointment = ({ studentId, professorId }) => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!professorId) return;

    const fetchSlots = async () => {
      try {
        const data = await getProfessorAvailability(professorId);
        setSlots(data);
      } catch (error) {
        console.error("교수 예약 조회 실패:", error.message);
      }
    };

    fetchSlots();
  }, [professorId]);

  const handleBook = async (availabilityId) => {
    if (!studentId) return alert("학생 ID가 필요합니다.");
    try {
      await bookAppointment(availabilityId, studentId);
      alert("예약 완료");
      // 예약이 성공하면 목록을 갱신합니다.
      setSlots((prev) =>
        prev.map((s) => (s.id === availabilityId ? { ...s, booked: true } : s))
      );
    } catch (error) {
      console.error("예약 실패:", error.message);
      alert("예약 실패: " + error.message);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>상담 예약</h3>
      <ul>
        {slots.map((slot) => (
          <li key={slot.id} style={{ marginBottom: "5px" }}>
            **{formatDateTime(slot.startTime)} ~ {formatDateTime(slot.endTime)}
            **{" "}
            <button
              disabled={slot.booked}
              onClick={() => handleBook(slot.id)}
              style={{ marginLeft: "10px" }}
            >
              {slot.booked ? "예약됨" : "예약"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookAppointment;
