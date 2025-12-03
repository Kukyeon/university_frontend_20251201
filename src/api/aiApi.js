import api from "./axiosConfig";

// [학생용] 챗봇 & 추천
export const chatApi = {
  // 질문하기
  ask: (studentId, question) => 
    api.post("/api/chatbot/ask", { studentId, question }),
  
  // 대화 이력 가져오기
  getHistory: (studentId) => 
    api.get(`/api/chatbot/history?studentId=${studentId}`),

  // 강의 추천 받기
  getRecommendation: (studentId) => 
    api.get(`/api/course/recommend?studentId=${studentId}`),
};

// [교수용] 대시보드
export const dashboardApi = {
  // 위험 학생 리스트 조회
  getRiskList: (professorId) => 
    api.get(`/api/dashboard/risk-list?professorId=${professorId}`),
};

// [관리자용] 시스템 제어
export const adminApi = {
  // 중도이탈 분석 실행
  runAnalysis: () => api.post("/api/dropout/analyze"),
  
  // 데이터 동기화 실행
  syncData: () => api.post("/api/system/sync"),
};

export default chatApi;