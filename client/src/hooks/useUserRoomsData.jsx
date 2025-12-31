import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../../config";
import { useNotifications } from "reapop";

export default function useUserRoomsData() {
  const [roomsData, setRoomsData] = useState({}); // Stores { room_id: [players] }
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { notify } = useNotifications();

  // Show notifications for errors/success
  useEffect(() => {
    if (message) {
      const isError = message.startsWith("❌");
      notify(message.replace(/^[✅❌]\s*/, ""), {
        status: isError ? "error" : "success",
        dismissAfter: 3000,
      });
    }
  }, [message, notify]);

  const fetchAllLeaderboards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/my-rooms/leaderboards`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setRoomsData(data.rooms); // The grouped dictionary from your Flask route
      } else {
        setMessage(`❌ ${data.message || "Failed to load room data"}`);
      }
    } catch (err) {
      console.error("All rooms fetch error:", err);
      setMessage("❌ Network error: Could not load your rooms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllLeaderboards();
  }, [fetchAllLeaderboards]);

  return {
    roomsData,
    loading,
    refreshAll: fetchAllLeaderboards,
  };
}
