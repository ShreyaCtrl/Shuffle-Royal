import { useState, useCallback } from "react"; // Use useCallback instead of useEffect for actions
import { API_URL } from "../../config";
import { useNotifications } from "reapop";

const useJoinRoom = () => {
    const [loading, setLoading] = useState(false);
    const { notify } = useNotifications();

    const joinRoom = useCallback(async (roomCode, userId) => {
        if (!roomCode || !userId) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/join-room`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    roomCode: roomCode, // Matches backend data.get("roomCode")
                    userId: userId,     // Matches backend data.get("userId")
                }),
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok && data.status === "success") {
                notify(`✅ Joined room ${data.roomCode}`, "success");
                return data; // Return data so the component can navigate
            } else {
                notify(`❌ ${data.message || "Failed to join"}`, "error");
            }
        } catch (err) {
            console.error("Error joining room:", err);
            notify("❌ Could not connect to server", "error");
        } finally {
            setLoading(false);
        }
    }, [notify]);

    return { loading, joinRoom };
}

export default useJoinRoom;