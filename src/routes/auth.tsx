import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Team Sign In — Entdecker Safaris" },
      {
        name: "description",
        content: "Sign in to the Entdecker Safaris content manager to update tours, gallery photos and journal articles.",
      },
      { property: "og:title", content: "Team Sign In — Entdecker Safaris" },
      { property: "og:description", content: "Sign in to manage Entdecker Safaris content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const fieldClass =
  "w-full rounded-sm border border-deep-forest/20 bg-transparent px-3 py-3 text-body-md text-deep-forest outline-none transition-colors focus:border-deep-forest";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        await navigate({ to: "/admin" });
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (signUpError) throw signUpError;
        setMessage("Account created. If confirmation is required, check your inbox.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    await navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md grow flex-col justify-center px-gutter py-40">
        <span className="label text-savannah-gold">Content manager</span>
        <h1 className="mb-8 mt-4 text-headline-md text-deep-forest">
          {mode === "signin" ? "Sign in" : "Create your account"}
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="label mb-2 block text-on-surface-variant" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label className="label mb-2 block text-on-surface-variant" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${fieldClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant transition-colors hover:text-deep-forest"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="label w-full rounded-sm bg-deep-forest px-8 py-4 text-horizon-sand shadow-editorial transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => void onGoogle()}
          className="label mt-4 w-full rounded-sm border border-deep-forest/20 px-8 py-4 text-deep-forest transition-colors hover:border-deep-forest"
        >
          Continue with Google
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="label mt-8 text-savannah-gold hover:text-deep-forest"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>

        {message && <p className="mt-6 text-body-md text-savannah-gold">{message}</p>}
        {error && <p className="mt-6 text-body-md text-red-700">{error}</p>}
      </main>
      <SiteFooter />
    </div>
  );
}
