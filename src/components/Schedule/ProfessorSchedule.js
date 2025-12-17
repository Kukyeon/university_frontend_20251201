import React, { useState, useEffect } from "react";
import {
  getProfessorRequests,
  getProfessorAvailability,
  setAvailability,
  closeAvailability,
  updateScheduleStatus,
} from "../../api/scheduleApi";
// 💡 interactionPlugin 추가

const ProfessorSchedule = ({ professorId }) => {
  const [requests, setRequests] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false); // 1. 데이터 로딩

  const fetchProfessorData = async () => {
    if (!professorId) return;
    setLoading(true);
    try {
      // getProfessorAvailability는 백엔드에서 principal을 사용하도록 설정되어 있다면 professorId는 불필요합니다.
      const [reqs, avail] = await Promise.all([
        getProfessorRequests(), // 예약 요청 목록
        getProfessorAvailability(), // 설정된 가능 시간 목록
      ]);
      setRequests(reqs);
      setAvailability(avail);
    } catch (e) {
      console.error("교수 일정 데이터 로드 실패:", e);
      alert("일정 정보를 불러오는 데 실패했습니다. 로그인을 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessorData();
  }, [professorId]); // 2. 가능 시간 설정 (날짜/시간 입력 로직이 없으므로 임시로 1시간 설정 팝업 사용)

  const handleSetAvailability = async () => {
    // 💡 실제로는 달력에서 날짜를 선택하거나, 별도 모달/입력창을 통해 Start/End 시간을 받아야 합니다.
    const startInput = window.prompt(
      "시작 시간을 입력하세요 (YYYY-MM-DD HH:MM):",
      "2025-12-25 10:00"
    );
    if (!startInput) return;

    const startTime = new Date(startInput);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1시간 후

    try {
      await setAvailability({
        startTime: startTime.toISOString(), // 백엔드가 ISO 포맷을 기대할 가능성 높음
        endTime: endTime.toISOString(),
      });
      alert(`✅ ${startTime.toLocaleString()}에 가능 시간이 설정되었습니다.`);
      fetchProfessorData();
    } catch (e) {
      alert(`❌ 가능 시간 설정 실패: ${e.message}`);
    }
  }; // 3. 달력 이벤트 변환 (요청 및 가능 시간 결합)

  const combinedEvents = [
    // 학생 예약 요청 (CounselingSchedule)
    ...requests.map((req) => ({
      id: `req-${req.id}`,
      title: `[${req.status === "PENDING" ? "대기" : "예약"}] ${
        req.studentName
      }`,
      start: req.startTime,
      end: req.endTime,
      color:
        req.status === "PENDING"
          ? "orange"
          : req.status === "APPROVED"
          ? "blue"
          : "gray",
      extendedProps: { isRequest: true, scheduleId: req.id, ...req },
    })), // 교수가 설정한 가능 시간 (ProfessorAvailability)
    ...availability.map((avail) => ({
      id: `avail-${avail.id}`,
      title: "가능 시간 (미예약)",
      start: avail.startTime,
      end: avail.endTime,
      color: "green",
      extendedProps: { isAvailability: true, availabilityId: avail.id },
    })),
  ]; // 4. 이벤트 클릭 시 상세 정보/액션

  const handleEventClick = (clickInfo) => {
    // 예약 요청 클릭 시 (승인/거절, 상세 페이지)
    if (clickInfo.event.extendedProps.isRequest) {
      const scheduleId = clickInfo.event.extendedProps.scheduleId; // 🚨 여기서는 상세 페이지로 이동하도록 가정합니다.
      console.log(`예약 상세 보기/승인/거절 페이지로 이동: ${scheduleId}`);
      alert(
        `상담 요청 상세 보기: ${clickInfo.event.title}\n(스케줄 ID: ${scheduleId})`
      );
    } // 가능 시간 클릭 시 닫기 (삭제)
    else if (clickInfo.event.extendedProps.isAvailability) {
      const availabilityId = clickInfo.event.extendedProps.availabilityId;
      if (window.confirm("이 가능 시간을 닫으시겠습니까? (예약 슬롯 삭제)")) {
        closeAvailability(availabilityId)
          .then(() => {
            alert("✅ 가능 시간이 닫혔습니다.");
            fetchProfessorData();
          })
          .catch((e) => alert(`❌ 닫기 실패: ${e.message}`));
      }
    }
  };

  // 5. 달력의 빈 공간을 클릭하여 가능 시간을 설정하는 기능 (선택 사항)
  // interactionPlugin이 필요합니다.
  const handleDateSelect = (selectInfo) => {
    if (
      window.confirm(
        `선택한 시간(${selectInfo.startStr} ~ ${selectInfo.endStr})에 가능 시간을 설정하시겠습니까?`
      )
    ) {
      handleSetAvailability(selectInfo.startStr, selectInfo.endStr);
    }
  };

  return (
    <div className="professor-schedule-container">
      <h3>교수 상담 일정 관리</h3>
      <button onClick={handleSetAvailability}>
        + 새 가능 시간 설정 (수동 입력)
      </button>

      {loading ? (
        <p>⏳ 일정 로딩 중...</p>
      ) : (
        <div className="calendar-view">
          {/* 💡 FullCalendar 컴포넌트 활성화 및 설정 추가 */}
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locale="ko"
            allDaySlot={false}
            slotDuration="01:00:00"
            selectable={true} // 드래그하여 시간 선택 가능
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={combinedEvents}
            eventClick={handleEventClick}
            select={handleDateSelect} // 드래그 선택 시 가능 시간 설정
            height="auto"
          />
        </div>
      )}
    </div>
  );
};
export default ProfessorSchedule;
