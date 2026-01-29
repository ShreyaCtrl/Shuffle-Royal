import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom"; // Add this for navigation
import useFetchProfile from '../../hooks/useFetchProfile';
import useUserRoomsData from "../../hooks/useUserRoomsData";
import useConnectExistingLeaderboard from "../../hooks/useConnectExistingLeaderboard";
import useJoinRoom from "../../hooks/useJoinRoom";

const Scoreboard = () => {
  const navigate = useNavigate();
    const {
    user: profileUser,
    loading: profileLoading
  } = useFetchProfile();
  const {
    connectLeaderboard,
    loading: connectLoading
  } = useConnectExistingLeaderboard();
  const {
    roomsData,
    loading: leaderboardLoading,
    refreshAll: refreshLeaderboard,
  } = useUserRoomsData();
  const { loading: joinLoading, joinRoom } = useJoinRoom();

  const handleCreateRoom = async (roomId, roomName) => {
    // We assume profileUser.user_id is available from useFetchProfile
    const result = await connectLeaderboard(roomId, profileUser.user_id);

    if (result.success) {
      // Option A: Navigate using URL params (good for bookmarking)
      // Option B: Passing data via 'state' (good for sensitive or hidden data)
      console.log(result);
      navigate(`/waiting-room/${roomName}`, {
        state: {
          roomId: roomId,
          roomCode: result.roomCode,
          userId: profileUser.user_id,
          roomMembers: result.roomMembers,
        }
      });
    }
  };

  const handleJoinRoom = async (roomId, roomName) => {
    // 1. Call the joinRoom hook with correct parameters
    // Note: If your backend expects roomCode instead of roomId, change the first param
    const result = await joinRoom(roomCode, profileUser.user_id);

    // 2. The hook returns 'data' on success, which contains 'status: "success"'
    if (result && result.status === "success") {
      navigate(`/waiting-room/${roomName}`, {
        state: {
          roomId: roomId,
          roomCode: result.roomCode,
          userId: profileUser.user_id,
          // 3. Pass the updated members list from the join response
          roomMembers: result.roomMembers,
        }
      });
    }
  };

  if (profileLoading || leaderboardLoading) {
    return <p className="text-center mt-10 font-bold" style={{ color: "var(--text-main)" }}>Consulting the Oracles...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 mt-10 px-4 pb-20">
      <div className="card-primary p-8" style={{ borderLeft: "6px solid var(--theme-arcade-yellow)" }}>
        <div className="flex justify-center mb-8">
          <button onClick={() => navigate("/create-room")} className="button-primary px-10 py-3">
            Create New Room
          </button>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl uppercase font-bold" style={{ color: "var(--accent-primary)" }}>
            Room Rankings
          </h3>
          <button
            onClick={refreshLeaderboard}
            className="links font-bold text-sm"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            Refresh Scores
          </button>
        </div>

        {Object.keys(roomsData).length > 0 ? (
          Object.entries(roomsData).map(([roomId, roomDetails]) => (
            <div key={roomId} className="mb-12 last:mb-0 flex flex-col items-center">
              <div className="flex flex-row justify-between items-center">

                {/* <h4 className="text-md font-semibold mb-3 p-4" style={{ color: "var(--color-link)" }}>
                  🏰 Room: {roomDetails.name}
                </h4> */}
              </div>
              {/* <div className="flex flex-row justify-between items-center">
                <div className="mb-4 p-4">
                  <button
                    onClick={() => handleJoinRoom(roomId, roomDetails.name)}
                    className="button-primary px-8 py-2 flex justify-center"
                    disabled={connectLoading}
                  >
                    {connectLoading ? "Joining room..." : "Join Room"}
                  </button>
                </div>
                <div className="mb-4 p-4">
                  <button
                    onClick={() => handleCreateRoom(roomId, roomDetails.name)}
                    className="button-primary px-8 py-2 flex justify-center"
                    disabled={connectLoading}
                  >
                    {connectLoading ? "Creating room..." : "Create Room"}
                  </button>
                </div>
              </div> */}
              <div className="flex flex-row justify-between items-center">

                <h4 className="text-md font-semibold mb-3 p-4" style={{ color: "var(--color-link)" }}>
                  🏰 Room: {roomDetails.name}
                </h4>
                <div className="mb-4 p-4">
                  <button
                    onClick={() => handleCreateRoom(roomId, roomDetails.name)}
                    className="button-primary px-8 py-2 flex justify-center"
                    disabled={connectLoading}
                  >
                    {connectLoading ? "Creating room..." : "Create Room"}
                  </button>
                  {/* <button
                    onClick={() => handleJoinRoom(roomId, roomDetails.name)}
                    className="button-primary px-8 py-2 flex justify-center"
                    disabled={connectLoading}
                  >
                    {connectLoading ? "Joining room..." : "Join Room"}
                  </button> */}
                </div>
              </div>
              <div className="overflow-x-auto rounded-md shadow-sm border" style={{ borderColor: "var(--border-color)" }}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: "var(--input-bg)", color: "var(--text-main)" }}>
                      <th className="p-3 text-left">Rank</th>
                      <th className="p-3 text-left">Player</th>
                      <th className="p-3 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomDetails.leaderboard.map((player) => {
                      const isCurrentUser = player.username === profileUser?.username;

                      return (
                        <tr
                          key={player.username}
                          className="border-b transition-colors"
                          style={{
                            borderColor: "var(--border-color)",
                            backgroundColor: isCurrentUser ? "var(--theme-arcade-yellow)" : "transparent",
                            color: isCurrentUser ? "#000000" : "var(--text-main)",
                          }}
                        >
                          <td className="p-3 font-bold">#{player.rank}</td>

                          <td className="p-3">
                            <span
                              className="links"
                              onClick={() => navigate(`/profile/${player.username}`)}
                              style={{
                                color: isCurrentUser ? "#000000" : "var(--color-link)",
                                textDecoration: isCurrentUser ? "underline" : "none"
                              }}
                            >
                              {player.username} {isCurrentUser && "(You)"}
                            </span>
                          </td>

                          <td
                            className="p-3 text-right font-bold"
                            style={{ color: isCurrentUser ? "#000000" : "var(--accent-primary)" }}
                          >
                            {player.score}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted p-4">You haven't joined any rooms yet!</p>
        )}
      </div>
    </div>
  );
};

export default Scoreboard;