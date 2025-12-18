import React, { useEffect, useState } from "react";
import { chatApi } from "../api/aiApi";
import Chatbot from "../components/Chatbot/Chatbot"; // 아까 만든 챗봇 불러오기
import { Navigate, useNavigate } from "react-router-dom";

const StudentMain = ({user}) => {
  
  const [studentId, setStudentId] = useState(null); //1번
  const [studentName, setStudentName] = useState();
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
     alert("로그인이 필요합니다.");
      navigate("/login"); 
      return;
    } 
    
     setStudentId(user.id);
     setStudentName(user?.name);
    }, [user,navigate]);

  // AI 강의 추천 요청 함수
  // const getRecommend = async () => {
  //   setLoading(true);
  //   setRecommendation(""); // 기존 결과 초기화
  //   try {
  //     // 백엔드: CourseController 호출
  //     const res = await chatApi.getRecommendation(studentId);
  //     setRecommendation(res.data.result);
  //   } catch (err) {
  //     alert("추천 실패: " + err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>🎓 학생용 학사지원 시스템</h1>
      <p>안녕하세요, {user?.name} 학생님! 무엇을 도와드릴까요?</p>
      
      <hr style={{ margin: "30px 0" }} />

     
      {/* <div style={cardStyle}>
        <h2>🤖 AI 맞춤 강의 추천</h2>
        <p>나의 지난 수강 이력을 분석하여, 이번 학기 들을만한 과목을 추천해줍니다.</p>
        
        <button onClick={getRecommend} disabled={loading} style={btnStyle}>
          {loading ? "AI가 분석 중입니다... (약 3초)" : "강의 추천 받기"}
        </button>

        
        {recommendation && (
          <div style={resultBoxStyle}>
            <h3>🎯 분석 결과</h3>
            
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
              {recommendation}
            </pre>
          </div>
        )}
      </div> */}

      {/* === 챗봇 컴포넌트 (우측 하단 고정) === */}
      <Chatbot studentId={studentId} />
    </div>
  );
};

export default StudentMain;