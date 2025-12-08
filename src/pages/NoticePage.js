import React, { useEffect, useState } from "react";
import { getNoticeList } from "../api/noticeApi";
import { useNavigate } from "react-router-dom";

const NoticePage = ({ role }) => {
  const [pageData, setPageData] = useState(null);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("title");

  const navigate = useNavigate();

  const fetchList = async () => {
    const data = await getNoticeList(page, keyword, searchType);
    setPageData(data);
  };
  console.log();
  useEffect(() => {
    fetchList();
  }, [page]);

  if (!pageData) return <>로딩중...</>;

  return (
    <div>
      <h2>공지사항</h2>
      {/* 검색 */}
      <div>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="title">제목</option>
          <option value="content">제목 + 내용</option>
        </select>

        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어 입력"
        />
        <button
          onClick={() => {
            setPage(0);
            fetchList();
          }}
        >
          검색
        </button>
      </div>
      {/* {role === "STAFF" && ( */} {/* role 안먹는다요 ㅠㅠㅠㅠ */}
      <button onClick={() => navigate("/notice/write")}>새 글 등록</button>
      {/* )} */}
      {/* 목록 */}
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
          {pageData.content.map((n) => (
            <tr key={n.id}>
              <td>{n.id}</td>
              <td>{n.category}</td>
              <td
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/notice/${n.id}`)}
              >
                {n.title}
              </td>
              <td>{new Date(n.createdTime).toLocaleDateString()}</td>
              <td>{n.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "15px" }}>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          이전
        </button>
        <span style={{ margin: "0 10px" }}>
          {page + 1} / {pageData.totalPages}
        </span>
        <button
          disabled={page === pageData.totalPages - 1}
          onClick={() => setPage(page + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default NoticePage;
