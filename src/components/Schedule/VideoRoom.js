import React, { useState, useEffect, useCallback } from "react";
import { saveRecord } from "../../api/scheduleApi"; // 👈 API import 필요
import "./VideoRoom.css"; // 💡 CSS 파일을 여기에 import 해야 합니다.

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
    // 💡 클래스 적용
    <div className="video-room-container">
      <h2 className="video-room-title">💬 화상 상담 (상담 ID: {room})</h2>

      {/* 💡 Iframe 클래스 적용 */}
      <iframe
        src={iframeSrc}
        title={`Video Room ${room}`}
        id="JanusIframe"
        className="video-room-iframe"
        allow="camera; microphone"
      ></iframe>

      {/* React 레벨에서 상담 종료 버튼 제공 */}
      <button
        onClick={handleFinishClick}
        className="btn-finish-counseling" // 💡 클래스 적용
      >
        상담 종료 및 기록 저장
      </button>

      {/* 💡 교수 전용 기록 폼을 Iframe 아래로 배치합니다. */}
      {isProfessor && (
        <div className="professor-note-container">
          <label className="professor-note-label">상담 기록 (교수 전용):</label>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            rows={5}
            placeholder="상담 내용을 여기에 기록하시면, '상담 종료' 버튼 클릭 시 자동으로 저장됩니다."
            className="professor-note-textarea" // 💡 클래스 적용
          />
        </div>
      )}
    </div>
  );
}

export default VideoRoom;
