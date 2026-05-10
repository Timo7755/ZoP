import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import { DRUPAL_BASE } from "#/config";

interface DrupalOglas {
  id: string;
  relationships: {
    field_slika: { data: { id: string } | null };
  };
}

interface DrupalIncluded {
  id: string;
  type: string;
  attributes: {
    uri?: { url: string };
  };
}

interface OglasnaDeskaData {
  oglasi: DrupalOglas[];
  included?: DrupalIncluded[];
}

const getOglasi = createServerFn({ method: "GET" }).handler(
  async (): Promise<OglasnaDeskaData> => {
    const res = await fetch(
      `${DRUPAL_BASE}/jsonapi/node/oglas?include=field_slika&sort=-created`,
    );
    if (!res.ok) throw new Error("Failed to fetch oglasi");
    const json = (await res.json()) as {
      data: DrupalOglas[];
      included?: DrupalIncluded[];
    };
    return { oglasi: json.data, included: json.included };
  },
);

export const Route = createFileRoute("/oglasna-deska")({
  head: () => ({
    meta: [{ title: "Zgodbe o Pomurju — Oglasna deska" }],
  }),
  loader: () => getOglasi(),
  component: OglasnaDeskaPage,
});

function OglasnaDeskaPage() {
  const { oglasi, included } = Route.useLoaderData();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  function getImageUrl(imageId: string | undefined): string | null {
    if (!imageId || !included) return null;
    const file = included.find(
      (f) => f.id === imageId && f.type === "file--file",
    );
    return file?.attributes.uri
      ? `${DRUPAL_BASE}${file.attributes.uri.url}`
      : null;
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIndex(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const images = oglasi
    .map((oglas) => getImageUrl(oglas.relationships.field_slika.data?.id))
    .filter((url): url is string => url !== null);

  return (
    <main>
      {images.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-20">
          Trenutno ni oglasov.
        </p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-12 px-6 pb-10">
          {" "}
          {images.map((url, i) => (
            <ScrollReveal
              key={i}
              delay={i * 60}
              className="break-inside-avoid mb-10"
            >
              <button
                onClick={() => setLightboxIndex(i)}
                className="w-full cursor-pointer"
              >
                <img
                  src={url}
                  className="w-full object-cover hover:opacity-90 transition-opacity duration-200"
                />
              </button>
            </ScrollReveal>
          ))}
        </div>
      )}
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-6 text-white text-4xl font-light"
            onClick={() => setLightboxIndex(null)}
          >
            ×
          </button>
          <button
            className="absolute left-4 text-white text-4xl font-light px-4 py-2"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                (lightboxIndex - 1 + images.length) % images.length,
              );
            }}
          >
            ‹
          </button>
          <img
            src={images[lightboxIndex]}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 text-white text-4xl font-light px-4 py-2"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % images.length);
            }}
          >
            ›
          </button>
          <span className="absolute bottom-4 text-white/60 text-sm">
            {lightboxIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </main>
  );
}
