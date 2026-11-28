import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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

import { collections } from "../lib/collections";



export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [toursOpen, setToursOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const desktopMenu = useRef<HTMLDivElement>(null);
  const desktopTrigger = useRef<HTMLButtonElement>(null);
  const closeTours = () => { setToursOpen(false); setActiveCategory(null); };
  const closeMobile = () => { setOpen(false); closeTours(); };
  useEffect(() => {
    const onPointer = (event: PointerEvent) => { if (desktopMenu.current && !desktopMenu.current.contains(event.target as Node) && window.matchMedia("(min-width: 1024px)").matches) { setToursOpen(false); setActiveCategory(null); } };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setToursOpen(false); setActiveCategory(null); setOpen(false); if (desktopMenu.current?.contains(document.activeElement)) desktopTrigger.current?.focus(); } };
    document.addEventListener("pointerdown", onPointer); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onPointer); document.removeEventListener("keydown", onKey); };
  }, []);
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
          <div ref={desktopMenu} className="relative">
            <button ref={desktopTrigger} type="button" aria-expanded={toursOpen} aria-controls="desktop-tour-menu" onClick={() => { if (toursOpen) closeTours(); else setToursOpen(true); }} className="label flex items-center gap-1 pb-1 text-on-surface-variant hover:text-savannah-gold">
              {t("Tour Packages")} <span aria-hidden="true" className="material-symbols-outlined text-[18px]">{toursOpen ? "expand_less" : "expand_more"}</span>
            </button>
            {toursOpen && <div id="desktop-tour-menu" className="absolute left-0 top-full z-50 w-[min(700px,85vw)] -translate-x-1/4 pt-4">
              <div className="overflow-hidden rounded-lg border border-savannah-gold/30 bg-surface shadow-editorial">
                <Link to="/tour-packages" search={{}} onClick={closeTours} className="label block border-b border-deep-forest/10 px-6 py-4 text-savannah-gold">Safari Escapes →</Link>
                <div className="grid grid-cols-[1fr_1.25fr]">
                  <div className="bg-surface-container-low p-3">
                    {collections.map(c => <button key={c.slug} type="button" aria-expanded={activeCategory === c.slug} onClick={() => setActiveCategory(activeCategory === c.slug ? null : c.slug)} className={`flex w-full items-center justify-between gap-2 rounded px-4 py-4 text-left text-sm font-medium ${activeCategory === c.slug ? "bg-deep-forest text-horizon-sand" : "text-deep-forest hover:bg-surface"}`}>{c.name}<span aria-hidden="true" className="material-symbols-outlined text-lg">chevron_right</span></button>)}
                  </div>
                  <div className="p-5">
                    {collections.filter(c => c.slug === activeCategory).map(c => <div key={c.slug}><h3 className="mb-3 font-semibold text-deep-forest">{c.name}</h3>{c.packages.map(p => <Link key={p.slug} to="/tours/$slug" params={{slug:p.slug}} onClick={closeTours} className="block rounded px-2 py-3 text-sm text-on-surface-variant hover:bg-surface-container-low hover:text-savannah-gold">{p.name}</Link>)}<Link to="/tour-packages" search={{collection:c.slug}} onClick={closeTours} className="label mt-4 block text-savannah-gold">Explore category →</Link></div>)}
                    {!activeCategory && <p className="p-4 text-sm text-on-surface-variant">Select a safari category to discover its journeys.</p>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 border-t border-deep-forest/10 px-6 py-4"><Link to="/day-tours" onClick={closeTours} className="label text-deep-forest hover:text-savannah-gold">Day Tours & Excursions</Link></div>
              </div>
            </div>}
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
          aria-expanded={open}
          onClick={() => { if (open) closeMobile(); else { closeTours(); setOpen(true); } }}
          className="p-2 text-deep-forest lg:hidden"
        >
          <span className="material-symbols-outlined text-[24px]">{open ? "close" : "menu"}</span>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 max-h-[75vh] overflow-y-auto border-t border-deep-forest/10 bg-surface px-gutter py-4 lg:hidden">
          <Link to="/" onClick={closeMobile} className="label py-3 text-on-surface-variant" activeOptions={{ exact: true }} activeProps={{ className: "label py-3 text-savannah-gold" }}>
            {t("Home")}
          </Link>
          <button type="button" aria-expanded={toursOpen} aria-controls="mobile-tour-menu" onClick={() => { if (toursOpen) closeTours(); else setToursOpen(true); }} className="label flex items-center justify-between py-3 text-left text-deep-forest">{t("Tour Packages")}<span aria-hidden="true" className="material-symbols-outlined">{toursOpen ? "expand_less" : "expand_more"}</span></button>
          {toursOpen && <div id="mobile-tour-menu" className="space-y-1 border-l border-savannah-gold/40 pl-3">
            <Link to="/tour-packages" search={{}} onClick={closeMobile} className="label block py-3 text-savannah-gold">Safari Escapes →</Link>
            {collections.map(c => <div key={c.slug}><button type="button" aria-expanded={activeCategory === c.slug} onClick={() => setActiveCategory(activeCategory === c.slug ? null : c.slug)} className="flex w-full items-center justify-between gap-2 py-3 text-left text-sm font-semibold text-deep-forest">{c.name}<span aria-hidden="true" className="material-symbols-outlined">{activeCategory === c.slug ? "expand_less" : "expand_more"}</span></button>{activeCategory === c.slug && <div className="space-y-1 border-l border-deep-forest/10 pl-4">{c.packages.map(p => <Link key={p.slug} to="/tours/$slug" params={{slug:p.slug}} onClick={closeMobile} className="block py-3 text-sm text-on-surface-variant">{p.name}</Link>)}<Link to="/tour-packages" search={{collection:c.slug}} onClick={closeMobile} className="label block py-3 text-savannah-gold">Explore category →</Link></div>}</div>)}
            <Link to="/day-tours" onClick={closeMobile} className="label block py-3 text-deep-forest">Day Tours & Excursions</Link>
          </div>}
          {links.slice(1).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMobile}
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
                    onClick={closeMobile}
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
                  onClick={closeMobile}
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
