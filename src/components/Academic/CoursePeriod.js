import React, { useState, useEffect } from "react";
// ★ 방금 만든 API 파일에서 함수를 가져옵니다.
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

  // 1. 조회 함수
  const fetchStatus = async () => {
    try {
      addLog("서버 상태 조회 중..."); 
      
      // [변경] API 함수 호출
      const data = await getSugangPeriod(); 
      
      setStatus(data.period);
      addLog(`상태 조회 완료: 현재 상태값 [${data.period}]`);
    } catch (error) {
      console.error(error);
      addLog(`[Error] 상태 조회 실패: ${error.message}`);
    }
  };

  // 2. 시작 함수
  const handleStart = async () => {
    if (!window.confirm("수강 신청 기간을 시작하시겠습니까?")) return;

    setLoading(true);
    addLog("=== 수강 신청 시작 요청 보냄 ===");

    try {
      // [변경] API 함수 호출 (type: 1)
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

  // 3. 종료 함수
  const handleEnd = async () => {
    if (!window.confirm("수강 신청 기간을 종료하시겠습니까?")) return;

    setLoading(true);
    addLog("=== 수강 신청 종료 요청 보냄 ===");

    try {
      // [변경] API 함수 호출 (type: 2)
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
    <div className="mypage-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h3>수강 신청 기간 설정</h3>
      <hr />
      
      <div style={{ marginBottom: '20px' }}>
        {loading ? (
            <p style={{ color: 'blue', fontWeight: 'bold' }}>데이터 처리 중입니다... (잠시만 기다려주세요)</p>
        ) : (
            <>
                {status === 0 && (
                    <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                        <p>현재 <strong>예비 수강 신청 기간</strong>입니다.</p>
                        <button onClick={handleStart} className="btn-primary" style={btnStyle}>
                            수강 신청 시작 (데이터 이관)
                        </button>
                    </div>
                )}

                {status === 1 && (
                    <div style={{ padding: '10px', backgroundColor: '#e7f1ff', borderRadius: '5px' }}>
                        <p>현재 <strong>수강 신청 진행 중</strong>입니다.</p>
                        <button onClick={handleEnd} className="btn-danger" style={{ ...btnStyle, backgroundColor: '#dc3545' }}>
                            수강 신청 종료
                        </button>
                    </div>
                )}

                {status === 2 && (
                    <div style={{ padding: '10px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
                        <p>이번 학기 수강 신청이 <strong>종료</strong>되었습니다.</p>
                    </div>
                )}
            </>
        )}
      </div>

      <div className="console-window" style={consoleStyle}>
        <div style={{ borderBottom: '1px solid #555', paddingBottom: '5px', marginBottom: '5px', color: '#fff' }}>
            <strong>System Log</strong>
        </div>
        <div style={{ height: '150px', overflowY: 'auto' }}>
            {logs.length === 0 ? (
                <span style={{ color: '#777' }}>대기 중...</span>
            ) : (
                logs.map((log, index) => (
                    <div key={index} style={{ marginBottom: '4px' }}>
                        {log.includes('Error') || log.includes('실패') ? (
                             <span style={{ color: '#ff6b6b' }}>{log}</span>
                        ) : log.includes('성공') ? (
                             <span style={{ color: '#51cf66' }}>{log}</span>
                        ) : (
                             <span>{log}</span>
                        )}
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

const btnStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#0d6efd',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const consoleStyle = {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#1e1e1e', 
    color: '#00ff00',           
    borderRadius: '8px',
    fontFamily: 'monospace',    
    fontSize: '14px',
    boxShadow: 'inset 0 0 10px #000'
};

export default CoursePeriod;