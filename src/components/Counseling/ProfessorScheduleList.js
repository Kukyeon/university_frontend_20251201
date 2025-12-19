// src/components/professor/ProfessorScheduleList.js
import React, { useState, useEffect } from "react";
import {
  getProfessorAllSchedules,
  updateScheduleStatus,
} from "../../api/scheduleApi";
import { useNavigate } from "react-router-dom";
import "../../pages/SchedulePage.css";
import { counselingApi } from "../../api/counselingApi";

// 날짜/시간 포맷팅 함수
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  const date = new Date(dateTimeStr);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}-${day} ${hours}:${minutes}`;
};
const getStatusLabel = (status) => {
  switch (status) {
    case "PENDING":
      return "대기";
    case "CONFIRMED":
      return "확정";
    case "IN_PROGRESS":
      return "상담중";
    case "COMPLETED":
      return "완료";
    case "CANCELED":
      return "취소";
    case "NO_SHOW":
      return "노쇼";
    default:
      return status;
  }
};
const ProfessorScheduleList = ({
  professorId,
  filterStatus,
  onSelectSchedule,
}) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const allSchedules = await getProfessorAllSchedules();
      let filtered = allSchedules;
      if (filterStatus) {
        if (Array.isArray(filterStatus)) {
          filtered = allSchedules.filter((s) =>
            filterStatus.includes(s.status)
          );
        } else {
          filtered = allSchedules.filter((s) => s.status === filterStatus);
        }
      }

      setSchedules(filtered);
    } catch (err) {
      console.error("교수 일정 조회 실패:", err);
      setError("일정 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (professorId) fetchSchedules();
  }, [professorId, filterStatus]);

  const handleStatusChange = async (scheduleId, newStatus) => {
    const confirmMsg = `상태를 ${getStatusLabel(
      newStatus
    )}로 변경하시겠습니까?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await updateScheduleStatus(scheduleId, newStatus);
      alert(`상담 상태가 ${getStatusLabel(newStatus)}로 변경되었습니다.`);
      fetchSchedules();
    } catch (err) {
      console.error("상태 변경 실패:", err);
      alert("상태 변경 실패: " + (err.message || ""));
    }
  };
  const handleEnter = async (schedule) => {
    try {
      // 입장 가능 체크
      const res = await counselingApi.checkEntry(schedule.id);
      if (!res.data.canEnter) {
        alert(res.data.reason);
        return;
      }

      // 입장 처리
      await counselingApi.enterRoom(schedule.id);

      // 선택된 일정 업데이트 (VideoRoom 렌더링용)
      onSelectSchedule?.(schedule);
    } catch (err) {
      console.error("입장 오류:", err);
      alert(err.response?.data?.message || "상담 입장 중 오류가 발생했습니다.");
    }
  };

  if (loading)
    return <div className="loading-text">⏳ 교수 일정 목록 로딩 중...</div>;
  if (error) return <div className="error-message">🚨 {error}</div>;
  if (schedules.length === 0)
    return <p className="info-message">표시할 상담 일정이 없습니다.</p>;

  return (
    <>
      <h3>상담 예약 현황</h3>
      <div className="table-wrapper">
        <table className="course-table">
          <thead>
            <tr>
              <th>학생 이름</th>
              <th>날짜/시간</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((req) => {
              const isPending = req.status === "PENDING";
              const isConfirmed = req.status === "CONFIRMED";
              const isCompleted = req.status === "COMPLETED";

              return (
                <tr key={req.id}>
                  <td>{req.studentName}</td>
                  <td>{formatDateTime(req.startTime)}</td>
                  <td>
                    <span
                      className={`status-badge status-${req.status.toLowerCase()}`}
                    >
                      {getStatusLabel(req.status)}
                    </span>
                  </td>
                  <td className="action-buttons">
                    {isPending && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(req.id, "CONFIRMED")
                          }
                        >
                          승인
                        </button>
                        <button
                          onClick={() => handleStatusChange(req.id, "CANCELED")}
                        >
                          거절
                        </button>
                      </>
                    )}

                    {isConfirmed && (
                      <button onClick={() => handleEnter(req)}>
                        상담 시작
                      </button>
                    )}

                    {isCompleted && onSelectSchedule && (
                      <button onClick={() => onSelectSchedule(req)}>
                        상세 보기
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProfessorScheduleList;
