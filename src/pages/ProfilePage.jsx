// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function ProfilePage({ user }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/api/users/${user.regNo}`);
      setProfile(data || user);
    };
    if (user?.regNo) load();
  }, [user]);

  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex gap-4 items-center">
          <img
            src="https://i.pravatar.cc/80?img=8"
            alt="avatar"
            className="h-16 w-16 rounded-full"
          />
          <div>
            <div className="text-2xl font-bold">
              {profile.firstName} {profile.lastName}
            </div>
            <div className="text-gray-600">{profile.email}</div>
            <div className="text-gray-600">Reg No: {profile.regNo}</div>
            {profile.mobile && (
              <div className="text-gray-600">Mobile: {profile.mobile}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
