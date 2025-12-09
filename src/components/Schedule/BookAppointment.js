import React, { useState, useEffect } from "react";
import { getAllAvailableTimes, bookAppointment } from "../../api/scheduleApi";

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  const date = new Date(dateTimeStr);
  return date.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const BookAppointment = ({ studentId }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      setError("학생 로그인 후 이용 가능합니다.");
      return;
    }

    const fetchSlots = async () => {
      try {
        const data = await getAllAvailableTimes();
        const filtered = data.filter((slot) => !slot.isBooked);
        setAvailableSlots(filtered);
      } catch (err) {
        setError("예약 가능한 시간을 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [studentId]);

  const handleBook = async (availabilityId) => {
    if (!studentId) return alert("학생만 예약할 수 있습니다.");

    try {
      await bookAppointment(availabilityId, studentId);
      alert("📌 예약이 완료되었습니다!");

      setAvailableSlots((prev) =>
        prev.filter((slot) => slot.id !== availabilityId)
      );
    } catch (error) {
      alert("예약 실패: " + error.message);
    }
  };

  if (loading) return <div>⏳ 예약 가능한 시간 불러오는 중...</div>;
  if (error) return <div style={{ color: "red" }}>⚠ {error}</div>;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>📅 상담 예약 가능한 시간</h3>
      {availableSlots.length === 0 ? (
        <p style={{ color: "gray" }}>현재 예약 가능한 시간이 없습니다.</p>
      ) : (
        <ul>
          {availableSlots.map((slot) => (
            <li key={slot.id} style={{ marginBottom: "8px" }}>
              🕒 {formatDateTime(slot.startTime)} ~{" "}
              {formatDateTime(slot.endTime)}
              <button
                style={{ marginLeft: "10px", cursor: "pointer" }}
                onClick={() => handleBook(slot.id)}
              >
                예약하기
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookAppointment;
