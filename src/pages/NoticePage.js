import React, { useEffect, useState } from "react";
import { getNoticeList, deleteNotice } from "../api/noticeApi";
import { useNavigate } from "react-router-dom";

const NoticePage = () => {
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();

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
            <th>ID</th>
            <th>제목</th>
            <th>작성일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((n) => (
            <tr key={n.id}>
              <td>{n.id}</td>
              <td
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/notice/${n.id}`)}
              >
                {n.title}
              </td>
              <td>{new Date(n.createdTime).toLocaleString()}</td>
              <td>
                <button onClick={() => navigate(`/notice/edit/${n.id}`)}>
                  수정
                </button>
                <button onClick={() => deleteNotice(n.id).then(fetchList)}>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NoticePage;
