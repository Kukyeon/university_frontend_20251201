import React, { useEffect, useState } from "react";
import { getNoticeDetail, deleteNotice } from "../../api/noticeApi";
import { useParams, useNavigate } from "react-router-dom";

const NoticeDetail = ({ role }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    getNoticeDetail(id).then(setNotice);
  }, [id]);

  if (!notice) return <div>로딩중...</div>;

  const handleDelete = async () => {
    if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
      try {
        await deleteNotice(id);
        alert("삭제되었습니다.");
        navigate("/notice"); // 삭제 후 목록으로 이동
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div>
      <h2>{notice.title}</h2>
      <p>
        <strong>말머리:</strong> {notice.category} |<strong> 조회수:</strong>{" "}
        {notice.views || 0}
      </p>
      {notice.imageUrl && (
        <img
          src={`http://localhost:8888${notice.imageUrl}`}
          alt="첨부 이미지"
          style={{ maxWidth: "500px", marginBottom: "10px" }}
        />
      )}
      <p>{notice.content}</p>
      <small>작성일: {new Date(notice.createdTime).toLocaleString()}</small>

      <br />
      <br />
      {role === "staff" && (
        <>
          <button onClick={() => navigate(`/notice/edit/${id}`)}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </>
      )}
      <button onClick={() => navigate("/notice")}>목록</button>
    </div>
  );
};

export default NoticeDetail;
