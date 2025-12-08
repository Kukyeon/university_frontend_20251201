import React, { useState, useEffect } from 'react';
import { courseApi } from '../api/gradeApi'; // api.js 경로 확인 필요

const EnrollmentPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [myList, setMyList] = useState([]);
  
  // 검색 필터 상태
  const [filters, setFilters] = useState({ type: '전체', deptId: '', name: '' });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // 1. 개설 강좌 목록 조회 (List<Subject>)
      const subRes = await courseApi.getSubjectList(filters);
      // 백엔드가 List를 바로 반환하므로 .data를 그대로 사용
      setSubjects(subRes.data || []); 

      // 2. 내 신청 내역 조회 (List<StuSub>)
      const myRes = await courseApi.getMyHistory();
      // 백엔드가 List를 바로 반환하므로 .data를 그대로 사용
      setMyList(myRes.data || []);
    } catch (err) {
      console.error("데이터 로딩 실패:", err);
    }
  };

  // 신청 핸들러
  const handleApply = async (subjectId) => {
    if(!window.confirm("수강신청 하시겠습니까?")) return;
    try {
      await courseApi.register(subjectId);
      alert("✅ 신청 완료");
      loadAllData(); // 목록 갱신
    } catch (err) {
      // 백엔드 에러 메시지 표시
      alert("❌ 신청 실패: " + (err.response?.data || "오류가 발생했습니다."));
    }
  };

  // 취소 핸들러
  const handleCancel = async (subjectId) => {
    if(!window.confirm("정말 취소하시겠습니까?")) return;
    try {
      await courseApi.cancel(subjectId);
      alert("🗑️ 취소 완료");
      loadAllData();
    } catch (err) {
      alert("❌ 취소 실패: " + (err.response?.data || "오류가 발생했습니다."));
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1>📅 수강신청</h1>

      {/* 검색 필터 영역 */}
      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <label>강의구분: </label>
        <select onChange={(e) => setFilters({...filters, type: e.target.value})}>
           <option value="전체">전체</option>
           <option value="전공">전공</option>
           <option value="교양">교양</option>
        </select>
        &nbsp;
        <input 
            placeholder="강의명 검색" 
            onChange={(e) => setFilters({...filters, name: e.target.value})} 
        />
        <button onClick={loadAllData} style={{marginLeft: '10px'}}>조회</button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* ================= 왼쪽: 개설 강좌 목록 (Subject List) ================= */}
        <div style={{ flex: 1 }}>
          <h3>📝 개설 강좌 ({subjects.length}건)</h3>
          <table border="1" style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#eee' }}>
                <th>강의명</th><th>교수</th><th>시간/장소</th><th>학점</th><th>인원</th><th>신청</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(sub => {
                // 정원 초과 여부
                const isFull = sub.numOfStudent >= sub.capacity;
                
                // [수정] 내 신청 목록(myList)은 StuSub 객체 리스트임. 
                // StuSub 안에 subject 객체가 있고 그 안에 id가 있음.
                const isRegistered = myList.some(my => my.subject?.id === sub.id);

                return (
                  <tr key={sub.id}>
                    <td style={{textAlign: 'left', paddingLeft: '10px'}}>{sub.name}</td>
                    
                    {/* [수정] 교수 객체 내부 접근 (Null Check 필수) */}
                    <td>{sub.professor?.name || '미정'}</td>
                    
                    <td>{sub.subDay} {sub.startTime}~{sub.endTime} ({sub.roomId})</td>
                    <td>{sub.grades}</td>
                    <td>{sub.numOfStudent} / {sub.capacity}</td>
                    <td>
                      {isRegistered ? (
                        <button disabled style={{background: '#ccc', border:'none', padding:'5px'}}>신청됨</button>
                      ) : (
                        <button 
                          onClick={() => handleApply(sub.id)}
                          disabled={isFull}
                          style={{
                             background: isFull ? '#ccc' : '#007bff', 
                             color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer'
                          }}
                        >
                          {isFull ? '마감' : '신청'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ================= 오른쪽: 내 신청 내역 (StuSub List) ================= */}
        <div style={{ width: '350px', position: 'sticky', top: '20px', height: 'fit-content' }}>
          <div style={{ border: '2px solid #007bff', padding: '10px', borderRadius: '10px', background: 'white' }}>
            <h3>🎓 내 신청 내역</h3>
            <ul style={{ paddingLeft: '20px' }}>
              {myList.length === 0 ? <li>신청 내역이 없습니다.</li> : 
                myList.map(item => (
                  // item은 StuSub 객체 -> 내부에 subject 객체가 있음
                  <li key={item.id} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                    {/* [수정] subject 객체 내부 접근 */}
                    <strong>{item.subject?.name}</strong> <br/>
                    <small>
                        {item.subject?.subDay} {item.subject?.startTime}~{item.subject?.endTime}
                    </small>
                    <button 
                      onClick={() => handleCancel(item.subject?.id)}
                      style={{ float: 'right', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                      취소
                    </button>
                  </li>
                ))
              }
            </ul>
            <p style={{textAlign: 'right', fontWeight: 'bold'}}>
                {/* [수정] 총 학점 계산 시에도 subject 내부 grades 접근 */}
                총 학점: {myList.reduce((acc, cur) => acc + (cur.subject?.grades || 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPage;