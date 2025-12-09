import React, { useEffect } from "react";

const RecordAutoSave = ({ sttText, onChange }) => {
  useEffect(() => {
    // STT 업데이트 시마다 부모로 전달
    onChange && onChange(sttText);
  }, [sttText]);

  return (
    <div>
      <h4>자동 상담 기록</h4>
      <textarea value={sttText} readOnly rows={5} style={{ width: "100%" }} />
    </div>
  );
};

export default RecordAutoSave;
