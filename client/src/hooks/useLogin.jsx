import { useState, useEffect } from "react";
import { useNotifications } from "reapop";
import { GOOGLE_CLIENT_ID, API_URL } from "../../config";
import { useNavigate } from "react-router";

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { notify } = useNotifications();
  const navigate = useNavigate();

  // ✅ Show a Reapop notification whenever message changes
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

  // ✅ Load Google GSI script only once
  useEffect(() => {
    let mounted = true;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    console.log(GOOGLE_CLIENT_ID)

    script.onload = () => {
      if (!mounted) return;
      console.log("Google GSI script loaded — initializing");
      window.google?.accounts?.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        itp_support: true,
        use_fedcm_for_prompt: true,
      });
    };

    script.onerror = (e) =>
      console.error("Failed to load Google GSI script", e);

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ Handle Google response
  const handleGoogleResponse = async (response) => {
    if (!response || !response.credential) {
      console.warn("No Google credential:", response);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/auth/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
        credentials: "include",
      });

      const data = await res.json();
      if (data.status === "success") {
        setMessage("✅ Google login successful!");
        setTimeout(() => navigate("/game-desc"), 1000);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Google login error:", err);
      setMessage("❌ Google login failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Trigger Google login prompt manually
  const handleGoogleLogin = (e) => {
    e?.preventDefault?.();
    if (!window.google || !window.google.accounts) {
      setMessage("❌ Google SDK not loaded yet.");
      return;
    }

    try {
      window.google.accounts.id.disableAutoSelect();
      window.google.accounts.id.prompt();
      console.log("FedCM prompt triggered for login");
    } catch (err) {
      console.error("FedCM prompt error:", err);
      setMessage("❌ Could not open Google sign-in. Try again.");
    }
  };

  // ✅ Email login
  const handleEmailLogin = async (email, password) => {
    if (!email || !password) {
      setMessage("❌ Please fill all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (data.status === "success") {
        setMessage("✅ Login successful!");
        setTimeout(() => navigate("/game-desc"), 1000);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Email login error:", err);
      setMessage("❌ Login failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleGoogleLogin,
    handleEmailLogin,
    loading,
    message,
  };
}
