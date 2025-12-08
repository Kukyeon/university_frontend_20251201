import React, { useEffect, useState } from "react";
import { getScheduleDetail, deleteSchedule } from "../../api/scheduleApi";

const ScheduleDetail = ({ id, onEdit, onDelete }) => {
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const data = await getScheduleDetail(id);
        setSchedule(data);
      } catch (error) {
        console.error("상세 조회 실패:", error.message);
        // 오류 처리 로직 추가 (예: 상세 정보가 없을 경우 목록으로 복귀)
      }
    };

    fetchDetail();
  }, [id]);

  const handleDeleteClick = async () => {
    if (window.confirm(`이 일정을 정말로 삭제하시겠습니까?`)) {
      try {
        await deleteSchedule(id);
        alert("일정이 삭제되었습니다.");
        onDelete(); // 삭제 완료 후 목록으로 복귀 요청
      } catch (error) {
        console.error("일정 삭제 실패:", error.message);
        alert("일정 삭제에 실패했습니다.");
      }
    }
  };

  if (!schedule) return <div>로딩중...</div>;

  // 연도를 제목으로 사용 (예: 2023년 학교 학사일정)
  const year = schedule.startDay
    ? schedule.startDay.substring(0, 4)
    : "확인 불가";

  return (
    <div style={{ borderTop: "2px solid #333", paddingTop: "10px" }}>
      <h3 style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
        {year}년 학교 학사일정
      </h3>

      <div
        style={{
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <div style={{ width: "100px", color: "#666" }}>시작날짜</div>
        <div style={{ flexGrow: 1 }}>{schedule.startDay?.substring(5)}</div>
      </div>

      <div
        style={{
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <div style={{ width: "100px", color: "#666" }}>종료날짜</div>
        <div style={{ flexGrow: 1 }}>{schedule.endDay?.substring(5)}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", padding: "10px 0" }}>
        <div style={{ width: "100px", color: "#666" }}>내용</div>
        <div style={{ flexGrow: 1 }}>
          {schedule.information || schedule.notes}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <button
          onClick={onEdit}
          style={{
            marginRight: "5px",
            padding: "5px 15px",
            backgroundColor: "#fff",
            color: "#333",
            border: "1px solid #333",
            borderRadius: "0",
            cursor: "pointer",
          }}
        >
          수정
        </button>
        <button
          onClick={handleDeleteClick}
          style={{
            padding: "5px 15px",
            backgroundColor: "#333",
            color: "white",
            border: "1px solid #333",
            borderRadius: "0",
            cursor: "pointer",
          }}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default ScheduleDetail;
