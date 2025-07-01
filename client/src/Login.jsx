import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AppContext } from "./context/AppContext.jsx";

export default function Login() {
  const { login } = useContext(AppContext);
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await axios.post("http://localhost:3001/login", {
      email, password
    });
    if (res.data.status === "Success") {
      login(res.data.user);
    } else {
      alert(res.data.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-teal-600 text-white rounded-lg text-lg font-semibold hover:bg-teal-700 transition"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New to Edemy?{" "}
          <Link to="/signup" className="font-medium text-teal-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
