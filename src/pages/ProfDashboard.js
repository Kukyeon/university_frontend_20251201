import React, { useState, useEffect } from 'react';
import { dashboardApi } from "../api/aiApi"; // [핵심] api.js 사용

const ProfDashboard = () => {
  const [risks, setRisks] = useState([]);
  const professorId = 101; // (로그인 기능 완성 전까지 임시 ID 사용)

  useEffect(() => {
    // 백엔드에서 위험 학생 리스트 가져오기
    dashboardApi.getRiskList(professorId)
      .then(res => setRisks(res.data))
      .catch(err => alert("데이터 로딩 실패"));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>🚨 중도이탈 위험군 모니터링</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th>학번</th>
            <th>이름</th>
            <th>위험도</th>
            <th>상태</th>
            <th>AI 분석 원인</th>
            <th>조치</th>
          </tr>
        </thead>
        <tbody>
          {risks.map((risk) => (
            <tr key={risk.studentId}>
              <td>{risk.studentId}</td>
              <td>{risk.studentName}</td>
              <td>{risk.riskScore}점</td>
              <td style={{ color: risk.riskLevel === '심각' ? 'red' : 'black', fontWeight: 'bold' }}>
                {risk.riskLevel}
              </td>
              <td>{risk.reason}</td>
              <td>
                <button onClick={() => alert(risk.studentName + " 학생 상담 예약")}>
                  상담하기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfDashboard;