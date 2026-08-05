import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, KeyRound } from "lucide-react";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await base44.auth.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-navy border-2 border-graphite flex items-center justify-center">
          <KeyRound className="w-5 h-5 text-signal" />
        </div>
        <h3 className="font-heading text-graphite text-xl uppercase">Change Password</h3>
      </div>

      <form onSubmit={handleSubmit} className="nb-card p-6 max-w-md">
        {error && (
          <div className="mb-4 border-2 border-destructive bg-destructive/10 px-4 py-3 font-mono text-xs text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 border-2 border-azure bg-azure/10 px-4 py-3 font-mono text-xs text-azure">
            Password updated.
          </div>
        )}

        <div className="mb-4">
          <label className="font-mono text-xs uppercase tracking-widest text-graphite block mb-2">
            Current Password<span className="text-azure">*</span>
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full border-2 border-graphite px-3 py-2 bg-signal font-mono text-sm outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="font-mono text-xs uppercase tracking-widest text-graphite block mb-2">
            New Password<span className="text-azure">*</span>
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="w-full border-2 border-graphite px-3 py-2 bg-signal font-mono text-sm outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="font-mono text-xs uppercase tracking-widest text-graphite block mb-2">
            Confirm New Password<span className="text-azure">*</span>
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full border-2 border-graphite px-3 py-2 bg-signal font-mono text-sm outline-none"
          />
        </div>

        <button type="submit" disabled={submitting} className="nb-btn bg-navy text-signal px-6 py-3 text-xs disabled:opacity-60">
          {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating…</> : "Update Password"}
        </button>
      </form>
    </div>
  );
}
