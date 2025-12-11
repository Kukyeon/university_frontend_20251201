import React, { useEffect, useState } from "react";
import CounselingRecordView from "../components/Counseling/CounselingRecordView";
import api from "../api/axiosConfig";

const CounselingRecordPage = ({ user }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (!user) return;
    api
      .get(`/counseling/records/${user.id}`)
      .then((res) => setRecords(res.data))
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>상담 기록 조회</h1>
      <CounselingRecordView records={records} />
    </div>
  );
};

export default CounselingRecordPage;
