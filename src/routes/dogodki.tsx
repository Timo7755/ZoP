import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ScrollReveal } from "../components/ScrollReveal";

const DRUPAL_BASE = "http://zop-web-blog.ddev.site";

interface DrupalDogodek {
  id: string;
  attributes: {
    title: string;
    field_datum: string | null;
    field_kraj: string | null;
    field_telo: Array<{ processed: string }>;
  };
}

const getDogodki = createServerFn({ method: "GET" }).handler(
  async (): Promise<DrupalDogodek[]> => {
    const res = await fetch(
      `${DRUPAL_BASE}/jsonapi/node/dogodek?sort=field_datum&fields[node--dogodek]=title,field_datum,field_kraj,field_telo`,
    );
    if (!res.ok) throw new Error("Failed to fetch dogodki");
    const json = (await res.json()) as { data: DrupalDogodek[] };
    return json.data;
  },
);

export const Route = createFileRoute("/dogodki")({
  head: () => ({
    meta: [{ title: "Zgodbe o Pomurju — Dogodki" }],
  }),
  loader: () => getDogodki(),
  component: DogodkiPage,
});

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("sl-SI", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function EventItem({
  event,
  index,
  openId,
  setOpenId,
}: {
  event: DrupalDogodek;
  index: number;
  openId: string | null;
  setOpenId: (id: string | null) => void;
}) {
  const isOpen = openId === event.id;
  return (
    <ScrollReveal delay={index * 60}>
      <div className="border-b border-gray-200">
        <button
          onClick={() => setOpenId(isOpen ? null : event.id)}
          className="w-full flex items-center justify-between py-5 px-2 text-left group cursor-pointer"
        >
          <div className="flex flex-wrap items-center gap-3">
            {event.attributes.field_datum && (
              <>
                <span className="text-3xl font-black uppercase text-black">
                  {formatDate(event.attributes.field_datum)}
                </span>
                <span className="text-3xl font-black text-black">/</span>
              </>
            )}
            <span className="text-3xl font-black uppercase text-black">
              {event.attributes.title}
            </span>
            {event.attributes.field_kraj && (
              <>
                <span className="text-3xl font-black text-black">/</span>
                <span className="text-3xl font-black uppercase text-black">
                  {event.attributes.field_kraj}
                </span>
              </>
            )}
          </div>
          {event.attributes.field_telo.length > 0 && (
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
          )}
        </button>
        {isOpen && event.attributes.field_telo[0] && (
          <div className="px-2 pb-6 max-w-6xl">
            <div
              className="prose prose-s max-w-none text-black font-semibold"
              dangerouslySetInnerHTML={{
                __html: event.attributes.field_telo[0].processed,
              }}
            />
          </div>
        )}
      </div>
    </ScrollReveal>
  );
}

function DogodkiPage() {
  const dogodki = Route.useLoaderData();
  const [openId, setOpenId] = useState<string | null>(null);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcoming = dogodki.filter((d) => {
    if (!d.attributes.field_datum) return true;
    const [y, m, day] = d.attributes.field_datum.split("-").map(Number);
    return new Date(y, m - 1, day) >= now;
  });

  const past = [...dogodki]
    .filter((d) => {
      if (!d.attributes.field_datum) return false;
      const [y, m, day] = d.attributes.field_datum.split("-").map(Number);
      return new Date(y, m - 1, day) < now;
    })
    .reverse();

  return (
    <main>
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <ScrollReveal>
          <h1 className="text-5xl font-black uppercase text-center mb-16">
            Dogodki
          </h1>
        </ScrollReveal>

        {dogodki.length === 0 && (
          <ScrollReveal>
            <p className="text-center text-gray-400 text-sm py-20">
              Trenutno ni načrtovanih dogodkov.
            </p>
          </ScrollReveal>
        )}

        {upcoming.length > 0 && (
          <section className="mb-16">
            <ScrollReveal>
              <h2 className="text-s font-black uppercase text-black mb-4 border-b border-gray-200 pb-4">
                Prihajajoči dogodki
              </h2>
            </ScrollReveal>
            {upcoming.map((event, i) => (
              <EventItem
                key={event.id}
                event={event}
                index={i}
                openId={openId}
                setOpenId={setOpenId}
              />
            ))}
          </section>
        )}

        {past.length > 0 && (
          <section>
            <ScrollReveal>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4 border-b border-gray-200 pb-4">
                Pretekli dogodki
              </h2>
            </ScrollReveal>
            {past.map((event, i) => (
              <EventItem
                key={event.id}
                event={event}
                index={i}
                openId={openId}
                setOpenId={setOpenId}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
