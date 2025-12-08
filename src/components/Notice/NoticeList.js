import React, { useEffect, useState } from "react";
import { getNoticeList, deleteNotice } from "../../api/noticeApi";
import { useNavigate } from "react-router-dom";

const NoticeList = () => {
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
    <table border="1" width="100%">
      <thead>
        <tr>
          <th>번호</th>
          <th>말머리</th>
          <th>제목</th>
          <th>작성일</th>
          <th>조회수</th>
          <th>관리</th>
        </tr>
      </thead>

      <tbody>
        {notices.map((n) => (
          <tr key={n.id}>
            <td>{n.id}</td>

            {/* 상세보기 이동 */}
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
  );
};

export default NoticeList;
