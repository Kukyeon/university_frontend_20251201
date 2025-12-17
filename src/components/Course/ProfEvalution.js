import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { useModal } from "../ModalContext";

const ProfEvaluation = () => {
  const [evaluationData, setEvaluationData] = useState([]);
  const [subjects, setSubjects] = useState([]); // 셀렉트용 과목 목록
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const { showModal } = useModal();
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
      showModal({
        type: "alert",
        message: "강의 평가를 불러오는데 실패했습니다.",
      });
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
      showModal({
        type: "alert",
        message: "강의 목록을 불러오는데 실패했습니다.",
      });
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
    <>
      <h3>내 강의 평가</h3>
      <div className="form-row">
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
      <div className="table-wrapper">
        <table className="course-table">
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
    </>
  );
};

export default ProfEvaluation;
