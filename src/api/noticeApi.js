import api from "./api";

export const getNoticeList = async (page = 1) => {
  const response = await api.get(`/notice/list/${page}`);
  return response.data;
};

export const getNoticeDetail = async (id) => {
  const response = await api.get(`/notice/read?id=${id}`);
  return response.data;
};

export const createNotice = async (data) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  const response = await api.post("/notice/write", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateNotice = async (id, data) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  const response = await api.put(`/notice/update?id=${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteNotice = async (id) => {
  const response = await api.delete(`/notice/delete?id=${id}`);
  return response.data;
};
