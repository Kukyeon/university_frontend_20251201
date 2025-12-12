// src/pages/ProfessorCounselingDetail.js (수정)
import VideoRoom from "../../components/Schedule/VideoRoom";
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getCounselingRecord, saveRecord } from "../../api/scheduleApi";
// RecordAutoSave 컴포넌트는 더 이상 사용하지 않습니다.

const ProfessorCounselingDetail = () => {
  const { scheduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const studentId = queryParams.get("studentId");
  const profId = queryParams.get("professorId");

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 💡 VideoRoom 컴포넌트를 직접 렌더링하기 위한 상태
  const [isMeetingActive, setIsMeetingActive] = useState(false); // 화상 회의 시작 버튼 클릭 핸들러

  const handleStartVideo = () => {
    // record가 아직 로드되지 않았으면 실행하지 않습니다.
    if (!record) return;
    setIsMeetingActive(true);
  };
  const handleFinishMeeting = async (finalNotes) => {
    setIsMeetingActive(false);
    setLoading(true); // 저장 및 재요청 동안 로딩 상태 표시

    try {
      if (finalNotes !== undefined && record?.keywords !== undefined) {
        // 💡 1. VideoRoom에서 전달받은 최종 notes를 저장합니다.
        await saveRecord(scheduleId, finalNotes, record.keywords);
        console.log("상담 기록 자동 저장 완료:", finalNotes);
        alert("상담 기록이 성공적으로 저장되었습니다.");
      }
    } catch (err) {
      console.error("상담 기록 자동 저장 실패:", err);
      alert("상담 기록 자동 저장에 실패했습니다. 수동으로 저장해주세요.");
    }

    // 💡 2. 저장 후, 상세 정보(record)를 재요청하여 화면을 업데이트합니다.
    await fetchRecord();
  };

  const handleWriteRecord = () => {
    // 기록 작성/수정 페이지로 이동
    navigate(
      `/professor/counseling/write/${scheduleId}?studentId=${studentId}`
    );
  };

  const fetchRecord = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCounselingRecord(scheduleId, studentId);
      setRecord(data);
    } catch (err) {
      console.error("교수 상담 기록 조회 실패:", err);
      setError("상담 기록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!scheduleId || !studentId) {
      setError("상담 ID 또는 학생 ID가 누락되었습니다.");
      setLoading(false);
      return;
    }
    if (!isMeetingActive) {
      fetchRecord();
    }
  }, [scheduleId, studentId, isMeetingActive]); // 화상 회의 종료 후 재요청 // 💡 VideoRoom 컴포넌트를 import하고 직접 렌더링

  if (isMeetingActive) {
    return (
      <VideoRoom
        scheduleId={scheduleId}
        studentId={studentId}
        professorId={profId}
        onFinish={handleFinishMeeting}
        userRole="professor"
        userName="교수님" // 실제 사용자 이름으로 대체 필요
        // 💡 VideoRoom에 기존 기록 notes를 전달하여 회의 중 수정 가능하게 함
        initialNotes={record?.notes || ""}
        initialKeywords={record?.keywords || ""} // 💡 키워드도 전달하여 저장 시 누락 방지
      />
    );
  }

  if (loading) return <div>상담 상세 로딩 중...</div>;
  if (error) return <div style={{ color: "red" }}>에러: {error}</div>;
  if (!record || !record.schedule)
    return <div>상담 상세 정보가 존재하지 않습니다.</div>;

  const schedule = record.schedule;
  const isConfirmed =
    schedule.status === "확인됨" || schedule.status === "CONFIRMED";
  const isCompleted =
    schedule.status === "상담 완료" || schedule.status === "COMPLETED";
  const canWriteOrEditRecord = isConfirmed || isCompleted; // ⭐️ STT 진행 상태 판단 로직 제거 // const isSttInProgress = record.transcribeJobName && !record.notes;

  return (
    <div
      style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "5px" }}
    >
            <h3>[교수용] 상담 상세 내용</h3>     {" "}
      <p>
                <strong>학생 이름:</strong>{" "}
        {schedule.studentName || "정보 없음"}     {" "}
      </p>
           {" "}
      <p>
                <strong>상담 일시:</strong>        {" "}
        {new Date(schedule.startTime).toLocaleString()} ~        {" "}
        {new Date(schedule.endTime).toLocaleString()}     {" "}
      </p>
           {" "}
      <p>
                <strong>현재 상태:</strong> {schedule.status}     {" "}
      </p>
            <hr />      <h4>상담 기록 (Notes)</h4>     {" "}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          whiteSpace: "pre-wrap",
          backgroundColor: "#f9f9f9",
        }}
      >
                {/* 💡 STT 진행 중 메시지 제거 */}       {" "}
        {record.notes || "저장된 상담 내용이 없습니다."}     {" "}
      </div>
           {" "}
      {record.keywords && (
        <p>
                    <strong>키워드:</strong> {record.keywords}       {" "}
        </p>
      )}
            {/* ... (버튼 로직 유지) ... */}     {" "}
      {isConfirmed && (
        <button
          onClick={handleStartVideo}
          style={{
            marginTop: "20px",
            marginRight: "10px",
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
                    🎥 화상 회의 시작        {" "}
        </button>
      )}
           {" "}
      {canWriteOrEditRecord && (
        <button
          onClick={handleWriteRecord}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
                    {record.notes ? "상담 기록 수정" : "상담 기록 작성"}       {" "}
        </button>
      )}
         {" "}
    </div>
  );
};

// 💡 VideoRoom 컴포넌트 추가: CounselingRoomWrapper 대신 사용

export default ProfessorCounselingDetail;
