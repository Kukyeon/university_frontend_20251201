import React, { useState, useEffect } from "react";
import {
  createNotice,
  updateNotice,
  getNoticeDetail,
} from "../../api/noticeApi";

const NoticeForm = ({ id, onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "[일반]",
    file: null,
  });

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const data = await getNoticeDetail(id);
        setForm({ ...data, file: null });
      };
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") setForm((f) => ({ ...f, file: files[0] }));
    else setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) await updateNotice(id, form);
    else await createNotice(form);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <input type="file" name="file" onChange={handleChange} />
      <button type="submit">저장</button>
    </form>
  );
};

export default NoticeForm;
