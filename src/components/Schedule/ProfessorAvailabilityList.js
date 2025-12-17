import React, { useState, useEffect } from "react";
import {
  getProfessorAvailability,
  closeAvailability,
} from "../../api/scheduleApi";
import "../../pages/SchedulePage.css";

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  const date = new Date(dateTimeStr);
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
};

const ProfessorAvailabilityList = ({ professorId }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const data = await getProfessorAvailability(professorId);
      setSlots(data);
    } catch (err) {
      console.error(err);
      setError("가능 시간 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!professorId) return;
    fetchSlots();
  }, [professorId]);

  const handleClose = async (id) => {
    if (!window.confirm("이 시간을 닫으시겠습니까?")) return;
    try {
      await closeAvailability(id);
      alert("시간이 닫혔습니다.");
      fetchSlots();
    } catch (e) {
      alert("처리 실패");
    }
  };

  if (loading) return <div className="loading-text">⏳ 로딩 중...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="availability-list-container">
      {slots.length === 0 ? (
        <p className="info-message">등록된 상담 가능 시간이 없습니다.</p>
      ) : (
        <ul className="availability-ul">
          {slots.map((slot) => {
            const isClosed = !slot.active;
            const isReserved =
              slot.status === "REQUESTED" || slot.status === "CLOSED";

            return (
              <li
                key={slot.id}
                className={`availability-item ${
                  isClosed
                    ? "status-closed"
                    : isReserved
                    ? "status-booked"
                    : "status-available"
                }`}
              >
                <span className="slot-time">
                  {formatDateTime(slot.startTime)} ~{" "}
                  {formatDateTime(slot.endTime)}
                </span>

                <span className="slot-status">
                  상태 :
                  {isClosed ? " 닫힘" : isReserved ? " 예약됨" : " 예약 가능"}
                </span>

                {!isClosed && !isReserved && (
                  <button
                    className="btn-close-slot"
                    onClick={() => handleClose(slot.id)}
                  >
                    닫기
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ProfessorAvailabilityList;
