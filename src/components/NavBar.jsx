// src/components/NavBar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function NavBar({ user, onLogout }) {
  const navigate = useNavigate();

  const link =
    "px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100";
  const active =
    "px-3 py-2 rounded-md text-sm font-semibold text-blue-600 bg-blue-50";

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="https://rgicdn.s3.ap-south-1.amazonaws.com/ghrcempune/images/new-theme/logo.png"
            alt="Raisoni"
            className="h-8"
          />
          <div className="text-xl font-bold text-blue-700">RaisoniConnect</div>
          <input
            className="ml-6 hidden md:block border rounded-lg px-3 py-1.5 w-80"
            placeholder="Search Raisoni students, alumni, clubs..."
          />
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/feed"
            className={({ isActive }) => (isActive ? active : link)}
          >
            Feed
          </NavLink>
          <NavLink
            to="/network"
            className={({ isActive }) => (isActive ? active : link)}
          >
            Network
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) => (isActive ? active : link)}
          >
            Events
          </NavLink>
          <NavLink
            to="/achievements"
            className={({ isActive }) => (isActive ? active : link)}
          >
            Achievements
          </NavLink>
          <NavLink
            to="/campuses"
            className={({ isActive }) => (isActive ? active : link)}
          >
            Campuses
          </NavLink>

          <div className="h-6 w-px bg-gray-200 mx-2" />

          <button
            className="text-sm text-gray-700 hover:underline"
            onClick={() => navigate("/profile")}
            title="Profile"
          >
            {user?.firstName ? user.firstName : "Profile"}
          </button>

          <button
            onClick={() => {
              onLogout?.();
              navigate("/login", { replace: true });
            }}
            className="ml-2 text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
