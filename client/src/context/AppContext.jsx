import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Fix: 'data' is not a named export
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Function to handle Socket.io connection
  const connectSocket = (user) => {
    if (user && !socket) {
      const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
        query: { userId: user._id },
      });
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (userIds) => {
        setOnlineUsers(userIds);
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setOnlineUsers([]);
      });
    }
  };
  // Checking User Auth & Setting user data & Connecting to Socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        setName(data.user.name);
        setBio(data.user.bio);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Login function to handle user authentication and socket connection
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/user/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        navigate("/")
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.get("/api/user/logout");
      if (socket) {
        socket.disconnect();
      }
      setAuthUser(null);
      setOnlineUsers([]);
      navigate("/login");
      toast.success("Logged Out Successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Update profile function
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/user/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updates successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);


  const value = {
    axios,
    navigate,
    selectedUser,
    setSelectedUser,
    name,
    setName,
    bio,
    setBio,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
    loading,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
