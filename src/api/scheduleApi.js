import api from "./axiosConfig";

// 전체 일정 조회
export const getScheduleList = async () => {
  const res = await api.get("/schedule/list");
  return res.data;
};

// 단일 일정 조회
export const getScheduleDetail = async (id) => {
  const res = await api.get(`/schedule/${id}`);
  return res.data;
};

// 일정 생성
export const createSchedule = async (data) => {
  const res = await api.post("/schedule/write", data);
  return res.data;
};

// 일정 수정
export const updateSchedule = async (id, data) => {
  const res = await api.put(`/schedule/update/${id}`, data);
  return res.data;
};

// 일정 삭제
export const deleteSchedule = async (id) => {
  const res = await api.delete(`/schedule/delete/${id}`);
  return res.data;
};
