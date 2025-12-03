import React, { useState } from "react";
import { chatApi } from "../api/aiApi";
import Chatbot from "../components/Chatbot/Chatbot"; // 아까 만든 챗봇 불러오기

const StudentMain = () => {
  const studentId = 101; // (로그인 전 임시 ID)
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  // AI 강의 추천 요청 함수
  const getRecommend = async () => {
    setLoading(true);
    setRecommendation(""); // 기존 결과 초기화
    try {
      // 백엔드: CourseController 호출
      const res = await chatApi.getRecommendation(studentId);
      setRecommendation(res.data.result);
    } catch (err) {
      alert("추천 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>🎓 학생용 학사지원 시스템</h1>
      <p>안녕하세요, {studentId}번 학생님! 무엇을 도와드릴까요?</p>
      
      <hr style={{ margin: "30px 0" }} />

      {/* === [핵심 기능] AI 강의 추천 섹션 === */}
      <div style={cardStyle}>
        <h2>🤖 AI 맞춤 강의 추천</h2>
        <p>나의 지난 수강 이력을 분석하여, 이번 학기 들을만한 과목을 추천해줍니다.</p>
        
        <button onClick={getRecommend} disabled={loading} style={btnStyle}>
          {loading ? "AI가 분석 중입니다... (약 3초)" : "강의 추천 받기"}
        </button>

        {/* 결과 표시 영역 */}
        {recommendation && (
          <div style={resultBoxStyle}>
            <h3>🎯 분석 결과</h3>
            {/* 줄바꿈(\n) 처리를 위해 pre-wrap 사용 */}
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
              {recommendation}
            </pre>
          </div>
        )}
      </div>

      {/* === 챗봇 컴포넌트 (우측 하단 고정) === */}
      <Chatbot studentId={studentId} />
    </div>
  );
};

// 스타일 (CSS 파일로 분리 가능)
const cardStyle = {
  background: "#f9f9f9",
  padding: "30px",
  borderRadius: "15px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  textAlign: "center"
};

const btnStyle = {
  padding: "12px 24px",
  fontSize: "16px",
  background: "#6200ea",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};

const resultBoxStyle = {
  marginTop: "20px",
  padding: "20px",
  background: "white",
  border: "1px solid #ddd",
  borderRadius: "8px",
  textAlign: "left",
  lineHeight: "1.6"
};

export default StudentMain;