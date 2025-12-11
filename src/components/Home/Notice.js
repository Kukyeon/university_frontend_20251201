import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
const Notice = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);

  const handleClickNotice = (noticeId) => {
    // 공지 클릭 시, noticeId 전달
    navigate("/academicPage", {
      state: { view: "detail", noticeId: noticeId },
    });
  };

  const getNoticeList = async () => {
    const res = await api.get("/notice/latest");
    setNotices(res.data);
    console.log(res.data);
  };
  useEffect(() => {
    getNoticeList();
  }, []);
  return (
    <section className="notices">
      <h2>공지사항</h2>
      <ul>
        {notices.map((n) => (
          <li key={n.id} onClick={() => handleClickNotice(n.id)}>
            <span className="notice-title">
              {n.category}
              {n.title}
            </span>
            <span className="notice-date">
              {new Date(n.createdTime).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Notice;
