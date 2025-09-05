// src/pages/NetworkPage.jsx
import React from "react";

const demo = [
  { name: "Aarav Kulkarni", branch: "CSE", grad: "2026" },
  { name: "Sneha Sharma", branch: "IT", grad: "2025" },
  { name: "Rohit Patil", branch: "ENTC", grad: "2024" },
];

export default function NetworkPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-3 gap-4">
      {demo.map((p) => (
        <div key={p.name} className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/60?img=11"
              alt={p.name}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-600">
                {p.branch} • Batch {p.grad}
              </div>
            </div>
          </div>
          <button className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-lg">
            Connect
          </button>
        </div>
      ))}
    </div>
  );
}
