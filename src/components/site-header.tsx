import { Link } from "@tanstack/react-router";
import { useState } from "react";
import logo from "../assets/entdecker-logo.png.asset.json";

const links = [
  { to: "/", label: "Home" },
  { to: "/tour-packages", label: "Tour Packages" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-deep-forest/10 bg-surface/90 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-(--container-max) items-center justify-between px-gutter py-2">
        <Link to="/" className="flex items-center" aria-label="Entdecker Safaris home">
          <img
            src={logo.url}
            alt="Entdecker Safaris logo"
            className="h-16 w-auto mix-blend-multiply md:h-20"
            width={1536}
            height={1024}
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
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

        <Link
          to="/contact"
          className="hidden rounded-sm bg-deep-forest px-6 py-3 text-horizon-sand shadow-editorial transition-opacity duration-300 hover:opacity-90 md:block label"
        >
          Book Now
        </Link>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-deep-forest md:hidden"
        >
          <span className="material-symbols-outlined text-[24px]">{open ? "close" : "menu"}</span>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-deep-forest/10 bg-surface px-gutter py-4 md:hidden">
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
