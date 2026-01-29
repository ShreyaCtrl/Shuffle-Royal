import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useJoinRoom from '../../hooks/useJoinRoom';
import useFetchProfile from '../../hooks/useFetchProfile';

const JoinRoom = () => {
    const [roomCode, setRoomCode] = useState("");
    const navigate = useNavigate();

    // 1. Get the current logged-in user's data
    const { user: profileUser, loading: profileLoading } = useFetchProfile();

    // 2. Use your custom join hook
    const { joinRoom, loading: joinLoading } = useJoinRoom();

    const handleJoinSubmit = async (e) => {
        e.preventDefault();

        if (!roomCode.trim()) return;

        // Call the hook with the code and the user's ID
        const result = await joinRoom(roomCode, profileUser?.user_id);

        if (result && result.status === "success") {
            // result.room_name should be returned by your backend
            const roomName = result.roomName || "Adventurer-Lobby";

            navigate(`/waiting-room/${roomName}`, {
                state: {
                    roomCode: roomCode,
                    userId: profileUser.user_id,
                    roomMembers: result.room_details.room_members, // Passing initial members list
                    roomId: result.roomId,
                    roomName: result.room_details.name,
                    created_at: result.room_details.created_at,
                }
            });
        }
    };

    if (profileLoading) return <p className="text-center mt-10">Verifying Identity...</p>;

    return (
        <div className="max-w-md mx-auto mt-20 px-4">
            <div className="card-primary p-8" style={{ borderBottom: "6px solid var(--theme-arcade-blue)" }}>
                <h2
                    className="text-2xl font-black uppercase text-center mb-6 italic tracking-tighter"
                    style={{ color: "var(--accent-primary)" }}
                >
                    Enter Room Code
                </h2>

                <form onSubmit={handleJoinSubmit} className="space-y-6">
                    <div className="flex flex-col">
                        <label className="text-xs uppercase font-bold mb-2 opacity-70">Secret Key</label>
                        <input
                            type="text"
                            placeholder="e.g. AB12CD"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            className="input-field text-center text-2xl font-mono tracking-widest uppercase p-4"
                            maxLength={8}
                            required
                            style={{
                                backgroundColor: "var(--input-bg)",
                                color: "var(--text-main)",
                                border: "2px solid var(--border-color)"
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={joinLoading || !roomCode}
                        className="button-primary w-full py-4 text-xl font-bold uppercase transition-all hover:scale-105 active:scale-95"
                    >
                        {joinLoading ? "Breaching Room..." : "Join Party"}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs opacity-50 uppercase tracking-widest">
                    Ensure your squad has provided the correct code.
                </p>
            </div>
        </div>
    );
};

export default JoinRoom;