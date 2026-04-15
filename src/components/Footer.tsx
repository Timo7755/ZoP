export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-10">
          {/* Left — email */}
          <div className="flex-1 flex justify-start">
            <a
              href="mailto:urednistvo@zgodbeopomurju.com"
              className="text-black hover:text-gray-600 font-bold text-md transition-colors"
            >
              urednistvo@zgodbeopomurju.com
            </a>
          </div>

          {/* Center — social icons + logo */}
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-6">
              <a
                href="https://www.youtube.com/@ZgodbeoPomurju"
                aria-label="YouTube"
                className="text-black/70 hover:text-black transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/zgodbe.o.pomurju/"
                aria-label="Instagram"
                className="text-black/70 hover:text-black transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12c0-3.2 0-3.6.1-4.8C2.4 3.9 4 2.3 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1.0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9C23.7 2.7 21.3.3 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@zgodbeopomurju"
                aria-label="TikTok"
                className="text-black/70 hover:text-black transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.6 3a3.6 3.6 0 0 1-3.6-3h-3v12.4a2.1 2.1 0 1 1-2.9-2V7a5.1 5.1 0 1 0 5.9 5V8.4a7.6 7.6 0 0 0 4.4 1.4V6.4A3.6 3.6 0 0 1 19.6 3z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/zgodbeopomurju/"
                aria-label="Facebook"
                className="text-black/70 hover:text-black transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1C0 18.1 4.4 23 10.1 24v-8.4H7.1v-3.5h3V9.7c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.2h3.3l-.5 3.5h-2.8V24C19.6 23 24 18.1 24 12.1z" />
                </svg>
              </a>
            </div>
            <img
              src="/logo/zopblack.png"
              alt="Zgodbe o Pomurju"
              className="h-30 w-auto"
            />
          </div>

          {/* Right — legal links */}
          <div className="flex-1 flex flex-col items-end gap-3">
            <a
              href="/politika-zasebnosti"
              className="text-md text-[rgb(227,25,28)] underline underline-offset-4 hover:text-[#c42527] transition-colors"
            >
              Politika zasebnosti
            </a>
            <a
              href="/pogoji-uporabe"
              className="text-md text-[rgb(227,25,28)] underline underline-offset-4 hover:text-[#c42527] transition-colors"
            >
              Pogoji uporabe
            </a>
            <a
              href="/impressum"
              className="text-md text-[rgb(227,25,28)] underline underline-offset-4 hover:text-[#c42527] transition-colors"
            >
              Impressum
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
