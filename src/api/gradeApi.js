import api from "./axiosConfig";

// [신규] 성적 관련 API
export const gradeApi = {
  getThisSemester: () => api.get("/grade/thisSemester"), // 금학기
  getSemester: () => api.get("/grade/semester"),         // 학기별 (전체)
  searchSemester: (params) => api.post("/grade/read", params), // 학기별 (검색)
  getTotal: () => api.get("/grade/total"),               // 누계
};

// [신규] 수강신청 관련 API
export const courseApi = {
  // 1. 강의 목록 조회 (학기 자동 감지)
  // GET /api/course/list?year=2025&semester=1 (파라미터 생략 가능)
  getSubjectList: (params) => api.get("/course/list", { params }),

  // 2. 내 수강 내역 조회
  // GET /api/course/history
  getMyHistory: () => api.get("/course/history"),

  // 3. AI 강의 추천
  // GET /api/course/recommend
  getAiRecommendation: () => api.get("/course/recommend"),

  // 4. 수강신청
  // POST /api/course/register
  register: (subjectId) => api.post("/course/register", { subjectId }),

  // 5. 수강취소
  // DELETE /api/course/cancel?subjectId=101
  cancel: (subjectId) => api.delete("/course/cancel", { params: { subjectId } }),

  //학과 목록 조회
  getDeptList: () => api.get("/department/list"),
};

// 관리자 강의 관리 API
export const adminSubjectApi = {
  getList: () => api.get("/admin/subject"),
  insert: (data) => api.post("/admin/subject", data),
  delete: (id) => api.delete(`/admin/subject/${id}`),


};
