import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getCounselingRecord } from "../../api/scheduleApi";

const ProfessorCounselingDetail = () => {
  const { scheduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // URL 쿼리 파라미터에서 studentId를 추출합니다.

  const studentId = new URLSearchParams(location.search).get("studentId");

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 1. 화상회의 시작 핸들러 (컴포넌트 본문에 정의)

  const handleStartVideo = () => {
    // 화상회의 페이지로 이동, scheduleId를 방(room) ID로 사용
    navigate(`/videoroom?scheduleId=${scheduleId}`);
  }; // 2. 상담 기록 작성/수정 페이지 이동 핸들러

  const handleWriteRecord = () => {
    // 상담 기록 작성 페이지로 이동
    navigate(
      `/professor/counseling/write/${scheduleId}?studentId=${studentId}`
    );
  }; // 3. 기존 기록 불러오기 (useEffect 유지)

  useEffect(() => {
    if (!scheduleId || !studentId) {
      setError("상담 ID 또는 학생 ID가 누락되었습니다.");
      setLoading(false);
      return;
    }

    const fetchRecord = async () => {
      setLoading(true);
      setError(null);
      try {
        // 교수 전용 API 호출
        const data = await getCounselingRecord(scheduleId, studentId);
        setRecord(data);
      } catch (err) {
        console.error("교수 상담 기록 조회 실패:", err);
        setError("상담 기록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [scheduleId, studentId]);

  if (loading) return <div>상담 상세 로딩 중...</div>;
  if (error) return <div style={{ color: "red" }}>에러: {error}</div>;
  if (!record || !record.schedule)
    return <div>상담 상세 정보가 존재하지 않습니다.</div>;

  const schedule = record.schedule; //  상태가 'CONFIRMED'일 때만 버튼을 노출하도록 수정
  const isConfirmed = schedule.status === "확인됨";
  const isCompleted = schedule.status === "상담 완료";
  const canWriteOrEditRecord = isConfirmed || isCompleted;
  return (
    <div
      style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "5px" }}
    >
      <h3>[교수용] 상담 상세 내용</h3>
      <p>
        <strong>학생 이름:</strong>
        {schedule.studentName || "정보 없음"}
      </p>
      <p>
        <strong>상담 일시:</strong>
        {new Date(schedule.startTime).toLocaleString()} ~
        {new Date(schedule.endTime).toLocaleString()}
      </p>
      <p>
        <strong>현재 상태:</strong> {schedule.status}
      </p>
      <hr /> <h4>상담 기록 (Notes)</h4>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          whiteSpace: "pre-wrap",
          backgroundColor: "#f9f9f9",
        }}
      >
        {record.notes || "저장된 상담 내용이 없습니다."}
      </div>
      {record.keywords && (
        <p>
          <strong>키워드:</strong> {record.keywords}
        </p>
      )}
      {/* 1. 화상 회의 시작 버튼: 'CONFIRMED' 상태일 때만 활성화 */}
      {isConfirmed && (
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#007bff", // 파란색 계열
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
          onClick={handleStartVideo}
        >
          🎥 화상 회의 시작
        </button>
      )}
      {/* 2. 상담 기록 작성/수정 버튼: 'CONFIRMED' 상태일 때만 활성화 */}
      {canWriteOrEditRecord && (
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleWriteRecord}
        >
          {record.notes ? "상담 기록 수정" : "상담 기록 작성"}
        </button>
      )}
    </div>
  );
};

export default ProfessorCounselingDetail;
