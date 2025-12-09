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

  const [period, setPeriod] = useState(null);
  const [myEnrolledIds, setMyEnrolledIds] = useState([]);

  useEffect(() => {
    loadInitData();
  }, []);
  useEffect(() => {
    if (period === 0) setPageHeader("예비 수강신청");
    else if (period === 1) setPageHeader("본 수강신청");
    else if (period === 2) setPageHeader("수강신청 종료");
  }, [period, setPageHeader]);
  useEffect(() => {
    if (period !== null) {
      loadData(page);
    }
  }, [page, appliedFilters, period]);

  const loadInitData = async () => {
    try {
      console.log("👉 1. 기간 조회 시작");
      const periodRes = await courseApi.getSugangPeriod();
      console.log("👉 2. 기간 조회 성공:", periodRes.data);

      setPeriod(periodRes.data.period);

      const deptRes = await courseApi.getDeptList();
      setDepartments(deptRes.data || []);

      await loadMyStatus();
    } catch (err) {
      console.error("🚨 초기 로딩 실패:", err);
      alert("서버 연결 실패: " + err.message);
    }
  };

  const loadMyStatus = async () => {
    try {
      const res = await courseApi.getMyHistory();
      const ids = res.data.map((item) => item.subject.id);
      setMyEnrolledIds(ids);
    } catch (err) {
      console.error("내역 확인 실패", err);
    }
  };

  const loadData = async (pageNum) => {
    console.log(`👉 ${pageNum + 1}페이지 데이터 요청 중...`);

    try {
      const res = await courseApi.getSubjectList({
        page: pageNum,
        type: appliedFilters.type,
        name: appliedFilters.name,
        deptId: appliedFilters.deptId,
      });

      console.log("✅ 데이터 수신:", res.data.content);

      setSubjects(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("강의 목록 조회 실패", err);
    }
  };

  const handleRegister = async (subject) => {
    if (period === 2) {
      alert("🚫 수강신청 기간이 아닙니다.");
      return;
    }

    const actionName = period === 0 ? "목록에 담으시" : "수강신청 하시";
    if (!window.confirm(`[${subject.name}] 강의를 ${actionName}겠습니까?`))
      return;

    try {
      await courseApi.register(subject.id);

      const successMsg = period === 0 ? "목록 담기 성공!" : "수강신청 성공!";
      alert(successMsg);

      setMyEnrolledIds([...myEnrolledIds, subject.id]);
      if (period === 1) loadData();
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
      {/* 헤더 */}
      <div className="enrollment-header">
        {/* <h1>{getPageTitle()}</h1> */}
        {period === 0 && <span>※ 지금은 예비 수강신청 기간입니다.</span>}
        {period === 1 && <span>※ 본 수강신청 기간입니다.</span>}
        {period === 2 && <span>※ 수강신청이 종료되었습니다.</span>}
      </div>

      {period === 2 ? (
        <div className="enrollment-empty">
          <h2>수강신청 기간이 아닙니다.</h2>
        </div>
      ) : (
        <>
          {/* 검색 필터 */}
          <div className="department-form" style={{ marginBottom: "15px" }}>
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
          </div>
          {/* 테이블 */}
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
