// src/components/educator/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // load persisted user once on mount
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-gray-500 bg-white">
      {/* Logo / Home link */}
      <Link to="/">
        <img src={assets.logo} alt="Edemy Logo" className="h-10" />
      </Link>

      {/* Greeting + Logout */}
      <div className="flex items-center gap-4 text-gray-700">
        <span className="hidden sm:inline">
          Hi, {user?.name ?? "Instructor"}
        </span>

        {user ? (
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <img
            src={assets.profile_img}
            alt="Profile placeholder"
            className="w-8 h-8 rounded-full"
          />
        )}
      </div>
    </header>
  );
}
