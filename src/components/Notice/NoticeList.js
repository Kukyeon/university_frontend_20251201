import React, { useEffect, useState } from "react";
import { getNoticeList, deleteNotice } from "../../api/noticeApi";

const NoticeList = ({ onSelect, onEdit }) => {
  const [notices, setNotices] = useState([]);

  const fetchList = async () => {
    const data = await getNoticeList();
    setNotices(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      await deleteNotice(id);
      fetchList();
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <table border="1">
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
            <td onClick={() => onSelect(n.id)} style={{ cursor: "pointer" }}>
              {n.title}
            </td>
            <td>{n.timeFormat}</td>
            <td>
              <button onClick={() => onEdit(n.id)}>수정</button>
              <button onClick={() => handleDelete(n.id)}>삭제</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default NoticeList;
