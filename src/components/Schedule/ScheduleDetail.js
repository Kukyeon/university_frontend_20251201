import { useEffect, useState } from "react";
import { deleteSchedule, getScheduleDetail } from "../../api/scheduleApi";

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
      }
    };

    fetchDetail();
  }, [id]);

  const handleDeleteClick = async () => {
    if (window.confirm("이 일정을 정말로 삭제하시겠습니까?")) {
      try {
        await deleteSchedule(id);
        alert("일정이 삭제되었습니다.");
        onDelete();
      } catch (error) {
        console.error("일정 삭제 실패:", error.message);
        alert("일정 삭제에 실패했습니다.");
      }
    }
  };

  if (!schedule) return <div>로딩중...</div>;

  const year = schedule.startDay?.substring(0, 4) || "확인 불가";

  return (
    <div className="schedule-detail-container">
      <h3 className="schedule-detail-title">{year}년 학교 학사일정</h3>

      <div className="schedule-detail-row">
        <div className="schedule-detail-label">시작날짜</div>
        <div className="schedule-detail-value">
          {schedule.startDay?.substring(5)}
        </div>
      </div>

      <div className="schedule-detail-row">
        <div className="schedule-detail-label">종료날짜</div>
        <div className="schedule-detail-value">
          {schedule.endDay?.substring(5)}
        </div>
      </div>

      <div className="schedule-detail-row">
        <div className="schedule-detail-label">내용</div>
        <div className="schedule-detail-value">
          {schedule.information || schedule.notes}
        </div>
      </div>

      <div className="schedule-detail-actions">
        <button className="schedule-detail-button edit" onClick={onEdit}>
          수정
        </button>
        <button
          className="schedule-detail-button delete"
          onClick={handleDeleteClick}
        >
          삭제
        </button>
      </div>
    </div>
  );
};
export default ScheduleDetail;
