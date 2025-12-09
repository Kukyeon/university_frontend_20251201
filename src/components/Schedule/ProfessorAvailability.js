import React, { useState } from "react";
import { setAvailability } from "../../api/scheduleApi";
import DatePicker from "react-datepicker";

const ProfessorAvailability = ({ professorId, onSaved }) => {
  const [form, setForm] = useState({
    startTime: null,
    endTime: null,
  });
  const [loading, setLoading] = useState(false);

  const handleDateChange = (name, date) => {
    setForm((f) => ({ ...f, [name]: date }));
  };

  const formatDateForBackend = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = "00"; // 백엔드가 초를 요구하는 경우

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!professorId) return alert("교수 ID가 정의되지 않았습니다.");
    if (!form.startTime || !form.endTime)
      return alert("시작 시간과 종료 시간을 모두 선택해주세요.");

    const requestData = {
      startTime: formatDateForBackend(form.startTime),
      endTime: formatDateForBackend(form.endTime),
    };

    setLoading(true);
    try {
      await setAvailability(requestData);
      alert("상담 가능 시간이 성공적으로 설정되었습니다.");

      setForm({ startTime: null, endTime: null }); // 성공 후 상태 초기화

      if (onSaved) onSaved();
    } catch (error) {
      alert("가능 시간 설정 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "20px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3>🗓️ 상담 가능 시간 설정</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            시작 시간:
          </label>

          <DatePicker
            selected={form.startTime} // ⭐️ Date 객체를 바인딩
            onChange={(date) => handleDateChange("startTime", date)}
            showTimeSelect // 시간 선택 활성화
            timeIntervals={30} // 30분 단위 선택
            dateFormat="yyyy-MM-dd HH:mm" // 표시 형식 설정
            timeFormat="HH:mm"
            placeholderText="날짜와 시간 선택"
            required
            disabled={loading}
            className="custom-datepicker-input" // 필요 시 커스텀 스타일링을 위한 클래스
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            종료 시간:
          </label>

          <DatePicker
            selected={form.endTime}
            onChange={(date) => handleDateChange("endTime", date)}
            showTimeSelect
            timeIntervals={30}
            dateFormat="yyyy-MM-dd HH:mm"
            timeFormat="HH:mm"
            placeholderText="날짜와 시간 선택"
            required
            disabled={loading}
            className="custom-datepicker-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "8px 15px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {loading ? "저장 중..." : "가능 시간 등록"}
        </button>
      </form>
    </div>
  );
};

export default ProfessorAvailability;
