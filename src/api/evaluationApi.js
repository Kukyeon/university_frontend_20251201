import api from "./axiosConfig";

// 교수용 전체 평가 조회
export const getAllEvaluationsByProfessor = async () => {
  const res = await api.get("/evaluation/professor");
  return res.data;
};

// 과목별 평가 조회
export const getEvaluationBySubject = async (subjectName) => {
  const res = await api.get(`/evaluation/subject/${subjectName}`);
  return res.data;
};

//평가 문항 조회 ( 질문가져오기)
export const getEvaluationQuestions = async () => {
  const res = await api.get("/evaluation/questions");
  return res.data;
};

// 단일 평가 상세 조회
export const getEvaluationDetail = async (id) => {
  const res = await api.get(`/evaluation/${id}`);
  return res.data;
};

// 평가 등록
export const createEvaluation = async (subjectId, data) => {
  const res = await api.post(`/evaluation/write/${subjectId}`, data);
  return res.data;
};
