import React, { useState, useEffect } from "react";
import { gradeApi } from "../api/gradeApi";

const GradePage = () => {
  const [activeTab, setActiveTab] = useState("this"); // this, semester, total
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

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

      setData(res.data);
    } catch {
      alert("데이터 로딩 실패");
    } finally {
      setLoading(false);
    }
  };

  const table = (thead, tbody) => (
    <table className="styled-table">
      <thead>
        <tr>
          {thead.map((h, i) => (
            <th key={i}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{tbody}</tbody>
    </table>
  );

  return (
    <div className="academic-page-container">
      {/* 사이드바 */}
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

          {!loading && data && (
            <>
              {/* 금학기 성적 */}
              {activeTab === "this" && (
                <div>
                  {table(
                    ["과목명", "이수학점", "성적", "등급"],
                    data.gradeList?.length ? (
                      data.gradeList.map((g, idx) => (
                        <tr key={idx}>
                          <td>{g.name}</td>
                          <td>{g.grades}</td>
                          <td>{g.grade || "-"}</td>
                          <td>{g.gradeValue || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="empty-row">
                          이번 학기 성적이 없습니다.
                        </td>
                      </tr>
                    )
                  )}
                </div>
              )}

              {/* 학기별 성적 */}
              {activeTab === "semester" && (
                <div>
                  {table(
                    ["연도", "학기", "과목명", "구분", "학점", "성적"],
                    data.gradeList?.length ? (
                      data.gradeList.map((g, idx) => (
                        <tr key={idx}>
                          <td>{g.subYear}</td>
                          <td>{g.semester}</td>
                          <td>{g.name}</td>
                          <td>{g.type}</td>
                          <td>{g.grades}</td>
                          <td>{g.grade}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="empty-row">
                          성적 데이터가 없습니다.
                        </td>
                      </tr>
                    )
                  )}
                </div>
              )}

              {/* 누계 성적 */}
              {activeTab === "total" && (
                <div>
                  {table(
                    ["연도", "학기", "신청학점", "취득학점", "평점평균"],
                    data.mygradeList?.length ? (
                      data.mygradeList.map((mg, idx) => (
                        <tr key={idx}>
                          <td>{mg.subYear}</td>
                          <td>{mg.semester}</td>
                          <td>{mg.sumGrades}</td>
                          <td>{mg.myGrades}</td>
                          <td>{mg.averageScore}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="empty-row">
                          누계 성적 정보가 없습니다.
                        </td>
                      </tr>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default GradePage;
