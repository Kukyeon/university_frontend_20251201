import React, { useState, useEffect } from "react";
import { courseApi } from "../api/gradeApi"; // api 파일 경로 확인

const CourseListPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // [추가] 학과 목록 상태
  const [departments, setDepartments] = useState([]);

  // [수정] 검색 조건 상태 (deptId 추가)
  const [searchParams, setSearchParams] = useState({
    type: "",
    name: "",
    deptId: "",
  });

  // 실제 API 요청 시 사용할 확정된 필터
  const [appliedFilters, setAppliedFilters] = useState({
    type: "",
    name: "",
    deptId: "",
  });

  // 1. 초기 로딩 (학과 목록 가져오기)
  useEffect(() => {
    loadDepartments();
  }, []);

  // 2. 데이터 로딩 (페이지나 검색조건이 바뀌면 실행)
  useEffect(() => {
    loadData();
  }, [page, appliedFilters]);

  // [신규] 학과 목록 로딩
  const loadDepartments = async () => {
    try {
      const res = await courseApi.getDeptList();
      setDepartments(res.data || []);
    } catch (err) {
      console.error("학과 목록 로딩 실패", err);
    }
  };

  // 강의 데이터 로딩
  const loadData = async () => {
    try {
      const res = await courseApi.getSubjectList({
        page: page,
        type: appliedFilters.type,
        name: appliedFilters.name,
        deptId: appliedFilters.deptId, // [추가] 학과 ID 전송
      });
      setSubjects(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error(err);
      setSubjects([]);
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  // 조회 버튼 클릭 핸들러
  const handleSearch = () => {
    setPage(0); // 검색 시 1페이지로 초기화
    setAppliedFilters({ ...searchParams }); // 검색 조건 확정
  };

  // 팝업 띄우기 함수
  const openSyllabus = (subjectId) => {
    // 새 창으로 열기 (너비 1000, 높이 900)
    window.open(
      `/course/syllabus/${subjectId}`,
      "_blank",
      "width=1000,height=900,left=200,top=50"
    );
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* 검색 필터 영역 */}
      <div style={filterContainerStyle}>
        {/* 1. 강의 구분 */}
        <div style={inputGroupStyle}>
          <label style={labelStyle}>강의 구분</label>
          <select
            name="type"
            value={searchParams.type}
            onChange={handleInputChange}
            style={selectStyle}
          >
            <option value="">전체</option>
            <option value="전공">전공</option>
            <option value="교양">교양</option>
          </select>
        </div>

        {/* 2. [추가] 개설 학과 */}
        <div style={inputGroupStyle}>
          <label style={labelStyle}>개설 학과</label>
          <select
            name="deptId"
            value={searchParams.deptId}
            onChange={handleInputChange}
            style={{ ...selectStyle, width: "150px" }}
          >
            <option value="">전체</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. 강의명 */}
        <div style={inputGroupStyle}>
          <label style={labelStyle}>강의명</label>
          <input
            name="name"
            value={searchParams.name}
            onChange={handleInputChange}
            placeholder="강의명을 입력하세요"
            style={inputStyle}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <button onClick={handleSearch} style={searchButtonStyle}>
          검색
        </button>
      </div>

      <table border="1" style={tableStyle}>
        <thead style={{ background: "#f8f9fa" }}>
          <tr>
            <th>단과대학</th>
            <th>개설학과</th>
            <th>학수번호</th>
            <th>강의구분</th>
            <th>강의명</th>
            <th>담당교수</th>
            <th>학점</th>
            <th>요일/시간 (강의실)</th>
            <th>인원</th>
            <th>강의계획서</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length === 0 ? (
            <tr>
              <td colSpan="10" style={{ padding: "20px" }}>
                검색된 강좌가 없습니다.
              </td>
            </tr>
          ) : (
            subjects.map((sub) => (
              <tr key={sub.id}>
                {/* 데이터 접근 경로 확인 (sub.department.name) */}
                <td>{sub.department?.college?.name || "-"}</td>
                <td>{sub.department?.name || "-"}</td>
                <td>{sub.id}</td>
                <td>{sub.type}</td>
                <td
                  style={{
                    textAlign: "left",
                    paddingLeft: "15px",
                    fontWeight: "bold",
                  }}
                >
                  {sub.name}
                </td>
                <td>{sub.professor?.name || "미정"}</td>
                <td>{sub.grades}</td>
                <td>
                  {sub.subDay} {sub.startTime}~{sub.endTime} ({sub.room.id})
                </td>
                <td>
                  {sub.numOfStudent} / {sub.capacity}
                </td>
                <td>
                  <button
                    style={smallBtnStyle}
                    onClick={() => openSyllabus(sub.id)}
                  >
                    조회
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          style={pageBtnStyle}
        >
          ◀ 이전
        </button>
        <span style={{ margin: "0 15px", fontWeight: "bold" }}>
          {page + 1} / {totalPages === 0 ? 1 : totalPages}
        </span>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => setPage(page + 1)}
          style={pageBtnStyle}
        >
          다음 ▶
        </button>
      </div>
    </div>
  );
};

// --- 스타일 정의 ---
const tableStyle = {
  width: "100%",
  textAlign: "center",
  borderCollapse: "collapse",
  marginTop: "10px",
  fontSize: "14px",
};
const filterContainerStyle = {
  background: "#f1f3f5",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
  gap: "20px",
  border: "1px solid #e9ecef",
};
const inputGroupStyle = { display: "flex", alignItems: "center", gap: "10px" };
const labelStyle = { fontWeight: "bold", color: "#495057" };
const selectStyle = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ced4da",
  width: "100px",
};
const inputStyle = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ced4da",
  width: "200px",
};
const searchButtonStyle = {
  padding: "8px 20px",
  background: "#228be6",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};
const pageBtnStyle = {
  padding: "5px 10px",
  background: "white",
  border: "1px solid #ddd",
  cursor: "pointer",
};
const smallBtnStyle = {
  padding: "3px 8px",
  fontSize: "12px",
  cursor: "pointer",
};

export default CourseListPage;
