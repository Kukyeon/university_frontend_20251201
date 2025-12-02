import { useEffect, useState } from "react";

function Evaluation() {
  const [evaluationList, setEvaluationList] = useState([]);

  useEffect(() => {
    fetch("/api/evaluation")
      .then((res) => res.json())
      .then((data) => setEvaluationList(data));
  }, []);

  return (
    <div>
      <h1>평가 목록</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>과목</th>
            <th>점수</th>
            <th>평가일</th>
          </tr>
        </thead>
        <tbody>
          {evaluationList.map((evalItem) => (
            <tr key={evalItem.id}>
              <td>{evalItem.id}</td>
              <td>{evalItem.subject}</td>
              <td>{evalItem.score}</td>
              <td>{evalItem.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Evaluation;
