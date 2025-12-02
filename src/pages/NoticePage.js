import React, { useState } from "react";
import NoticeList from "../components/Notice/NoticeList";
import NoticeDetail from "../components/Notice/NoticeDetail";
import NoticeForm from "../components/Notice/NoticeForm";

const NoticePage = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh((f) => !f);

  if (editingId)
    return (
      <NoticeForm
        id={editingId}
        onSubmit={() => {
          setEditingId(null);
          handleRefresh();
        }}
      />
    );
  if (selectedId) return <NoticeDetail id={selectedId} />;

  return (
    <div>
      <button onClick={() => setEditingId(null)}>새 글 등록</button>
      <NoticeList
        onSelect={setSelectedId}
        onEdit={setEditingId}
        key={refresh}
      />
    </div>
  );
};

export default NoticePage;
