import React, { useState, useEffect } from "react";
import { API_URL } from "../../../config";
import { useNotifications } from "reapop";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { notify } = useNotifications();

  // ✅ Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/profile/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.status === "success") {
          setUser(data.user);
          setForm({
            avatar: data.user.avatar || "",
            password: "",
            friends: data.user.friends?.join(", ") || "",
          });
        } else {
          notify(data.message, { status: "error" });
        }
      } catch (err) {
        notify("❌ Failed to fetch profile :", err, { status: "error" });
      }
    };
    fetchProfile();
  }, [notify]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Save profile changes
  const handleSave = async () => {
    try {
      const payload = {
        avatar: form.avatar,
        password: form.password,
        friends: form.friends
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
      };

      const res = await fetch(`${API_URL}/profile/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await res.json();

      if (data.status === "success") {
        notify("✅ Profile updated successfully!", { status: "success" });
        setUser(data.user);
        setIsEditing(false);
      } else {
        notify(`❌ ${data.message}`, { status: "error" });
      }
    } catch (err) {
      notify("❌ Error updating profile",err, { status: "error" });
    }
  };

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Your Profile</h2>

      <div className="flex flex-col items-center mb-4">
        <img
          src={form.avatar || "/default-avatar.png"}
          alt="Avatar"
          className="w-24 h-24 rounded-full border mb-2"
        />
        {isEditing && (
          <input
            type="text"
            name="avatar"
            placeholder="Avatar URL"
            value={form.avatar}
            onChange={handleChange}
            className="input-field text-center"
          />
        )}
      </div>

      <div className="space-y-3">
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Total Score:</strong> {user.total_score}
        </p>
        <p>
          <strong>Games Played:</strong> {user.games_played}
        </p>
        <p>
          <strong>Games Won:</strong> {user.games_won}
        </p>
        <div>
          <strong>Friends:</strong>
          {isEditing ? (
            <input
              type="text"
              name="friends"
              placeholder="Enter usernames separated by commas"
              value={form.friends}
              onChange={handleChange}
              className="input-field w-full mt-1"
            />
          ) : (
            <ul className="ml-4 list-disc">
              {user.friends?.length ? (
                user.friends.map((f) => <li key={f}>{f}</li>)
              ) : (
                <p className="text-muted">No friends added yet</p>
              )}
            </ul>
          )}
        </div>

        {isEditing && (
          <div>
            <strong>Change Password:</strong>
            <input
              type="password"
              name="password"
              placeholder="New password"
              value={form.password}
              onChange={handleChange}
              className="input-field w-full mt-1"
            />
          </div>
        )}
      </div>

      <div className="flex justify-center mt-6">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="button-primary mr-2 px-4 py-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="button-secondary px-4 py-2"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="button-primary px-6 py-2"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
