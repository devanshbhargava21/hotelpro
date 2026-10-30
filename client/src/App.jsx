import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import UserHome from "./components/UserHome.jsx";
import MyBookings from "./components/MyBookings.jsx";
import AdminHome from "./components/AdminHome.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user" element={<ProtectedRoute role="ordinary"><UserHome /></ProtectedRoute>} />
        <Route path="/user/bookings" element={<ProtectedRoute role="ordinary"><MyBookings /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminHome /></ProtectedRoute>} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
