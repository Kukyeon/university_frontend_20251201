import React, { useEffect, useState } from "react";

import { createEvaluation, getEvaluationDetail } from "../../api/evaluationApi";

const EvaluationForm = ({ evaluationId, subjectId, onSubmit }) => {
  const [form, setForm] = useState({
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    answer5: "",
    answer6: "",
    answer7: "",
    improvements: "",
  });

  useEffect(() => {
    if (evaluationId && evaluationId !== 0) {
      const fetchData = async () => {
        const data = await getEvaluationDetail(evaluationId);
        setForm(data);
      };
      fetchData();
    }
  }, [evaluationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (evaluationId && evaluationId !== 0) {
        //  평가 수정
        // await updateEvaluation(evaluationId, form);
        console.warn(
          "수정 기능은 현재 백엔드/프론트엔드에 구현되어 있지 않습니다."
        );
      } else if (subjectId) {
        await createEvaluation(subjectId, form);
      } else {
        alert("평가할 과목 ID를 찾을 수 없습니다.");
        return;
      }

      onSubmit();
    } catch (error) {
      console.error("평가 제출 실패:", error);
      alert(`제출 실패: ${error.response?.data?.message || error.message}`);
    }
  };

  const answers = [
    { value: 5, label: "매우 그렇다" },
    { value: 4, label: "그렇다" },
    { value: 3, label: "보통" },
    { value: 2, label: "그렇지 않다" },
    { value: 1, label: "전혀 그렇지 않다" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      {" "}
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i}>
          {" "}
          <p>
            {i + 1}. 질문 {i + 1}{" "}
          </p>{" "}
          {answers.map((a) => (
            <label key={a.value}>
              {" "}
              <input
                type="radio"
                name={`answer${i + 1}`}
                value={a.value}
                checked={Number(form[`answer${i + 1}`]) === a.value}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: e.target.name,
                      value: Number(e.target.value),
                    },
                  })
                }
              />
              {a.label}{" "}
            </label>
          ))}{" "}
        </div>
      ))}{" "}
      <div>
        <p>개선사항</p>{" "}
        <textarea
          name="improvements"
          value={form.improvements}
          onChange={handleChange}
        />{" "}
      </div>
      <button type="submit">제출하기</button>{" "}
    </form>
  );
};

export default EvaluationForm;
