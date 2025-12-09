// src/api/scheduleApi.js

import api from "./axiosConfig";

// --- 일반 학사 일정 (백엔드 ScheduleController 경로: /api/schedule) ---
// 목록 조회
// export const getScheduleList = () =>
//   api.get("/schedule").then((res) => res.data);
export const getScheduleList = async () => {
  try {
    const res = await api.get("/schedule");
    return res.data;
  } catch (err) {
    console.error("🔥 학사 일정 요청 에러:", err.response?.data || err.message);
    throw err;
  }
};
//상세 조회
export const getScheduleDetail = (id) =>
  api.get(`/schedule/${id}`).then((res) => res.data);

//  등록
export const createSchedule = (data) =>
  api.post("/schedule/write", data).then((res) => res.data);

// 수정
export const updateSchedule = (id, data) =>
  api.put(`/schedule/${id}`, data).then((res) => res.data);

//삭제
export const deleteSchedule = (id) =>
  api.delete(`/schedule/${id}`).then((res) => res.data);

// --- 상담 일정/기록 API (백엔드 CounselingController 경로: /api/schedules) ---
const requestCounseling = async (method, url, data = {}, params = {}) => {
  try {
    const response = await api({
      method,
      url: `/schedules${url}`, // /api/schedules 경로 사용
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
export const getProfessorAvailability = () =>
  requestCounseling("get", "/professor");

// 학생 상담 예약
export const bookAppointment = (availabilityId, studentId) =>
  requestCounseling("post", "/book", {
    availabilityId,
    studentId,
  });

// 모든 교수님의 예약 가능한 시간 조회 (학생 예약용)
export const getAllAvailableTimes = () =>
  requestCounseling("get", "/available-list");

// 학생 예약 일정 조회
export const getStudentSchedules = () => requestCounseling("get", "/student");

// 상담 일정 취소
export const cancelAppointment = (scheduleId) =>
  requestCounseling("put", `/cancel/${scheduleId}`);

// 상담 기록 검색
export const searchRecords = (searchParams) =>
  requestCounseling("get", "/records/search", {}, searchParams);

// 상담 기록 저장
export const saveRecord = (scheduleId, notes, keywords = "") =>
  requestCounseling("post", `/records/save/${scheduleId}`, { notes, keywords });

// 교수에게 신청된 상담 일정 목록 조회 (로그인된 교수 ID로 백엔드에서 자동 조회)
export const getProfessorRequests = () => requestCounseling("get", "/requests");

// 상담 일정 상태 변경 (승인/거절/완료)
export const updateScheduleStatus = (scheduleId, newStatus) =>
  requestCounseling("put", `/status/${scheduleId}`, { status: newStatus });

// 특정 상담 기록 상세 조회 / 교수용
export const getCounselingRecord = (scheduleId, studentId) => {
  return requestCounseling("get", `/records/${scheduleId}`, {}, { studentId });
};

//특정 상담 기록 상세 조회 / 학생용
export const getStudentCounselingRecord = (scheduleId) => {
  return requestCounseling("get", `/records/student/${scheduleId}`);
};
