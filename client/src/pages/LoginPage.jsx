import React, { useState } from "react";
import assets from "../assets/assets";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const LoginPage = () => {
  const { name, setName, bio, setBio, login } = useAppContext();
  const [state, setState] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (state === "register" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(state === "register" ? "register" : "login", {
      name,
      email,
      password,
      bio,
    });
  };
  return (
    <div
      className="min-h-screen bg-cover bg-center flex
     items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl"
    >
      {/* ---------left--------  */}
      <img src={assets.logo_big} alt="" className="w-[min(30vw, 250px)]" />
      {/* -----------right--------- */}
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-600/70 bg-white/8"
      >
        <div className="flex w-full items-center justify-between text-2xl font-medium m-auto">
          <div className="text-white/85">
            {state === "login" ? "Login" : "Sign Up"}
          </div>
          {isDataSubmitted && (
            <ChevronLeft
              onClick={() => setIsDataSubmitted(false)}
              className="text-gray-400 cursor-pointer max-w-7"
            />
          )}
        </div>
        {/* -------name---- */}
        {state === "register" && !isDataSubmitted && (
          <div className="w-full">
            <p className="text-white">Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Full name"
              className="border border-gray-600/70 rounded w-full p-2 mt-1 outline-violet-500/70 text-white/85"
              type="text"
              required
            />
          </div>
        )}
        {/* ------------email & password----------- */}
        {!isDataSubmitted && (
          <>
            <div className="w-full ">
              <p className="text-white">Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="type here"
                className="border border-gray-600/70 rounded w-full p-2 mt-1 outline-violet-500/70 text-white/85"
                type="email"
                required
              />
            </div>
            <div className="w-full ">
              <p className="text-white">Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="type here"
                className="border border-gray-600/70 rounded w-full p-2 mt-1 outline-violet-500/70 text-white/85"
                type="password"
                required
              />
            </div>
          </>
        )}
        {/* ----------textarea---------- */}
        {state === "register" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            placeholder="write a short bio..."
            className="border border-gray-600/70 rounded
             w-full p-2 mt-1 outline-violet-500/70 text-white/85"
          ></textarea>
        )}
        {state === "register" ? (
          <p className="text-white">
            Already have account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-violet-500/90 cursor-pointer hover:underline"
            >
              click here
            </span>
          </p>
        ) : (
          <p className="text-white">
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-violet-500/90 cursor-pointer hover:underline"
            >
              click here
            </span>
          </p>
        )}

        <button className="bg-gradient-to-r from-purple-400 to-violet-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>

        {/* ---------checkbox---------- */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" className="" />
          <p>Agree to terms of use an privacy policy</p>
        </div>

        <div></div>
      </form>
    </div>
  );
};

export default LoginPage;
