import React, { useState } from "react";
import ScheduleList from "../components/Schedule/ScheduleList";
import ScheduleForm from "../components/Schedule/ScheduleForm";
import ScheduleDetail from "../components/Schedule/ScheduleDetail";

const ScheduleManagerPage = () => {
  const [viewMode, setViewMode] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // ScheduleList에서 항목 선택 시 호출 (list -> detail 모드)
  const handleSelect = (id, mode) => {
    setSelectedId(id);
    setViewMode(mode); // 'detail'
  };

  // 저장 (등록/수정) 완료 후 호출 (create/edit -> list 모드)
  const handleFormSubmit = () => {
    alert(
      selectedId ? "일정 수정이 완료되었습니다." : "일정 등록이 완료되었습니다."
    );
    setViewMode("list");
    setSelectedId(null);
    setRefreshKey((prev) => prev + 1); // 목록 갱신
  };

  // ScheduleDetail에서 삭제 완료 후 호출 (detail -> list 모드)
  const handleDeleteComplete = () => {
    setViewMode("list");
    setSelectedId(null);
    setRefreshKey((prev) => prev + 1); // 목록 갱신
  };

  // ScheduleDetail에서 수정 요청 시 호출 (detail -> edit 모드)
  const handleEditRequest = () => {
    setViewMode("edit");
  };

  const renderContent = () => {
    switch (viewMode) {
      case "create":
        return (
          <>
            <h2>📝 새 학사 일정 등록</h2>
            <ScheduleForm id={null} onSubmit={handleFormSubmit} />
          </>
        );
      case "edit":
        return (
          <>
            <h2>✏️ 학사 일정 수정 (ID: {selectedId})</h2>
            <ScheduleForm id={selectedId} onSubmit={handleFormSubmit} />
          </>
        );
      case "detail": // 👈 상세 보기 모드
        return (
          <>
            <h2>🔎 학사 일정 상세</h2>
            <ScheduleDetail
              id={selectedId}
              onEdit={handleEditRequest} // 수정 버튼 클릭 시 edit 모드로 전환
              onDelete={handleDeleteComplete} // 삭제 완료 시 목록으로 돌아가도록 처리
            />
          </>
        );
      case "list":
      default:
        return (
          <>
            <button
              onClick={() => setViewMode("create")}
              style={{
                marginBottom: "20px",
                padding: "10px 15px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              ➕ 새 학사 일정 등록
            </button>
            <ScheduleList
              onSelect={handleSelect} // 'detail' 모드 트리거
              onActionComplete={refreshKey} // 목록 갱신용 키
            />
          </>
        );
    }
  };

  return (
    <div style={{ padding: "10px 0" }}>
      <h1>🗓️ 학사 일정 관리</h1>
      <p style={{ color: "#666" }}>
        일정 등록, 상세 보기, 수정, 삭제를 관리합니다.
      </p>
      <hr style={{ margin: "20px 0" }} />

      {/* 목록 외 모드일 때 목록으로 돌아가는 버튼 제공 */}
      {viewMode !== "list" && (
        <button
          onClick={() => {
            setViewMode("list");
            setSelectedId(null);
          }}
          style={{
            marginBottom: "10px",
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ⬅️ 전체 목록 보기
        </button>
      )}
      {renderContent()}
    </div>
  );
};

export default ScheduleManagerPage;
