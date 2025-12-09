import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";

const ProfCourse = () => {
  const [subYear, setSubYear] = useState(""); // 초기값 빈 문자열 → 전체 조회
  const [semester, setSemester] = useState(""); // 초기값 빈 문자열 → 전체 조회
  const [courses, setCourses] = useState([]);

  // 초기 전체 데이터 로딩
  useEffect(() => {
    getSubjectList(); // 처음엔 필터 없이 전체 조회
  }, []);

  const getSubjectList = async (filter = {}) => {
    try {
      const params = {};
      // filter 객체에 값이 있을 때만 params에 추가
      if (filter.subYear) params.subYear = parseInt(filter.subYear);
      if (filter.semester) params.semester = parseInt(filter.semester);

      const res = await api.get("/prof", { params });
      setCourses(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("내 강의 조회 실패", err);
      setCourses([]);
    }
  };

  // 조회 버튼 클릭
  const handleSearch = () => {
    getSubjectList({ subYear, semester });
  };

  const openSyllabus = (courseId) => {
    window.open(
      `/course/syllabus/${courseId}`,
      "_blank",
      "width=1000,height=900,left=200,top=50"
    );
  };

  const openStudentList = (courseId) => {
    window.open(
      `/course/students/${courseId}`,
      "_blank",
      "width=1000,height=900,left=200,top=50"
    );
  };

  return (
    <div className="my-course-container">
      {/* 학기 선택 */}
      <div className="filter-container">
        <div className="department-form" style={{ marginBottom: "15px" }}>
          <label>연도</label>
          <select value={subYear} onChange={(e) => setSubYear(e.target.value)}>
            <option value="">전체</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>

          <label>학기</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="">전체</option>
            <option value="1">1학기</option>
            <option value="2">2학기</option>
          </select>

          <button className="search-btn" onClick={handleSearch}>
            조회
          </button>
        </div>
      </div>

      {/* 강의 목록 */}
      <table className="course-table">
        <thead>
          <tr>
            <th>학수번호</th>
            <th>강의명</th>
            <th>강의시간</th>
            <th>강의계획서</th>
            <th>학생 목록</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                조회된 강의가 없습니다.
              </td>
            </tr>
          ) : (
            courses.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td className="course-name">{c.name}</td>
                <td>
                  {c.subDay} {c.startTime}:00-{c.endTime}:00 ({c.roomId})
                </td>
                <td>
                  <button
                    className="small-btn"
                    onClick={() => openSyllabus(c.id)}
                  >
                    조회
                  </button>
                </td>
                <td>
                  <button
                    className="small-btn"
                    onClick={() => openStudentList(c.id)}
                  >
                    조회
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

export default ProfCourse;
