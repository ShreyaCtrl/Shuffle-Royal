import { useState } from "react";
import { API_URL } from "../../config";
import { useNotifications } from "reapop";

const useConnectExistingLeaderboard = () => {
    const [loading, setLoading] = useState(false);
    const { notify } = useNotifications();

    /**
     * @param {string} roomId - The ID of the existing room/group
     * @param {string} adminId - The user ID of the person initializing the sync
     */
    const connectLeaderboard = async (roomId, adminId) => {
        if (!roomId || !adminId) {
            notify("❌ Room ID or Admin ID is missing", { status: "error" });
            return { success: false };
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/create-room-existing-leaderboard`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    room_id: roomId,
                    admin_id: adminId,
                }),
                credentials: "include", // Essential for session/cookie support
            });
            // console.log(res);
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                notify("✅ Redis session synchronized successfully!", { status: "success" });
                return {
                    success: true,
                    roomCode: data.data?.room_code, // Assuming the backend returns this in the data object
                    roomMembers: data.data?.room_members,
                    roomCreatedAt: data.data?.created_at,
                    message: data.message
                };
            } else {
                notify(`❌ ${data.error || "Failed to sync leaderboard"}`, { status: "error" });
                return { success: false };
            }
        } catch (err) {
            console.error("Sync Error:", err);
            notify("❌ Connection error. Check if the server is running.", { status: "error" });
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return { connectLeaderboard, loading };
};

export default useConnectExistingLeaderboard;