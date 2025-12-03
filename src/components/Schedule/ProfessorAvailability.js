import React, { useState, useEffect } from "react";
import {
  getProfessorAvailability,
  bookAppointment,
} from "../../api/scheduleApi";

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
      setSlots((prev) =>
        prev.map((s) => (s.id === availabilityId ? { ...s, booked: true } : s))
      );
    } catch (error) {
      console.error("예약 실패:", error.message);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>상담 예약</h3>
      <ul>
        {slots.map((slot) => (
          <li key={slot.id} style={{ marginBottom: "5px" }}>
            {slot.startTime} ~ {slot.endTime}{" "}
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
