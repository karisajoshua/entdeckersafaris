import { Link } from "@tanstack/react-router";
import logo from "../assets/entdecker-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="w-full bg-deep-forest text-horizon-sand">
      <div className="mx-auto grid max-w-(--container-max) grid-cols-1 gap-8 px-gutter py-section-mobile md:grid-cols-4 md:py-section-desktop">
        <div className="col-span-1 pr-8 md:col-span-2">
          <Link
            to="/"
            className="mb-6 inline-block rounded-lg bg-horizon-sand px-6 py-4"
            aria-label="Entdecker Safaris home"
          >
            <img
              src={logo.url}
              alt="Entdecker Safaris logo"
              className="h-32 w-auto md:h-36"
              width={940}
              height={800}
              loading="lazy"
            />

          </Link>
          <p className="max-w-[400px] text-body-md text-surface-variant/70">
            Crafting luxurious, organic, and highly personalized safari experiences across Kenya's
            most breathtaking landscapes.
          </p>
        </div>

        <div>
          <h4 className="label mb-6 text-savannah-gold">Contact</h4>
          <ul className="space-y-4 text-body-md">
            <li className="text-surface-variant/70">Nairobi, Kenya</li>
            <li>
              <a
                href="tel:+254721886882"
                className="text-surface-variant/70 transition-colors duration-200 hover:text-savannah-gold"
              >
                +254 721 886 882
              </a>
            </li>
            <li>
              <a
                href="tel:+254104886882"
                className="text-surface-variant/70 transition-colors duration-200 hover:text-savannah-gold"
              >
                +254 104 886 882
              </a>
            </li>
            <li>
              <a
                href="mailto:info@entdeckersafaris.com"
                className="text-surface-variant/70 transition-colors duration-200 hover:text-savannah-gold"
              >
                info@entdeckersafaris.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="label mb-6 text-savannah-gold">Explore</h4>
          <ul className="space-y-4 text-body-md">
            <li>
              <Link
                to="/tour-packages"
                className="text-surface-variant/70 transition-colors duration-200 hover:text-savannah-gold"
              >
                Tour Packages
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className="text-surface-variant/70 transition-colors duration-200 hover:text-savannah-gold"
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="text-surface-variant/70 transition-colors duration-200 hover:text-savannah-gold"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-surface-variant/70 transition-colors duration-200 hover:text-savannah-gold"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

      </div>

      <div className="mx-auto max-w-(--container-max) border-t border-surface-variant/10 px-gutter pb-8 pt-8 text-center">
        <p className="label text-surface-variant/50">
          © 2026 Entdecker Safaris. All rights reserved.
        </p>
        <p className="label mt-2 text-surface-variant/40">
          Powered by Texcortech Systems
        </p>
      </div>
    </footer>
  );
}
