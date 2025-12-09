import api from "./axiosConfig";


export const getSugangPeriod = async () => {
  const response = await api.get("/sugang/period");
  return response.data;
};

/**
 * 수강신청 기간 상태 변경
 */
export const updateSugangPeriod = async (type) => {
  const response = await api.put(`/sugang/period?type=${type}`);
  return response.data;
};

