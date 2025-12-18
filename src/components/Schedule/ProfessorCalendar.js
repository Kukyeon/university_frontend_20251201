// src/components/Schedule/ProfessorCalendar.js (수정된 코드)

import React, { useState, useEffect } from "react";
import {
  getAvailableTimesByProfessor,
  bookAppointment,
} from "../../api/scheduleApi";

// FullCalendar 및 플러그인 임포트
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // 💡 상호작용 플러그인 임포트 확인

const ProfessorCalendar = ({ professor, studentId, onBooked }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSlots = async () => {
    if (!professor?.id) return;
    setLoading(true);
    try {
      const times = await getAvailableTimesByProfessor(professor.id);
      setSlots(times);
      console.log("교수 달력 슬롯 로드 성공:", times);
    } catch (e) {
      console.error("달력 슬롯 로드 실패:", e);
      setSlots([]); // 401 에러 등은 이미 BookAppointment.js에서 처리되었을 수 있으므로 일반 에러 메시지 유지
      alert("예약 가능 시간 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [professor]); // professor가 변경될 때마다 재호출 // 달력 이벤트 형식으로 변환: 예약 가능한 시간대를 표시

  const calendarEvents = slots.map((s) => ({
    id: s.id,
    title: "✅ 예약 가능", // 타이틀을 더 명확하게 변경
    start: s.startTime,
    end: s.endTime,
    allDay: false,
    backgroundColor: "#4CAF50", // 녹색 (예약 가능)
    extendedProps: {
      isAvailable: true,
      availabilityId: s.id,
    },
  })); // 달력에서 슬롯을 클릭했을 때의 이벤트 핸들러

  const handleSlotClick = async (clickInfo) => {
    if (clickInfo.event.extendedProps.isAvailable) {
      const availabilityId = clickInfo.event.extendedProps.availabilityId;
      const startTime = clickInfo.event.start.toLocaleString("ko-KR"); // 시간 포맷팅
      if (
        window.confirm(`선택한 시간(${startTime})에 상담을 예약하시겠습니까?`)
      ) {
        try {
          await bookAppointment(availabilityId, studentId);
          alert("✅ 예약이 완료되었습니다.");
          onBooked(); // 상위 컴포넌트 (BookAppointment)의 리스트 새로고침 트리거
          await fetchSlots(); // 예약 후 달력 새로고침하여 슬롯 업데이트
        } catch (e) {
          alert(
            `❌ 예약 실패: ${
              e.message || "이미 예약되었거나 유효하지 않은 시간입니다."
            }`
          );
        }
      }
    }
  };

  if (loading) return <p>⏳ {professor.name} 교수님 예약 시간 로딩 중...</p>;

  return (
    <div className="professor-calendar-wrapper">
      {/* 💡 FullCalendar 컴포넌트 활성화 및 설정 추가 */}

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // interactionPlugin 추가
        initialView="timeGridWeek"
        locale="ko" // 한국어 설정
        allDaySlot={false} // 종일 슬롯 제거
        slotDuration="01:00:00" // 1시간 단위 슬롯 (백엔드 설정과 일치해야 함)
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay", // Day 뷰 추가
        }}
        events={calendarEvents}
        eventClick={handleSlotClick} // 이벤트 클릭 시 예약 처리
        height="auto"
      />

      {slots.length === 0 && (
        <p>현재 예약 가능한 슬롯이 없습니다. (교수님에게 문의하세요)</p>
      )}
    </div>
  );
};

export default ProfessorCalendar;
