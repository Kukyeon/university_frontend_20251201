import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NoticeList() {
  const [noticeList, setNoticeList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("title");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/notice?type=${type}&keyword=${keyword}`)
      .then((res) => res.json())
      .then((data) => setNoticeList(data));
  }, [keyword, type]);

  const handleSearch = (e) => {
    e.preventDefault();
    // fetch는 useEffect에서 자동으로 반영됨
  };

  return (
    <div>
      <h1>공지사항</h1>
      <form onSubmit={handleSearch}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="title">제목</option>
          <option value="keyword">제목+내용</option>
        </select>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <button type="submit">검색</button>
      </form>

      <table>
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
          {noticeList.length > 0 ? (
            noticeList.map((notice) => (
              <tr
                key={notice.id}
                onClick={() => navigate(`/notice/${notice.id}`)}
              >
                <td>{notice.id}</td>
                <td>{notice.category}</td>
                <td>{notice.title}</td>
                <td>{notice.timeFormat}</td>
                <td>{notice.views}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">공지사항이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={() => navigate("/notice/write")}>등록</button>
    </div>
  );
}

export default NoticeList;
