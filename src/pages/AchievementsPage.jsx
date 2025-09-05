// src/pages/AchievementsPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function AchievementsPage({ user }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", date: "" });

  const load = async () => {
    const { data } = await api.get(`/api/achievements/${user.regNo}`);
    setItems(data);
  };

  useEffect(() => {
    if (user?.regNo) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.regNo]);

  const addAchievement = async (e) => {
    e.preventDefault();
    const payload = { ...form, regNo: user.regNo };
    const { data } = await api.post("/api/achievements", payload);
    setItems((prev) => [data, ...prev]);
    setForm({ title: "", description: "", date: "" });
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Add Achievement</h2>
        <form onSubmit={addAchievement} className="grid md:grid-cols-3 gap-3">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Date (e.g., 2025-08-20)"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <input
            className="border rounded-lg px-3 py-2 md:col-span-1 col-span-3"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Save
          </button>
        </form>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {items.map((a) => (
          <div key={a._id} className="bg-white rounded-xl shadow p-4">
            <div className="text-lg font-semibold">{a.title}</div>
            <div className="text-sm text-gray-500">{a.date}</div>
            <p className="mt-2 text-gray-700">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
