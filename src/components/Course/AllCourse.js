import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { courseApi } from "../../api/gradeApi";

const AllCourse = () => {
  const [year, setYear] = useState(""); // 초기값 빈 문자열 → 전체 조회
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [name, setName] = useState("");
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [departments, setDepartments] = useState([]);

  // 학과 목록 로딩
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await courseApi.getDeptList();
        setDepartments(res.data || []);
      } catch (err) {
        console.error("학과 목록 로딩 실패", err);
      }
    };
    loadDepartments();
  }, []);

  // 강좌 목록 로딩
  useEffect(() => {
    loadCourses();
  }, [page]);

  const loadCourses = async (filter = {}) => {
    try {
      const params = { page };

      // filter 객체 또는 상태 값에 따라 조건부로 params 추가
      if (filter.year || year) params.year = parseInt(filter.year || year);
      if (filter.semester || semester)
        params.semester = (filter.semester || semester) === "1학기" ? 1 : 2;
      if (filter.department || department)
        params.deptId = filter.department || department;
      if (filter.name || name) params.name = filter.name || name;

      const res = await api.get("/course", { params });
      setCourses(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("강좌 목록 로딩 실패", err);
      setCourses([]);
    }
  };

  const handleSearch = () => {
    setPage(0); // 페이지 초기화
    loadCourses({ year, semester, department, name });
  };

  const openSyllabus = (courseId) => {
    window.open(
      `/course/syllabus/${courseId}`,
      "_blank",
      "width=1000,height=900,left=200,top=50"
    );
  };

  return (
    <div className="all-course-container">
      {/* 검색 필터 */}
      <div className="filter-container">
        <div className="department-form" style={{ marginBottom: "15px" }}>
          <label>연도</label>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">전체</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>

          <label>학기</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="">전체</option>
            <option value="1학기">1학기</option>
            <option value="2학기">2학기</option>
          </select>

          <label>개설학과</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">전체</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          <label>강의명</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="강의명을 입력하세요"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />

          <button className="search-btn" onClick={handleSearch}>
            조회
          </button>
        </div>
      </div>

      <p className="total-count">강의 목록 [총 {courses.length}건]</p>

      {/* 강의 테이블 */}
      <table className="course-table">
        <thead>
          <tr>
            <th>연도/학기</th>
            <th>단과대학</th>
            <th>개설학과</th>
            <th>학수번호</th>
            <th>강의구분</th>
            <th>강의명</th>
            <th>담당교수</th>
            <th>학점</th>
            <th>수강인원</th>
            <th>정원</th>
            <th>강의계획서</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="11" className="no-data">
                검색된 강좌가 없습니다.
              </td>
            </tr>
          ) : (
            courses.map((c) => (
              <tr key={c.id}>
                <td>
                  {c.subYear}-{c.semester}학기
                </td>
                <td>{c.department?.college?.name || "-"}</td>
                <td>{c.department?.name || "-"}</td>
                <td>{c.id}</td>
                <td>{c.type}</td>
                <td className="course-name">{c.name}</td>
                <td>{c.professor?.name || "미정"}</td>
                <td>{c.grades}</td>
                <td>{c.numOfStudent}</td>
                <td>{c.capacity}</td>
                <td>
                  <button
                    className="small-btn"
                    onClick={() => openSyllabus(c.id)}
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
    </div>
  );
};

export default AllCourse;
