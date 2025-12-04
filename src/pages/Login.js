import React, { useContext, useState } from "react";
import "./Login.css";
import Modal from "../components/Modal"; // 모달 컴포넌트
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/Context/UserContext";

const LoginPage = () => {
  const [openModal, setOpenModal] = useState(null);
  const [loginData, setLoginData] = useState({
    id: "",
    password: "",
    rememberId: false,
  });
  const [modalData, setModalData] = useState({
    name: "",
    email: "",
    userId: "",
    role: "student",
  });
  const [tempPassword, setTempPassword] = useState("");
  const [foundId, setFoundId] = useState(""); // 새 상태
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setModalData((prev) => ({ ...prev, [name]: value }));
  };
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // 아이디 찾기 처리
  const handleFindId = async () => {
    try {
      console.log("보내는 데이터:", modalData); // 확인용
      const response = await api.post("/user/findId", {
        name: modalData.name,
        email: modalData.email,
        userRole: modalData.role,
      });
      setFoundId(response.data.id); // 모달 안에서 바로 보여주기
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // 비밀번호 찾기 처리
  const handleFindPw = async () => {
    try {
      const response = await api.post("/user/findPw", {
        name: modalData.name,
        email: modalData.email,
        id: parseInt(modalData.userId, 10),
        userRole: modalData.role,
      });
      setTempPassword(response.data.tempPassword);
    } catch (err) {
      console.error(
        "임시 비밀번호 발급 실패:",
        err.response?.data || err.message
      );
      alert(
        err.response?.data?.message ||
          "임시 비밀번호 발급 중 오류가 발생했습니다."
      );
    }
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // 새로고침 방지
    try {
      const response = await api.post("/user/login", {
        id: parseInt(loginData.id, 10),
        password: loginData.password,
      });
      console.log("로그인 성공:", response.data);
      setUser(response.data);
      navigate("/");
      // 로그인 성공 후 처리
    } catch (err) {
      console.error("로그인 실패:", err.response?.data || err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>로그인</h2>

        <form className="login-form" onSubmit={handleLoginSubmit}>
          <div className="input-group">
            <label>아이디</label>
            <input
              type="text"
              name="id"
              placeholder="아이디를 입력하세요"
              value={loginData.id}
              onChange={handleLoginChange}
            />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={loginData.password}
              onChange={handleLoginChange}
            />
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="saveId" />
            <label htmlFor="saveId">아이디 저장</label>
          </div>

          <button type="submit" className="login-btn">
            로그인
          </button>

          <div className="login-links">
            <button type="button" onClick={() => setOpenModal("findId")}>
              아이디 찾기
            </button>
            <span>|</span>
            <button type="button" onClick={() => setOpenModal("findPw")}>
              비밀번호 찾기
            </button>
          </div>
        </form>
      </div>

      {/* 아이디 찾기 모달 */}
      {openModal === "findId" && (
        <Modal
          onClose={() => {
            setOpenModal(null); // 모달 닫기
            setModalData({ name: "", email: "", userId: "", role: "student" }); // 초기화
            setFoundId(""); // 조회 결과 초기화
          }}
        >
          <h3>아이디 찾기</h3>
          <input
            className="modal-input"
            placeholder="이름"
            name="name"
            value={modalData.name}
            onChange={handleChange}
          />
          <input
            className="modal-input"
            placeholder="이메일"
            name="email"
            value={modalData.email}
            onChange={handleChange}
          />
          <div className="role-checkboxes">
            {["student", "professor", "staff"].map((r) => (
              <label key={r}>
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={modalData.role === r}
                  onChange={handleChange}
                />{" "}
                {r === "student" ? "학생" : r === "professor" ? "교수" : "직원"}
              </label>
            ))}
          </div>
          <button className="modal-btn" onClick={handleFindId}>
            조회
          </button>
          {foundId && (
            <div className="found-id-display">
              조회된 ID: <strong>{foundId}</strong>
            </div>
          )}
        </Modal>
      )}

      {/* 비밀번호 찾기 모달 */}
      {openModal === "findPw" && (
        <Modal
          onClose={() => {
            setOpenModal(null); // 모달 닫기
            setModalData({ name: "", email: "", userId: "", role: "student" }); // 초기화
            setTempPassword(""); // 조회 결과 초기화
          }}
        >
          <h3>비밀번호 찾기</h3>
          <input
            className="modal-input"
            placeholder="이름"
            name="name"
            value={modalData.name}
            onChange={handleChange}
          />
          <input
            className="modal-input"
            placeholder="아이디"
            name="userId"
            value={modalData.userId}
            onChange={handleChange}
          />
          <input
            className="modal-input"
            placeholder="이메일"
            name="email"
            value={modalData.email}
            onChange={handleChange}
          />
          <div className="role-checkboxes">
            {["student", "professor", "staff"].map((r) => (
              <label key={r}>
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={modalData.role === r}
                  onChange={handleChange}
                />{" "}
                {r === "student" ? "학생" : r === "professor" ? "교수" : "직원"}
              </label>
            ))}
          </div>
          <button className="modal-btn" onClick={handleFindPw}>
            임시 비밀번호 발급
          </button>
          {tempPassword && (
            <div className="temp-password-display">
              임시 비밀번호: <strong>{tempPassword}</strong>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default LoginPage;
