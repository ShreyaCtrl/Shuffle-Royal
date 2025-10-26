import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";

import "./SignUp.css";
import Loader from "../../utils/Loader.jsx";
import useSignUp from "../../hooks/useSignUp.jsx";

const SignUp = () => {
  const navigate = useNavigate();
  const { handleGoogleRegister, handleEmailRegister, loading, message } =
    useSignUp();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigateToLogin = () => {
    navigate("/login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEmailRegister(email, username, password, confirmPassword);
  };

  return (
    <div className="flex justify-center bg-gradient-signup items-center m-4">
      <div className="login-page flex rounded-lg p-4 bg-shadow flex-col login-page-background ">
        <h1 className="flex font-bold text-lg items-center justify-center">
          Shuffle Royal
        </h1>
        <hr className="mt-2 mb-2" />
        <h1 className="text-lg mt-2">Create your game account</h1>
        <h2 className="text-sm ">
          One step before starting your favorite games
        </h2>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col p-1 form-group">
            <label htmlFor="email form-label" className="mt-2 mb-1 text-xl">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md input-field text-lg border h-[2.5em] border-gray-400  input-clicked-login"
            />
          </div>
          <div className="flex flex-col p-1 form-group">
            <label htmlFor="username" className="mt-2 mb-1 text-xl">
              Username
            </label>
            <input
              type="username"
              name="username"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-md input-field text-lg border h-[2.5em] border-gray-400  input-clicked-login"
            />
          </div>
          <div className="flex flex-col p-1 mb-3 form-group">
            <label htmlFor="password" className="mt-2 mb-1 text-xl">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md input-field text-lg border h-[2.5em] border-gray-400 input-clicked-signup "
              // className="rounded-md text-lg border hover:border-b-2 bg-[#1e1e1e]"
            />
          </div>
          <div className="flex flex-col p-1 mb-3 form-group">
            <label htmlFor="password" className="mt-2 mb-1 text-xl">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-md input-field text-lg border h-[2.5em] border-gray-400 input-clicked-login"
              // className="rounded-md text-lg border hover:border-b-2 bg-[#1e1e1e]"
            />
          </div>
          <button
            type="submit"
            className="button-primary border items-center justify-center rounded-lg p-2 flex mt-3 mb-2 w-full hover:bg-gray-200"
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
              className="border button-secondary items-center justify-center rounded-lg p-2 flex mt-3 mb-2 w-full hover:bg-gray-200"
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
            <p
              onClick={navigateToLogin}
              className="links hover:underline text-sm"
            >
              Login here
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
