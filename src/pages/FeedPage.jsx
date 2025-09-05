import React, { useEffect, useState } from "react";
import api from "../api";
import axios from "axios";

export default function FeedPage({ user }) {
  const [posts, setPosts] = useState([]);
  const [newText, setNewText] = useState("");
  const [file, setFile] = useState(null);

  // Get token from localStorage (assuming you store it there after login)
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Create axios instance with auth headers
  const authenticatedAxios = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  const load = async () => {
    try {
      const { data } = await authenticatedAxios.get("/api/posts");
      setPosts(data);
    } catch (error) {
      console.error("Failed to load posts:", error);
      // Handle token expiry - redirect to login if needed
      if (error.response?.status === 401) {
        // Token expired or invalid - redirect to login
        localStorage.removeItem('token');
        // You might want to redirect to login page here
      }
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submitPost = async (e) => {
    e.preventDefault();

    if (!newText.trim() && !file) {
      alert("Please enter some content or select a file");
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('content', newText);
      if (file) {
        formData.append('file', file);
      }

      const response = await axios.post(
        "http://localhost:5000/api/posts", 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log("✅ Post Created:", response.data);
      
      // Reset form
      setNewText("");
      setFile(null);
      
      // Reload posts to show the new one
      load();
    } catch (err) {
      console.error("❌ Post Creation Error:", err.response?.data || err.message);
    }
  };

  const likePost = async (id) => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/posts/${id}/like`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      );
      // Reload posts to get updated like count
      load();
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const commentPost = async (id, text) => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/posts/${id}/comment`,
        { text },
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      );
      // Reload posts to get updated comments
      load();
    } catch (error) {
      console.error("Failed to comment on post:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Create Post */}
      <div className="bg-white rounded-xl shadow p-4">
        <textarea
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Share something..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
          className="mt-2"
        />
        <button
          onClick={submitPost}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Post
        </button>
      </div>

      {/* Feed */}
      <div className="mt-6 space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold">{post.userId?.name || 'Unknown User'}</div>
            <div className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </div>
            <div className="mt-2">{post.content}</div>

            {/* Media Preview */}
            {post.fileUrl && (
              <div className="mt-2">
                {/* Detect file type based on extension or implement server-side type detection */}
                {post.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) && (
                  <img
                    src={`http://localhost:5000${post.fileUrl}`}
                    alt=""
                    className="mt-2 rounded-lg max-w-full"
                  />
                )}
                {post.fileUrl.match(/\.(mp4|webm|ogg)$/i) && (
                  <video controls className="mt-2 rounded-lg max-w-full">
                    <source
                      src={`http://localhost:5000${post.fileUrl}`}
                      type="video/mp4"
                    />
                  </video>
                )}
                {post.fileUrl.match(/\.(pdf|doc|docx|txt)$/i) && (
                  <a
                    href={`http://localhost:5000${post.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline mt-2 inline-block"
                  >
                    📄 View Document
                  </a>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-3 text-sm text-gray-600">
              <button onClick={() => likePost(post._id)}>
                👍 Like ({post.likes?.length || 0})
              </button>
              <button>💬 Comment ({post.comments?.length || 0})</button>
              <button>↗ Share</button>
            </div>

            {/* Comments */}
            <div className="mt-2 space-y-1">
              {post.comments?.map((c, i) => (
                <div key={i} className="text-sm">
                  <span className="font-semibold">{c.userId?.name || 'Unknown User'}</span>: {c.text}
                  <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
                </div>
              ))}
              <input
                className="w-full border px-2 py-1 mt-2 text-sm rounded"
                placeholder="Write a comment..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    commentPost(post._id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}