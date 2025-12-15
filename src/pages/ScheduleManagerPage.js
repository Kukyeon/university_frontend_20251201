import React, { useState } from "react";
import ScheduleList from "../components/Schedule/ScheduleList";
import ScheduleForm from "../components/Schedule/ScheduleForm";
import ScheduleDetail from "../components/Schedule/ScheduleDetail";

const ScheduleManagerPage = () => {
  const [viewMode, setViewMode] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelect = (id, mode) => {
    setSelectedId(id);
    setViewMode(mode);
  };

  const handleFormSubmit = () => {
    alert(
      selectedId ? "일정 수정이 완료되었습니다." : "일정 등록이 완료되었습니다."
    );
    setViewMode("list");
    setSelectedId(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleDeleteComplete = () => {
    setViewMode("list");
    setSelectedId(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEditRequest = () => {
    setViewMode("edit");
  };

  return (
    <>
      <h3>학사 일정 관리</h3>

      {viewMode !== "list" && (
        <button
          className="schedule-button gray"
          onClick={() => setViewMode("list")}
        >
          ⬅️ 전체 목록 보기
        </button>
      )}

      {/* 단일 컨테이너 안에서 모드별 컴포넌트 교체 */}
      <>
        {viewMode === "list" && (
          <>
            <button
              className="schedule-button green"
              onClick={() => setViewMode("create")}
            >
              새 학사 일정 등록
            </button>
            <ScheduleList
              onSelect={handleSelect}
              onActionComplete={refreshKey}
            />
          </>
        )}

        {viewMode === "create" && (
          <ScheduleForm id={null} onSubmit={handleFormSubmit} />
        )}

        {viewMode === "edit" && (
          <ScheduleForm id={selectedId} onSubmit={handleFormSubmit} />
        )}

        {viewMode === "detail" && (
          <ScheduleDetail
            id={selectedId}
            onEdit={handleEditRequest}
            onDelete={handleDeleteComplete}
          />
        )}
      </>
    </>
  );
};

export default ScheduleManagerPage;
