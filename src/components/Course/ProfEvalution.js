import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig"; // 실제 API 경로

const ProfEvaluation = () => {
  const [evaluationData, setEvaluationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const res = await api.get("/prof/my-evaluation"); // 내 강의 평가 API
        setEvaluationData(res.data);
      } catch (err) {
        console.error("강의 평가 조회 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, []);

  if (loading) return <p>로딩중...</p>;

  if (evaluationData.length === 0)
    return <p className="no-data">조회할 강의 평가가 존재하지 않습니다.</p>;

  return (
    <div className="my-evaluation-container">
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
            <tr key={e.subjectId}>
              <td>{e.subjectName}</td>
              <td>{e.avgScore.toFixed(2)}</td>
              <td>{e.improvements}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfEvaluation;
