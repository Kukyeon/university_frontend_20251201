import React, { useState } from "react";
import ScheduleList from "../components/Schedule/ScheduleList";
import ScheduleDetail from "../components/Schedule/ScheduleDetail";
import ScheduleForm from "../components/Schedule/ScheduleForm";

const SchedulePage = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh((f) => !f);

  if (editingId !== null)
    return (
      <ScheduleForm
        id={editingId}
        onSubmit={() => {
          setEditingId(null);
          handleRefresh();
        }}
      />
    );
  if (selectedId !== null) return <ScheduleDetail id={selectedId} />;

  return (
    <div>
      <button onClick={() => setEditingId(0)}>새 일정 등록</button>
      <ScheduleList
        onSelect={setSelectedId}
        onEdit={setEditingId}
        key={refresh}
      />
    </div>
  );
};

export default SchedulePage;
