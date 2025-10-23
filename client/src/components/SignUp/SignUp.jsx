import React from "react";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import "./SignUp.css";
import Loader from "../../utils/Loader.jsx";
import { GOOGLE_CLIENT_ID } from "../../../config.js";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load Google script
  // --- inside your SignUp.jsx component ---
  useEffect(() => {
    let mounted = true;
    const script = document.createElement("script");
    console.log("Loading Google script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (!mounted) return;
      console.log("Google script onload - initializing");

      // ✅ Initialize with FedCM support
      window.google?.accounts?.id.initialize({
        client_id:
          GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        itp_support: true,
        use_fedcm_for_prompt: true, // ✅ ensures FedCM actually returns credential
      });
      
      console.log("Google initialized with FedCM support");
    };

    script.onerror = (e) => {
      console.error("Failed to load Google GSI script", e);
    };

    // return () => {
    //   mounted = false;
    //   const el = document.getElementById("google-signin-button");
    //   if (el) el.innerHTML = ""; // safe cleanup
    // };
  }, []);


  // Called when Google returns an ID token (credential)
  const handleGoogleResponse = async (response) => {
    if (!response || !response.credential) {
      console.log("No Google credential in response:", response);
      return;
    }
    console.log("Full FedCM response:", response);
    console.log("Google response received");
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.status === "success") {
        setMessage("✅ Google registration/login successful!");
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Google sign up error", err);
      setMessage("❌ Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  // This is called from your "Continue with Google" custom button
  const handleGoogleRegister = (e) => {
    e?.preventDefault?.();

    if (!window.google || !window.google.accounts) {
      setMessage("❌ Google SDK not loaded yet. Try again in a moment.");
      console.warn("Google SDK not loaded on handleGoogleRegister");
      return;
    }

    try {
      // Disable auto-select so the chooser always appears
      window.google.accounts.id.disableAutoSelect();

      // ✅ Simply prompt; FedCM takes care of UI handling internally
      window.google.accounts.id.prompt();
      console.log("FedCM prompt triggered");
    } catch (err) {
      console.error("Error triggering Google prompt:", err);
      setMessage("❌ Could not open Google sign-in. Try again.");
    }
  };

  // Handle email registration
  const handleEmailRegister = async (e) => {
    e.preventDefault();

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
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-gradient-signup items-center h-screen app">
      <div className="flex signup-page-background rounded-lg p-4 bg-shadow-signup flex-col signup-page">
        <h1 className="flex font-bold text-lg items-center justify-center">
          Shuffle Royal
        </h1>
        <hr className="mt-2 mb-2" />
        <h1 className="text-lg mt-2">Create your game account</h1>
        <h2 className="text-sm ">
          One step before starting your favorite games
        </h2>
        <form className="mt-4" onSubmit={handleEmailRegister}>
          <div className="flex flex-col p-1">
            <label htmlFor="email" className="mt-2 mb-1 text-xl">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md  text-lg border h-[2.5em] border-gray-400  input-clicked-login"
            />
          </div>
          <div className="flex flex-col p-1">
            <label htmlFor="username" className="mt-2 mb-1 text-xl">
              Username
            </label>
            <input
              type="username"
              name="username"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-md  text-lg border h-[2.5em] border-gray-400  input-clicked-login"
            />
          </div>
          <div className="flex flex-col p-1 mb-3">
            <label htmlFor="password" className="mt-2 mb-1 text-xl">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md  text-lg border h-[2.5em] border-gray-400 input-clicked-signup "
              // className="rounded-md text-lg border hover:border-b-2 bg-[#1e1e1e]"
            />
          </div>
          <div className="flex flex-col p-1 mb-3">
            <label htmlFor="password" className="mt-2 mb-1 text-xl">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-md  text-lg border h-[2.5em] border-gray-400 input-clicked-login"
              // className="rounded-md text-lg border hover:border-b-2 bg-[#1e1e1e]"
            />
          </div>
          <button
            type="submit"
            className="border items-center justify-center rounded-lg p-2 flex mt-3 mb-2 w-full hover:bg-gray-200"
          >
            {loading ? <Loader /> : <p className="flex">Create your account</p>}
          </button>
          <div className="flex items-center">
            <hr className="flex-grow border-t-2 border-gray-200" />
            <p className="mx-4 text-gray-500">OR</p>
            <hr className="flex-grow border-t-2 border-gray-200" />
          </div>
          <div className="flex flex-col">
            <button
              id="google-signin-button"
              onClick={handleGoogleRegister}
              className="border items-center justify-center rounded-lg p-2 flex mt-3 mb-2 w-full hover:bg-gray-200"
            >
              {loading ? (
                <Loader />
              ) : (
                <>
                  <p className="flex">Continue with Google</p>
                  <FcGoogle size={20} className="mt-1 ml-3" />
                </>
              )}
            </button>
          </div>
          {/* <div className="flex flex-col">
            <div
              id="google-signin-button"
              className="border items-center justify-center rounded-lg p-2 flex mt-3 mb-2 w-full hover:bg-gray-200"
            ></div>
          </div> */}
          <div className="flex mt-2">
            <p className="text-sm mr-1">Already have an Account ?</p>
            <p className="text-blue-500 hover:underline text-sm">Login here</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
