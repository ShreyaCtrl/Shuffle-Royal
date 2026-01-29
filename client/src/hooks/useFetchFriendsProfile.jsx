import { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { useNotifications } from "reapop";

const useFetchFriendsProfile = (identifier) => {
    const [targetUser, setTargetUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const { notify } = useNotifications();

    useEffect(() => {
        // Don't fetch if no ID/Username is provided
        if (!identifier) return;

        const fetchOtherProfile = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/profile/${identifier}`, {
                    credentials: "include",
                });
                const data = await res.json();
                console.log(data);
                if (data.status === "success") {
                    setTargetUser(data.user);
                } else {
                    notify(`❌ ${data.message}`, { status: "error" });
                }
            } catch (err) {
                console.error("Error fetching target profile:", err);
                notify("❌ Could not load user profile", { status: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchOtherProfile();
    }, [identifier, notify]);

    return { targetUser, loading };
};

export default useFetchFriendsProfile;