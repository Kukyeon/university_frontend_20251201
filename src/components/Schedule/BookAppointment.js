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

const BookAppointment = ({ studentId }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      setError("상담 예약 정보를 가져올 수 없습니다. (학생 ID 부재)");
      return;
    }

    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProfessorAvailability();
        setSlots(data);
      } catch (err) {
        console.error(
          "교수 예약 조회 실패:",
          err.response?.data?.message || err.message
        );
        setError("가능 시간을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [studentId]);

  const handleBook = async (availabilityId) => {
    if (!studentId) return alert("예약은 학생만 가능합니다..");
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
  if (!studentId) {
    return (
      <div style={{ marginTop: "20px", color: "gray" }}>
        상담 예약 기능은 학생만 이용 가능합니다.
      </div>
    );
  }
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
