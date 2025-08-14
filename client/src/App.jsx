import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const { authUser, loading } = useAppContext();

  if (loading) {
    return (
      <div
        className={
          "bg-[url('/bgImage.svg')] bg-center bg-cover min-h-screen flex items-center justify-center text-white text-xl font-bold"
        }
      >
        Loading...
      </div>
    );
  }

  return (
    <div className={"bg-[url('/bgImage.svg')] bg-center bg-contain"}>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
