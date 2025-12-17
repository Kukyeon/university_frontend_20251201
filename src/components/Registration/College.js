import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useModal } from "../ModalContext";

const College = () => {
  const [colleges, setColleges] = useState([]);
  const [newCollegeName, setNewCollegeName] = useState("");
  const { showModal } = useModal();
  useEffect(() => {
    getList();
  }, []);
  const getList = async () => {
    try {
      const res = await api.get("/admin/college");
      const data =
        res.data.content || (Array.isArray(res.data) ? res.data : [res.data]);
      setColleges(data);
    } catch (err) {
      console.error(err);
      setColleges([]);
      showModal({
        type: "alert",
        message: "단과대 목록을 불러오는데 실패했습니다.",
      });
    }
  };
  const handleAddCollege = async () => {
    if (!newCollegeName) return;
    try {
      const res = await api.post("/admin/college", { name: newCollegeName });
      showModal({
        type: "alert",
        message: `${newCollegeName}를 등록히였습니다.`,
      });
      setNewCollegeName("");
      getList(); // 등록 후 리스트 갱신
    } catch (err) {
      console.error(err);
      showModal({
        type: "alert",
        message: "단과대 등록에 실패했습니다.",
      });
    }
  };

  const handleDeleteCollege = async (id, name) => {
    showModal({
      type: "confirm",
      message: `${name}을 삭제 하시겠습니까?`,
      onConfirm: async () => {
        try {
          await api.delete(`/admin/college/${id}`);
          showModal({
            type: "alert",
            message: "단과대를 삭제하였습니다.",
          });
          getList(); // 삭제 후 리스트 갱신
        } catch (err) {
          showModal({
            type: "alert",
            message: "단과대 삭제에 실패하였습니다.",
          });
        }
      },
    });
  };

  return (
    <>
      <h3>단과대학 관리</h3>
      <div className="department-form">
        <input
          type="text"
          placeholder="신규 단과대학 이름"
          value={newCollegeName}
          onChange={(e) => setNewCollegeName(e.target.value)}
        />
        <button onClick={handleAddCollege}>등록</button>
      </div>

      <div className="table-wrapper">
        <table className="course-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {colleges.map((college) => (
              <tr key={college.id}>
                <td>{college.id}</td>
                <td>{college.name}</td>
                <td>
                  <button
                    onClick={() =>
                      handleDeleteCollege(college.id, college.name)
                    }
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default College;
