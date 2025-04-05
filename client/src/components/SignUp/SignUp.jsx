import React from "react";
import { FcGoogle } from "react-icons/fc";
import "./SignUp.css";

const SignUp = () => {
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
        <div className="mt-4">
          <div className="flex flex-col p-1">
            <label htmlFor="email" className="mt-2 mb-1 text-xl">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
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
              className="rounded-md  text-lg border h-[2.5em] border-gray-400 input-clicked-login"
              // className="rounded-md text-lg border hover:border-b-2 bg-[#1e1e1e]"
            />
          </div>
          <button
            type="submit"
            className="border items-center justify-center rounded-lg p-2 flex mt-3 mb-2 w-full hover:bg-gray-200"
          >
            <p className="flex">Create your account</p>
          </button>
          <div className="flex items-center">
            <hr className="flex-grow border-t-2 border-gray-200" />
            <p className="mx-4 text-gray-500">OR</p>
            <hr className="flex-grow border-t-2 border-gray-200" />
          </div>
          {/* <p className="flex flex-col p-1 justify-center">
            <hr className="flex text-black" />
            <p>OR</p>
            <hr />
          </p> */}
          <div className="flex flex-col">
            <button className="border items-center justify-center rounded-lg p-2 flex mt-3 mb-2 w-full hover:bg-gray-200">
              <p className="flex">Continue with Google</p>
              <FcGoogle size={20} className="mt-1 ml-3" />
            </button>
          </div>
          <div className="flex mt-2">
            <p className="text-sm mr-1">Already have an Account ?</p>
            <p className="text-blue-500 hover:underline text-sm">Login here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
