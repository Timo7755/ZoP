import { Link, useRouterState } from "@tanstack/react-router";

import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
  { to: "/" as const, label: "DOMOV" },
  { to: "/clanki" as const, label: "ČLANKI", activePrefix: "/clanek" },
  { to: "/novice" as const, label: "NOVICE" },
  { to: "/dogodki" as const, label: "DOGODKI" },
  { to: "/ponudniki" as const, label: "PONUDNIKI" },
  { to: "/oglasna-deska" as const, label: "OGLASNA DESKA" },
  { to: "/video-vsebine" as const, label: "VIDEO VSEBINE" },
];

export default function Header() {
  const [hidden, setHidden] = useState(false);

  const lastScrollY = useRef(0);
  const { location } = useRouterState();
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY <= 0) {
        setHidden(false);
      } else if (currentY > lastScrollY.current) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-[#ea191b]/90 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center gap-5">
        <div className="w-full flex items-center justify-start gap-5">
          <a
            href="https://www.youtube.com/@ZgodbeoPomurju"
            aria-label="YouTube"
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/zgodbe.o.pomurju/"
            aria-label="Instagram"
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12c0-3.2 0-3.6.1-4.8C2.4 3.9 4 2.3 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1.0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9C23.7 2.7 21.3.3 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z" />
            </svg>
          </a>
          <a
            href="https://www.tiktok.com/@zgodbeopomurju"
            aria-label="TikTok"
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.6 3a3.6 3.6 0 0 1-3.6-3h-3v12.4a2.1 2.1 0 1 1-2.9-2V7a5.1 5.1 0 1 0 5.9 5V8.4a7.6 7.6 0 0 0 4.4 1.4V6.4A3.6 3.6 0 0 1 19.6 3z" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/zgodbeopomurju/"
            aria-label="https://www.facebook.com/zgodbeopomurju/"
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1C0 18.1 4.4 23 10.1 24v-8.4H7.1v-3.5h3V9.7c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.2h3.3l-.5 3.5h-2.8V24C19.6 23 24 18.1 24 12.1z" />
            </svg>
          </a>
        </div>

        <Link to="/" className="flex flex-col items-center">
          <span
            className="text-6xl text-white"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Zgodbe o Pomurju
          </span>
          <span className="text-white text-xs tracking-[0.3em] mt-1 pb-4">
            POMURSKI SPLETNI MEDIJ
          </span>
        </Link>

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {NAV_LINKS.map(({ to, label, activePrefix }) => {
            const isActive =
              location.pathname === to ||
              (activePrefix && location.pathname.startsWith(activePrefix));
            return (
              <Link
                key={label}
                to={to}
                className={
                  isActive
                    ? "text-sm font-semibold tracking-widest text-white underline underline-offset-4"
                    : "text-sm font-semibold tracking-widest text-white/80 hover:text-white transition-colors"
                }
              >
                {label}
              </Link>
            );
          })}
          <a
            href="https://www.klaraduric.com/fotomarket"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold tracking-widest text-white/80 hover:text-white transition-colors"
          >
            FOTO MARKET
          </a>
          <a
            href="/podpora-mediju"
            className="text-sm font-semibold tracking-widest text-white/80 hover:text-white transition-colors"
          >
            PODPORA MEDIJU
          </a>
        </nav>
      </div>
    </header>
  );
}
