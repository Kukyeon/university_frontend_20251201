import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createNotice,
  updateNotice,
  getNoticeDetail,
} from "../../api/noticeApi";

const NoticeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "[일반]",
    imageUrl: "",
  });
  const [file, setFile] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  useEffect(() => {
    if (id) {
      getNoticeDetail(id).then((data) =>
        setForm({
          title: data.title,
          content: data.content,
          category: data.category,
          imageUrl: data.imageUrl || "",
        })
      );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. FormData 객체 생성
    const formData = new FormData();

    // 2. 텍스트 데이터 추가
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("category", form.category);

    // 3. 파일 데이터 추가 (백엔드 NoticeFormDto의 필드 이름인 'file'로 매핑)
    if (file) {
      formData.append("file", file);
    }

    // 4. API 호출 (FormData를 직접 전송)
    if (id) {
      // 수정 시에도 파일이 있다면 FormData로 전송해야 합니다.
      await updateNotice(id, formData);
    } else {
      await createNotice(formData);
    }

    navigate("/notice");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? "공지 수정" : "공지 등록"}</h2>

      <select name="category" value={form.category} onChange={handleChange}>
        <option value="[일반]">[일반]</option>
        <option value="[학사]">[학사]</option>
        <option value="[장학]">[장학]</option>
      </select>

      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="제목"
      />

      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="내용"
      />

      <input
        type="file"
        name="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <button type="submit">{id ? "수정완료" : "등록"}</button>
      <button onClick={() => navigate("/notice")}>취소</button>
    </form>
  );
};

export default NoticeForm;
