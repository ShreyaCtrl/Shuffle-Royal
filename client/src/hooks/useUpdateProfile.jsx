import { useState } from "react";
import { API_URL } from "../../config";
import { useNotifications } from "reapop";

const useUpdateProfile = () => {
  const [updating, setUpdating] = useState(false);
  const { notify } = useNotifications();

  const updateProfile = async (formData) => {
    setUpdating(true);
    try {
      // 1. Process friends string back into an array as per your handleSave logic
      const payload = {
          avatar: formData.avatar,
          username: formData.username,
        password: formData.password,
        friends: formData.friends
          ? formData.friends.split(",").map((f) => f.trim()).filter((f) => f)
          : [],
      };
      console.log(payload);
      // 2. Perform the API call
      const res = await fetch(`${API_URL}/profile/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();

      if (data.status === "success") {
        notify("✅ Profile updated successfully!", { status: "success" });
        return { success: true, user: data.user };
      } else {
        notify(`❌ ${data.message}`, { status: "error" });
        return { success: false };
      }
    } catch (err) {
      notify("❌ Error updating profile", { status: "error" });
      return { success: false };
    } finally {
      setUpdating(false);
    }
  };

  return { updateProfile, updating };
};

export default useUpdateProfile;