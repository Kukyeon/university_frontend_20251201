import { useState } from "react";
import api from "../../api/axiosConfig";
import { useModal } from "../ModalContext";

const ChangePw = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const { showModal } = useModal();
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPw) {
      showModal({
        type: "alert",
        message: "새 비밀번호와 확인이 일치하지 않습니다.",
      });
      return;
    }
    try {
      const payload = { oldPassword, newPassword };
      await api.put("/user/update/pw", payload);
      showModal({
        type: "alert",
        message: "비밀번호가 변경되었습니다.",
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPw("");
    } catch (error) {
      showModal({
        type: "alert",
        message: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <>
      <h3>비밀번호 변경</h3>
      <form className="change-password-form" onSubmit={handleChangePassword}>
        <div className="input-group">
          <label>현재 비밀번호</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>새 비밀번호 확인</label>
          <input
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-save">
          변경
        </button>
      </form>
    </>
  );
};

export default ChangePw;
