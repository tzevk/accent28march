'use client';

import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    username: '',
    role: '',
    permissions: {},
  });

  useEffect(() => {
    const username = localStorage.getItem('username') || '';
    const role = localStorage.getItem('userRole') || '';
    const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');

    setProfile({ username, role, permissions });
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">User Profile</h2>

      <div className="mb-4">
        <label className="block font-semibold">Username</label>
        <p className="text-gray-700">{profile.username}</p>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Role</label>
        <p className="text-gray-700 capitalize">{profile.role}</p>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Permissions</label>
        <div className="bg-gray-100 p-4 rounded-md text-sm">
          {Object.keys(profile.permissions).length === 0 ? (
            <p>No permissions assigned.</p>
          ) : (
            Object.entries(profile.permissions).map(([module, perms]) => (
              <div key={module} className="mb-2">
                <strong className="capitalize">{module}</strong>:{" "}
                {Object.entries(perms)
                  .filter(([, allowed]) => allowed)
                  .map(([key]) => key)
                  .join(", ") || "None"}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Edit Profile
        </button>
      </div>
    </div>
  );
}