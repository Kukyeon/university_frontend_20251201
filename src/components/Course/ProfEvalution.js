import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";

const ProfEvaluation = () => {
  const [evaluationData, setEvaluationData] = useState([]);
  const [subjects, setSubjects] = useState([]); // 셀렉트용 과목 목록
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(true);
  // 전체 평가 조회
  const fetchEvaluation = async (subjectName = "") => {
    try {
      const res = await api.get(
        subjectName
          ? `/evaluation/subject/${subjectName}`
          : `/evaluation/professor`
      );
      setEvaluationData(res.data);
    } catch (err) {
      console.error("강의 평가 조회 실패", err);
    } finally {
      setLoading(false);
    }
  };
  // 교수의 강의 목록 조회
  const fetchSubjects = async () => {
    try {
      const res = await api.get(`/evaluation/professor/subjects`);
      setSubjects(res.data);
    } catch (err) {
      console.error("강의 목록 조회 실패", err);
    }
  };

  useEffect(() => {
    fetchEvaluation(); // 전체 평가
    fetchSubjects(); // 과목 목록
  }, []);

  const handleSearch = () => {
    fetchEvaluation(selectedSubject);
  };

  if (loading) return <p>로딩중...</p>;

  if (evaluationData.length === 0)
    return <p className="no-data">조회할 강의 평가가 존재하지 않습니다.</p>;

  return (
    <div className="my-evaluation-container">
      <div style={{ marginBottom: "20px" }}>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">전체 과목</option>
          {subjects.map((sub, idx) => (
            <option key={idx} value={sub}>
              {sub}
            </option>
          ))}
        </select>
        <button onClick={handleSearch}>조회</button>
      </div>
      <table className="evaluation-table">
        <thead>
          <tr>
            <th>과목 이름</th>
            <th>총 평가 점수</th>
            <th>건의 사항</th>
          </tr>
        </thead>
        <tbody>
          {evaluationData.map((e) => (
            <tr key={`${e.subjectId}-${e.studentId}`}>
              <td>{e.subjectName}</td>
              <td>{e.avgScore ? Number(e.avgScore).toFixed(2) : "-"}</td>
              <td>{e.improvements}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfEvaluation;
