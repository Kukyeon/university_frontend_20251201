import React, { useEffect, useState } from "react";

import {
  getEvaluationDetail,
  getEvaluationQuestions,
} from "../../api/evaluationApi";

const EvaluationDetail = ({ id, onBack }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const [evalData, qData] = await Promise.all([
        getEvaluationDetail(id),
        getEvaluationQuestions(),
      ]);
      setEvaluation(evalData);
      setQuestions(qData);
    };
    fetchDetail();
  }, [id]);

  if (!evaluation || !questions) return <div>로딩중...</div>;

  const subjectName = evaluation.subject?.name || "과목 정보 없음";

  return (
    <div>
      <button onClick={onBack}>목록으로</button>
      <h2>{subjectName}</h2>
      <ul>
        {Array.from({ length: 7 }, (_, i) => i + 1).map((i) => (
          <li key={i}>
            {questions[`question${i}`]}: {evaluation[`answer${i}`]}
          </li>
        ))}
      </ul>
      <p>개선사항: {evaluation.improvements}</p>
    </div>
  );
};

export default EvaluationDetail;
