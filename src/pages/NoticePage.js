import React, { useEffect, useState } from "react";
import { getNoticeList } from "../api/noticeApi";
import { useNavigate } from "react-router-dom";

const NoticePage = () => {
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();

  //목록 불러오기
  const fetchList = async () => {
    const data = await getNoticeList();
    setNotices(data);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div>
      <h2>공지사항</h2>
      <button onClick={() => navigate("/notice/write")}>새 글 등록</button>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>번호</th>
            <th>말머리</th>
            <th>제목</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((n) => (
            <tr key={n.id}>
              <td>{n.id}</td>
              <td>{n.category}</td>
              <td
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/notice/${n.id}`)}
              >
                {n.title}
              </td>
              <td>{new Date(n.createdTime).toLocaleString()}</td>
              <td>{n.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NoticePage;
