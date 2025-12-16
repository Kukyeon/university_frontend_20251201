// src/components/professor/ProfessorScheduleList.js

import React, { useState, useEffect, useCallback } from "react";
import {
  // 💡 [수정 필요] getProfessorAllSchedules 대신 PENDING과 CONFIRMED를 각각 조회하는
  // 두 개의 API를 사용하는 것이 프론트엔드 로직을 단순화할 수 있지만,
  // 현재 구조를 유지하며 필터링 로직을 수정하겠습니다.
  getProfessorAllSchedules,
  updateScheduleStatus,
} from "../../api/scheduleApi";
import { useNavigate } from "react-router-dom";
import "../../pages/SchedulePage.css";

// 날짜/시간 포맷팅 함수 (유지)
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  const date = new Date(dateTimeStr);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}-${day} ${hours}:${minutes}`;
};

// 컴포넌트 이름은 ProfessorScheduleList로 가정합니다.
const ProfessorScheduleList = ({ professorId }) => {
  const [schedules, setSchedules] = useState([]); // 전체 일정 목록 (대기/확정/완료 모두 포함)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchSchedules = useCallback(async () => {
    if (!professorId) {
      setLoading(false);
      setError("교수 ID가 없어 일정을 불러올 수 없습니다.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 현재는 모든 일정을 가져옴 (PENDING, CONFIRMED, COMPLETED)
      const data = await getProfessorAllSchedules();
      setSchedules(data);
    } catch (err) {
      console.error(
        "교수 일정 조회 실패:",
        err.response?.data?.message || err.message
      );
      setError("일정 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [professorId]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleStatusChange = async (scheduleId, newStatus) => {
    const isCompletion = newStatus === "COMPLETED";

    if (
      isCompletion &&
      !window.confirm(
        "상담을 완료 처리하고 기록을 남기시겠습니까? 완료된 상담은 기록 게시판으로 이동합니다. (현재는 확정/진행 목록에 계속 표시됩니다.)"
      )
    ) {
      return;
    }
    if (
      !isCompletion &&
      !window.confirm(`상태를 ${newStatus}로 변경하시겠습니까?`)
    )
      return;

    try {
      await updateScheduleStatus(scheduleId, newStatus);
      alert(`상담 ID ${scheduleId} 상태가 ${newStatus}로 변경되었습니다.`); // 💡 목록 갱신: 완료(COMPLETED) 상태는 목록에서 사라지게 됩니다.

      fetchSchedules();
    } catch (error) {
      console.error("상태 변경 실패:", error.message);
      alert("상태 변경 실패: " + error.message);
    }
  };

  const pendingRequests = schedules.filter((req) => req.status === "PENDING"); // 1. 신청된 상담 목록 (PENDING만)

  // ⭐️ [수정] 확정/진행 예정 상담: PENDING을 제외한 CONFIRMED, COMPLETED, CANCELED 등 모든 상태를 포함
  const confirmedSchedules = schedules
    .filter((req) => req.status !== "PENDING")
    .sort((a, b) => {
      // 💡 목록 정렬: COMPLETED가 가장 아래로 가도록 정렬
      if (a.status === "COMPLETED" && b.status !== "COMPLETED") return 1;
      if (a.status !== "COMPLETED" && b.status === "COMPLETED") return -1;
      return new Date(a.startTime) - new Date(b.startTime);
    });

  if (loading)
    return <div className="loading-text">⏳ 교수 일정 목록 로딩 중...</div>;
  if (error) return <div className="error-message">🚨 {error}</div>;

  return (
    <div className="schedule-management-container">
      {/* 1. 신청된 상담 목록 (PENDING만) */}
      <div className="pending-requests-section request-list-container">
        <h3 className="list-title pending-title">🔔 신청된 상담 (대기)</h3>
        {pendingRequests.length === 0 ? (
          <p className="info-message">현재 대기 중인 상담 요청이 없습니다.</p>
        ) : (
          <ul className="request-ul">
            {pendingRequests.map((req) => (
              <RequestListItem
                key={req.id}
                req={req}
                professorId={professorId}
                navigate={navigate}
                handleStatusChange={handleStatusChange}
              />
            ))}
          </ul>
        )}
      </div>
      <hr className="divider" />
      {/* 2. 확정 및 진행 예정 상담 목록 (PENDING 제외한 모든 상담 기록) */}
      <div className="confirmed-schedules-section request-list-container">
        <h3 className="list-title confirmed-title">
          ✅ 확정/진행 및 완료된 상담 기록
        </h3>
        {confirmedSchedules.length === 0 ? (
          <p className="info-message">
            확정되거나 완료된 상담 일정이 없습니다.
          </p>
        ) : (
          <ul className="request-ul">
            {confirmedSchedules.map((req) => (
              <RequestListItem
                key={req.id}
                req={req}
                professorId={professorId}
                navigate={navigate}
                handleStatusChange={handleStatusChange}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// 목록 아이템 서브 컴포넌트 (COMPLETED 상태 처리 수정)
const RequestListItem = ({
  req,
  professorId,
  navigate,
  handleStatusChange,
}) => {
  const isConfirmed = req.status === "CONFIRMED";
  const isCompleted = req.status === "COMPLETED";

  // ⭐️ [수정] COMPLETED 상태를 목록에서 필터링하지 않습니다.
  // if (isCompleted) {
  //   return null;
  // }

  return (
    <li
      key={req.id}
      className={`request-item status-${req.status.toLowerCase()}`}
      onClick={() =>
        navigate(
          `/professor/counseling/detail/${req.id}?studentId=${req.studentId}&professorId=${professorId}`
        )
      }
    >
      <div className="request-info-header">
        학생 이름 : {req.studentName} | {formatDateTime(req.startTime)}
      </div>
      <div className="request-actions">
        <span className={`status-badge status-${req.status.toLowerCase()}`}>
          현재 상태: {req.status}
        </span>
        {/* PENDING 상태 액션 */}
        {req.status === "PENDING" && (
          <>
            <button
              className="btn-approve"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(req.id, "CONFIRMED");
              }}
            >
              예약 승인
            </button>
            <button
              className="btn-reject"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(req.id, "CANCELED");
              }}
            >
              예약 거절
            </button>
          </>
        )}
        {/* CONFIRMED 상태 액션 */}
        {isConfirmed && (
          <>
            <button
              className="btn-complete"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(req.id, "COMPLETED"); // 완료 처리 시 COMPLETED 상태로 변경
              }}
            >
              완료 처리
            </button>
          </>
        )}
        {/* COMPLETED 상태에는 버튼을 표시하지 않습니다. (자동 처리) */}
      </div>
    </li>
  );
};

export default ProfessorScheduleList;
