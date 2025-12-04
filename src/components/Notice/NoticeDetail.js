import React, { useEffect, useState } from "react";
import { getNoticeDetail } from "../../api/noticeApi";
import { useParams, useNavigate } from "react-router-dom";

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    getNoticeDetail(id).then(setNotice);
  }, [id]);

  if (!notice) return <div>로딩중...</div>;

  return (
    <div>
      <h2>{notice.title}</h2>
      {notice.imageUrl && (
        <img
          src={notice.imageUrl}
          alt="첨부 이미지"
          style={{ maxWidth: "500px", marginBottom: "10px" }}
        />
      )}
      <p>{notice.content}</p>
      <small>작성일: {new Date(notice.createdTime).toLocaleString()}</small>

      <br />
      <br />

      <button onClick={() => navigate(`/notice/edit/${id}`)}>수정</button>
      <button onClick={() => navigate("/notice")}>목록</button>
    </div>
  );
};

export default NoticeDetail;
