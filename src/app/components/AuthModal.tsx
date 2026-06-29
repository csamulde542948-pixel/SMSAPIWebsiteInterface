import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail, User, X } from "lucide-react";
import { toast } from "sonner";
import { formatFirebaseAuthError, resetPassword, signInWithEmail, signInWithGoogle, signUpWithEmail } from "../lib/firebaseAuth";
import { OpenSMSLogo } from "./OpenSMSLogo";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
  mode?: "signin" | "signup";
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

function passwordStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#EF4444", "#F59E0B", "#EAB308", "#22C55E", "#16A34A"];
  return { score, label: labels[score], color: colors[score] };
}

export function AuthModal({ open, onClose, onSuccess, onPrivacy, onTerms, mode = "signin" }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup">(mode);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const isSignup = tab === "signup";
  const strength = passwordStrength(password);

  useEffect(() => {
    if (open) {
      setTab(mode);
      setForgotMode(false);
      setResetSent(false);
      setError("");
      setTimeout(() => {
        if (mode === "signup") nameRef.current?.focus();
        else emailRef.current?.focus();
      }, 100);
    }
  }, [open, mode]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (isSignup && !name.trim()) return;
    setBusy(true);
    setError("");
    try {
      if (isSignup) {
        await signUpWithEmail(name, email, password);
      } else {
        await signInWithEmail(email, password);
      }
      onSuccess();
    } catch (event: any) {
      setError(formatFirebaseAuthError(event));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setError("");
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (event: any) {
      setError(formatFirebaseAuthError(event));
    } finally {
      setBusy(false);
    }
  }

  async function handleResetPassword(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError("");
    try {
      await resetPassword(email);
      setResetSent(true);
      toast.success("Reset link sent", { description: "Check your inbox for password reset instructions." });
    } catch (event: any) {
      setError(formatFirebaseAuthError(event));
    } finally {
      setBusy(false);
    }
  }

  function switchTab(next: "signin" | "signup") {
    setTab(next);
    setForgotMode(false);
    setResetSent(false);
    setError("");
    setPassword("");
    setTimeout(() => {
      if (next === "signup") nameRef.current?.focus();
      else emailRef.current?.focus();
    }, 50);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative w-full max-w-[440px] overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_40px_120px_rgba(5,8,20,0.28)]"
      >
        <div className="p-7">
          <div className="flex items-center justify-between">
            <OpenSMSLogo className="h-[22px] w-auto" />
            <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl text-subtle-foreground transition hover:bg-surface hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-1 rounded-2xl bg-secondary p-1">
            <button
              type="button"
              onClick={() => switchTab("signin")}
              disabled={forgotMode}
              className={`rounded-xl py-2.5 text-[13px] font-semibold transition ${tab === "signin" && !forgotMode ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground disabled:opacity-60"}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => switchTab("signup")}
              disabled={forgotMode}
              className={`rounded-xl py-2.5 text-[13px] font-semibold transition ${tab === "signup" && !forgotMode ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground disabled:opacity-60"}`}
            >
              Get Started
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={forgotMode ? "forgot" : tab}
              initial={{ opacity: 0, x: forgotMode ? 12 : isSignup ? 12 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: forgotMode ? -12 : isSignup ? -12 : 12 }}
              transition={{ duration: 0.2 }}
            >
              {forgotMode ? (
                <>
                  <h2 className="mt-6 text-[24px] font-bold tracking-[-0.04em] text-foreground">Reset your password</h2>
                  <p className="mt-1.5 text-[14px] leading-6 text-muted-foreground">
                    {resetSent
                      ? "If an account exists for that email, a reset link is on its way."
                      : "Enter your email and we will send you a reset link."}
                  </p>
                  {!resetSent && (
                    <form onSubmit={handleResetPassword} className="mt-5 space-y-3">
                      <label className="block">
                        <span className="text-[12.5px] font-semibold text-label">Email</span>
                        <div className="mt-1.5 flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10">
                          <Mail className="h-4 w-4 shrink-0 text-subtle-foreground" />
                          <input
                            ref={emailRef}
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="w-full bg-transparent text-[14px] text-foreground outline-none placeholder:text-subtle-foreground"
                          />
                        </div>
                      </label>
                      {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                          {error}
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={busy || !email.trim()}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_rgba(0,132,255,0.28)] transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {busy ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        ) : (
                          "Send reset link"
                        )}
                      </button>
                    </form>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setForgotMode(false);
                      setResetSent(false);
                      setError("");
                    }}
                    className="mt-4 text-[13px] font-semibold text-brand transition hover:underline"
                  >
                    Back to sign in
                  </button>
                </>
              ) : (
                <>
              <h2 className="mt-6 text-[24px] font-bold tracking-[-0.04em] text-foreground">
                {isSignup ? "Create your account" : "Welcome back"}
              </h2>
              <p className="mt-1.5 text-[14px] leading-6 text-muted-foreground">
                {isSignup ? "Start routing SMS through your gateway network." : "Sign in to manage your SMS gateway console."}
              </p>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={busy}
                className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-white px-5 py-3 text-[14px] font-semibold text-foreground transition hover:border-border hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-black/10" />
                <span className="text-[12px] font-medium text-subtle-foreground">or with email</span>
                <div className="h-px flex-1 bg-black/10" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {isSignup && (
                  <label className="block">
                    <span className="text-[12.5px] font-semibold text-label">Full name</span>
                    <div className="mt-1.5 flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10">
                      <User className="h-4 w-4 shrink-0 text-subtle-foreground" />
                      <input
                        ref={nameRef}
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Juan Dela Cruz"
                        className="w-full bg-transparent text-[14px] text-foreground outline-none placeholder:text-subtle-foreground"
                      />
                    </div>
                  </label>
                )}

                <label className="block">
                  <span className="text-[12.5px] font-semibold text-label">Email</span>
                  <div className="mt-1.5 flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10">
                    <Mail className="h-4 w-4 shrink-0 text-subtle-foreground" />
                    <input
                      ref={emailRef}
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-transparent text-[14px] text-foreground outline-none placeholder:text-subtle-foreground"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-[12.5px] font-semibold text-label">Password</span>
                  <div className="mt-1.5 flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10">
                    <Lock className="h-4 w-4 shrink-0 text-subtle-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isSignup ? "At least 8 characters" : "Enter your password"}
                      className="w-full bg-transparent text-[14px] text-foreground outline-none placeholder:text-subtle-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="shrink-0 text-subtle-foreground transition hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {isSignup && password.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex flex-1 gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all"
                            style={{ backgroundColor: i < strength.score ? strength.color : "#E2E8F0" }}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-medium" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                  )}
                </label>

                {!isSignup && (
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setRemember((v) => !v)}
                      className="flex items-center gap-2 text-[13px] text-muted-foreground transition hover:text-foreground"
                    >
                      <span className={`flex h-4 w-4 items-center justify-center rounded border transition ${remember ? "border-brand bg-brand" : "border-border bg-white"}`}>
                        {remember && <Check className="h-3 w-3 text-white" />}
                      </span>
                      Remember me
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotMode(true);
                        setResetSent(false);
                        setError("");
                        setTimeout(() => emailRef.current?.focus(), 50);
                      }}
                      className="text-[13px] font-medium text-brand transition hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_rgba(0,132,255,0.28)] transition hover:bg-brand-hover hover:shadow-[0_14px_40px_rgba(0,132,255,0.32)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brand"
                >
                  {busy ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : isSignup ? (
                    "Create account"
                  ) : (
                    "Sign in"
                  )}
                  {!busy && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              <p className="mt-4 text-center text-[12px] leading-5 text-subtle-foreground">
                {isSignup ? "Already have an account? " : "New to OpenSMS? "}
                <button
                  type="button"
                  onClick={() => switchTab(isSignup ? "signin" : "signup")}
                  className="font-semibold text-brand transition hover:underline"
                >
                  {isSignup ? "Sign in" : "Create one"}
                </button>
              </p>

              <p className="mt-3 text-center text-[11px] leading-4 text-subtle-foreground">
                By continuing you agree to our{" "}
                <button type="button" onClick={onTerms} className="font-medium text-muted-foreground underline-offset-2 hover:underline">Terms</button>
                {" "}and{" "}
                <button type="button" onClick={onPrivacy} className="font-medium text-muted-foreground underline-offset-2 hover:underline">Privacy Policy</button>.
              </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
