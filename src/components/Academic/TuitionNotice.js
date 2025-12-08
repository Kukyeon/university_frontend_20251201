import React, { useState } from "react";
import api from "../../api/axiosConfig";

const TuitionNotice = () => {
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await api.post("/tuition/create");
      alert(res.data.message); // JSON 반환 기준
    } catch (err) {
      console.error(err);
      alert("등록금 고지서 발송 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mypage-card">
      <h3>등록금 고지서 발송</h3>
      <button onClick={handleSend} disabled={loading}>
        {loading ? "발송 중..." : "발송"}
      </button>
    </div>
  );
};

export default TuitionNotice;
