import React, { useState, useEffect } from "react";
import {
  getProfessorRequests,
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

const ProfessorScheduleRequests = ({ professorId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    if (!professorId) {
      setLoading(false);
      setError("교수 ID가 없어 요청을 불러올 수 없습니다.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 백엔드가 로그인된 교수 ID로 조회
      const data = await getProfessorRequests();
      setRequests(data);
    } catch (err) {
      console.error(
        "교수 예약 요청 조회 실패:",
        err.response?.data?.message || err.message
      );
      setError("예약 요청 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [professorId]);

  const handleStatusChange = async (scheduleId, newStatus) => {
    if (!window.confirm(`상태를 ${newStatus}로 변경하시겠습니까?`)) return;

    try {
      await updateScheduleStatus(scheduleId, newStatus);
      alert(`상담 ID ${scheduleId} 상태가 ${newStatus}로 변경되었습니다.`);
      // 목록 갱신
      fetchRequests();
    } catch (error) {
      console.error("상태 변경 실패:", error.message);
      alert("상태 변경 실패: " + error.message);
    }
  };

  if (loading)
    return <div className="loading-text">⏳ 예약 요청 목록 로딩 중...</div>;
  if (error) return <div className="error-message">🚨 {error}</div>;

  return (
    // 💡 클래스 적용
    <div className="request-list-container">
      <h3 className="list-title">교수님에게 신청된 상담 목록</h3>
      {requests.length === 0 ? (
        <p className="info-message">현재 대기 중인 상담 요청이 없습니다.</p>
      ) : (
        // 💡 클래스 적용
        <ul className="request-ul">
          {requests.map((req) => (
            <li
              key={req.id}
              // 💡 상태별 클래스 추가 (소문자 변환)
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
                {/* 💡 상태 배지 */}
                <span
                  className={`status-badge status-${req.status.toLowerCase()}`}
                >
                  현재 상태: {req.status}
                </span>

                {/* PENDING 상태 */}
                {req.status === "PENDING" && (
                  <>
                    <button
                      className="btn-approve"
                      onClick={(e) => {
                        e.stopPropagation(); // li 클릭 방지
                        handleStatusChange(req.id, "CONFIRMED");
                      }}
                    >
                      예약 승인
                    </button>
                    <button
                      className="btn-reject"
                      onClick={(e) => {
                        e.stopPropagation(); // li 클릭 방지
                        handleStatusChange(req.id, "CANCELED");
                      }}
                    >
                      예약 거절
                    </button>
                  </>
                )}

                {/* CONFIRMED 상태 */}
                {req.status === "CONFIRMED" && (
                  <>
                    <button
                      className="btn-complete"
                      onClick={(e) => {
                        // ⭐ 이벤트 버블링 방지 추가
                        e.stopPropagation();
                        handleStatusChange(req.id, "COMPLETED");
                      }}
                    >
                      완료 처리
                    </button>
                    <button
                      className="btn-reject-confirmed"
                      onClick={(e) => {
                        // ⭐ 이벤트 버블링 방지 추가
                        e.stopPropagation();
                        handleStatusChange(req.id, "CANCELED");
                      }}
                    >
                      거절/취소
                    </button>
                  </>
                )}
                {/* 기타 상태 처리 로직 추가 가능 */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfessorScheduleRequests;
