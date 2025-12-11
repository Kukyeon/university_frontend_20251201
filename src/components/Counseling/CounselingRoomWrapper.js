import React, { useRef, useState } from "react";
import VideoRoomApp from "../../VideoRoomApp";
import RecordAutoSave from "./RecordAutoSave";
import { saveRecord, startTranscription } from "../../api/scheduleApi";

let mediaRecorder;
let audioChunks = [];

const CounselingRoomWrapper = ({ scheduleId, onFinish, studentId }) => {
  const [sttText, setSttText] = useState("");
  const [saving, setSaving] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribeJobName, setTranscribeJobName] = useState(null); // STT Job Name 상태
  const audioRef = useRef(null); // 오디오 스트림 저장용

  const handleStartRecording = async () => {
    if (!scheduleId || isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRef.current = stream; // 스트림 즈장

      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" }); // 파일생승
        console.log("녹음 완료. STT 시작 요청");

        try {
          const jobName = await startTranscription(scheduleId, audioBlob);
          setTranscribeJobName(jobName); // Job Name 상태 저장 -> RecordAutoSave로 전달
          alert(`STT Job 시작: ${jobName}. 결과는 5초마다 업데이트됩니다.`);
        } catch (sttError) {
          alert("STT Job 시작 실패: " + sttError.message);
          console.error("STT Job 시작실패:" + sttError);
        }
        audioRef.current.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      alert("상담 녹음 시작되었습니다.");
    } catch (error) {
      console.error("녹음 시작 실패:", error);
      alert("녹음 시작 실패: 마이크 권한을 확인해 주세요.");
    }
  };

  // 녹음 중단 핸들러
  const handleStopRecording = () => {
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const handleFinish = async () => {
    // 녹음 중이면 먼저 중단
    if (isRecording) {
      handleStopRecording();
      // 여기서는 일단 녹음 중단 후 바로 기록 저장을 시도합니다.
    }

    if (!scheduleId) return alert("상담 일정이 선택되지 않았습니다.");
    setSaving(true);

    try {
      // RecordAutoSave에서 폴링으로 얻은 최종 STT 텍스트 저장
      await saveRecord(scheduleId, sttText);
      alert("상담 기록이 성공적으로 저장되었습니다.");
      onFinish(); // 부모 컴포넌트로 종료 알림
    } catch (error) {
      alert("상담 기록 저장 중 오류: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎥 상담 화상 회의 (ID: {scheduleId})</h2>

      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        disabled={saving}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: isRecording ? "#dc3545" : "#17a2b8", // 빨간색: 중단, 하늘색: 시작
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isRecording ? "🔴 녹음 및 STT 중단" : "▶️ 녹음 및 STT 시작"}
      </button>

      <VideoRoomApp />

      {/*  jobName과 studentId를 RecordAutoSave에 전달 */}
      <RecordAutoSave
        scheduleId={scheduleId}
        onChange={setSttText}
        jobName={transcribeJobName}
        studentId={studentId}
      />

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
