import React, { useState } from "react";
import ScheduleList from "../components/Schedule/ScheduleList";
import ScheduleForm from "../components/Schedule/ScheduleForm";
import ScheduleDetail from "../components/Schedule/ScheduleDetail";

const ScheduleManagerPage = () => {
  const [viewMode, setViewMode] = useState("list"); // 'list', 'create', 'edit', 'detail'
  const [selectedId, setSelectedId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // 목록 갱신을 위한 키

  // 목록 항목 선택 (상세보기/수정하기)
  const handleSelect = (id, mode) => {
    setSelectedId(id);
    setViewMode(mode);
  };

  // 등록/수정 완료 후 목록 화면으로 돌아가기
  const handleFormSubmit = () => {
    alert(
      selectedId ? "일정 수정이 완료되었습니다." : "일정 등록이 완료되었습니다."
    );
    setViewMode("list");
    setSelectedId(null);
    setRefreshKey((prev) => prev + 1); // 목록 갱신 트리거
  };

  const renderContent = () => {
    switch (viewMode) {
      case "create":
        return (
          <>
            <h2>일정 등록</h2>
            <ScheduleForm id={null} onSubmit={handleFormSubmit} />
          </>
        );
      case "edit":
        return (
          <>
            <h2>일정 수정</h2>
            <ScheduleForm id={selectedId} onSubmit={handleFormSubmit} />
          </>
        );
      case "detail":
        return (
          <>
            <h2>일정 상세</h2>
            <ScheduleDetail id={selectedId} />
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => setViewMode("list")}
                style={{ marginRight: "5px" }}
              >
                목록으로
              </button>
              <button onClick={() => setViewMode("edit")}>수정하기</button>
            </div>
          </>
        );
      case "list":
      default:
        return (
          <>
            <button
              onClick={() => setViewMode("create")}
              style={{ marginBottom: "10px", padding: "10px 15px" }}
            >
              ➕ 새 학사 일정 등록
            </button>
            <ScheduleList
              onSelect={handleSelect}
              onActionComplete={refreshKey}
            />
          </>
        );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🗓️ 학사 일정 관리</h1>
      <hr />

      {/* 목록 외 모드일 때 목록으로 돌아가는 버튼 제공 */}
      {viewMode !== "list" && (
        <button
          onClick={() => setViewMode("list")}
          style={{ marginBottom: "10px" }}
        >
          ⬅️ 전체 목록 보기
        </button>
      )}
      {renderContent()}
    </div>
  );
};

export default ScheduleManagerPage;
