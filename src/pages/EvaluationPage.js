import React, { useState } from "react";
import EvaluationList from "../components/Evaluation/EvaluationList";
import EvaluationDetail from "../components/Evaluation/EvaluationDetail";
import EvaluationForm from "../components/Evaluation/EvaluationForm";

const EvaluationPage = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [refresh, setRefresh] = useState(false);

  //  평가 등록 시 사용할 과목 ID (실제로는 강의 목록에서 선택)
  const [currentSubjectId, setCurrentSubjectId] = useState(1);

  const handleRefresh = () => setRefresh((f) => !f);

  if (editingId !== null)
    return (
      <EvaluationForm
        evaluationId={editingId > 0 ? editingId : null}
        subjectId={editingId === 0 ? currentSubjectId : null}
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
      {/* 임시 과목 ID 선택 UI (실제에서는 강의 목록에서 선택되어야 함) */}
      <p>
        현재 평가할 과목 ID (테스트용):
        <input
          type="number"
          value={currentSubjectId}
          onChange={(e) => setCurrentSubjectId(Number(e.target.value))}
        />
      </p>
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
