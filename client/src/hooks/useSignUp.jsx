import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { GOOGLE_CLIENT_ID, API_URL } from "../../config";
import { useNotifications } from "reapop";

export default function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
    const { notify } = useNotifications();

    // ✅ Show a Reapop notification whenever message changes
    useEffect(() => {
      if (message) {
        const isError = message.startsWith("❌");
        const isSuccess = message.startsWith("✅");
        console.log("SignUp message:", message);
        notify(message.replace(/^[✅❌]\s*/, message), {
          status: isError ? "error" : isSuccess ? "success" : "info",
          dismissAfter: 3000,
        });
      }
    }, [message, notify]);

  // ✅ Load Google GSI script once
  useEffect(() => {
    let mounted = true;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (!mounted) return;
      console.log("Google script loaded for SignUp");

      window.google?.accounts?.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        itp_support: true,
        use_fedcm_for_prompt: true,
      });
    };

    script.onerror = (e) => {
      console.error("Failed to load Google GSI script", e);
    };

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ Handle Google response (FedCM)
  const handleGoogleResponse = async (response) => {
    if (!response || !response.credential) {
      console.warn("No Google credential in response:", response);
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
        setMessage("✅ Google registration/login successful!");
        setTimeout(() => navigate("/game-desc"), 1000);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Google signup error:", err);
      setMessage("❌", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Trigger FedCM Google signup
  const handleGoogleRegister = (e) => {
    e?.preventDefault?.();
    if (!window.google || !window.google.accounts) {
      setMessage("❌ Google SDK not loaded yet. Try again in a moment.");
      console.warn("Google SDK not loaded on handleGoogleRegister");
      return;
    }

    try {
      window.google.accounts.id.disableAutoSelect();
      window.google.accounts.id.prompt();
      console.log("FedCM prompt triggered for Google Signup");
    } catch (err) {
      console.error("Error triggering Google prompt:", err);
      setMessage("❌ Could not open Google sign-in. Try again.");
    }
  };

  // ✅ Handle email-based registration
  const handleEmailRegister = async (
    email,
    username,
    password,
    confirmPassword
  ) => {
    if (!email || !password || !confirmPassword || !username) {
      setMessage("❌ Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword, username }),
        credentials: "include",
      });

      const data = await res.json();
      if (data.status === "success") {
        setMessage("✅ Registration successful!");
        setTimeout(() => navigate("/game-desc"), 1000);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Email signup failed:", err);
      setMessage("❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleGoogleRegister,
    handleEmailRegister,
    loading,
    message,
  };
}
