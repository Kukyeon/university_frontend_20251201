import React, { useEffect, useState } from "react";
import { getNoticeDetail } from "../../api/noticeApi";

const NoticeDetail = ({ id }) => {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const data = await getNoticeDetail(id);
      setNotice(data);
    };
    fetchDetail();
  }, [id]);

  if (!notice) return <div>로딩중...</div>;

  return (
    <div>
      <h2>{notice.title}</h2>
      <p>{notice.content}</p>
      {notice.setUpImage && (
        <img src={notice.setUpImage} alt="" width="400" height="300" />
      )}
    </div>
  );
};

export default NoticeDetail;
