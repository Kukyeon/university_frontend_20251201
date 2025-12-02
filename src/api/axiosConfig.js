import axios from "axios";

// 기본 Axios 인스턴스
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8888/api", // 백엔드 기본 URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 세션 인증이 필요할 경우
});
export default api;
