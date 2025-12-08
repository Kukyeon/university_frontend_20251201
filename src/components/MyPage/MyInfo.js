import { useState } from "react";
import api from "../../api/axiosConfig";

const MyInfo = ({ user, userData, setUserData, role }) => {
  const [editMode, setEditMode] = useState(false); // 수정 모드
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = async () => {
    try {
      const res = await api.put("/user/update", userData);
      alert("저장 완료! (API 연결 전 임시 기능)");
      setEditMode(false);
      setUserData(res.data);
    } catch (err) {
      console.error(err);
      alert("저장 실패: " + err.response?.data || err.message);
    }
  };
  return (
    <section className="mypage-card">
      <h3>내 정보 조회</h3>
      <table>
        <tbody>
          {role === "student" ? (
            <>
              <tr>
                <td>학번</td>
                <td>{userData?.id}</td>
                <td>소속</td>
                <td>{userData?.department?.name}</td>
              </tr>
              <tr>
                <td>학년</td>
                <td>{userData?.grade}</td>
                <td>학기</td>
                <td>{userData?.semester}</td>
              </tr>
              <tr>
                <td>입학일</td>
                <td>{userData?.entranceDate}</td>
                <td>졸업(예정)일</td>
                <td>{userData?.graduationDate || "-"}</td>
              </tr>
              <tr>
                <td>이름</td>
                <td>{userData?.name}</td>
                <td>생년월일</td>
                <td>{userData?.birthDate}</td>
              </tr>
              <tr>
                <td>성별</td>
                <td>{userData?.gender}</td>
                <td>이메일</td>
                <td>
                  {editMode ? (
                    <input
                      name="email"
                      value={userData?.email}
                      onChange={handleChange}
                    />
                  ) : (
                    userData?.email
                  )}
                </td>
              </tr>
              <tr>
                <td>연락처</td>
                <td>
                  {editMode ? (
                    <input
                      name="tel"
                      value={userData?.tel}
                      onChange={handleChange}
                    />
                  ) : (
                    userData?.tel
                  )}
                </td>
                <td>주소</td>
                <td>
                  {editMode ? (
                    <input
                      name="address"
                      value={userData?.address}
                      onChange={handleChange}
                    />
                  ) : (
                    userData?.address
                  )}
                </td>
              </tr>
            </>
          ) : (
            <>
              <tr>
                <td>ID</td>
                <td>{userData?.id}</td>
                <td>소속</td>
                <td>
                  {userData?.department?.college.name}{" "}
                  {userData?.department?.name}
                </td>
              </tr>
              <tr>
                <td>성명</td>
                <td>{userData?.name}</td>
                <td>생년월일</td>
                <td>{userData?.birthDate}</td>
              </tr>
              <tr>
                <td>성별</td>
                <td>{userData?.gender}</td>
                <td>주소</td>
                <td>{userData?.address}</td>
              </tr>
              <tr>
                <td>연락처</td>
                <td>{userData?.tel}</td>
                <td>email</td>
                <td>{userData?.email}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        {editMode ? (
          <>
            <button onClick={handleSave}>저장</button>
            <button onClick={() => setEditMode(false)}>취소</button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)}>수정</button>
        )}
      </div>

      {/* 학적 변동 내역 */}
      <h4 style={{ marginTop: "30px" }}>학적 변동 내역</h4>
      <table>
        <thead>
          <tr>
            <th>변동 일자</th>
            <th>변동 구분</th>
            <th>세부</th>
            <th>승인 여부</th>
            <th>복학 예정 연도/학기</th>
          </tr>
        </thead>
        <tbody>
          {userData?.academicChanges?.map((change, idx) => (
            <tr key={idx}>
              <td>{change.date}</td>
              <td>{change.type}</td>
              <td>{change.detail}</td>
              <td>{change.approval}</td>
              <td>{change.returnSemester}</td>
            </tr>
          ))}
          {!userData?.academicChanges?.length && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                학적 변동 내역이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};
export default MyInfo;
