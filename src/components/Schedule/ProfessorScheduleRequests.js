import React, { useState, useEffect } from "react";
import {
  getProfessorRequests,
  updateScheduleStatus,
} from "../../api/scheduleApi";
import { useNavigate } from "react-router-dom";

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

  if (loading) return <div>⏳ 예약 요청 목록 로딩 중...</div>;
  if (error) return <div style={{ color: "red" }}>🚨 {error}</div>;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>교수님에게 신청된 상담 목록</h3>
      {requests.length === 0 ? (
        <p>현재 대기 중인 상담 요청이 없습니다.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {requests.map((req) => (
            <li
              key={req.id}
              style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}
              onClick={() =>
                navigate(
                  `/professor/counseling/detail/${req.id}?studentId=${req.studentId}&professorId=${professorId}`
                )
              }
            >
              <div style={{ fontWeight: "bold" }}>
                학생 ID: {req.studentName} | {formatDateTime(req.startTime)}
              </div>
              <div>
                현재 상태: **{req.status}**
                {req.status === "PENDING" && ( // CONFIRMED 상태일 때만 버튼 표시
                  <>
                    <button
                      style={{
                        marginLeft: "10px",
                        background: "#007bff",
                        color: "white",
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // li 클릭 방지
                        handleStatusChange(req.id, "CONFIRMED");
                      }}
                    >
                      예약 승인
                    </button>
                    <button
                      style={{
                        marginLeft: "5px",
                        background: "#f44336",
                        color: "white",
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // li 클릭 방지
                        handleStatusChange(req.id, "CANCELED");
                      }}
                    >
                      예약 거절
                    </button>
                  </>
                )}
                {/* 기타 상태 처리 로직 추가 가능 */}
                {req.status === "CONFIRMED" && ( // DTO에서 "확인됨"으로 변환했으므로 한글 사용
                  <>
                    <button
                      style={{
                        marginLeft: "10px",
                        background: "#4CAF50",
                        color: "white",
                      }}
                      onClick={(e) => {
                        // ⭐ 이벤트 버블링 방지 추가
                        e.stopPropagation();
                        handleStatusChange(req.id, "COMPLETED");
                      }}
                    >
                      완료 처리
                    </button>
                    <button
                      style={{
                        marginLeft: "5px",
                        background: "#f44336",
                        color: "white",
                      }}
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfessorScheduleRequests;
