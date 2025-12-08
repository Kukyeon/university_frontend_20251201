import React, { useState, useEffect } from 'react';
import { courseApi } from '../api/gradeApi';

const EnrollmentHistoryPage = () => {
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    loadMyHistory();
  }, []);

  const loadMyHistory = async () => {
    try {
      const res = await courseApi.getMyHistory();
      setMyList(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (subjectId) => {
    if(!window.confirm("정말 수강을 취소하시겠습니까?")) return;
    try {
      await courseApi.cancel(subjectId);
      alert("🗑️ 취소 완료");
      loadMyHistory();
    } catch (err) {
      alert("❌ 취소 실패");
    }
  };

  // 총 학점 계산
  const totalCredits = myList.reduce((acc, cur) => acc + (cur.subject?.grades || 0), 0);

  return (
    <div style={{ padding: '30px' }}>
      <h1>🎓 수강신청 내역 조회</h1>
      
      <div style={{ marginBottom: '10px', textAlign: 'right', fontWeight: 'bold' }}>
        총 신청 학점: <span style={{color:'blue', fontSize:'1.2em'}}>{totalCredits}</span> 학점
      </div>

      <table border="1" style={tableStyle}>
        <thead style={{ background: '#e3f2fd' }}>
          <tr>
            <th>연도</th><th>학기</th><th>학수번호</th><th>강의구분</th>
            <th>강의명</th><th>담당교수</th><th>학점</th><th>요일시간 (강의실)</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {myList.length === 0 ? (
             <tr><td colSpan="9">신청 내역이 없습니다.</td></tr>
          ) : (
            myList.map(item => (
              <tr key={item.id}>
                <td>{item.subject?.subYear}</td>
                <td>{item.subject?.semester}</td>
                <td>{item.subject?.id}</td>
                <td>{item.subject?.type}</td>
                <td style={{textAlign:'left', paddingLeft:'10px', fontWeight:'bold'}}>{item.subject?.name}</td>
                <td>{item.subject?.professor?.name}</td>
                <td>{item.subject?.grades}</td>
                <td>{item.subject?.subDay} {item.subject?.startTime}~{item.subject?.endTime} ({item.subject?.roomId})</td>
                <td>
                   <button 
                     onClick={() => handleCancel(item.subject?.id)}
                     style={{background: 'red', color: 'white', border: 'none', padding:'5px 10px', cursor:'pointer'}}
                   >
                     취소
                   </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const tableStyle = { width: '100%', textAlign: 'center', borderCollapse: 'collapse' };

export default EnrollmentHistoryPage;