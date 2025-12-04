// src/components/Schedule/ProfessorAvailability.js

import React, { useState } from "react";
import { setAvailability } from "../../api/scheduleApi";

const ProfessorAvailability = ({ professorId, onSaved }) => {
  const [form, setForm] = useState({
    // input type="datetime-local"에 맞게 초기화
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!professorId) return alert("교수 ID가 정의되지 않았습니다.");

    // 백엔드 LocalDateTime 형식에 맞게 초(seconds)를 추가하여 전송
    const requestData = {
      startTime: form.startTime + ":00",
      endTime: form.endTime + ":00",
    };

    setLoading(true);
    try {
      await setAvailability(requestData);
      alert("상담 가능 시간이 성공적으로 설정되었습니다.");

      setForm({ startTime: "", endTime: "" });

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
      }}
    >
      <h3>🗓️ 상담 가능 시간 설정</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>시작 시간:</label>
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>종료 시간:</label>
          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "8px 15px" }}
        >
          {loading ? "저장 중..." : "가능 시간 등록"}
        </button>
      </form>
    </div>
  );
};

export default ProfessorAvailability;
