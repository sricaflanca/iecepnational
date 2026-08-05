import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Plus, Trash2, Loader2, X } from "lucide-react";

const ROLE_LABELS = {
  admin: "Administrator (full access)",
  resolutions: "Resolutions",
  events: "Events",
  iecepistle: "IECEPistle",
  chapters: "Chapter Corner",
  social: "Social Clubs",
  students: "Student Corner",
  specializations: "Specializations",
  partners: "Partners",
  leadership: "Leadership",
};
const ROLES = Object.keys(ROLE_LABELS);

export default function UsersManager() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState([]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      setUsers(await base44.admin.users.list());
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleRole = (role) => {
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setRoles([]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (roles.length === 0) {
      setError("Select at least one role");
      return;
    }
    setSubmitting(true);
    try {
      await base44.admin.users.create({ email, password, roles });
      resetForm();
      setShowForm(false);
      await loadUsers();
    } catch (err) {
      setError(err.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this user's access? This cannot be undone.")) return;
    try {
      await base44.admin.users.delete(id);
      await loadUsers();
    } catch (err) {
      alert(err.message || "Failed to remove user");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-heading text-graphite text-xl uppercase">Staff Access</h3>
          <span className="font-mono text-xs text-muted-foreground">({users.length})</span>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
          className="nb-btn bg-azure text-navy px-4 py-2 text-xs"
        >
          {showForm ? <><X className="w-4 h-4 mr-1" />Close</> : <><Plus className="w-4 h-4 mr-1" />Add New</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="nb-card p-6 mb-6">
          {error && (
            <div className="mb-4 border-2 border-destructive bg-destructive/10 px-4 py-3 font-mono text-xs text-destructive">
              {error}
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-graphite block mb-2">
                Email<span className="text-azure">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-2 border-graphite px-3 py-2 bg-signal font-mono text-sm outline-none"
              />
            </div>
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-graphite block mb-2">
                Initial Password<span className="text-azure">*</span>
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full border-2 border-graphite px-3 py-2 bg-signal font-mono text-sm outline-none"
              />
            </div>
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-graphite block mb-2">
              Roles<span className="text-azure">*</span>
            </label>
            <div className="grid sm:grid-cols-3 gap-2">
              {ROLES.map((role) => (
                <label key={role} className="flex items-center gap-2 border-2 border-graphite px-3 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={roles.includes(role)}
                    onChange={() => toggleRole(role)}
                  />
                  <span className="font-mono text-xs">{ROLE_LABELS[role]}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={submitting} className="nb-btn bg-navy text-signal px-6 py-3 text-xs mt-4 disabled:opacity-60">
            {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating…</> : "Create User"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : users.length === 0 ? (
        <div className="border-2 border-dashed border-graphite p-8 text-center font-mono text-xs uppercase text-muted-foreground">
          No staff accounts found. Click "Add New" to create one.
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="border-2 border-graphite flex items-start justify-between gap-4 p-4 hover:bg-muted transition-colors">
              <div className="flex-1 min-w-0">
                <div className="font-heading text-graphite text-sm uppercase truncate">{u.email}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {u.roles.map((role) => (
                    <span key={role} className="font-mono text-[10px] uppercase bg-navy text-signal px-2 py-1">
                      {ROLE_LABELS[role] || role}
                    </span>
                  ))}
                </div>
              </div>
              {u.id !== currentUser?.id && (
                <button
                  onClick={() => handleDelete(u.id)}
                  className="border-2 border-destructive text-destructive p-2 hover:bg-destructive hover:text-signal transition-colors flex-shrink-0"
                  aria-label="Remove access"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
