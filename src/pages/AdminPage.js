import React, { useEffect, useState } from 'react';
import { adminApi } from "../api/aiApi"; // [핵심] api.js 사용

const AdminPage = () => {
  const [logs, setLogs] = useState([]); // 로그 목록 상태
  // 페이지 열리면 로그 가져오기
  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const res = await adminApi.getLogs();
      setLogs(res.data);
    } catch (err) {
      console.error("로그 로딩 실패");
    }
  };
  
  const runAnalysis = async () => {
    if(!window.confirm("전체 학생 분석을 시작하시겠습니까? (시간이 소요됩니다)")) return;
    
    try {
      alert("분석을 시작합니다...");
      await adminApi.runAnalysis();
      alert("✅ 분석 완료! 교수님 대시보드에서 확인하세요.");
    } catch (err) {
      alert("분석 실패: " + err.message);
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>시스템 관리자 페이지</h1>
      <hr />
      <div style={{ marginTop: '30px' }}>
        <h3>🤖 AI 분석 엔진 제어</h3>
        <p>매일 밤 12시에 자동 실행되지만, 필요 시 수동으로 실행할 수 있습니다.</p>
        <button 
          onClick={runAnalysis}
          style={{ padding: '15px 30px', fontSize: '18px', background: 'blue', color: 'white', cursor: 'pointer' }}
        >
          중도이탈 위험 분석 즉시 실행
        </button>
      </div>
      {/* === [추가] 데이터 수집 이력 모니터링 === */}
      <h3>📜 데이터 수집 및 통합 이력 (System Logs)</h3>
      <table border="1" cellPadding="10" style={{ width: "80%", margin: "20px auto", borderCollapse: "collapse" }}>
        <thead style={{ background: "#eee" }}>
          <tr>
            <th>ID</th>
            <th>시스템</th>
            <th>상태</th>
            <th>건수</th>
            <th>메시지</th>
            <th>시간</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.sourceSystem}</td>
              <td style={{ color: log.status === "SUCCESS" ? "green" : "red" }}>{log.status}</td>
              <td>{log.recordCount}건</td>
              <td>{log.message}</td>
              <td>{log.collectedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;