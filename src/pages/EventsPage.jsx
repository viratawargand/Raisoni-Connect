// src/pages/EventsPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", date: "", description: "" });

  const load = async () => {
    const { data } = await api.get("/api/events");
    setEvents(data);
  };

  useEffect(() => {
    load();
  }, []);

  const addEvent = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/api/events", form);
    setEvents((prev) => [data, ...prev]);
    setForm({ title: "", date: "", description: "" });
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Add Event</h2>
        <form onSubmit={addEvent} className="grid md:grid-cols-3 gap-3">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="date"
            className="border rounded-lg px-3 py-2"
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
        {events.map((ev) => (
          <div key={ev._id} className="bg-white rounded-xl shadow p-4">
            <div className="text-lg font-semibold">{ev.title}</div>
            <div className="text-sm text-gray-500">{ev.date}</div>
            <p className="mt-2 text-gray-700">{ev.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
