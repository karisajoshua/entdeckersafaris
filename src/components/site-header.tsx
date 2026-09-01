import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import logo from "../assets/entdecker-logo.png.asset.json";

const links = [
  { to: "/", label: "Home" },
  { to: "/tour-packages", label: "Tour Packages" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;


export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    setOpen(false);
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/", replace: true });
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-deep-forest/10 bg-surface/90 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-(--container-max) items-center justify-between px-gutter py-3">
        <Link to="/" className="flex items-center" aria-label="Entdecker Safaris home">
          <img
            src={logo.url}
            alt="Entdecker Safaris logo"
            className="h-24 w-auto md:h-28"
            width={940}
            height={800}
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">

          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="label pb-1 text-on-surface-variant transition-colors duration-300 hover:text-savannah-gold"
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{
                className: "label pb-1 text-savannah-gold border-b border-savannah-gold",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          {!loading &&
            (user ? (
              <>
                <Link
                  to="/admin"
                  className="label text-on-surface-variant transition-colors duration-300 hover:text-savannah-gold"
                >
                  Admin
                </Link>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="label text-on-surface-variant transition-colors duration-300 hover:text-savannah-gold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="label text-on-surface-variant transition-colors duration-300 hover:text-savannah-gold"
              >
                Sign In
              </Link>
            ))}

          <Link
            to="/contact"
            className="rounded-sm bg-deep-forest px-6 py-3 text-horizon-sand shadow-editorial transition-opacity duration-300 hover:opacity-90 label"
          >
            Book Now
          </Link>
        </div>


        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-deep-forest lg:hidden"
        >
          <span className="material-symbols-outlined text-[24px]">{open ? "close" : "menu"}</span>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-deep-forest/10 bg-surface px-gutter py-4 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="label py-3 text-on-surface-variant"
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "label py-3 text-savannah-gold" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
