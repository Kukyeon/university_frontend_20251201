import React, { useState } from "react";
import api from "../../api/axiosConfig";
import { useModal } from "../ModalContext";

const TuitionNotice = () => {
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();
  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await api.post("/tuition/create");
      showModal({
        type: "alert",
        message: res.data.message,
      });
    } catch (err) {
      showModal({
        type: "alert",
        message: "등록금 고지서 발송 실패",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3>등록금 고지서 발송</h3>
      <button onClick={handleSend} disabled={loading}>
        {loading ? "발송 중..." : "발송"}
      </button>
    </>
  );
};

export default TuitionNotice;
