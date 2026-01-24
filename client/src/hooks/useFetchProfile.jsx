import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../../config";
import { useNotifications } from "reapop";

const useFetchProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { notify } = useNotifications();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/profile/me`, {
        credentials: "include",
      });
      const data = await res.json();
      
        if (data.status === "success") {
          console.log(data.user);
        setUser(data.user);
      } else {
        notify(data.message, { status: "error" });
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      notify("❌ Failed to fetch profile", { status: "error" });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { user, setUser, loading, refreshProfile: fetchProfile };
};

export default useFetchProfile;