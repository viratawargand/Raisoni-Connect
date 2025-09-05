import React, { useState } from "react";

const CreatePost = ({ onAddPost }) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content && !file) return;

    const newPost = {
      id: Date.now(),
      content,
      file: file ? URL.createObjectURL(file) : null,
      fileType: file ? file.type : null,
    };

    onAddPost(newPost);
    setContent("");
    setFile(null);
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md mb-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-2 border rounded-lg resize-none focus:ring focus:ring-blue-300"
        />

        <input
          type="file"
          accept="image/,video/,.pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;