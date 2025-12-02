import api from "./api";

export const getEvaluations = async (subjectId) => {
  const response = await api.get(`/evaluation/read/${subjectId}`);
  return response.data;
};

export const submitEvaluation = async (subjectId, data) => {
  const response = await api.post(`/evaluation/write/${subjectId}`, data);
  return response.data;
};
