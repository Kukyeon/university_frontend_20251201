// src/components/Schedule/BookAppointment.js
import React, { useState, useEffect } from "react";
import {
  getProfessorAvailability,
  bookAppointment,
} from "../../api/scheduleApi";

const BookAppointment = ({ studentId, professorId }) => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchSlots = async () => {
      const data = await getProfessorAvailability(professorId);
      setSlots(data);
    };
    fetchSlots();
  }, [professorId]);

  const handleBook = async (availabilityId) => {
    await bookAppointment(availabilityId, studentId);
    alert("예약 완료");
  };

  return (
    <div className="book-appointment">
      <h3>상담 예약</h3>
      <ul>
        {slots.map((slot) => (
          <li key={slot.id}>
            {slot.startTime} ~ {slot.endTime}
            <button
              disabled={slot.booked}
              onClick={() => handleBook(slot.id)}
              style={{ marginLeft: "10px" }}
            >
              예약
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookAppointment;
