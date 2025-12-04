import api from "./axiosConfig";

// --- 기존 일정 CRUD ---
export const getScheduleList = () =>
  api.get("/schedule/list").then((res) => res.data);
export const getScheduleDetail = (id) =>
  api.get(`/schedule/${id}`).then((res) => res.data);
export const createSchedule = (data) =>
  api.post("/schedule/write", data).then((res) => res.data);
export const updateSchedule = (id, data) =>
  api.put(`/schedule/update/${id}`, data).then((res) => res.data);
export const deleteSchedule = (id) =>
  api.delete(`/schedule/delete/${id}`).then((res) => res.data);

// --- 상담 일정/기록 API ---
const requestCounseling = async (method, url, data = {}, params = {}) => {
  try {
    const response = await api({
      method,
      url: `/schedules${url}`,
      data: method !== "get" ? data : undefined,
      params: method === "get" ? params : undefined,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "요청 처리 중 오류가 발생했습니다."
    );
  }
};

// 교수 가능 시간 설정
export const setAvailability = (availabilityRequest) =>
  requestCounseling("post", "/availability", availabilityRequest);

// 교수/학생별 예약 현황 조회
export const getProfessorAvailability = (profId) =>
  requestCounseling("get", `/professor/${profId}`);

// 학생 상담 예약
export const bookAppointment = (availabilityId, studentId) =>
  requestCounseling("post", "/book", { availabilityId, studentId });

// 학생 예약 일정 조회
export const getStudentSchedules = (studentId) =>
  requestCounseling("get", `/student/${studentId}`);

// 상담 일정 취소
export const cancelAppointment = (scheduleId) =>
  requestCounseling("put", `/cancel/${scheduleId}`);

// 상담 기록 검색
export const searchRecords = (searchParams) =>
  requestCounseling("get", "/records/search", {}, searchParams);

// 상담 기록 저장
export const saveRecord = (scheduleId, notes, keywords = "") =>
  requestCounseling("post", `/records/save/${scheduleId}`, { notes, keywords });
