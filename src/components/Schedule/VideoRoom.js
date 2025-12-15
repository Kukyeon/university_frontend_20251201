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
  initialKeywords,
}) {
  const room = Number(scheduleId);
  const htmlFile = "videoroomtest.html";
  const iframeSrc = `${process.env.PUBLIC_URL}/${htmlFile}?room=${room}&role=${userRole}&display=${userName}`;

  // 💡 교수용 상담 기록 상태 추가
  const isProfessor = userRole === "professor" || userRole === "prof";
  const [notes, setNotes] = useState(initialNotes || "");
  const [keywords] = useState(initialKeywords || "");
  // 💡 텍스트 입력 핸들러
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleFinishClick = () => {
    // 교수일 경우 현재 notes를, 아닐 경우 undefined를 전달합니다.
    const finalNotes = isProfessor ? notes : undefined;
    onFinish(finalNotes);
  };

  return (
    <div style={{ height: "100vh", width: "100%", padding: "0 20px" }}>
      {" "}
      {/* padding 추가 */}
      <h2>💬 화상 상담 (상담 ID: {room})</h2>
      {/* 💡 Iframe을 먼저 배치하여 상단에 비디오가 오도록 합니다. */}
      <iframe
        src={iframeSrc}
        title={`Video Room ${room}`}
        id="JanusIframe"
        style={{
          width: "100%",
          // 💡 Iframe 높이 조정: 450px + 버튼 공간을 뺀 나머지.
          // (videoroomtest.html에서 비디오 높이를 400px로 설정했으므로, 500px 정도면 충분합니다)
          height: "500px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "10px" /* 아래 요소와의 간격 추가 */,
        }}
        allow="camera; microphone"
      ></iframe>
      {/* React 레벨에서 상담 종료 버튼 제공 */}
      <button
        onClick={handleFinishClick}
        style={{
          margin: "10px 0",
          padding: "8px 15px",
          background: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "4px",
          display: "block" /* 블록 요소로 만들어 공간 확보 */,
        }}
      >
        상담 종료 및 기록 저장
      </button>
      {/* 💡 교수 전용 기록 폼을 Iframe 아래로 배치합니다. */}
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
    </div>
  );
}

export default VideoRoom;
