import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { useI18n, LANGS, LANG_LABELS } from "@/lib/i18n";
import logo from "../assets/entdecker-badge.png.asset.json";

const links = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

const tourLinks = [
  { to: "/day-tours", label: "Day Tours & Excursions" },
  { to: "/safaris", label: "Safaris" },
] as const;


export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useSession();
  const { t, lang, setLang } = useI18n();
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
    <header className="fixed top-0 z-50 w-full border-b border-savannah-gold/30 bg-surface/90 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-(--container-max) items-center justify-between px-gutter py-3">
        <Link to="/" className="flex items-center" aria-label="Entdecker Safaris home">
          <img
            src={logo.url}
            alt="Entdecker Safaris logo"
            className="h-24 w-auto md:h-28"
            width={1016}
            height={1020}
          />

        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <Link to="/" className="label pb-1 text-on-surface-variant transition-colors duration-300 hover:text-savannah-gold" activeOptions={{ exact: true }} activeProps={{ className: "label pb-1 text-savannah-gold border-b border-savannah-gold" }}>
            {t("Home")}
          </Link>
          <div className="group relative">
            <button type="button" className="label flex items-center gap-1 pb-1 text-on-surface-variant transition-colors hover:text-savannah-gold">
              {t("Tour Packages")}
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>
            <div className="invisible absolute left-0 top-full z-50 min-w-60 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="flex flex-col rounded-sm border border-savannah-gold/30 bg-surface p-2 shadow-editorial">
                {tourLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="label rounded-sm px-4 py-3 text-on-surface-variant hover:bg-surface-container-lowest hover:text-savannah-gold" activeProps={{ className: "label rounded-sm px-4 py-3 text-savannah-gold" }}>
                    {t(link.label)}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {links.slice(1).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="label pb-1 text-on-surface-variant transition-colors duration-300 hover:text-savannah-gold"
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{
                className: "label pb-1 text-savannah-gold border-b border-savannah-gold",
              }}
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <div className="flex items-center gap-1" role="group" aria-label="Language">
            {LANGS.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`label rounded-sm px-2 py-1 transition-colors duration-200 ${
                  lang === code
                    ? "bg-deep-forest text-horizon-sand"
                    : "text-on-surface-variant hover:text-savannah-gold"
                }`}
              >
                {LANG_LABELS[code]}
              </button>
            ))}
          </div>

          {!loading &&
            (user ? (
              <>
                <Link
                  to="/admin"
                  className="label text-on-surface-variant transition-colors duration-300 hover:text-savannah-gold"
                >
                  {t("Admin")}
                </Link>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="label text-on-surface-variant transition-colors duration-300 hover:text-savannah-gold"
                >
                  {t("Sign Out")}
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="label text-on-surface-variant transition-colors duration-300 hover:text-savannah-gold"
              >
                {t("Sign In")}
              </Link>
            ))}

          <Link
            to="/contact"
            className="rounded-sm bg-deep-forest px-6 py-3 text-horizon-sand shadow-editorial transition-opacity duration-300 hover:opacity-90 label"
          >
            {t("Book Now")}
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
          <span className="label pt-3 text-on-surface-variant/70">{t("Tour Packages")}</span>
          {tourLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="label py-3 pl-4 text-on-surface-variant" activeProps={{ className: "label py-3 pl-4 text-savannah-gold" }}>
              {t(link.label)}
            </Link>
          ))}
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="label py-3 text-on-surface-variant"
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "label py-3 text-savannah-gold" }}
            >
              {t(link.label)}
            </Link>
          ))}

          <div className="mt-2 flex gap-2 border-t border-deep-forest/10 pt-4" role="group" aria-label="Language">
            {LANGS.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`label rounded-sm border px-3 py-2 transition-colors duration-200 ${
                  lang === code
                    ? "border-deep-forest bg-deep-forest text-horizon-sand"
                    : "border-deep-forest/20 text-on-surface-variant"
                }`}
              >
                {LANG_LABELS[code]}
              </button>
            ))}
          </div>

          {!loading && (
            <div className="mt-2 flex flex-col gap-1 border-t border-deep-forest/10 pt-2">
              {user ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="label py-3 text-savannah-gold"
                  >
                    {t("Admin")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleSignOut()}
                    className="label py-3 text-left text-on-surface-variant"
                  >
                    {t("Sign Out")}
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="label py-3 text-savannah-gold"
                >
                  {t("Sign In")}
                </Link>
              )}
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
