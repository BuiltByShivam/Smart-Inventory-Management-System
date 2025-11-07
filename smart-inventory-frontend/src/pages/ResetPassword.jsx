// src/pages/ResetPassword.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import loginImage from "../assets/login-image.png";

const TOKEN_TTL_MS = 1000 * 60 * 30; // 30 minutes

function getTokenMap() {
  try {
    const raw = localStorage.getItem("pwResetTokens");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function removeToken(token) {
  try {
    const m = getTokenMap();
    delete m[token];
    localStorage.setItem("pwResetTokens", JSON.stringify(m));
  } catch {}
}

function loadStoredUsers() {
  try {
    const raw = localStorage.getItem("mockUsers");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(arr) {
  localStorage.setItem("mockUsers", JSON.stringify(arr));
}

export default function ResetPassword() {
  const nav = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get("token") || "";

  const [status, setStatus] = useState("loading"); // loading | invalid | ok
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setErr("No token provided.");
      return;
    }
    const map = getTokenMap();
    const record = map[token];
    if (!record) {
      setStatus("invalid");
      setErr("Invalid or expired token.");
      return;
    }
    const created = record.created || 0;
    if (Date.now() - created > TOKEN_TTL_MS) {
      removeToken(token);
      setStatus("invalid");
      setErr("Token expired.");
      return;
    }
    setUsername(record.username);
    setStatus("ok");
  }, [token]);

  const inputBase = "mt-1 w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500";
  const lightBg = "bg-white text-gray-900 border-gray-300";
  const darkBg = "dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600";

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    if (!newPassword || !confirm) {
      setErr("Enter and confirm new password.");
      return;
    }
    if (newPassword !== confirm) {
      setErr("Passwords do not match.");
      return;
    }
    try {
      const stored = loadStoredUsers();
      const idx = stored.findIndex((u) => u.username === username);
      if (idx >= 0) {
        stored[idx] = { ...stored[idx], password: newPassword };
        saveStoredUsers(stored);
      } else {
        stored.push({ username, password: newPassword, role: "user", enabled: true });
        saveStoredUsers(stored);
      }
      removeToken(token);
      setSuccess("Password updated successfully. Redirecting to login…");
      setTimeout(() => nav("/login"), 1400);
    } catch (e) {
      console.error(e);
      setErr("Failed to update password.");
    }
  };

  if (status === "loading") {
    return <div className="p-6 text-center">Validating token…</div>;
  }

  if (status === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Reset password</h2>
          <div className="text-sm text-red-600 mb-4">{err || "Invalid token."}</div>
          <div className="text-sm">
            <button onClick={() => nav("/forgot-password")} className="text-blue-600 hover:underline">
              Request a new reset link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div
        className="hidden md:flex w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${loginImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-700 opacity-25"></div>
        <div className="relative z-10 text-white p-10 text-center m-auto space-y-4">
          <h1 className="text-6xl font-extrabold tracking-tight">Smart Inventory</h1>
          <p className="text-lg max-w-md mx-auto">Set a new password for your account.</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Reset password</h2>
          <p className="text-sm text-gray-500 mb-4">Resetting password for <strong>{username}</strong>.</p>

          {err && <div className="p-3 mb-3 bg-red-100 dark:bg-red-900 text-red-800 rounded">{err}</div>}
          {success && <div className="p-3 mb-3 bg-green-50 dark:bg-green-900 text-green-800 rounded">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300">New password</label>
              <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password"
                className={`${inputBase} ${lightBg} ${darkBg}`} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300">Confirm password</label>
              <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password"
                className={`${inputBase} ${lightBg} ${darkBg}`} />
            </div>

            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">Set new password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
