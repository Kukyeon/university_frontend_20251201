import React, { useEffect, useState } from "react";
import { createEvaluation, getEvaluationDetail } from "../../api/evaluationApi";

const EvaluationForm = ({ id, onSubmit }) => {
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
    if (id && id !== 0) {
      const fetchData = async () => {
        const data = await getEvaluationDetail(id);
        setForm(data);
      };
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createEvaluation(id, form);
    onSubmit();
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
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i}>
          <p>
            {i + 1}. 질문 {i + 1}
          </p>
          {answers.map((a) => (
            <label key={a.value}>
              <input
                type="radio"
                name={`answer${i + 1}`}
                value={a.value}
                checked={form[`answer${i + 1}`] === a.value.toString()}
                onChange={handleChange}
              />
              {a.label}
            </label>
          ))}
        </div>
      ))}
      <div>
        <p>개선사항</p>
        <textarea
          name="improvements"
          value={form.improvements}
          onChange={handleChange}
        />
      </div>
      <button type="submit">제출하기</button>
    </form>
  );
};

export default EvaluationForm;
