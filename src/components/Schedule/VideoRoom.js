/* src/components/Schedule/VideoRoom.js (수정) */
import React, { useState, useEffect, useCallback } from "react";
import { saveRecord } from "../../api/scheduleApi"; // 👈 API import 필요

/**
 * Janus WebRTC Video Room을 iFrame으로 로드하는 컴포넌트입니다.
 * 이 컴포넌트가 상담 시작 시 렌더링 됩니다.
 */
function VideoRoom({
  scheduleId,
  studentId,
  professorId,
  userRole,
  userName,
  onFinish,
  initialNotes,
}) {
  const room = scheduleId;
  const htmlFile = "videoroomtest.html";
  const iframeSrc = `${process.env.PUBLIC_URL}/${htmlFile}?room=${room}&role=${userRole}&display=${userName}`;

  // 💡 교수용 상담 기록 상태 추가
  const isProfessor = userRole === "professor";
  const [notes, setNotes] = useState(initialNotes || "");

  // 💡 텍스트 입력 핸들러
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleFinishClick = () => {
    // 교수일 경우 현재 notes를, 아닐 경우 undefined를 전달합니다.
    const finalNotes = isProfessor ? notes : undefined;
    onFinish(finalNotes);
  };

  // 컴포넌트 마운트 시 기존 기록을 불러오는 useEffect가 필요하지만,
  // VideoRoom은 회의 시작 시에만 렌더링되므로,
  // 초기 기록은 ProfessorCounselingDetail에서 불러와 props로 넘겨주는 것이 더 깔끔할 수 있습니다.
  // (현재 코드에서는 생략하고, 새로운 기록만 작성한다고 가정합니다.)

  return (
    <div style={{ height: "100vh", width: "100%", padding: "0 20px" }}>
      {" "}
      {/* padding 추가 */}
      <h2>💬 화상 상담 (상담 ID: {room})</h2>
      {/* 💡 교수 전용 기록 폼 */}
      {isProfessor && (
        <div
          style={{
            marginBottom: "15px",
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "4px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            상담 기록 (교수 전용):
          </label>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            rows={5}
            placeholder="상담 내용을 여기에 기록하시면, '상담 종료' 버튼 클릭 시 자동으로 저장됩니다."
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
      )}
      {/* React 레벨에서 상담 종료 버튼 제공 */}
      <button
        onClick={handleFinishClick} // 💡 수정된 종료 핸들러 사용
        style={{
          margin: "10px 0",
          padding: "8px 15px",
          background: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        상담 종료 및 기록 저장
      </button>
      <iframe
        src={iframeSrc}
        title={`Video Room ${room}`}
        id="JanusIframe"
        style={{
          width: "100%",
          // 💡 폼 공간 확보: 교수일 경우 높이 조정, 아닐 경우 기존 높이 유지
          height: isProfessor ? "calc(100% - 240px)" : "calc(100% - 100px)",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
        allow="camera; microphone"
      ></iframe>
    </div>
  );
}

export default VideoRoom;
