import React, { useState, useEffect } from 'react';
import { adminSubjectApi } from '../api/gradeApi';

const AdminSubjectPage = () => {
  const [list, setList] = useState([]);
  const [formData, setFormData] = useState({
    name: '', professorId: '', roomId: '', deptId: '', 
    type: '전공', subYear: '2025', semester: '1', 
    subDay: '월', startTime: '', endTime: '', grades: '', capacity: ''
  });

  useEffect(() => {
    loadList();
  }, []);

  const loadList = () => {
    adminSubjectApi.getList().then(res => setList(res.data));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminSubjectApi.insert(formData);
      alert("강의 등록 성공");
      loadList(); // 목록 갱신
      setFormData({...formData, name: ''}); // 폼 초기화 (일부만 예시)
    } catch (err) {
      alert("등록 실패");
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("삭제하시겠습니까?")) return;
    await adminSubjectApi.delete(id);
    loadList();
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1>🛠️ 강의 관리 (관리자)</h1>
      
      {/* 입력 폼 */}
      <div style={{ background: '#eee', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h3>신규 강의 등록</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <input name="name" placeholder="강의명" onChange={handleChange} required />
          <input name="professorId" placeholder="교수ID" onChange={handleChange} />
          <input name="deptId" placeholder="학과ID" onChange={handleChange} />
          <input name="roomId" placeholder="강의실" onChange={handleChange} />
          
          <select name="type" onChange={handleChange}>
            <option value="전공">전공</option><option value="교양">교양</option>
          </select>
          
          <input name="grades" placeholder="학점" type="number" onChange={handleChange} />
          <input name="capacity" placeholder="정원" type="number" onChange={handleChange} />
          
          <div style={{gridColumn: '1 / -1'}}>
            <button type="submit" style={{width: '100%', padding: '10px', background: '#28a745', color: 'white', border:'none'}}>등록하기</button>
          </div>
        </form>
      </div>

      {/* 목록 테이블 */}
      <table border="1" style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#333', color: 'white' }}>
            <th>ID</th><th>강의명</th><th>교수ID</th><th>구분</th><th>학점</th><th>정원</th><th>관리</th>
          </tr>
        </thead>
        <tbody>
          {list.map(sub => (
            <tr key={sub.id}>
              <td>{sub.id}</td>
              <td>{sub.name}</td>
              <td>{sub.professorId}</td>
              <td>{sub.type}</td>
              <td>{sub.grades}</td>
              <td>{sub.capacity}</td>
              <td>
                <button onClick={() => handleDelete(sub.id)} style={{background: 'red', color:'white', border:'none'}}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSubjectPage;