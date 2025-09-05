// src/pages/CampusesPage.jsx
import React from "react";

const campuses = [
  { name: "GH Raisoni, Pune", address: "Wagholi, Pune" },
  { name: "GH Raisoni, Nagpur", address: "Nagpur, Maharashtra" },
  { name: "GH Raisoni, Jalgaon", address: "Jalgaon, Maharashtra" },
];

export default function CampusesPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-3 gap-4">
      {campuses.map((c) => (
        <div key={c.name} className="bg-white rounded-xl shadow p-4">
          <div className="text-lg font-semibold">{c.name}</div>
          <div className="text-gray-600">{c.address}</div>
          <button className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-lg">
            View
          </button>
        </div>
      ))}
    </div>
  );
}
