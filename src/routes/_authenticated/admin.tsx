import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getMyAccess } from "../../lib/admin.functions";
import logo from "../../assets/entdecker-logo.png.asset.json";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title: "Content Manager — Entdecker Safaris" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/blog", label: "Journal" },
  { to: "/admin/tours", label: "Tours" },
  { to: "/admin/enquiries", label: "Enquiries" },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const fetchAccess = useServerFn(getMyAccess);
  const { data, isPending } = useQuery({
    queryKey: ["admin-access"],
    queryFn: () => fetchAccess(),
    retry: false,
  });

  async function signOut() {
    await supabase.auth.signOut();
    await navigate({ to: "/auth" });
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="label text-on-surface-variant">Checking your access…</p>
      </div>
    );
  }

  if (!data?.isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface px-gutter text-center">
        <h1 className="text-headline-md text-deep-forest">This area is for site administrators</h1>
        <p className="max-w-md text-body-md text-on-surface-variant">
          Your account does not have administrator access. Sign in with the Entdecker Safaris
          administrator account to manage content.
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => void signOut()}
            className="label rounded-sm bg-deep-forest px-6 py-3 text-horizon-sand"
          >
            Sign out
          </button>
          <Link
            to="/"
            className="label rounded-sm border border-deep-forest/20 px-6 py-3 text-deep-forest"
          >
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 border-b border-deep-forest/10 bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-(--container-max) flex-wrap items-center justify-between gap-4 px-gutter py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo.url} alt="Entdecker Safaris" className="h-12 w-auto" />
            <span className="label text-on-surface-variant">Content manager</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: "exact" in item ? item.exact : false }}
                activeProps={{ className: "bg-deep-forest text-horizon-sand" }}
                className="label rounded-sm px-4 py-2 text-deep-forest transition-colors hover:bg-deep-forest/5"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => void signOut()}
              className="label ml-2 rounded-sm border border-deep-forest/20 px-4 py-2 text-deep-forest transition-colors hover:border-deep-forest"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-(--container-max) px-gutter py-16">
        <Outlet />
      </main>
    </div>
  );
}
