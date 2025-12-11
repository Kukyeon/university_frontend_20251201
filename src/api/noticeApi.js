import api from "./axiosConfig";

// 공지 리스트 조회
export const getNoticeList = async (
  page = 0,
  keyword = "",
  searchType = "title"
) => {
  const res = await api.get(`/notice/list`, {
    params: { page, keyword, searchType },
  });
  return res.data;
};

// 공지 상세 조회
export const getNoticeDetail = async (id) => {
  const res = await api.get(`/notice/read/${id}`);
  return res.data;
};

// 공지 등록
export const createNotice = async (formData) => {
  const res = await api.post(`/notice/write`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // 필수 설정
    },
  });
  return res.data;
};

// 공지 수정
export const updateNotice = async (id, formData) => {
  const res = await api.post(`/notice/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // 필수 설정
    },
  });
  return res.data;
};

// 공지 삭제
export const deleteNotice = async (id) => {
  const res = await api.delete(`/notice/delete/${id}`);
  return res.data;
};

// 공지사항 조회수
export const incrementNoticeViews = async (id) => {
  const res = await api.post(`/notice/views/${id}`);
  return res.data;
};
