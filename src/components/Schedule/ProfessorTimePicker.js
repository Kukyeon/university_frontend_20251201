// ProfessorTimePicker.js

import React, { useState } from "react";
import DatePicker from "react-datepicker";
// ... (나머지 import 유지)

// YYYY-MM-DD 포맷팅 함수 (유지)
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 💡 [수정] slots, loading, bookAppointment를 props로 받습니다.
const ProfessorTimePicker = ({
  professor,
  studentId,
  onBooked,
  slots,
  loading,
  bookAppointment, // 💡 [추가] 부모로부터 예약 함수를 받습니다.
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  }; // 💡 [완성] handleTimeClick 함수: 부모의 예약 함수를 호출합니다.

  const handleTimeClick = async (slotId, time) => {
    if (
      !window.confirm(
        `[${time}] 슬롯에 상담을 신청하시겠습니까? (교수님의 승인이 필요합니다.)`
      )
    ) {
      return;
    }

    try {
      // 💡 부모 컴포넌트에서 전달받은 예약 함수(handleBook)를 호출
      await bookAppointment(slotId, time); // 예약 성공 처리는 부모 컴포넌트(handleBook)에서 alert 및 목록 갱신을 수행함
    } catch (error) {
      // 예약 실패 처리는 부모 컴포넌트에서 수행되므로 여기서는 추가 로직 불필요
      console.error("예약 요청 오류:", error);
    }
  };

  // 1. 선택된 날짜의 YYYY-MM-DD 문자열 생성 (로컬 시간 기준)
  const selectedDateString = formatDateToYYYYMMDD(selectedDate); // 디버깅 로그 유지 (최종적으로는 삭제 권장)

  slots.forEach((slot, index) => {
    const slotStatus = slot.status;
    const slotStartTime = slot.startTime;
    const slotDateString = slotStartTime ? slotStartTime.substring(0, 10) : "";

    console.log(
      `슬롯 ${index}: Status=${slotStatus}, StartTime=${slotStartTime}, DateString=${slotDateString}`
    );

    if (slotStatus === "OPEN" && slotDateString === selectedDateString) {
      console.log(`✅ 슬롯 ${index}: 필터링 통과 예정`);
    } else {
      console.log(
        `❌ 슬롯 ${index}: 필터링 불합격 (${
          slotStatus !== "OPEN" ? "상태 불일치" : "날짜 불일치"
        })`
      );
    }
  }); // 2. 예약 가능한 시간 슬롯 필터링 및 매핑 (로직 유지)
  const availableTimesForSelectedDate = slots
    .filter((slot) => {
      // 1. Status 필터링: 'OPEN' 상태인 슬롯만 예약 가능
      const isAvailable = slot.status === "OPEN";
      if (!isAvailable) return false; // 2. 날짜 필터링: 서버 문자열의 앞부분만 잘라서 선택된 날짜 문자열과 직접 비교합니다.

      const slotDateString = slot.startTime
        ? slot.startTime.substring(0, 10)
        : ""; // YYYY-MM-DD 문자열을 직접 비교 (타임존 문제 회피)

      return slotDateString === selectedDateString;
    })
    .map((slot) => ({
      // 시간 추출 로직
      time: new Date(slot.startTime).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      id: slot.id, // 예약 시 원본 1시간 슬롯 ID 사용
    }))
    .sort((a, b) => a.time.localeCompare(b.time)); // 달력에서 과거 날짜 선택 방지

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="time-picker-container">
      <h4>🗓️ 상담 시간 선택</h4>
      <p>날자와 시간 선택 후 예약 바랍니다.</p>
      {/* 캘린더 (날짜 선택) */}
      <div className="calendar-group">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateSelect}
          dateFormat="yyyy.MM.dd"
          inline
          minDate={today} // 과거 날짜 선택 방지
        />
      </div>
      <p className="selected-date-info">
        선택된 날짜 : {selectedDate.toLocaleDateString("ko-KR")}
      </p>
      {/* 시간 버튼 목록 */}
      <div className="time-slots-container">
        {loading ? (
          <div className="loading-text">⏳ 슬롯 로딩 중...</div>
        ) : availableTimesForSelectedDate.length === 0 ? (
          <p className="info-message">
            해당 날짜에 예약 가능한 시간이 없습니다.
            <br /> (교수님이 상담 시간을 열어두지 않았거나, 이미 예약이
            찼습니다.)
          </p>
        ) : (
          <div className="time-slots-list">
            {availableTimesForSelectedDate.map((slot) => (
              <button
                key={slot.id}
                className="btn-time-slot"
                onClick={() => handleTimeClick(slot.id, slot.time)}
              >
                {slot.time}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorTimePicker;
