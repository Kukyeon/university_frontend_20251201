import React, { useState, useEffect } from "react";
import {
  createEvaluation,
  getEvaluationDetail,
  getEvaluationQuestions,
} from "../../api/evaluationApi";

const EvaluationForm = ({ evaluationId, subjectId, onSubmit }) => {
  const [form, setForm] = useState({
    answer1: null,
    answer2: null,
    answer3: null,
    answer4: null,
    answer5: null,
    answer6: null,
    answer7: null,
    improvements: "",
  });
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    // 1. 질문 데이터 가져오기
    const fetchQuestions = async () => {
      try {
        const qData = await getEvaluationQuestions();
        setQuestions(qData);
      } catch (error) {
        console.error("평가 질문 로드 실패:", error);
      }
    };

    // 2. 기존 평가 데이터 가져오기 (수정 모드일 때)
    const fetchDetail = async () => {
      if (evaluationId && evaluationId !== 0) {
        const data = await getEvaluationDetail(evaluationId);
        setForm(data);
      }
    };

    fetchQuestions();
    fetchDetail();
  }, [evaluationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (evaluationId && evaluationId !== 0) {
        console.warn(
          "수정 기능은 현재 백엔드/프론트엔드에 구현되어 있지 않습니다."
        );
      } else if (subjectId) {
        await createEvaluation(subjectId, form);
        onSubmit();
      } else {
        alert("평가할 과목 ID를 찾을 수 없습니다.");
        return;
      }
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

  // 로딩 처리
  if (!questions) return <div>평가 질문 로딩 중...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h3>평가 항목</h3>

      {Array.from({ length: 7 }, (_, i) => {
        const questionKey = `question${i + 1}`;
        const questionText =
          questions[questionKey] || `[질문 ${i + 1} 텍스트 없음]`;
        const answerName = `answer${i + 1}`;

        return (
          <div
            key={i}
            style={{
              marginBottom: "15px",
              borderBottom: "1px solid #eee",
              paddingBottom: "10px",
            }}
          >
            <p style={{ fontWeight: "bold", margin: "5px 0" }}>
              {i + 1}. {questionText}
            </p>
            <div style={{ display: "flex", gap: "15px", marginTop: "5px" }}>
              {answers.map((a) => (
                <label key={a.value}>
                  <input
                    type="radio"
                    name={answerName}
                    value={a.value}
                    checked={Number(form[answerName]) === a.value}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: e.target.name,
                          value: Number(e.target.value),
                        },
                      })
                    }
                  />
                  {a.label}
                </label>
              ))}
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: "20px" }}>
        <p style={{ fontWeight: "bold" }}>개선사항 (자유 기술)</p>
        <textarea
          name="improvements"
          value={form.improvements}
          onChange={handleChange}
          rows={4}
          style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
        />
      </div>
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        제출하기
      </button>
    </form>
  );
};

export default EvaluationForm;
