import React, { useState, useEffect } from "react";
import { courseApi } from "../../api/gradeApi";
import EnrollmentTable from "./EnrollmentTable";

const EnrollmentPage = ({ setPageHeader }) => {
  const [subjects, setSubjects] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [departments, setDepartments] = useState([]);
  const [searchParams, setSearchParams] = useState({
    type: "",
    name: "",
    deptId: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    type: "",
    name: "",
    deptId: "",
  });

  const [period, setPeriod] = useState(null); // 0: 장바구니, 1: 본수강, 2: 종료
  const [myEnrolledIds, setMyEnrolledIds] = useState([]);

  // 1. 초기 데이터 로드
  useEffect(() => {
    loadInitData();
  }, []);

  // 2. 헤더 텍스트 변경 (period 상태에 따라)
  useEffect(() => {
    if (period === 0) setPageHeader("예비 수강신청 (장바구니)");
    else if (period === 1) setPageHeader("본 수강신청");
    else if (period === 2) setPageHeader("수강신청 종료");
  }, [period, setPageHeader]);

  // 3. 데이터 리로드 (페이지, 필터, 기간 변경 시)
  useEffect(() => {
    if (period !== null) {
      loadData(page);
    }
  }, [page, appliedFilters, period]);

  const loadInitData = async () => {
    try {
      const periodRes = await courseApi.getSugangPeriod();
      setPeriod(periodRes.data.period);

      const deptRes = await courseApi.getDeptList();
      setDepartments(deptRes.data || []);

      await loadMyStatus();
    } catch (err) {
      console.error("초기 로딩 실패:", err);
    }
  };

  const loadMyStatus = async () => {
    try {
      const res = await courseApi.getMyHistory();
      // 내역에서 과목 ID만 추출하여 배열로 저장
      const ids = res.data.map((item) => item.subject.id);
      setMyEnrolledIds(ids);
    } catch (err) {
      console.error("내역 확인 실패", err);
    }
  };

  const loadData = async (pageNum) => {
    try {
      const res = await courseApi.getSubjectList({
        page: pageNum,
        type: appliedFilters.type,
        name: appliedFilters.name,
        deptId: appliedFilters.deptId,
      });

      setSubjects(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("강의 목록 조회 실패", err);
    }
  };

  // ★ 두 번째 코드의 handleRegister 로직 적용 (메시지 처리 등)
  const handleRegister = async (subject) => {
    if (period === 2) {
      alert("🚫 수강신청 기간이 아닙니다.");
      return;
    }

    const actionName = period === 0 ? "장바구니에 담으" : "수강신청 하시";
    if (!window.confirm(`[${subject.name}] 강의를 ${actionName}겠습니까?`))
      return;

    try {
      await courseApi.register(subject.id);

      const successMsg = period === 0 ? "장바구니 담기 성공!" : "수강신청 성공!";
      alert(successMsg);

      // 성공 후 상태 업데이트 (새로고침 없이 버튼 상태 변경을 위해)
      setMyEnrolledIds([...myEnrolledIds, subject.id]);
      
      // 인원 수 변동 등이 있을 수 있으므로 데이터 다시 로드
      loadData(page); 
    } catch (err) {
      const msg = err.response?.data || "요청 실패";
      alert("❌ " + msg);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearch = () => {
    setPage(0);
    setAppliedFilters({ ...searchParams });
  };

  return (
    <div className="enrollment-container">
      {/* 기간별 안내 메시지 */}
      <div className="enrollment-header-info">
        {period === 0 && <p>※ 지금은 예비 수강신청(장바구니) 기간입니다.</p>}
        {period === 1 && <p>※ 본 수강신청 기간입니다.</p>}
        {period === 2 && <p>※ 수강신청이 종료되었습니다.</p>}
      </div>

      {period === 2 ? (
        <div className="enrollment-empty">
          <h2>수강신청 기간이 아닙니다.</h2>
        </div>
      ) : (
        <>
          {/* 검색 필터 */}
          <div className="enrollment-filter">
            <select
              name="type"
              value={searchParams.type}
              onChange={handleInputChange}
            >
              <option value="">전체 구분</option>
              <option value="전공">전공</option>
              <option value="교양">교양</option>
            </select>

            <select
              name="deptId"
              value={searchParams.deptId}
              onChange={handleInputChange}
            >
              <option value="">전체 학과</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>

            <input
              name="name"
              value={searchParams.name}
              onChange={handleInputChange}
              placeholder="강의명"
            />
            <button onClick={handleSearch}>검색</button>
          </div>

          {/* 테이블 컴포넌트 호출 */}
          <EnrollmentTable
            subjects={subjects}
            myEnrolledIds={myEnrolledIds}
            period={period}
            handleRegister={handleRegister}
          />

          {/* 페이지네이션 */}
          <div className="enrollment-pagination">
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
              ◀ 이전
            </button>
            <span>
              {page + 1} / {totalPages === 0 ? 1 : totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              다음 ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EnrollmentPage;