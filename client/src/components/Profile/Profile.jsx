import React, { useState, useEffect } from "react";
import { API_URL } from "../../../config";
import { useNotifications } from "reapop";
import useFetchProfile from "../../hooks/useFetchProfile";
import useUpdateProfile from "../../hooks/useUpdateProfile";


export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: "", avatar: "", password: "", friends: "" });
  const [isEditing, setIsEditing] = useState(false);
  const { notify } = useNotifications();
  const {
    updateProfile,
    updating
  } = useUpdateProfile();
  const {
    user: profileUser,
    setUser: setProfileUser,
    loading: refreshProfile
  } = useFetchProfile();

  useEffect(() => {
    if (profileUser) {
      setUser(profileUser);
      setForm({
        username: profileUser.username,
        avatar: profileUser.avatar,
        // The password here is hashed change it to include the password without hash
        password: profileUser.password,
        friends: profileUser.friends?.join(", ") || "",
      });
    }
  }, [profileUser, isEditing]);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const result = await updateProfile(form);
    
    if (result.success) {
      setUser(result.user);
      setIsEditing(false);
    }
  };

  if (!user)
    return (
      <p className="text-center mt-10 font-bold">Summoning your profile...</p>
    );

  return (
    <div className="max-w-2xl mx-auto space-y-8 mt-10 px-4 pb-20">
      {/* --- Profile Card --- */}
      <div className="card-primary p-6">
        <h2
          className="text-2xl text-uppercase text-center mb-6 font-bold"
          style={{ color: "var(--accent-primary)" }}
        >
          Your Profile
        </h2>

        <div className="flex flex-col items-center mb-6">
          <img
            src={form.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-32 h-32 rounded-lg border-4 shadow-md object-cover"
            style={{ borderColor: "var(--card-accent-purple)" }}
          />
          {isEditing && (
            <input
              type="text"
              name="avatar"
              placeholder="Avatar URL"
              value={form.avatar}
              onChange={handleChange}
              className="input-field mt-4 text-center max-w-xs p-2"
            />
          )}
        </div>

        <div className="flex flex-col text-sm md:text-base">
          {isEditing ? (
            <>
              <p className="p-2 text-xl">
              <strong>Username:</strong> 
              </p>
              
                <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="input-field mt-4 text-center max-w-xs p-2"
              />
              <p className="p-2 text-xl">
              <strong>Password:</strong>
            </p>
            <input
              type="text"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="input-field mt-4 text-center max-w-xs p-2 "
            />
            {/* <input
              type="text"
              name="friends"
              placeholder="Friends (comma separated)"
              value={form.friends}
              onChange={handleChange}
              className="input-field mt-4 text-center max-w-xs p-2 text-yellow-500"
              /> */}
              <p className="p-2 text-xl">
              <strong>Games Played:</strong> {user.games_played}
            </p>
            <p className="p-2 text-xl">
              <strong>Games Won:</strong> {user.games_won}
            </p>
              </>
          ) : (
              <>
                <p className="p-2 text-xl">
              <strong>Username:</strong> {user.username}
                </p>
                <p className="p-2 text-xl">
              <strong>Password:</strong> {(user.password)? "********" : ""}
            </p>  
              <p className="p-2 text-xl">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="p-2 text-xl">
              <strong>Games Played:</strong> {user.games_played}
            </p>
            <p className="p-2 text-xl">
              <strong>Games Won:</strong> {user.games_won}
            </p>
            <p className="p-2 text-xl">
              <strong>Friends:</strong> {user.friends?.length || 0}
            </p>
              </>
            )}
            
            
        </div>

        <div className="flex justify-center mt-6 gap-3">
          {isEditing ? (
            <>
              <button onClick={handleSave} disabled={updating} className="button-primary px-6 py-2">
                {updating ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="button-secondary px-6 py-2"
                style={{ backgroundColor: "var(--theme-arcade-red)" }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="button-primary px-8 py-2"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}