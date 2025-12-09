import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { courseApi } from '../api/gradeApi';

const EnrollmentHistoryPage = () => {
  const navigate = useNavigate(); 

  // 상태 관리
  const [basketList, setBasketList] = useState([]); 
  const [successList, setSuccessList] = useState([]); 
  
  const [period, setPeriod] = useState(null); 
  const [totalCredits, setTotalCredits] = useState(0); 

  useEffect(() => {
    loadInitData();
  }, []);

  // 데이터 로딩
  const loadInitData = async () => {
    try {
      const pRes = await courseApi.getSugangPeriod();
      setPeriod(pRes.data.period);
      const currentPeriod = pRes.data.period;

      if (currentPeriod === 0) {
        const res = await courseApi.getMyBasket();
        setBasketList(res.data || []);
      } else {
        const basketRes = await courseApi.getMyBasket();
        const successRes = await courseApi.getMyHistory();
        
        setBasketList(basketRes.data || []);
        setSuccessList(successRes.data || []);

        const credits = (successRes.data || []).reduce((acc, cur) => acc + (cur.subject?.grades || 0), 0);
        setTotalCredits(credits);
      }
    } catch (err) { console.error(err); }
  };

  // --- 핸들러 ---
  const handleRegisterFromBasket = async (subject) => {
    if (!window.confirm(`[${subject.name}] 수강신청 하시겠습니까?`)) return;
    try {
      await courseApi.register(subject.id);
      alert("✅ 신청 성공!");
      loadInitData();
    } catch (err) {
      alert("❌ 신청 실패: " + (err.response?.data || "오류"));
    }
  };

  const handleDeleteBasket = async (subjectId) => {
    if (!window.confirm("장바구니에서 삭제하시겠습니까?")) return;
    try {
      await courseApi.cancel(subjectId); 
      alert("🗑️ 삭제 완료");
      loadInitData();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  const handleCancelSuccess = async (subjectId) => {
    // ★ [보안 추가] 기간이 종료(2)되었으면 함수 실행 즉시 중단
    if (period === 2) {
        alert("수강신청 기간이 종료되어 취소할 수 없습니다.");
        return;
    }

    if (!window.confirm("정말 수강을 취소하시겠습니까?")) return;
    try {
      await courseApi.cancel(subjectId);
      alert("취소 완료");
      loadInitData();
    } catch (err) {
      alert("취소 실패");
    }
  };


  // --- 렌더링 ---
  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* 1. 상단 타이틀 & 버튼 영역 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:'20px' }}>
        <div>
            <h1 style={{ margin: 0 }}>
                {period === 0 ? "🛒 예비 수강신청 (장바구니)" : (period === 2 ? "🔒 수강신청 종료 (내역 확인)" : "🎓 수강신청 현황")}
            </h1>
            {/* ★ 3. 강의 목록으로 이동하는 버튼 (종료 시 숨김) */}
            {period !== 2 && (
            <button 
                onClick={() => navigate('/student/enrollment')} 
                style={goListBtnStyle}
            >
                {period === 0 ? "➕ 강의 담으러 가기" : "➕ 강의 신청목록으로"}
            </button>
            )}
        </div>

        {period !== 0 && (
            <div style={{ padding:'10px 20px', background:'#e7f5ff', borderRadius:'8px', fontWeight:'bold' }}>
                신청 학점: <span style={{color:'blue', fontSize:'1.2em'}}>{totalCredits}</span> / 18
            </div>
        )}
      </div>

      {/* 2. 장바구니 목록 (기간 2일 때는 자동으로 안 보임: 조건이 period 0 or 1 이라서) */}
      {(period === 0 || period === 1) && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ borderBottom:'2px solid #fcc419', paddingBottom:'10px' }}>
            🛒 장바구니 목록 {period === 1 && <span style={{fontSize:'0.8em', color:'red'}}>(클릭하여 바로 신청하세요!)</span>}
          </h3>
          <table border="1" style={tableStyle}>
            <thead style={{ background: '#fff9db' }}>
              <tr>
                <th>학수번호</th><th>강의명</th><th>담당교수</th><th>학점</th>
                <th>요일시간 (강의실)</th><th>현재인원</th><th>정원</th><th>수강신청</th>
              </tr>
            </thead>
            <tbody>
              {basketList.length === 0 ? (
                <tr><td colSpan="8" style={{padding:'20px'}}>장바구니가 비었습니다.</td></tr>
              ) : (
                basketList.map(item => {
                  const sub = item.subject || item; 
                  const isAlreadySuccess = successList.some(s => s.subject.id === sub.id);
                  const isFull = sub.numOfStudent >= sub.capacity;

                  return (
                    <tr key={sub.id} style={{ opacity: isAlreadySuccess ? 0.5 : 1 }}>
                      <td>{sub.id}</td>
                      <td style={{fontWeight:'bold'}}>{sub.name}</td>
                      <td>{sub.professor?.name}</td>
                      <td>{sub.grades}</td>
                      <td>{sub.subDay} {sub.startTime}~{sub.endTime} ({sub.roomId})</td>
                      <td style={{ color: isFull ? 'red' : 'black', fontWeight:'bold' }}>{sub.numOfStudent}</td>
                      <td>{sub.capacity}</td>
                      <td>
                        {period === 0 ? (
                           <button onClick={() => handleDeleteBasket(sub.id)} style={delBtnStyle}>삭제</button>
                        ) : (
                           isAlreadySuccess ? (
                             <button disabled style={doneBtnStyle}>신청완료</button>
                           ) : (
                             <button 
                                onClick={() => handleRegisterFromBasket(sub)} 
                                disabled={isFull}
                                style={isFull ? fullBtnStyle : registerBtnStyle}
                             >
                                {isFull ? '마감' : '신청하기'}
                             </button>
                           )
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. 실제 수강 확정 목록 (기간 1, 2일 때 표시) */}
      {period >= 1 && (
        <div>
          <h3 style={{ borderBottom:'2px solid #4dabf7', paddingBottom:'10px' }}>✅ 수강 확정 목록</h3>
          <table border="1" style={tableStyle}>
            <thead style={{ background: '#e7f5ff' }}>
              <tr>
                <th>학수번호</th><th>강의명</th><th>담당교수</th><th>학점</th>
                <th>요일시간 (강의실)</th><th>현재인원</th><th>정원</th><th>관리</th>
              </tr>
            </thead>
            <tbody>
              {successList.length === 0 ? (
                <tr><td colSpan="8" style={{padding:'20px'}}>신청된 내역이 없습니다.</td></tr>
              ) : (
                successList.map(item => {
                  const sub = item.subject;
                  return (
                    <tr key={sub.id}>
                      <td>{sub.id}</td>
                      <td style={{fontWeight:'bold', color:'blue'}}>{sub.name}</td>
                      <td>{sub.professor?.name}</td>
                      <td>{sub.grades}</td>
                      <td>{sub.subDay} {sub.startTime}~{sub.endTime} ({sub.roomId})</td>
                      <td>{sub.numOfStudent}</td>
                      <td>{sub.capacity}</td>
                      <td>
                        {/* ★ [핵심 수정] 기간이 2(종료)이면 취소 버튼 숨기고 '마감됨' 텍스트 표시 */}
                        {period === 2 ? (
                            <span style={{color: '#adb5bd', fontSize: '13px', fontWeight: 'bold'}}>취소불가</span>
                        ) : (
                            <button onClick={() => handleCancelSuccess(sub.id)} style={delBtnStyle}>취소</button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

// 스타일
const tableStyle = { width: '100%', textAlign: 'center', borderCollapse: 'collapse', marginBottom:'10px', fontSize:'14px' };
const delBtnStyle = { background: '#ff6b6b', color: 'white', border: 'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer' };
const registerBtnStyle = { background: '#0d6efd', color: 'white', border: 'none', padding:'5px 15px', borderRadius:'4px', cursor:'pointer', fontWeight:'bold' };
const doneBtnStyle = { background: '#adb5bd', color: 'white', border: 'none', padding:'5px 10px', borderRadius:'4px', cursor:'default' };
const fullBtnStyle = { background: '#868e96', color: 'white', border: 'none', padding:'5px 10px', borderRadius:'4px', cursor:'not-allowed' };

// ★ 추가된 버튼 스타일
const goListBtnStyle = {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#343a40', // 짙은 회색
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    display: 'block' // 줄바꿈 효과
};

export default EnrollmentHistoryPage;