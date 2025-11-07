// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login-image.png";

const TOKEN_TTL_MS = 1000 * 60 * 30; // 30 minutes

function loadAllUsers() {
  try {
    const raw = localStorage.getItem("mockUsers");
    const stored = raw ? JSON.parse(raw) : [];
    // include builtin fallback
    const builtin = [
      { username: "admin", password: "admin", role: "admin", enabled: true, securityQuestion: "What is your mother's maiden name?", securityAnswer: "admin" },
      { username: "user", password: "user", role: "user", enabled: true, securityQuestion: "What city were you born in?", securityAnswer: "user" },
    ];
    const combined = [...builtin];
    stored.forEach((su) => {
      const idx = combined.findIndex((u) => u.username === su.username);
      const normalized = {
        username: su.username,
        password: su.password || su.pw || "",
        role: su.role || "user",
        enabled: su.enabled === undefined ? true : !!su.enabled,
        securityQuestion: su.securityQuestion || "Custom question",
        securityAnswer: su.securityAnswer || "",
      };
      if (idx >= 0) combined[idx] = { ...combined[idx], ...normalized };
      else combined.push(normalized);
    });
    return combined;
  } catch (e) {
    console.error(e);
    return [];
  }
}

function saveResetToken(token, username) {
  const raw = localStorage.getItem("pwResetTokens");
  const map = raw ? JSON.parse(raw) : {};
  map[token] = { username, created: Date.now() };
  localStorage.setItem("pwResetTokens", JSON.stringify(map));
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = enter username, 2 = answer question
  const [identifier, setIdentifier] = useState("");
  const [question, setQuestion] = useState("");
  const [expectedUsername, setExpectedUsername] = useState("");
  const [answer, setAnswer] = useState("");
  const [info, setInfo] = useState("");
  const [err, setErr] = useState("");
  const [tokenLink, setTokenLink] = useState("");

  const inputBase = "mt-1 w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500";
  const lightBg = "bg-white text-gray-900 border-gray-300";
  const darkBg = "dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600";

  const handleLookup = (e) => {
    e.preventDefault();
    setErr("");
    setInfo("");
    setTokenLink("");
    if (!identifier.trim()) {
      setErr("Enter username.");
      return;
    }
    const users = loadAllUsers();
    const found = users.find((u) => u.username === identifier.trim());
    if (!found) {
      setErr("No account found with that username.");
      return;
    }
    if (!found.enabled) {
      setErr("Account is disabled. Contact admin.");
      return;
    }
    setQuestion(found.securityQuestion || "Security question not set");
    setExpectedUsername(found.username);
    setStep(2);
  };

  const handleAnswer = (e) => {
    e.preventDefault();
    setErr("");
    setInfo("");
    setTokenLink("");
    if (!answer.trim()) {
      setErr("Enter answer to security question.");
      return;
    }
    const users = loadAllUsers();
    const found = users.find((u) => u.username === expectedUsername);
    if (!found) {
      setErr("Unexpected error. Try again.");
      return;
    }
    if ((found.securityAnswer || "").trim().toLowerCase() !== answer.trim().toLowerCase()) {
      setErr("Incorrect answer.");
      return;
    }

    const token = Math.random().toString(36).slice(2, 12) + Date.now().toString(36).slice(-4);
    saveResetToken(token, found.username);
    const link = `${window.location.origin}/reset-password?token=${token}`;
    setInfo("Security verified. Reset link generated (simulated).");
    setTokenLink(link);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div
        className="hidden md:flex w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${loginImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-700 opacity-25"></div>
        <div className="relative z-10 text-white p-10 text-center m-auto space-y-4">
          <h1 className="text-6xl font-extrabold tracking-tight">Smart Inventory</h1>
          <p className="text-lg max-w-md mx-auto">Securely reset your password (dev simulation).</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Forgot password</h2>

          {err && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">{err}</div>}
          {info && <div className="p-3 mb-4 bg-green-50 text-green-800 rounded">{info}</div>}

          {step === 1 && (
            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Username</label>
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={`${inputBase} ${lightBg} ${darkBg}`}
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>

              <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
                Continue
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleAnswer} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Security question</label>
                <div className="mt-1 p-3 rounded border bg-gray-50">{question}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-700">Answer</label>
                <input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className={`${inputBase} ${lightBg} ${darkBg}`}
                  placeholder="Answer to your security question"
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded">
                  Verify & Generate Link
                </button>
                <button
                  type="button"
                  onClick={() => { setStep(1); setIdentifier(""); setQuestion(""); setAnswer(""); setErr(""); setInfo(""); }}
                  className="flex-1 py-2 border rounded"
                >
                  Back
                </button>
              </div>
            </form>
          )}

          {tokenLink && (
            <div className="mt-4 p-3 border rounded bg-gray-50 text-sm">
              <div className="mb-2 text-xs text-gray-500">Simulated email — click the link to proceed:</div>
              <a
                href={tokenLink}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/reset-password?token=${new URL(tokenLink).searchParams.get("token")}`);
                }}
                className="text-blue-600 hover:underline break-all"
              >
                {tokenLink}
              </a>
              <div className="mt-2 text-xs text-gray-500">Token valid for 30 minutes (dev only).</div>
            </div>
          )}

          <div className="mt-4 text-sm">
            <button onClick={() => navigate("/login")} className="text-blue-600 hover:underline">
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
