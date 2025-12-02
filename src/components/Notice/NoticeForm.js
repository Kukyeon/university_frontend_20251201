import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function NoticeForm({ editMode }) {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("[일반]");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (editMode) {
      fetch(`/api/notice/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setCategory(data.category);
          setContent(data.content);
        });
    }
  }, [editMode, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", content);
    if (file) formData.append("file", file);

    const url = editMode ? `/api/notice/${id}` : "/api/notice";
    const method = editMode ? "PUT" : "POST";

    fetch(url, { method, body: formData }).then(() => navigate("/notice"));
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="[일반]">[일반]</option>
        <option value="[학사]">[학사]</option>
        <option value="[장학]">[장학]</option>
      </select>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용"
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">{editMode ? "수정" : "등록"}</button>
    </form>
  );
}

export default NoticeForm;
