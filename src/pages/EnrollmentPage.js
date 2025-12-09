import React, { useState, useEffect } from 'react';
import { courseApi } from '../api/gradeApi'; // ★ 위에서 수정한 API import

const EnrollmentPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 학과 목록 & 검색 필터
  const [departments, setDepartments] = useState([]);
  const [searchParams, setSearchParams] = useState({ type: '', name: '', deptId: '' });
  const [appliedFilters, setAppliedFilters] = useState({ type: '', name: '', deptId: '' });

  // 기간 및 상태 관리
  const [period, setPeriod] = useState(null); // 0:장바구니, 1:본수강, 2:종료
  // 내가 이미 신청한 과목 ID 목록
  const [myEnrolledIds, setMyEnrolledIds] = useState([]); // 내가 담은(신청한) 과목 ID들


  // 초기 로딩
  useEffect(() => {
    //loadDepartments();
    //loadMyStatus();
    loadInitData();
  }, []);

  // 검색/페이지 변경 시 로딩
  useEffect(() => {
    // period가 설정된 이후에만 데이터를 불러오도록 안전장치 추가
    if (period !== null) {
      loadData(page);
    }
  }, [page, appliedFilters, period]);

  // 1. 초기 데이터 로드 (기간 확인 -> 학과 목록 -> 내 내역)
  const loadInitData = async () => {
    try {
     console.log("👉 1. 기간 조회 시작"); // 로그 추가
      const periodRes = await courseApi.getSugangPeriod();
      console.log("👉 2. 기간 조회 성공:", periodRes.data); // 로그 추가

      setPeriod(periodRes.data.period); 

      const deptRes = await courseApi.getDeptList();
      setDepartments(deptRes.data || []);

      await loadMyStatus();
      
    } catch (err) {
      console.error("🚨 초기 로딩 실패:", err); // 에러 로그 확인
      alert("서버 연결 실패: " + err.message);
    }
  };


  // 내 수강 내역 확인 (이미 신청한 과목 버튼 비활성화용)
  const loadMyStatus = async () => {
    try {
      const res = await courseApi.getMyHistory();
      // 백엔드 StuSub 엔티티 구조: { id, student, subject: { id, name... } }
      // 따라서 item.subject.id를 가져와야 함
      const ids = res.data.map(item => item.subject.id);
      setMyEnrolledIds(ids);
    } catch (err) {
      console.error("내역 확인 실패", err);
    }
  };

  const loadDepartments = async () => {
    try {
      const res = await courseApi.getDeptList();
      setDepartments(res.data || []);
    } catch (err) { console.error(err); }
  };

  const loadData = async (pageNum) => {
    console.log(`👉 ${pageNum + 1}페이지 데이터 요청 중...`);

    try {
      // API 호출 시 state인 'page' 대신 인자로 받은 'pageNum'을 사용합니다.
      const res = await courseApi.getSubjectList({
        page: pageNum,
        type: appliedFilters.type,
        name: appliedFilters.name,
        deptId: appliedFilters.deptId
      });
      
      console.log("✅ 데이터 수신:", res.data.content);
      
      setSubjects(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) { 
      console.error("강의 목록 조회 실패", err); 
    }
  };

  // ★ 수강 신청 핸들러
  const handleRegister = async (subject) => {
    if (period === 2) {
      alert("🚫 수강신청 기간이 아닙니다.");
      return;
    }

    // 기간에 따라 메시지 다르게 보여주기
    const actionName = period === 0 ? "장바구니에 담으" : "수강신청 하시";
    if (!window.confirm(`[${subject.name}] 강의를 ${actionName}겠습니까?`)) return;

    try {
      // API 호출 (백엔드가 기간을 체크해서 알아서 Pre 또는 Stu 테이블에 저장함)
      await courseApi.register(subject.id);
      
      const successMsg = period === 0 ? "🛒 장바구니 담기 성공!" : "✅ 수강신청 성공!";
      alert(successMsg);
      
      setMyEnrolledIds([...myEnrolledIds, subject.id]);
      if (period === 1) loadData(); // 본수강 때는 인원수 갱신 중요
    } catch (err) {
      const msg = err.response?.data || "요청 실패";
      alert("❌ " + msg);
    }
  };

  // ... (검색 핸들러 등 기존 코드 유지) ...
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };
  const handleSearch = () => {
    setPage(0);
    setAppliedFilters({ ...searchParams });
  };

  const getPageTitle = () => {
    if (period === 0) return "🛒 예비 수강신청 (장바구니)";
    if (period === 1) return "✍️ 본 수강신청 (선착순)";
    if (period === 2) return "🔒 수강신청 종료";
    return "로딩 중...";
  };

  const getHeaderColor = () => {
    if (period === 0) return '#fff3bf'; // 노란색 (예비)
    if (period === 1) return '#e7f5ff'; // 파란색 (본수강)
    return '#f1f3f5'; // 회색 (종료)
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* 상단 헤더: 기간에 따라 바뀜 */}
      <div style={{ 
          marginBottom: '20px', padding: '15px', borderRadius: '8px', 
          background: getHeaderColor(), border: '1px solid #ddd',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>{getPageTitle()}</h1>
        
        {period === 0 && <span style={{color:'#f08c00', fontWeight:'bold'}}>※ 지금은 장바구니 기간입니다. 정원과 관계없이 담을 수 있습니다.</span>}
        {period === 1 && <span style={{color:'#1c7ed6', fontWeight:'bold'}}>※ 본 수강신청 기간입니다. 정원 내에서 선착순 마감됩니다.</span>}
      </div>
      
      {/* 검색 필터 */}
      <div style={filterContainerStyle}>
         <select name="type" value={searchParams.type} onChange={handleInputChange} style={selectStyle}>
             <option value="">전체 구분</option>
             <option value="전공">전공</option>
             <option value="교양">교양</option>
         </select>
         <select name="deptId" value={searchParams.deptId} onChange={handleInputChange} style={{...selectStyle, width: '150px'}}>
             <option value="">전체 학과</option>
             {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
         </select>
         <input name="name" value={searchParams.name} onChange={handleInputChange} placeholder="강의명" style={inputStyle} />
         <button onClick={handleSearch} style={searchButtonStyle}>검색</button>
      </div>

      <table border="1" style={tableStyle}>
        <thead style={{ background: '#f8f9fa' }}>
          <tr>
            <th>학과</th><th>학수번호</th><th>구분</th><th>강의명</th>
            <th>교수</th><th>학점</th><th>요일/시간</th><th>인원</th><th>관리</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length === 0 ? (
            <tr><td colSpan="9" style={{padding:'20px'}}>강좌가 없습니다.</td></tr>
          ) : (
            subjects.map(sub => {
                const isApplied = myEnrolledIds.includes(sub.id);
                const isFull = sub.numOfStudent >= sub.capacity;
                
                // 본수강(1)이면서 꽉 찼을 때만 마감 처리 (예비기간엔 마감 없음)
                const isClosed = (period === 1 && isFull);

                return (
                  <tr key={sub.id} style={{ backgroundColor: isApplied ? (period === 0 ? '#fff9db' : '#e6fcf5') : 'white' }}>
                    <td>{sub.department?.name}</td>
                    <td>{sub.id}</td>
                    <td>{sub.type}</td>
                    <td style={{textAlign:'left', paddingLeft:'15px', fontWeight:'bold'}}>{sub.name}</td>
                    <td>{sub.professor?.name}</td>
                    <td>{sub.grades}</td>
                    <td>{sub.subDay} {sub.startTime}~{sub.endTime}</td>
                    
                    {/* 인원 표시 */}
                    <td style={{ color: isClosed ? 'red' : 'black', fontWeight: isClosed ? 'bold' : 'normal' }}>
                        {sub.numOfStudent} / {sub.capacity}
                    </td>

                    {/* 버튼 */}
                    <td>
                        {isApplied ? (
                            <button disabled style={period === 0 ? basketDoneBtnStyle : appliedBtnStyle}>
                                {period === 0 ? "담기완료" : "신청완료"}
                            </button>
                        ) : (
                            <button 
                                onClick={() => handleRegister(sub)} 
                                disabled={isClosed || period === 2} // 마감됐거나 종료기간이면 불가
                                style={isClosed ? fullBtnStyle : (period === 0 ? basketBtnStyle : applyBtnStyle)}
                            >
                                {period === 0 ? "장바구니" : (isClosed ? "마감" : "신청")}
                            </button>
                        )}
                    </td>
                  </tr>
                );
            })
          )}
        </tbody>
      </table>
     {/* 페이지네이션 */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button disabled={page === 0} onClick={() => setPage(page - 1)} style={pageBtnStyle}>◀ 이전</button>
        <span style={{ margin: '0 15px', fontWeight: 'bold' }}>{page + 1} / {totalPages === 0 ? 1 : totalPages}</span>
        <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} style={pageBtnStyle}>다음 ▶</button>
      </div>
    </div>
  );
};

// 스타일 (기존 유지)
// 스타일
const tableStyle = { width: '100%', textAlign: 'center', borderCollapse: 'collapse', marginTop:'10px', fontSize:'14px' };
const filterContainerStyle = { background: '#f1f3f5', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px' };
const selectStyle = { padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' };
const inputStyle = { padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' };
const searchButtonStyle = { padding: '8px 20px', background: '#495057', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

// 버튼 스타일들
const basketBtnStyle = { padding: '5px 15px', background: '#fcc419', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight:'bold', textShadow: '0 1px 1px rgba(0,0,0,0.2)' };
const basketDoneBtnStyle = { padding: '5px 15px', background: '#ffe066', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'default', fontWeight:'bold' };
const applyBtnStyle = { padding: '5px 15px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight:'bold' };
const appliedBtnStyle = { padding: '5px 15px', background: '#20c997', color: 'white', border: 'none', borderRadius: '4px', cursor: 'default', fontWeight:'bold' };
const fullBtnStyle = { padding: '5px 15px', background: '#adb5bd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'not-allowed' };
const pageBtnStyle = { padding: '5px 10px', background: 'white', border: '1px solid #ddd', cursor: 'pointer' };
const smallBtnStyle = { padding: '3px 8px', fontSize: '12px', cursor: 'pointer' };

export default EnrollmentPage;