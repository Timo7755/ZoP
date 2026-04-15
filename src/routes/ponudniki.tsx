import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ScrollReveal } from "../components/ScrollReveal";

const DRUPAL_BASE = "http://zop-web-blog.ddev.site";

interface DrupalPonudnik {
  id: string;
  attributes: {
    title: string;
    field_tip: string | null;
    field_spletna_stran: { uri: string; title: string } | null;
  };
}

const CATEGORIES = [
  { key: "hrana", label: "BARI, RESTAVRACIJE, KAVARNE" },
  { key: "hotel", label: "HOTELI" },
  { key: "terme", label: "TERME IN KOPALIŠČA" },
  { key: "kmetija", label: "TURISTIČNE KMETIJE" },
] as const;

const getPonudniki = createServerFn({ method: "GET" }).handler(
  async (): Promise<DrupalPonudnik[]> => {
    const res = await fetch(
      `${DRUPAL_BASE}/jsonapi/node/ponudnik?sort=title&fields[node--ponudnik]=title,field_tip,field_spletna_stran`,
    );
    if (!res.ok) throw new Error("Failed to fetch ponudniki");
    const json = (await res.json()) as { data: DrupalPonudnik[] };
    return json.data;
  },
);

export const Route = createFileRoute("/ponudniki")({
  head: () => ({
    meta: [{ title: "Zgodbe o Pomurju — Ponudniki" }],
  }),
  loader: () => getPonudniki(),
  component: PonudnikiPage,
});

function getTipKey(tip: string): string {
  return tip.includes("|") ? (tip.split("|").pop() ?? tip) : tip;
}

function PonudnikiPage() {
  const ponudniki = Route.useLoaderData();
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  return (
    <main>
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <ScrollReveal>
          <h1 className="text-4xl sm:text-5xl font-black uppercase text-center mb-16 leading-tight">
            KAM SE BOSTE PA VI ODPRAVILI?
          </h1>
        </ScrollReveal>

        <div className="border-t border-gray-200">
          {CATEGORIES.map((cat, i) => {
            const items = ponudniki.filter(
              (p) =>
                p.attributes.field_tip &&
                getTipKey(p.attributes.field_tip) === cat.key,
            );

            const isOpen = openCategories.has(cat.key);

            return (
              <ScrollReveal key={cat.key} delay={i * 80}>
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => {
                      setOpenCategories((prev) => {
                        const next = new Set(prev);
                        isOpen ? next.delete(cat.key) : next.add(cat.key);
                        return next;
                      });
                    }}
                    className="w-full flex items-center justify-between py-6 px-2 text-left group cursor-pointer"
                  >
                    <span className="text-3xl font-black uppercase tracking-widest text-black group-hover:text-[#ec3032] transition-colors">
                      {cat.label}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`text-black ml-4 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="px-2 pb-8">
                      {items.length === 0 ? (
                        <p className="text-sm text-gray-400 py-2">
                          Trenutno ni ponudnikov v tej kategoriji.
                        </p>
                      ) : (
                        <ul className="flex flex-col gap-3">
                          {items.map((item) => (
                            <li
                              key={item.id}
                              className="flex items-start gap-3 text-md"
                            >
                              <span className="text-black shrink-0 self-center">
                                •
                              </span>

                              <div>
                                {item.attributes.field_spletna_stran ? (
                                  <a
                                    href={
                                      item.attributes.field_spletna_stran.uri
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold uppercase tracking-widest text-black hover:text-[#ec3032] transition-colors"
                                  >
                                    {item.attributes.title}
                                  </a>
                                ) : (
                                  <span className="font-bold uppercase tracking-widest text-black">
                                    {item.attributes.title}
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </main>
  );
}
