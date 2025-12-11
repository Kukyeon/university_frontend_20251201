import React, { useEffect, useState } from "react";
import {
  getTranscriptionStatus,
  getCounselingRecord,
} from "../../api/scheduleApi";

const POLLING_INTERVAL = 5000;

const RecordAutoSave = ({ scheduleId, onChange, studentId, jobName }) => {
  const [sttText, setSttText] = useState("");
  const [jobStatus, setJobStatus] = useState("NOT_STARTED");
  const [error, setError] = useState(null);

  // 부모 컴포넌트에 텍스트 변경 사항 전달
  useEffect(() => {
    onChange && onChange(sttText);
  }, [sttText, onChange]);

  // 💡 [STT 폴링 로직]
  useEffect(() => {
    // ⭐️ jobName이 없으면 시작하지 않습니다.
    if (!jobName || jobStatus === "COMPLETED" || jobStatus === "FAILED") {
      setSttText(
        `[STT] 상태: ${jobName ? jobStatus : "대기 중 (Job Name 없음)"}`
      );
      return;
    }

    const fetchStatus = async () => {
      try {
        const status = await getTranscriptionStatus(jobName);
        setJobStatus(status); // 상태 업데이트

        if (status === "COMPLETED") {
          console.log("Transcribe Job 완료! 최종 기록 조회 시작...");
          // Job 완료 시, DB에 저장된 최종 기록을 조회
          // 💡 studentId는 getCounselingRecord API 호출에 필요합니다. (교수/학생 기록 구분)
          const finalRecord = await getCounselingRecord(scheduleId, studentId);

          setSttText(
            finalRecord.notes || "[STT 결과 로드 실패: DB에 내용 없음]"
          );
          setError(null);
        } else if (status === "FAILED") {
          setError("STT 변환 실패. AWS Transcribe Job 실패");
          setSttText(`[STT] 상태: ${status}. 변환 실패. ${jobName}`);
        } else {
          setSttText(
            `[STT] 상태: ${status}. Job Name: ${jobName}. 결과 대기 중...`
          );
        }
      } catch (err) {
        console.error("STT 상태 폴링 실패:", err);
        setError("STT 상태 폴링 중 네트워크 오류 발생");
        setJobStatus("FAILED");
      }
    };

    const intervalId = setInterval(fetchStatus, POLLING_INTERVAL);

    // JobName이 변경되거나 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, [jobName, jobStatus, scheduleId, studentId]);

  return (
    <div>
      <h4>자동 상담 기록 (상태: {jobStatus})</h4>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <textarea value={sttText} readOnly rows={5} style={{ width: "100%" }} />
    </div>
  );
};

export default RecordAutoSave;
