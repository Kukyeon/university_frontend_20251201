import React, { useEffect, useState } from "react";
import { getEvaluationDetail } from "../../api/evaluationApi";

const EvaluationDetail = ({ id, onBack }) => {
  const [evaluation, setEvaluation] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const data = await getEvaluationDetail(id);
      setEvaluation(data);
    };
    fetchDetail();
  }, [id]);

  if (!evaluation) return <div>로딩중...</div>;

  return (
    <div>
      <button onClick={onBack}>목록으로</button>
      <h2>{evaluation.subjectName}</h2>
      <ul>
        <li>
          1. {evaluation.question1}: {evaluation.answer1}
        </li>
        <li>
          2. {evaluation.question2}: {evaluation.answer2}
        </li>
        <li>
          3. {evaluation.question3}: {evaluation.answer3}
        </li>
        <li>
          4. {evaluation.question4}: {evaluation.answer4}
        </li>
        <li>
          5. {evaluation.question5}: {evaluation.answer5}
        </li>
        <li>
          6. {evaluation.question6}: {evaluation.answer6}
        </li>
        <li>
          7. {evaluation.question7}: {evaluation.answer7}
        </li>
      </ul>
      <p>개선사항: {evaluation.improvements}</p>
    </div>
  );
};

export default EvaluationDetail;
