import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = "/admin";
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-azure mb-8 hover:underline underline-offset-4">
          <ArrowLeft className="w-4 h-4" /> Back to site
        </Link>

        <div className="bg-card border-2 border-graphite nb-shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-navy border-2 border-graphite flex items-center justify-center">
              <Lock className="w-6 h-6 text-signal" />
            </div>
            <div>
              <div className="font-heading text-graphite text-lg uppercase">Admin Login</div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase">IECEP Command Center</div>
            </div>
          </div>

          {error && (
            <div className="mb-4 border-2 border-destructive bg-destructive/10 px-4 py-3 font-mono text-xs text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-graphite block mb-2">Email</label>
              <div className="relative border-2 border-graphite">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-card font-mono text-sm outline-none"
                  placeholder="admin@iecep.org"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-xs uppercase tracking-widest text-graphite">Password</label>
                <Link to="/forgot-password" className="font-mono text-[10px] uppercase text-azure hover:underline underline-offset-4">
                  Forgot password?
                </Link>
              </div>
              <div className="relative border-2 border-graphite">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-card font-mono text-sm outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="nb-btn bg-azure text-navy w-full px-6 py-3 text-sm justify-center disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Authenticating…</>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>
        </div>

        <div className="mt-4 font-mono text-[10px] text-signal/50 text-center">
          AUTHORIZED PERSONNEL ONLY · IECEP NATIONAL ADMINISTRATION
        </div>
      </div>
    </div>
  );
}