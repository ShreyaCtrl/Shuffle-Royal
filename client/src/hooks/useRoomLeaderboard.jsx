import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../../config";
import { useNotifications } from "reapop";

export default function useRoomLeaderboard(roomId) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { notify } = useNotifications();

  // ✅ Show Reapop notification whenever message changes
  useEffect(() => {
    if (message) {
      const isError = message.startsWith("❌");
      const isSuccess = message.startsWith("✅");

      notify(message.replace(/^[✅❌]\s*/, ""), {
        status: isError ? "error" : isSuccess ? "success" : "info",
        dismissAfter: 3000,
      });
    }
  }, [message, notify]);

  // ✅ Function to fetch leaderboard data
  const fetchLeaderboard = useCallback(async () => {
    if (!roomId) return;

    setLoading(true);
    // We don't necessarily want to clear the message on every refresh
    // to avoid notification spam, but we reset internal error state
    try {
      const res = await fetch(`${API_URL}/rooms/${roomId}/leaderboard`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important if you use Flask-Login sessions
      });

      const data = await res.json();

      if (res.ok) {
        setLeaderboard(data.leaderboard);
        // Optional: setMessage("✅ Leaderboard updated");
      } else {
        setMessage(`❌ ${data.error || "Failed to fetch leaderboard"}`);
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      setMessage("❌ Network error: Could not load leaderboard");
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // ✅ Auto-fetch on mount or when roomId changes
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    loading,
    message,
    refreshLeaderboard: fetchLeaderboard, // Allow manual refresh (e.g., Pull to Refresh)
  };
}