import React, { useState } from "react";
import EvaluationList from "../components/Evaluation/EvaluationList";
import EvaluationDetail from "../components/Evaluation/EvaluationDetail";
import EvaluationForm from "../components/Evaluation/EvaluationForm";

const EvaluationPage = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh((f) => !f);

  if (editingId !== null)
    return (
      <EvaluationForm
        id={editingId}
        onSubmit={() => {
          setEditingId(null);
          handleRefresh();
        }}
      />
    );

  if (selectedId !== null)
    return (
      <EvaluationDetail id={selectedId} onBack={() => setSelectedId(null)} />
    );

  return (
    <div>
      <button onClick={() => setEditingId(0)}>새 평가 등록</button>
      <EvaluationList
        onSelect={setSelectedId}
        onEdit={setEditingId}
        key={refresh}
      />
    </div>
  );
};

export default EvaluationPage;
