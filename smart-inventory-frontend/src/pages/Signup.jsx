// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import loginImage from "../assets/login-image.png";

/**
 * Signup (mock/local-only)
 * - No role selection (all signups are 'user')
 * - Requires security question & answer for password recovery
 * - Persists to localStorage.mockUsers: { username, password, role, enabled, securityQuestion, securityAnswer }
 *
 * NOTE: This is for local/dev only. Do NOT store plaintext passwords/security answers in production.
 */

const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What is the name of your first pet?",
  "What was your first school's name?",
  "Custom question..."
];

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [question, setQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [customQuestion, setCustomQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStoredUsers = () => {
    try {
      const raw = localStorage.getItem("mockUsers");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveStoredUsers = (arr) => {
    localStorage.setItem("mockUsers", JSON.stringify(arr));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password || !confirm || !answer) {
      setError("Please fill all required fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    const users = loadStoredUsers();
    const existsInStored = users.find((u) => u.username === username);
    // builtin user check
    const builtin = ["admin", "user"];
    if (existsInStored || builtin.includes(username)) {
      setError("Username already exists. Choose a different username.");
      return;
    }

    const q = question === "Custom question..." ? customQuestion.trim() : question;

    const newUser = {
      username,
      password,
      role: "user",
      enabled: true,
      securityQuestion: q || "Custom question",
      securityAnswer: answer.trim(),
    };

    setLoading(true);
    try {
      users.push(newUser);
      saveStoredUsers(users);
      alert("Account created — please login.");
      navigate("/login");
    } catch (e) {
      console.error(e);
      setError("Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "mt-1 w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500";
  const lightBg = "bg-white text-gray-900 border-gray-300";
  const darkBg = "dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600";

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left side visual (like login) */}
      <div
        className="hidden md:flex w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${loginImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-700 opacity-25"></div>
        <div className="relative z-10 text-white p-10 text-center m-auto space-y-4">
          <h1 className="text-6xl font-extrabold tracking-tight">Smart Inventory</h1>
          <p className="text-lg max-w-md mx-auto">
            Create an account to start managing inventory locally (dev mode).
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <FaUserPlus className="text-2xl text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Create Account</h2>
          </div>

          {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`${inputBase} ${lightBg} ${darkBg}`}
                placeholder="Choose a username"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className={`${inputBase} ${lightBg} ${darkBg}`}
                placeholder="Choose a strong password"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Confirm Password</label>
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type="password"
                className={`${inputBase} ${lightBg} ${darkBg}`}
                placeholder="Confirm password"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Security question</label>
              <select
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={`${inputBase} ${lightBg} ${darkBg}`}
              >
                {SECURITY_QUESTIONS.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
              {question === "Custom question..." && (
                <input
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  className={`${inputBase} ${lightBg} ${darkBg} mt-2`}
                  placeholder="Enter your custom question"
                />
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-700">Answer</label>
              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className={`${inputBase} ${lightBg} ${darkBg}`}
                placeholder="Answer to security question"
                autoComplete="off"
              />
              <p className="text-xs text-gray-500 mt-1">Will be used to verify your identity for password recovery (dev only).</p>
            </div>

            <button type="submit" disabled={loading} className="w-full py-2 rounded bg-blue-600 text-white">
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>

          <div className="mt-4 text-sm text-center">
            <button onClick={() => navigate("/login")} className="text-blue-600 hover:underline">
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
