import React, { useState, useEffect } from "react";
import { gradeApi } from "../api/gradeApi";
import GradeThisSemester from "../components/Grade/GradeThisSemester";
import GradeBySemester from "../components/Grade/GradeBySemester";
import GradeTotal from "../components/Grade/GradeTotal";
import EvaluationPage from "./EvaluationPage";
import EvaluationForm from "../components/Evaluation/EvaluationForm";
import Modal from "../components/Modal";

const GradePage = () => {
  const [activeTab, setActiveTab] = useState("this"); // this, semester, total
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedEval, setSelectedEval] = useState(null);

  const openEvalModal = (g) => {
    setSelectedEval(g); // grade 정보 저장
  };

  const closeEvalModal = () => {
    setSelectedEval(null);
  };
  const menuItems = [
    { key: "this", label: "금학기 성적 조회" },
    { key: "semester", label: "학기별 성적 조회" },
    { key: "total", label: "누계 성적" },
  ];

  useEffect(() => {
    loadData();
  }, [activeTab]);
  const loadData = async () => {
    setLoading(true);
    try {
      let res;
      if (activeTab === "this") res = await gradeApi.getThisSemester();
      else if (activeTab === "semester") res = await gradeApi.getSemester();
      else if (activeTab === "total") res = await gradeApi.getTotal();

      // 🔥 HTTP 실패일 때만 alert
      if (!res || res.status !== 200) {
        alert("데이터 불러오기에 실패했습니다");
        setData({ gradeList: [], mygradeList: [] });
        return;
      }

      const d = res.data;

      // 🔥 빈 배열도 정상 → 오류 아님
      setData({
        gradeList: d?.gradeList ?? [],
        mygradeList: d?.mygradeList ?? [],
      });
    } catch (e) {
      // 🔥 네트워크 장애 같은 진짜 오류일 때만 alert
      alert("서버 연결 오류가 발생했습니다.");
      setData({ gradeList: [], mygradeList: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="academic-page-container">
      <aside className="academic-sidebar">
        <h2>성적</h2>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={activeTab === item.key ? "active" : ""}
              onClick={() => setActiveTab(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="academic-content">
        <div className="mypage-card">
          <h2>{menuItems.find((m) => m.key === activeTab).label}</h2>

          {loading && <div className="loading-text">로딩중...</div>}
          {selectedEval && (
            <Modal onClose={closeEvalModal}>
              <EvaluationForm
                evaluationId={0} // 항상 신규 평가
                subjectId={selectedEval.subjectId} // g.subjectId 사용
                onSubmit={closeEvalModal}
              />
            </Modal>
          )}

          {!loading && data && (
            <>
              {activeTab === "this" && (
                <GradeThisSemester data={data} onEvaluate={openEvalModal} />
              )}
              {activeTab === "semester" && <GradeBySemester data={data} />}
              {activeTab === "total" && <GradeTotal data={data} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default GradePage;
