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
              className="h-32 w-auto mix-blend-multiply md:h-36"
              width={1536}
              height={1024}
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
          <h4 className="label mb-6 text-savannah-gold">Legal</h4>
          <ul className="space-y-4 text-body-md">
            <li>
              <a
                href="#"
                className="text-surface-variant/70 transition-colors duration-200 hover:text-savannah-gold"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-surface-variant/70 transition-colors duration-200 hover:text-savannah-gold"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-(--container-max) border-t border-surface-variant/10 px-gutter pb-8 pt-8 text-center">
        <p className="label text-surface-variant/50">
          © 2024 Entdecker Safaris. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
