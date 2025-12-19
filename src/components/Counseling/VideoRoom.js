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
  const isProfessor = userRole === "professor" || userRole === "prof";
  const [notes, setNotes] = useState(initialNotes || "");
  const [keywords] = useState(initialKeywords || "");

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleFinishClick = async () => {
    if (isProfessor) {
      console.log(
        "scheduleId:",
        scheduleId,
        "userId:",
        professorId,
        "role:",
        userRole
      );

      try {
        await saveRecord(scheduleId, notes, keywords);
        alert("상담 기록이 저장되고 일정이 완료 처리되었습니다.");
      } catch (err) {
        console.error("기록 저장 실패:", err);
        alert(err.response?.data?.message || "기록 저장 중 오류 발생");
        return; // 실패 시 종료 막기
      }
    }

    // 학생도 교수도 공통: VideoRoom 종료
    onFinish();
  };

  const htmlFile = "videoroomtest.html";
  const iframeSrc = `${process.env.PUBLIC_URL}/${htmlFile}?room=${scheduleId}&role=${userRole}&display=${userName}`;

  return (
    // 💡 클래스 적용
    <>
      <h3>화상 상담 (방 번호 : {scheduleId} 번)</h3>

      {/* 💡 Iframe 클래스 적용 */}
      <iframe
        src={iframeSrc}
        title={`Video Room ${scheduleId}`}
        id="JanusIframe"
        className="video-room-iframe"
        allow="camera; microphone"
      ></iframe>
      {isProfessor && (
        <div>
          <label>상담 기록 (교수 전용):</label>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            rows={5}
            placeholder="상담 내용을 기록하세요."
          />
        </div>
      )}
      {/* React 레벨에서 상담 종료 버튼 제공 */}
      <button onClick={handleFinishClick}>상담 종료 및 기록 저장</button>

      {/* 💡 교수 전용 기록 폼을 Iframe 아래로 배치합니다. */}
    </>
  );
}

export default VideoRoom;
