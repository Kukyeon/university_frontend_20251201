import api from "./axiosConfig";

// 전체 학사일정 조회
export const getSchedules = async () => {
  const res = await api.get("/schedule");
  return res.data;
};

// 학사일정 등록
export const createSchedule = async (data) => {
  const res = await api.post("/schedule/write", data);
  return res.data;
};

// 학사일정 수정
export const updateSchedule = async (id, data) => {
  const res = await api.post("/schedule/update", { ...data, id });
  return res.data;
};

// 학사일정 삭제
export const deleteSchedule = async (id) => {
  const res = await api.get(`/schedule/delete?id=${id}`);
  return res.data;
};
