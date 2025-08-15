import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Fix: 'data' is not a named export
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [selectedUser, setSelectedUser] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);


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
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
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
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfulyy");
    socket.disconnect();
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


      // Function to handle Socket.io connection
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    newSocket.on("disconnect", () => {
      setSocket(null);
      setOnlineUsers([]);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, []);

  const value = {
    axios,
    navigate,
    selectedUser,
    setSelectedUser,
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
