// src/pages/Users.jsx
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

/**
 * Users page (mock/local-only)
 * - Combines builtin users (admin, user) with any users stored in localStorage ("mockUsers")
 * - Admin can change role, toggle enabled, and remove accounts
 * - Changes persist to localStorage for mock users (including password so login keeps working)
 *
 * NOTE: This is mock/local-only. Storing plaintext passwords in localStorage is only for dev.
 */

const BUILTIN = [
  { id: 1, username: "admin", role: "admin", enabled: true, password: "admin" },
  { id: 2, username: "user", role: "user", enabled: true, password: "user" },
];

export default function Users() {
  const { darkMode = false, role = "guest" } = useOutletContext?.() || {};
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load users: builtin + stored (stored users keep username, role, enabled, password)
  useEffect(() => {
    setLoading(true);
    try {
      const raw = localStorage.getItem("mockUsers");
      const stored = raw ? JSON.parse(raw) : [];
      // Normalize stored users, give them stable ids starting from 100
      const storedNorm = stored.map((u, i) => ({
        id: 100 + i,
        username: u.username,
        role: u.role || "user",
        enabled: u.enabled === undefined ? true : !!u.enabled,
        password: u.password || u.pw || "",
      }));
      setUsers([...BUILTIN, ...storedNorm]);
    } catch (e) {
      console.error("Failed to load users from storage:", e);
      setUsers([...BUILTIN]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist non-builtin users to localStorage — including password (if present)
  const persistStoredUsers = (allUsers) => {
    const builtinUsernames = BUILTIN.map((b) => b.username);
    const onlyStored = allUsers
      .filter((u) => !builtinUsernames.includes(u.username))
      .map((u) => ({
        username: u.username,
        role: u.role,
        enabled: u.enabled,
        ...(u.password ? { password: u.password } : {}),
      }));
    localStorage.setItem("mockUsers", JSON.stringify(onlyStored));
  };

  // Basic safety: ensure at least one enabled admin remains
  const wouldLeaveNoEnabledAdmin = (changesFn) => {
    // apply changesFn on a shallow copy, then test
    const copy = users.map((u) => ({ ...u }));
    changesFn(copy);
    const enabledAdmins = copy.filter((u) => u.role === "admin" && u.enabled);
    return enabledAdmins.length === 0;
  };

  const handleRoleChange = (index, newRole) => {
    if (wouldLeaveNoEnabledAdmin((arr) => { arr[index].role = newRole; })) {
      alert("Cannot remove admin rights: at least one enabled admin must remain.");
      return;
    }
    const updated = [...users];
    updated[index] = { ...updated[index], role: newRole };
    setUsers(updated);
    persistStoredUsers(updated);
  };

  const handleToggleEnabled = (index) => {
    if (wouldLeaveNoEnabledAdmin((arr) => { arr[index].enabled = !arr[index].enabled; })) {
      alert("Cannot disable the last enabled admin.");
      return;
    }
    const updated = [...users];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setUsers(updated);
    persistStoredUsers(updated);
  };

  const handleRemove = (index) => {
    const user = users[index];
    if (!user) return;

    const builtinUsernames = BUILTIN.map((b) => b.username);
    if (builtinUsernames.includes(user.username)) {
      alert("Built-in account cannot be removed.");
      return;
    }

    // Safety: will removing this user leave zero enabled admins?
    if (user.role === "admin" && user.enabled) {
      const otherEnabledAdmins = users.filter((u, i) => i !== index && u.role === "admin" && u.enabled);
      if (otherEnabledAdmins.length === 0) {
        alert("Cannot remove this account — it is the last enabled admin.");
        return;
      }
    }

    if (!window.confirm(`Remove account "${user.username}"? This cannot be undone.`)) return;

    const updated = users.filter((_, i) => i !== index);
    setUsers(updated);
    persistStoredUsers(updated);
  };

  if (role !== "admin") {
    return <div className="p-6 text-sm text-red-600">Access denied — admin only.</div>;
  }

  // Styling helpers
  const selectClass = darkMode
    ? "bg-gray-700 text-gray-100 border-gray-600"
    : "bg-gray-100 text-gray-900 border-gray-300";

  const tableBg = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const textPrimary = darkMode ? "text-gray-100" : "text-gray-900";
  const textMuted = darkMode ? "text-gray-300" : "text-gray-600";

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className={`text-2xl font-semibold ${textPrimary}`}>Users</h1>
        <p className={`text-sm ${textMuted}`}>Manage application users.</p>
      </div>

      <div className={`p-4 rounded-2xl shadow border ${tableBg}`}>
        {loading ? (
          <div className="py-6 text-center">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={`text-left text-xs uppercase ${textMuted}`}>
                  <th className="px-3 py-2">Username</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Enabled</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u, idx) => (
                  <tr key={u.id ?? u.username} className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <td className={`px-3 py-3 ${textPrimary}`}>{u.username}</td>

                    <td className="px-3 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(idx, e.target.value)}
                        className={`rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${selectClass}`}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>

                    <td className={`px-3 py-3`}>
                      <label className="inline-flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={!!u.enabled}
                          onChange={() => handleToggleEnabled(idx)}
                          className={`h-4 w-4 rounded ${darkMode ? "accent-indigo-400" : "accent-indigo-600"}`}
                        />
                        <span className={`${textPrimary}`}>{u.enabled ? "Yes" : "No"}</span>
                      </label>
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        {/* Show Remove button for non-builtin users (builtin cannot be removed) */}
                        { !BUILTIN.some(b => b.username === u.username) ? (
                          <button
                            onClick={() => handleRemove(idx)}
                            className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                            aria-label={`Remove ${u.username}`}
                          >
                            Remove
                          </button>
                        ) : (
                          <span className={`text-xs px-2 py-1 rounded ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-500"}`}>Protected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className={`px-3 py-6 text-center text-sm ${textMuted}`}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
