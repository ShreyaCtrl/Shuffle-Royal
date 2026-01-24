// import React, { useState, useEffect } from "react";
// import { API_URL } from "../../../config";
// import { useNotifications } from "reapop";
// // Import the custom hook
// import useRoomLeaderboard from "../../hooks/useRoomLeaderboard";

// export default function ProfilePage() {
//   const [user, setUser] = useState(null);
//   const [form, setForm] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const { notify } = useNotifications();

//   // Assuming you want to see the leaderboard for a specific room
//   // (e.g., passed from a parent or stored in the user object)
//   // For this example, we use a placeholder roomId from the user data if available
//   // const roomId = user?.active_room_id || "16075237-0890-4476-9d4a-3d37e2c0e9a2";
//   const {
//     roomsData: leaderboard,
//     loading: leaderboardLoading,
//     refreshAll: refreshLeaderboard,
//   } = useRoomLeaderboard();
//     // leaderboard,
//     // loading: leaderboardLoading,
//     // refreshLeaderboard,
//   // } = useRoomLeaderboard(roomId);

//   // ✅ Fetch user profile from backend
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch(`${API_URL}/profile/me`, {
//           credentials: "include",
//         });
//         const data = await res.json();
//         if (data.status === "success") {
//           setUser(data.user);
//           setForm({
//             avatar: data.user.avatar || "",
//             password: "",
//             friends: data.user.friends?.join(", ") || "",
//           });
//         } else {
//           notify(data.message, { status: "error" });
//         }
//       } catch (err) {
//         console.error("Profile fetch error:", err);
//         notify("❌ Failed to fetch profile", { status: "error" });
//       }
//     };
//     fetchProfile();
//   }, [notify]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSave = async () => {
//     try {
//       const payload = {
//         avatar: form.avatar,
//         password: form.password,
//         friends: form.friends
//           .split(",")
//           .map((f) => f.trim())
//           .filter((f) => f),
//       };

//       const res = await fetch(`${API_URL}/profile/update`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//         credentials: "include",
//       });
//       const data = await res.json();

//       if (data.status === "success") {
//         notify("✅ Profile updated successfully!", { status: "success" });
//         setUser(data.user);
//         setIsEditing(false);
//       } else {
//         notify(`❌ ${data.message}`, { status: "error" });
//       }
//     } catch (err) {
//       console.error("Profile update error:", err);
//       notify("❌ Error updating profile", { status: err });
//     }
//   };

//   if (!user) return <p className="text-center mt-10">Loading profile...</p>;

//   return (
//     <div className="max-w-2xl mx-auto space-y-6 mt-10 px-4">
//       {/* --- Profile Card --- */}
//       <div className="card-primary p-6">
//         <h2
//           className="text-2xl text-uppercase text-center mb-6 font-bold"
//           style={{ color: "var(--theme-quest-purple)" }}
//         >
//           Your Profile
//         </h2>
//         <div className="flex flex-col items-center mb-6">
//           <div className="relative">
//             <img
//               src={form.avatar || "/default-avatar.png"}
//               alt="Avatar"
//               className="w-32 h-32 rounded-lg border-4 shadow-md object-cover"
//               style={{ borderColor: "var(--card-accent-purple)" }}
//               // className="w-24 h-24 rounded-full border mb-2 object-cover"
//             />
//           </div>
//           {isEditing && (
//             <input
//               type="text"
//               name="avatar"
//               placeholder="Avatar URL"
//               value={form.avatar}
//               onChange={handleChange}
//               className="border p-2 rounded w-full max-w-xs text-center"
//             />
//           )}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
//           <div>
//             <p>
//               <strong>Username:</strong> {user.username}
//             </p>
//             <p>
//               <strong>Email:</strong> {user.email}
//             </p>
//             <p>
//               <strong>Global Score:</strong> {user.total_score}
//             </p>
//           </div>
//           <div>
//             <p>
//               <strong>Games Played:</strong> {user.games_played}
//             </p>
//             <p>
//               <strong>Games Won:</strong> {user.games_won}
//             </p>
//             <p>
//               <strong>Friends:</strong> {user.friends?.length || 0}
//             </p>
//           </div>
//         </div>

//         <div className="flex justify-center mt-6">
//           {isEditing ? (
//             <>
//               <button
//                 onClick={handleSave}
//                 className="bg-blue-600 text-white mr-2 px-4 py-2 rounded"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="bg-gray-400 text-white px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="bg-blue-600 text-white px-6 py-2 rounded"
//             >
//               Edit Profile
//             </button>
//           )}
//         </div>
//       </div>

//       {/* --- Room Leaderboard Section --- */}
//       <div
//         // className="bg-white shadow-md rounded-lg p-6"
//         className="card-primary p-8"
//         style={{ borderLeft: "6px solid var(--theme-arcade-yellow)" }}
//       >
//         <div
//           className="flex-between mb-6"
//           // className="flex justify-between items-center mb-4"
//         >
//           <h3
//             className="text-xl text-uppercase font-bold"
//             style={{ color: "var(--theme-quest-purple)" }}
//             // className="text-xl font-bold"
//           >
//             Room Rankings
//           </h3>
//           <button
//             onClick={refreshLeaderboard}
//             className="links text-bold text-sm"
//             // className="text-sm text-blue-600 hover:underline"
//             disabled={leaderboardLoading}
//             style={{ background: "none", border: "none", cursor: "pointer" }}
//           >
//             {leaderboardLoading ? "Refreshing..." : "Refresh Scores"}
//           </button>
//         </div>
//           {Object.entries(leaderboard).map(([roomId, players]) => (
//             <div key={roomId} className="mb-8">
//               <h4
//                 className="text-lg font-semibold mb-4"
//                 style={{ color: "var(--theme-arcade-blue)" }}
//               >
//                 Room ID: {roomId}
//               </h4>
//               <div
//           // className="overflow-x-auto"
//           className="overflow-x-auto rounded-md shadow-sm border"
//         >
//           <table
//             className="w-full border-collapse"
//             // className="w-full text-left border-collapse"
//           >
//             <thead>
//               <tr
//                 style={{
//                   backgroundColor: "var(--theme-space-accent)",
//                   color: "var(--theme-space-navy)",
//                 }}
//                 // className="border-b bg-gray-50"
//               >
//                 <th
//                   className="p-3 text-left"
//                   // className="p-2"
//                 >
//                   Rank
//                 </th>
//                 <th
//                   className="p-3 text-left"
//                   // className="p-2"
//                 >
//                   Player
//                 </th>
//                 <th
//                   className="p-3 text-right"
//                   // className="p-2 text-right"
//                 >
//                   Room Score
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {players.length > 0 ? (
//                 players.map((player) => (
//                   <tr
//                     key={player.username}
//                     className="border-b transition-colors"
//                     style={{
//                       backgroundColor:
//                         player.username === user.username
//                           ? "var(--theme-arcade-yellow)"
//                           : "white",
//                       color:
//                         player.username === user.username
//                           ? "var(--theme-space-navy)"
//                           : "inherit",
//                     }}
//                     // className={`border-b ${
//                     //   player.username === user.username
//                     //     ? "bg-cyan-300 font-bold"
//                     //     : ""
//                     // }`}
//                   >
//                     <td className="p-3 font-bold">#{player.rank}</td>
//                     <td className="p-2">{player.username}</td>
//                     <td
//                       className="p-2 text-right text-bold"
//                       style={{
//                         color:
//                           player.username === user.username
//                             ? "black"
//                             : "var(--card-accent-teal)",
//                       }}
//                     >
//                       {player.score}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="p-6 text-center text-muted">
//                     {leaderboardLoading
//                       ? "Loading leaderboard..."
//                       : "No scores available for this room."}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//          </div>
//             </div>
//           ))
//           }
//         {/* <div
//           // className="overflow-x-auto"
//           className="overflow-x-auto rounded-md shadow-sm border"
//         >
//           <table
//             className="w-full border-collapse"
//             // className="w-full text-left border-collapse"
//           >
//             <thead>
//               <tr
//                 style={{
//                   backgroundColor: "var(--theme-space-accent)",
//                   color: "var(--theme-space-navy)",
//                 }}
//                 // className="border-b bg-gray-50"
//               >
//                 <th
//                   className="p-3 text-left"
//                   // className="p-2"
//                 >
//                   Rank
//                 </th>
//                 <th
//                   className="p-3 text-left"
//                   // className="p-2"
//                 >
//                   Player
//                 </th>
//                 <th
//                   className="p-3 text-right"
//                   // className="p-2 text-right"
//                 >
//                   Room Score
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {leaderboard.length > 0 ? (
//                 leaderboard.map((player) => (
//                   <tr
//                     key={player.username}
//                     className="border-b transition-colors"
//                     style={{
//                       backgroundColor:
//                         player.username === user.username
//                           ? "var(--theme-arcade-yellow)"
//                           : "white",
//                       color:
//                         player.username === user.username
//                           ? "var(--theme-space-navy)"
//                           : "inherit",
//                     }}
//                     // className={`border-b ${
//                     //   player.username === user.username
//                     //     ? "bg-cyan-300 font-bold"
//                     //     : ""
//                     // }`}
//                   >
//                     <td className="p-3 font-bold">#{player.rank}</td>
//                     <td className="p-2">{player.username}</td>
//                     <td
//                       className="p-2 text-right text-bold"
//                       style={{
//                         color:
//                           player.username === user.username
//                             ? "black"
//                             : "var(--card-accent-teal)",
//                       }}
//                     >
//                       {player.score}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="p-6 text-center text-muted">
//                     {leaderboardLoading
//                       ? "Loading leaderboard..."
//                       : "No scores available for this room."}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table> */}
//         {/* </div> */}
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { API_URL } from "../../../config";
import { useNotifications } from "reapop";
import useFetchProfile from "../../hooks/useFetchProfile";
import useUserRoomsData from "../../hooks/useUserRoomsData"; // Using the "all rooms" hook
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
        password: "",
        friends: profileUser.friends?.join(", ") || "",
      });
    }
  }, [profileUser, isEditing]);
  

  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  // Fetch data for ALL rooms the user is in
  const {
    roomsData: roomsData,
    loading: leaderboardLoading,
    refreshAll: refreshLeaderboard,
  } = useUserRoomsData();

  
  // // ✅ Fetch user profile
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const res = await fetch(`${API_URL}/profile/me`, {
  //         credentials: "include",
  //       });
  //       const data = await res.json();
  //       if (data.status === "success") {
  //         setProfileUser(data.user);
  //         setForm({
  //           avatar: data.user.avatar || "",
  //           password: "",
  //           friends: data.user.friends?.join(", ") || "",
  //         });
  //       } else {
  //         notify(data.message, { status: "error" });
  //       }
  //     } catch (err) {
  //       notify("❌ Failed to fetch profile", { status: "error" });
  //     }
  //   };
  //   fetchProfile();
  // }, [notify]);

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

      {/* --- Room Leaderboard Section --- */}
        <div
          className="card-primary p-8"
          style={{ borderLeft: "6px solid var(--theme-arcade-yellow)" }}
        >
          <div className="flex-between mb-6">
            <h3
              className="text-xl text-uppercase font-bold"
              style={{ color: "var(--theme-quest-purple)" }}
            >
              Room Rankings
            </h3>
            <button
              onClick={refreshLeaderboard}
              className="links text-bold text-sm"
              disabled={leaderboardLoading}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              {leaderboardLoading ? "Consulting Oracles..." : "Refresh Scores"}
            </button>
          </div>

          {Object.keys(roomsData).length > 0 ? (
            Object.entries(roomsData).map(([roomId, roomDetails]) => (
              <div key={roomId} className="mb-8 last:mb-0">
                <h4
                  className="text-md font-semibold mb-3"
                  style={{ color: "var(--theme-arcade-blue)" }}
                >
                  🏰 Room: {roomDetails.name}...
                </h4>
                <div className="overflow-x-auto rounded-md shadow-sm border">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "var(--theme-space-accent)",
                          color: "var(--theme-space-navy)",
                        }}
                      >
                        <th className="p-3 text-left">Rank</th>
                        <th className="p-3 text-left">Player</th>
                        <th className="p-3 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roomDetails.leaderboard.map((player) => (
                        <tr
                          key={player.username}
                          className="border-b transition-colors"
                          style={{
                            backgroundColor:
                              player.username === user.username
                                ? "var(--theme-arcade-yellow)"
                                : "white",
                            color:
                              player.username === user.username
                                ? "var(--theme-space-navy)"
                                : "inherit",
                          }}
                        >
                          <td className="p-3 font-bold">#{player.rank}</td>
                          <td className="p-3">{player.username}</td>
                          <td
                            className="p-3 text-right font-bold"
                            style={{
                              color:
                                player.username === user.username
                                  ? "black"
                                  : "var(--card-accent-teal)",
                            }}
                          >
                            {player.score}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted p-4">
              You haven't joined any rooms yet!
            </p>
          )}
        </div>
    </div>
  );
}