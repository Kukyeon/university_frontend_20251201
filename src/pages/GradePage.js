import React, { useState, useEffect } from "react";
import { gradeApi } from "../api/gradeApi";
import GradeThisSemester from "../components/Grade/GradeThisSemester";
import GradeBySemester from "../components/Grade/GradeBySemester";
import GradeTotal from "../components/Grade/GradeTotal";
import EvaluationForm from "../components/Evaluation/EvaluationForm";
import Modal from "../components/Modal";
import api from "../api/axiosConfig";

const GradePage = () => {
  const [activeTab, setActiveTab] = useState("this"); // this, semester, total
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedEval, setSelectedEval] = useState(null);
  const [year, setYear] = useState(2025);
  const [semester, setSemester] = useState(1);
  const [type, setType] = useState("");

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

  const loadData = async () => {
    setLoading(true);
    try {
      let res;

      if (activeTab === "this") {
        res = await api.get("/grade/thisSemester", {
          params: { year: 2025, semester: 1 }, // 🔥 필요하면 바꿔도 됨
        });
      } else if (activeTab === "semester") {
        res = await api.get("/grade/semester", {
          params: { year, semester, type },
        });
        console.log(res);
      } else if (activeTab === "total") {
        res = await api.get("/grade/total");
      }

      if (res.status === 200) {
        setData({
          gradeList: res.data.gradeList ?? [],
          mygradeList: res.data.mygradeList ?? [],
        });
      } else {
        alert("데이터 로드 실패");
        setData({ gradeList: [], mygradeList: [] });
      }
    } catch (error) {
      alert("서버 연결 오류가 발생했습니다.");
      setData({ gradeList: [], mygradeList: [] });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, [activeTab, year, semester, type]);
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
                onSubmit={() => {
                  closeEvalModal();
                  loadData(); // ★★★ 평가 후 바로 다시 성적 조회
                }}
              />
            </Modal>
          )}

          {!loading && data && (
            <>
              {activeTab === "this" && (
                <GradeThisSemester data={data} onEvaluate={openEvalModal} />
              )}
              {activeTab === "semester" && (
                <>
                  <div
                    className="filter-box"
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "20px",
                    }}
                  >
                    {/* 연도 선택 */}
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                    >
                      <option value="2023">2023년</option>
                      <option value="2024">2024년</option>
                      <option value="2025">2025년</option>
                    </select>

                    {/* 학기 선택 */}
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                    >
                      <option value="1">1학기</option>
                      <option value="2">2학기</option>
                    </select>

                    {/* 구분 선택 */}
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="">전체</option>
                      <option value="전공">전공</option>
                      <option value="교양">교양</option>
                    </select>

                    <button onClick={loadData}>조회</button>
                  </div>
                  <GradeBySemester data={data} />
                </>
              )}
              {activeTab === "total" && <GradeTotal data={data} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default GradePage;
