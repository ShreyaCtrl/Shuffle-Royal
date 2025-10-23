import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import "./Login.css";
import Loader from "../../utils/Loader.jsx";
import useLogin from "../../hooks/useLogin.jsx";
import { GOOGLE_CLIENT_ID } from "../../../config.js";
import { useNavigate } from "react-router";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const { handleGoogleLogin, handleEmailLogin, loading, message } =  useLogin();
  // const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleNavigateToSignup = () => {
    navigate("/signup");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleEmailLogin(email, password);
  };


  // // ✅ Load Google GSI script once
  // useEffect(() => {
  //   let mounted = true;
  //   const script = document.createElement("script");
  //   console.log("Loading Google script for Login...");
  //   script.src = "https://accounts.google.com/gsi/client";
  //   script.async = true;
  //   script.defer = true;
  //   document.body.appendChild(script);

  //   script.onload = () => {
  //     if (!mounted) return;
  //     console.log("Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
  //     console.log("Google script loaded — initializing for Login");
  //     window.google?.accounts?.id.initialize({
  //       client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  //       callback: handleGoogleResponse,
  //       auto_select: false,
  //       cancel_on_tap_outside: true,
  //       itp_support: true,
  //       use_fedcm_for_prompt: true,
  //     });
  //     console.log("Google Login initialized with FedCM support");
  //   };

  //   script.onerror = (e) => {
  //     console.error("Failed to load Google GSI script in Login.jsx", e);
  //   };

  //   return () => {
  //     mounted = false;
  //   };
  // }, []);

  // // ✅ Called when Google returns an ID token (credential)
  // const handleGoogleResponse = async (response) => {
  //   if (!response || !response.credential) {
  //     console.warn("No Google credential in response:", response);
  //     return;
  //   }

  //   console.log("FedCM Google Login response:", response);
  //   setLoading(true);
  //   setMessage("");

  //   try {
  //     const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ token: response.credential }),
  //       credentials: "include",
  //     });

  //     const data = await res.json();
  //     if (data.status === "success") {
  //       setMessage("✅ Login successful!");
  //     } else {
  //       setMessage(`❌ ${data.message}`);
  //     }
  //   } catch (err) {
  //     console.error("Google login error:", err);
  //     setMessage("❌ Google login failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // ✅ Trigger FedCM prompt manually
  // const handleGoogleLogin = (e) => {
  //   e?.preventDefault?.();
  //   if (!window.google || !window.google.accounts) {
  //     setMessage("❌ Google SDK not loaded yet. Please wait a moment.");
  //     console.warn("Google SDK not loaded on handleGoogleLogin");
  //     return;
  //   }

  //   try {
  //     window.google.accounts.id.disableAutoSelect();
  //     window.google.accounts.id.prompt();
  //     console.log("FedCM prompt triggered for Login");
  //   } catch (err) {
  //     console.error("Error triggering FedCM prompt:", err);
  //     setMessage("❌ Could not open Google sign-in. Try again.");
  //   }
  // };

  // // ✅ Email-based login
  // const handleEmailLogin = async (e) => {
  //   e.preventDefault();

  //   if (!email || !password) {
  //     setMessage("❌ Please fill all fields");
  //     return;
  //   }

  //   setLoading(true);
  //   setMessage("");

  //   try {
  //     const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //       credentials: "include",
  //     });

  //     const data = await res.json();
  //     if (data.status === "success") {
  //       setMessage("✅ Login successful!");
  //     } else {
  //       setMessage(`❌ ${data.message}`);
  //     }
  //   } catch (err) {
  //     console.error("Email login failed:", err);
  //     setMessage("❌ Login failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="flex justify-center items-center h-screen app">
      <div className="flex rounded-lg p-4 bg-shadow flex-col login-page-background login-page">
        <h1 className="flex font-bold items-center justify-center">
          Shuffle Royal
        </h1>
        <hr className="mt-2 mb-2" />
        {/* Log in Component */}
        <h1 className="text-lg mt-2 ">Log in</h1>
        <h2 className="text-sm ">Continue your gaming experience</h2>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col p-1">
            <label htmlFor="email" className="mt-2 mb-1 text-xl">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md text-lg border h-[2.5em] border-gray-400 input-clicked-login"
            />
          </div>
          <div className="flex flex-col p-1 mb-3">
            <label htmlFor="password" className="mt-2 mb-1 text-xl ">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md  text-lg border h-[2.5em] border-gray-400 input-clicked-login "
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="border items-center justify-center rounded-lg p-2 flex mt-3 mb-2 w-full hover:bg-gray-200"
          >
            {loading ? (
              // <p className="flex ">Logging in...</p>
              <Loader />
            ) : (
              <p className="flex ">Log into your account</p>
            )}
          </button>
          {/* Eventually change the below error to be shown by toast notifications */}
          {/* {error && <p className="text-red-500 text-sm mt-2">{error}</p>} */}
          <div className="flex items-center">
            <hr className="flex-grow border-t-2 border-gray-200" />
            <p className="mx-4 text-gray-500">OR</p>
            <hr className="flex-grow border-t-2 border-gray-200" />
          </div>
          <div className="flex flex-col">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}

              className="border items-center justify-center rounded-lg p-2 flex mt-3 mb-2 w-full hover:bg-gray-200"
            >
              {loading ? (
                <Loader />
              ) : (
                <>
                  <p className="flex ">Continue with Google</p>
                  <FcGoogle size={20} className="mt-1 ml-3" />
                </>
              )}
            </button>
          </div>
          <div className="flex mt-2">
            <p className="text-sm mr-1">New to Shuffle Royal ?</p>
            <p
              className="text-blue-500 hover:underline text-sm "
              onClick={handleNavigateToSignup}
            >
              Register Now
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
