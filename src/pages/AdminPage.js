import React from 'react';
import { adminApi } from "../api/aiApi"; // [핵심] api.js 사용

const AdminPage = () => {
  
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
    </div>
  );
};

export default AdminPage;