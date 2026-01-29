import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetchFriendsProfile from "../../hooks/useFetchFriendsProfile"; // The hook we created
import useFetchProfile from "../../hooks/useFetchProfile"; // To check if it's "Me"

export default function PublicProfile() {
    const { username } = useParams();
    const navigate = useNavigate();
    const { targetUser, loading } = useFetchFriendsProfile(username);
    const { user: currentUser } = useFetchProfile();

    // If the user tries to view their own profile via a link, 
    // you could redirect them or just show the public view.
    const isMe = currentUser?.username === username;
    isMe ? navigate("/profile") : null;
    if (loading) return <p className="text-center mt-10 font-bold">Summoning traveler's records...</p>;
    if (!targetUser) return <p className="text-center mt-10">This traveler is lost in the void (User not found).</p>;

    return (
        <div className="max-w-2xl mx-auto space-y-8 mt-10 px-4 pb-20">
            <div className="card-primary p-6">
                <h2
                    className="text-2xl text-uppercase text-center mb-6 font-bold"
                    style={{ color: "var(--accent-primary)" }}
                >
                    {targetUser.username}'s Profile
                </h2>

                <div className="flex flex-col items-center mb-6">
                    <img
                        src={targetUser.avatar_url || "/default-avatar.png"}
                        alt="Avatar"
                        className="w-32 h-32 rounded-lg border-4 shadow-md object-cover"
                        style={{ borderColor: "var(--card-accent-purple)" }}
                    />
                </div>

                <div className="flex flex-col text-sm md:text-base space-y-4">
                    <div className="flex justify-between border-b border-gray-100 pb-2" style={{ borderColor: "var(--border-color)" }}>
                        <strong>Username:</strong>
                        <span>{targetUser.username}</span>
                    </div>

                    <div className="flex justify-between border-b border-gray-100 pb-2" style={{ borderColor: "var(--border-color)" }}>
                        <strong>Games Played:</strong>
                        <span>{targetUser.games_played}</span>
                    </div>

                    <div className="flex justify-between border-b border-gray-100 pb-2" style={{ borderColor: "var(--border-color)" }}>
                        <strong>Games Won:</strong>
                        <span>{targetUser.games_won}</span>
                    </div>

                    <div className="flex justify-between">
                        <strong>Friends:</strong>
                        <span>{targetUser.friends?.length || 0}</span>
                    </div>
                </div>

                <div className="flex justify-center mt-6 gap-3">
                    {isMe ? (
                        <button className="button-secondary px-8 py-2" disabled>
                            This is You
                        </button>
                    ) : (
                        <button className="button-primary px-8 py-2">
                            Send Friend Request
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}