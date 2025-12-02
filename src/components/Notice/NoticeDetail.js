import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function NoticeDetail() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/notice/${id}`)
      .then((res) => res.json())
      .then((data) => setNotice(data));
  }, [id]);

  if (!notice) return <div>Loading...</div>;

  return (
    <div>
      <h1>
        {notice.category} {notice.title}
      </h1>
      <p>{notice.content}</p>
      {notice.image && (
        <img src={notice.image} alt="공지 이미지" width="600" height="800" />
      )}

      <button onClick={() => navigate("/notice")}>목록</button>
      <button onClick={() => navigate(`/notice/update/${notice.id}`)}>
        수정
      </button>
      <button
        onClick={() => {
          fetch(`/api/notice/${notice.id}`, { method: "DELETE" }).then(() =>
            navigate("/notice")
          );
        }}
      >
        삭제
      </button>
    </div>
  );
}

export default NoticeDetail;
