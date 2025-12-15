import React, { useState, useEffect } from "react";
import { getSugangPeriod, updateSugangPeriod } from "../../api/sugangApi";

const CoursePeriod = () => {
  const [status, setStatus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    setLogs((prevLogs) => [`[${timeString}] ${message}`, ...prevLogs]);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      addLog("서버 상태 조회 중...");
      const data = await getSugangPeriod();
      setStatus(data.period);
      addLog(`상태 조회 완료: 현재 상태값 [${data.period}]`);
    } catch (error) {
      console.error(error);
      addLog(`[Error] 상태 조회 실패: ${error.message}`);
    }
  };

  const handleStart = async () => {
    if (!window.confirm("수강 신청 기간을 시작하시겠습니까?")) return;
    setLoading(true);
    addLog("=== 수강 신청 시작 요청 보냄 ===");

    try {
      const message = await updateSugangPeriod(1);
      setStatus(1);
      addLog(`✅ 처리 성공: ${message}`);
      alert("이번 학기 수강 신청 기간이 시작되었습니다.");
    } catch (error) {
      addLog(`❌ 처리 실패: ${error.message}`);
      alert("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = async () => {
    if (!window.confirm("수강 신청 기간을 종료하시겠습니까?")) return;
    setLoading(true);
    addLog("=== 수강 신청 종료 요청 보냄 ===");

    try {
      const message = await updateSugangPeriod(2);
      setStatus(2);
      addLog(`✅ 처리 성공: ${message}`);
      alert("이번 학기 수강 신청 기간이 종료되었습니다.");
    } catch (error) {
      addLog(`❌ 처리 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3>수강 신청 기간 설정</h3>

      {loading && (
        <p style={{ color: "#0d6efd", fontWeight: "bold" }}>
          데이터 처리 중입니다...
        </p>
      )}

      {!loading && (
        <>
          <div className="input-group">
            {status === 0 && (
              <>
                <p>
                  현재 <strong>예비 수강 신청 기간</strong>입니다.
                </p>
                <button className="primary-btn" onClick={handleStart}>
                  수강 신청 시작
                </button>
              </>
            )}

            {status === 1 && (
              <>
                <p>
                  현재 <strong>수강 신청 진행 중</strong>입니다.
                </p>
                <button className="primary-btn danger" onClick={handleEnd}>
                  수강 신청 종료
                </button>
              </>
            )}

            {status === 2 && (
              <p>
                이번 학기 수강 신청이 <strong>종료</strong>되었습니다.
              </p>
            )}
          </div>
        </>
      )}

      <div className="input-group">
        <label>System Log</label>
        <div
          style={{
            minHeight: "150px",
            padding: "10px",
            background: "#f0f0f0",
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "14px",
          }}
        >
          {logs.length === 0 ? (
            <span style={{ color: "#777" }}>대기 중...</span>
          ) : (
            logs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  color:
                    log.includes("Error") || log.includes("실패")
                      ? "#ff6b6b"
                      : log.includes("성공")
                      ? "#51cf66"
                      : "#333",
                  marginBottom: "4px",
                }}
              >
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CoursePeriod;
