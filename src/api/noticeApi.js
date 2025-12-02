import api from "./axiosConfig"; // 위에서 만든 Axios 인스턴스 사용

// 공지 리스트 조회
export const getNoticeList = async () => {
  const res = await api.get("/notice/list");
  return res.data;
};

// 공지 상세 조회
export const getNoticeDetail = async (id) => {
  const res = await api.get(`/notice/read/${id}`);
  return res.data;
};

// 공지 등록
export const createNotice = async (form) => {
  const formData = new FormData();
  formData.append("title", form.title);
  formData.append("content", form.content);
  formData.append("category", form.category);
  if (form.file) formData.append("file", form.file);

  const res = await api.post("/notice/write", formData, {
    headers: { "Content-Type": "multipart/form-data" }, // JSON 대신 multipart
  });
  return res.data;
};

// 공지 수정
export const updateNotice = async (id, form) => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("title", form.title);
  formData.append("content", form.content);
  formData.append("category", form.category);
  if (form.file) formData.append("file", form.file);

  const res = await api.post("/notice/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 공지 삭제
export const deleteNotice = async (id) => {
  const res = await api.delete(`/notice/delete/${id}`);
  return res.data;
};
