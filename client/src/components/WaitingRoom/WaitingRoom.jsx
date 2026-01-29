import { useParams, useLocation } from "react-router-dom";
import { gameSocket } from "../../utils/Socket";
import { useEffect, useState } from "react";
import { useNotifications } from "reapop";
// import useConnectExistingLeaderboard from "../../hooks/useConnectExistingLeaderboard";

const WaitingRoom = () => {
    const { roomName } = useParams(); // Gets the ID from the URL string
    const location = useLocation();
    const { notify } = useNotifications();
    // const { connectLeaderboard, loading } = useConnectExistingLeaderboard();

    // Access the state we passed in the navigate function
    const roomId = location.state?.roomId;
    const userId = location.state?.userId;
    const roomCode = location.state?.roomCode;
    const roomMembers = location.state?.roomMembers;
    const [partyMembers, setPartyMembers] = useState(location.state?.roomMembers || []);

    useEffect(() => {
        if (!roomId) return;

        // 1. Tell the backend this specific browser tab belongs to this Room ID
        // You need a @socketio.on("join_room_socket") event in your Flask app
        gameSocket.emit("join_room_socket", { room_id: roomId });

        // 2. Listen for updates
        gameSocket.on("player_joined", (newMember) => {
            setPartyMembers((prev) => {
                const exists = prev.find(m => m.user_id === newMember.user_id);
                if (exists) {
                    notify(`${newMember.username} has joined the party`, "success");
                    return prev.map(m => m.user_id === newMember.user_id ? { ...m, status: "active" } : m);
                }
                return [...prev, newMember];
            });
        });

        return () => {
            gameSocket.off("player_joined");
        };
    }, [roomId]);

    return (
        <div className="max-w-2xl mx-auto space-y-8 mt-10 px-4 pb-20">
            {/* --- Lobby Container --- */}
            <div
                className="card-primary p-8"
                style={{ borderTop: "6px solid var(--theme-arcade-yellow)" }}
            >
                {/* --- Header: Room Identity --- */}
                <div className="text-center mb-8">
                    <h2
                        className="text-3xl font-bold uppercase tracking-widest mb-2"
                        style={{ color: "var(--accent-primary)" }}
                    >
                        🏰 {roomName}
                    </h2>
                    <p className="opacity-70 text-sm italic">
                        Waiting for adventurers to assemble...
                    </p>
                </div>

                {/* --- Admin & Share Code Section --- */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 rounded-lg"
                    style={{ backgroundColor: "var(--input-bg)", border: "1px solid var(--border-color)" }}
                >
                    <div className="flex flex-col justify-center items-center md:items-start">
                        <span className="text-xs uppercase opacity-60">Dungeon Master</span>
                        <span className="font-bold text-lg" style={{ color: "var(--color-link)" }}>
                            {roomMembers.find((m) => m.user_id === userId)?.username || "Unknown"}
                        </span>
                    </div>

                    {roomCode && (
                        <div className="flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4"
                            style={{ borderColor: "var(--border-color)" }}>
                            <span className="text-xs uppercase opacity-60">Share Code</span>
                            <span className="text-2xl font-mono font-black tracking-widest"
                                style={{ color: "var(--theme-arcade-yellow)" }}>
                                {roomCode}
                            </span>
                        </div>
                    )}
                </div>

                {/* --- Member List --- */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase opacity-50 px-1">Current Party</h3>

                    {partyMembers.map((member) => {
                        const isMe = member.user_id === userId;
                        return (
                            <div
                                key={member.user_id}
                                className="flex items-center justify-between p-4 rounded-md transition-all duration-200"
                                style={{
                                    backgroundColor: isMe ? "var(--theme-)" : "var(--bg-card)",
                                    border: "1px solid var(--border-color)",
                                    color: isMe ? "#ffffff" : "var(--text-main)",
                                    transform: isMe ? "scale(1.02)" : "scale(1)"
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="font-bold opacity-60">#{member.rank}</span>
                                    <span className={`font-bold ${isMe ? 'text-white' : ''}`}>
                                        {member.username} {isMe && "(You)"}
                                    </span>
                                </div>

                                <div className="text-right">
                                    <span className="text-xs block opacity-70 uppercase">Score</span>
                                    <span className="font-mono font-bold " style={{ color: isMe ? "#ffffff" : "var(--card-accent-teal)" }}>
                                        {member.overall_room_score}
                                    </span>
                                    <span className="text-xs block opacity-70 uppercase" style={{ color: "var(--theme-arcade-teal)"}}>{member.status}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* --- Footer Action --- */}
                <div className="mt-10 flex flex-col items-center gap-4">
                    <button className="button-primary w-full py-4 text-xl font-black italic tracking-tighter uppercase transition-transform active:scale-95">
                        Start Quest
                    </button>
                    <button
                        className="links text-sm uppercase opacity-60"
                        style={{ background: 'none', border: 'none' }}
                    >
                        Leave Room
                    </button>
                </div>
            </div>
        </div>
        // <div>
        //     <h2>Room Name: {roomName}</h2>
        //     <p>Admin : {roomMembers.find((member) => member.user_id === userId).username}</p>
        //     {roomCode && <p>Share Code: <strong>{roomCode}</strong></p>}
        //     <div>
        //         {roomMembers.map((member) => (
        //             <div key={member.user_id}>
        //                 <p>{member.username}</p>
        //                 <p>{member.rank}</p>
        //                 <p>{member.overall_room_score}</p>
        //             </div>
        //         ))}
        //     </div>
        // </div>
    );
};

export default WaitingRoom;