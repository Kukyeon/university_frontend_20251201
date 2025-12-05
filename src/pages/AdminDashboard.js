import React, { useEffect, useState } from 'react';
import { dashboardApi } from "../api/aiApi";

const AdminDashboard = () => {
  const [risks, setRisks] = useState([]);
  const [checkedIds, setCheckedIds] = useState(new Set()); // 체크된 항목들

  useEffect(() => {
    // 관리자용 전체 리스트 불러오기
    dashboardApi.getAllRiskList()
      .then(res => setRisks(res.data))
      .catch(err => alert("데이터 로딩 실패"));
  }, []);

  // 삭제 처리 (관리자도 삭제 가능해야 함)
//   const handleDelete = async (id) => {
//     if (!window.confirm("삭제하시겠습니까?")) return;
//     try {
//       await dashboardApi.deleteRisk(id);
//       setRisks(prev => prev.filter(item => item.id !== id));
//     } catch (err) {
//       alert("삭제 실패");
//     }
//   };
    // 4. 일괄 삭제 (선택된 것들)
    const handleBulkDelete = async () => {
      if (checkedIds.size === 0) {
        alert("선택된 학생이 없습니다.");
        return;
      }
      if (!window.confirm(`선택한 ${checkedIds.size}명을 목록에서 삭제하시겠습니까?`)) return;
  
      try {
        // 여러 개를 한 번에 삭제 (Promise.all 사용)
        const deletePromises = Array.from(checkedIds).map(id => dashboardApi.deleteRisk(id));
        await Promise.all(deletePromises);
        
        // 화면 갱신
        setRisks(prev => prev.filter(item => !checkedIds.has(item.id)));
        setCheckedIds(new Set()); // 체크박스 초기화
        alert("삭제 완료!");
      } catch (err) {
        alert("삭제 중 오류 발생");
      }
    };
    const handleCheck = (id) => {
    const newChecked = new Set(checkedIds);
    if (newChecked.has(id)) newChecked.delete(id);
    else newChecked.add(id);
    setCheckedIds(newChecked);
  };


  return (
    <div style={{ padding: '30px' }}>
      <h1>👮‍♂️ 학사 관리팀 대시보드 (전체 현황)</h1>
      <button 
            onClick={handleBulkDelete}
            style={{ 
              padding: "8px 15px", 
              background: "#d32f2f", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" 
            }}
          >
            선택 항목 삭제
          </button>
      
      {/* (상단에 아까 만든 통계 카드들이 있다고 가정) */}
      
      <h3 style={{ marginTop: '40px' }}>🚨 전교생 중도이탈 위험군 리스트</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', background: 'white' }}>
        <thead style={{ background: '#333', color: 'white' }}>
          <tr>
            <th></th>
            <th>학과</th>
            <th>학번</th>
            <th>이름</th>
            <th>학년</th>
            <th>위험도</th>
            <th>상태</th>
            <th>AI 분석 원인</th>
            
          </tr>
        </thead>
        <tbody>
          {risks.length === 0 ? (
            <tr><td colSpan="8">데이터가 없습니다.</td></tr>
          ) : (
            risks.map((risk) => (
              <tr key={risk.id}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={checkedIds.has(risk.id)}
                    onChange={() => handleCheck(risk.id)}
                  />
                </td>
                {/* 관리자는 '학과'를 봐야 하므로 학과 컬럼 필수! */}
                <td style={{ fontWeight: 'bold' }}>{risk.departmentName}</td>
                <td>{risk.studentId}</td>
                <td>{risk.studentName}</td>
                <td>{risk.grade}학년</td>
                <td>{risk.riskScore}점</td>
                <td style={{ 
                    color: risk.riskLevel === '심각' ? 'red' : 'black', 
                    fontWeight: 'bold' 
                }}>
                  {risk.riskLevel}
                </td>
                <td style={{ textAlign: 'left' }}>{risk.reason}</td>
                
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;