import React, { useState, useEffect } from 'react';
import { gradeApi } from '../api/gradeApi';

const GradePage = () => {
  const [activeTab, setActiveTab] = useState('this'); // this, semester, total
  const [data, setData] = useState(null); // API 결과 데이터
  const [loading, setLoading] = useState(false);

  // 탭 변경 시 데이터 로딩
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      let res;
      if (activeTab === 'this') res = await gradeApi.getThisSemester();
      else if (activeTab === 'semester') res = await gradeApi.getSemester();
      else if (activeTab === 'total') res = await gradeApi.getTotal();
      
      setData(res.data);
    } catch (err) {
      alert("데이터 로딩 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1>🎓 성적 조회</h1>
      
      {/* 탭 메뉴 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('this')} style={activeTab === 'this' ? activeStyle : btnStyle}>금학기 성적</button>
        <button onClick={() => setActiveTab('semester')} style={activeTab === 'semester' ? activeStyle : btnStyle}>학기별 성적</button>
        <button onClick={() => setActiveTab('total')} style={activeTab === 'total' ? activeStyle : btnStyle}>전체 누계 성적</button>
      </div>

      {loading && <div>로딩중...</div>}

      {!loading && data && (
        <>
          {/* 1. 금학기 성적 뷰 */}
          {activeTab === 'this' && (
            <div>
              <h3>이번 학기 수강 과목</h3>
              <table border="1" style={tableStyle}>
                <thead>
                  <tr style={{background: '#f8f9fa'}}>
                    <th>과목명</th><th>이수학점</th><th>성적</th><th>등급</th>
                  </tr>
                </thead>
                <tbody>
                  {data.gradeList?.map((grade, idx) => (
                    <tr key={idx}>
                      <td>{grade.name}</td>
                      <td>{grade.grades}</td>
                      <td>{grade.grade || '-'}</td>
                      <td>{grade.gradeValue || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 2. 학기별 성적 뷰 */}
          {activeTab === 'semester' && (
            <div>
               {/* 여기에 연도/학기 필터 추가 가능 */}
               <table border="1" style={tableStyle}>
                <thead>
                  <tr style={{background: '#f8f9fa'}}>
                    <th>연도</th><th>학기</th><th>과목명</th><th>구분</th><th>학점</th><th>성적</th>
                  </tr>
                </thead>
                <tbody>
                  {data.gradeList?.map((grade, idx) => (
                    <tr key={idx}>
                      <td>{grade.subYear}</td>
                      <td>{grade.semester}</td>
                      <td>{grade.name}</td>
                      <td>{grade.type}</td>
                      <td>{grade.grades}</td>
                      <td>{grade.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. 누계 성적 뷰 */}
          {activeTab === 'total' && (
            <div>
               <table border="1" style={tableStyle}>
                <thead>
                  <tr style={{background: '#f8f9fa'}}>
                    <th>연도</th><th>학기</th><th>신청학점</th><th>취득학점</th><th>평점평균</th>
                  </tr>
                </thead>
                <tbody>
                  {data.mygradeList?.map((mg, idx) => (
                    <tr key={idx}>
                      <td>{mg.subYear}</td>
                      <td>{mg.semester}</td>
                      <td>{mg.sumGrades}</td>
                      <td>{mg.myGrades}</td>
                      <td>{mg.averageScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// 스타일 정의
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'center', marginTop: '10px' };
const btnStyle = { padding: '10px 20px', cursor: 'pointer', background: '#eee', border: 'none' };
const activeStyle = { ...btnStyle, background: '#007bff', color: 'white' };

export default GradePage;