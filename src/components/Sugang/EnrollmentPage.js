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
  const [myEnrolledIds, setMyEnrolledIds] = useState([]); // 내가 신청(또는 담기)한 과목 ID 목록

  // 1. 초기 데이터 로드
  useEffect(() => {
    loadInitData();
  }, []);

  // 2. 헤더 텍스트 변경
  useEffect(() => {
    if (period === 0) setPageHeader("예비 수강신청");
    else if (period === 1) setPageHeader("본 수강신청 (선착순)");
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
      // 1. 기간 조회
      const periodRes = await courseApi.getSugangPeriod();
      setPeriod(periodRes.data.period);

      // 2. 학과 목록 조회
      const deptRes = await courseApi.getDeptList();
      setDepartments(deptRes.data || []);

      // 3. 내 상태 조회 (기간에 따라 장바구니 목록 또는 수강 목록이 옴)
      await loadMyStatus();
    } catch (err) {
      console.error("초기 로딩 실패:", err);
    }
  };

  const loadMyStatus = async () => {
    try {
      const res = await courseApi.getMyHistory();
      // 내역에서 과목 ID만 추출하여 배열로 저장
      // (기간 0이면 장바구니 ID들, 기간 1이면 수강확정 ID들이 들어옴)
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

  // ★ 수강신청/장바구니 버튼 핸들러
  const handleRegister = async (subject) => {
    if (period === 2) {
      alert("🚫 수강신청 기간이 아닙니다.");
      return;
    }

    // 기간에 따른 메시지 분기
    let confirmMsg = "";
    if (period === 0) {
      confirmMsg = `[${subject.name}] 강의를 장바구니에 담으시겠습니까?`;
    } else {
      confirmMsg = `[${subject.name}] 강의를 수강신청 하시겠습니까? (선착순)`;
    }

    if (!window.confirm(confirmMsg)) return;

    try {
      // 같은 API(/register)를 호출하지만, 서버 내부에서 기간(period)에 따라 다르게 처리함
      await courseApi.register(subject.id);

      const successMsg =
        period === 0 ? "🛒 장바구니 담기 성공!" : "✅ 수강신청 성공!";
      alert(successMsg);

      // 성공 후 상태 업데이트 (버튼 비활성화를 위해 ID 추가)
      setMyEnrolledIds((prev) => [...prev, subject.id]);

      // 인원수(basketCount 또는 numOfStudent)가 변했으므로 목록 다시 불러오기
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
    <>
      <h3>
        {period === 0 && "예비 수강신청"}
        {period === 1 && "본 수강신청"}
        {period === 2 && "수강신청 종료"}
      </h3>
      {/* 기간별 상단 안내 메시지 */}
      <div className="enrollment-header-info">
        {period === 0 && (
          <p className="info-text basket">
            ※ 지금은 <strong>예비 수강신청(장바구니)</strong> 기간입니다. 미리
            담아둔 과목은 본 수강신청 때 빠르게 신청할 수 있습니다.
          </p>
        )}
        {period === 1 && (
          <p className="info-text enroll">
            ※ <strong>본 수강신청</strong> 기간입니다. 선착순으로 마감되니
            신중하게 신청하세요.
          </p>
        )}
        {period === 2 && (
          <p className="info-text end">
            ※ 수강신청이 <strong>종료</strong>되었습니다.
          </p>
        )}
      </div>

      {period === 2 ? (
        <div className="enrollment-empty">
          <h2>⛔ 수강신청 기간이 아닙니다.</h2>
        </div>
      ) : (
        <>
          {/* 검색 필터 영역 */}
          <div className="filter-container">
            <div className="department-form">
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
                placeholder="강의명 검색"
              />
              <button onClick={handleSearch}>검색</button>
            </div>
          </div>
          {/* 테이블 컴포넌트 호출 */}
          {/* EnrollmentTable 내부에서 period에 따라 '담은인원' vs '신청인원'을 다르게 보여줍니다 */}
          <div className="table-wrapper">
            <EnrollmentTable
              subjects={subjects}
              myEnrolledIds={myEnrolledIds}
              period={period}
              handleRegister={handleRegister}
            />
          </div>
          {/* 페이지네이션 */}
          <div className="pagination">
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
    </>
  );
};

export default EnrollmentPage;
