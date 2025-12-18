import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "./Notice.css";

const Notice = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);

  const handleClickNotice = (noticeId) => {
    navigate("/academicPage", {
      state: { view: "detail", noticeId },
    });
  };

  const getNoticeList = async () => {
    try {
      const res = await api.get("/notice/latest");
      setNotices(res.data);
    } catch (err) {
      console.error("공지사항 조회 실패", err);
    }
  };

  useEffect(() => {
    getNoticeList();
  }, []);

  return (
    <section className="notice">
      <h2 className="notice__title">공지사항</h2>
      <ul className="notice__list">
        {notices.map((n) => (
          <li
            key={n.id}
            className="notice__item"
            onClick={() => handleClickNotice(n.id)}
          >
            <span className="notice__item-title">
              {n.category}
              {n.title}
            </span>
            <span className="notice__item-date">
              {new Date(n.createdTime).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Notice;
