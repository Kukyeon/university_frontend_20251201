import React, { useEffect, useState } from "react";
import { getNoticeList } from "../api/noticeApi";
import NoticeForm from "../components/Notice/NoticeForm";
import NoticeDetail from "../components/Notice/NoticeDetail";
import "./NoticePage.css";
import { useLocation, useParams } from "react-router-dom";

const NoticePage = ({ role }) => {
  const location = useLocation();
  const [pageData, setPageData] = useState(null);
  const state = location.state || {};
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [view, setView] = useState(state.view ? "detail" : "list"); // list / write / detail
  const [selectedNoticeId, setSelectedNoticeId] = useState(
    state.noticeId || null
  );
  console.log(state);
  const fetchList = async () => {
    const data = await getNoticeList(page, keyword, searchType);
    setPageData(data);
  };
  console.log();

  // 🔹 화면 분기
  if (view === "edit" || view === "write") {
    return (
      <NoticeForm
        role={role}
        noticeId={selectedNoticeId}
        onBack={() => setView("list")}
      />
    );
  }

  if (view === "detail") {
    return (
      <NoticeDetail
        noticeId={selectedNoticeId}
        onBack={() => setView("list")}
        onEdit={(id) => {
          setSelectedNoticeId(id); // 어떤 글을 수정할지 저장
          setView("edit"); // edit 모드로 전환
        }}
        role={role}
      />
    );
  }

  if (!pageData) return <>로딩중...</>;

  return (
    <div className="notice-page">
      <h3 className="notice-page__title">공지사항</h3>

      {/* 검색 */}
      <div className="department-form" style={{ marginBottom: "15px" }}>
        <select
          className="notice-page__select"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="title">제목</option>
          <option value="content">제목 + 내용</option>
        </select>

        <input
          className="notice-page__input"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어 입력"
        />
        <button
          className="notice-page__btn"
          onClick={() => {
            setPage(0);
            fetchList();
          }}
        >
          검색
        </button>
      </div>

      {role === "staff" && (
        <button
          className="notice-page__btn notice-page__btn--write"
          onClick={() => {
            setSelectedNoticeId(null); // ★ 초기화
            setView("write");
          }}
        >
          새 글 등록
        </button>
      )}

      {/* 목록 */}
      <table className="notice-page__table">
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
                className="notice-page__title-cell"
                onClick={() => {
                  setSelectedNoticeId(n.id);
                  setView("detail");
                }}
              >
                {n.title}
              </td>
              <td>{new Date(n.createdTime).toLocaleDateString()}</td>
              <td>{n.views}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="notice-page__pagination">
        <button
          className="notice-page__btn"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          이전
        </button>
        <span className="notice-page__page-info">
          {page + 1} / {pageData.totalPages}
        </span>
        <button
          className="notice-page__btn"
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
