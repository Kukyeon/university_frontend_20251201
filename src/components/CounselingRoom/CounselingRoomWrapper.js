import React, { useState } from "react";
import VideoRoomApp from "../../VideoRoomApp";
import RecordAutoSave from "./RecordAutoSave";
import { saveRecord } from "../../api/scheduleApi";

const CounselingRoomWrapper = ({ scheduleId, onFinish }) => {
  const [sttText, setSttText] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    if (!scheduleId) return alert("상담 일정이 선택되지 않았습니다.");
    setSaving(true);

    try {
      await saveRecord(scheduleId, sttText);
      alert("상담 기록이 저장되었습니다.");
      onFinish();
    } catch (error) {
      alert("상담 기록 저장 중 오류: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎥 상담 화상 회의</h2>
      <VideoRoomApp />
      <RecordAutoSave onChange={setSttText} />
      <button
        onClick={handleFinish}
        disabled={saving}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        상담 종료 & 기록 저장
      </button>
    </div>
  );
};

export default CounselingRoomWrapper;
