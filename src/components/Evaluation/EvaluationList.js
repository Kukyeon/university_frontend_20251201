import React, { useEffect, useState } from "react";
import {
  getAllEvaluationsByProfessor,
  getEvaluationBySubject,
} from "../../api/evaluationApi";

const EvaluationList = ({ onSelect, onEdit }) => {
  const [evaluations, setEvaluations] = useState([]);
  const [subjectName, setSubjectName] = useState("");

  const fetchAll = async () => {
    const data = await getAllEvaluationsByProfessor();
    setEvaluations(data);
  };

  const fetchBySubject = async () => {
    if (!subjectName) return fetchAll();
    const data = await getEvaluationBySubject(subjectName);
    setEvaluations(data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <input
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          placeholder="과목명 검색"
        />
        <button onClick={fetchBySubject}>조회</button>
      </div>
      <table border="1">
        <thead>
          <tr>
            <th>과목 이름</th>
            <th>총 평가 점수</th>
            <th>개선사항</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((e) => (
            <tr key={e.id}>
              <td onClick={() => onSelect(e.id)} style={{ cursor: "pointer" }}>
                {e.name}
              </td>
              <td>{e.answerSum}</td>
              <td>{e.improvements}</td>
              <td>
                <button onClick={() => onEdit(e.id)}>수정</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EvaluationList;
