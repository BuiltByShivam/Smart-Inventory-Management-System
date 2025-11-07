// src/pages/Login.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login-image.png";

// built-in demo accounts (kept for fallback)
const builtinUsers = [
  { username: "admin", password: "admin", role: "admin", enabled: true },
  { username: "user", password: "user", role: "user", enabled: true },
];

const Login = ({ setRole }) => {
  const navigate = useNavigate();
  const usernameRef = useRef(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (usernameRef.current) usernameRef.current.focus();
  }, []);

  // load saved (mock) users from localStorage and merge with builtinUsers
  const loadAllUsers = () => {
    try {
      const raw = localStorage.getItem("mockUsers");
      const stored = raw ? JSON.parse(raw) : [];
      // stored expected: { username, password, role, enabled }
      const combined = [...builtinUsers];

      // add stored users, but if a stored user has same username as builtin, prefer stored
      stored.forEach((su) => {
        const idx = combined.findIndex((u) => u.username === su.username);
        const normalized = {
          username: su.username,
          password: su.password || su.pw || "",
          role: su.role || "user",
          enabled: su.enabled === undefined ? true : !!su.enabled,
        };
        if (idx >= 0) combined[idx] = { ...combined[idx], ...normalized };
        else combined.push(normalized);
      });

      // ensure fields exist on all users
      return combined.map((u) => ({
        username: u.username,
        password: u.password || "",
        role: u.role || "user",
        enabled: u.enabled === undefined ? true : !!u.enabled,
      }));
    } catch (e) {
      console.error("Failed to load mock users:", e);
      return builtinUsers;
    }
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    const users = loadAllUsers();
    // helpful debug while testing:
    // console.debug("Loaded users for login:", users);

    const found = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!found) {
      setError("Invalid username or password");
      return;
    }

    if (found.enabled === false) {
      setError("Account disabled — contact admin.");
      return;
    }

    // success
    setError("");
    setRole(found.role);
    localStorage.setItem("role", found.role);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Side: Background Image */}
      <div
        className="hidden md:flex w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${loginImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-700 opacity-25"></div>

        <div className="relative z-10 text-white p-10 text-center m-auto space-y-4">
          <h1 className="text-6xl font-extrabold tracking-tight">Smart Inventory</h1>
          <p className="text-lg max-w-md mx-auto">
            Efficiently track, manage, and control your inventory from one place.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
          <div className="flex items-center justify-center mb-4">
            <div className="text-4xl font-bold text-gray-800">
              Smart<span className="text-blue-600">Inventory</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Sign in</h2>

          <form onSubmit={submit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  👤
                </span>
                <input
                  id="username"
                  ref={usernameRef}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="mt-0 w-full pl-10 px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  aria-label="Username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  🔒
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="mt-0 w-full pl-10 pr-12 px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  aria-label="Password"
                />
                {/* Show/hide toggle with emoji */}
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-lg"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-between items-center text-sm">
              <button type="button" onClick={() => navigate("/forgot-password")} className="text-blue-600 hover:underline">
                Forgot password?
              </button>

              <div>
                <span className="text-gray-500 mr-2">No account?</span>
                <button type="button" onClick={() => navigate("/signup")} className="text-blue-600 hover:underline">
                  Sign up
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!username || !password}
                className={`w-full py-3 text-white rounded-lg transition-all duration-200 ${
                  !username || !password
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                }`}
                aria-disabled={!username || !password}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
