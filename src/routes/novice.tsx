import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ScrollReveal } from "../components/ScrollReveal";

const DRUPAL_BASE = "http://zop-web-blog.ddev.site";

interface DrupalIncluded {
  id: string;
  type: string;
  attributes: {
    uri?: { url: string };
  };
}

interface DrupalNovica {
  id: string;
  attributes: {
    title: string;
    created: string;
    path: { alias: string | null };
  };
  relationships: {
    field_field_naslovna_slika: { data: { id: string } | null };
  };
}

interface NoviceData {
  novice: DrupalNovica[];
  included?: DrupalIncluded[];
}

const getNovice = createServerFn({ method: "GET" }).handler(
  async (): Promise<NoviceData> => {
    const res = await fetch(
      `${DRUPAL_BASE}/jsonapi/node/novica?include=field_field_naslovna_slika&sort=-created`,
    );
    if (!res.ok) throw new Error("Failed to fetch novice");
    const json = (await res.json()) as {
      data: DrupalNovica[];
      included?: DrupalIncluded[];
    };
    return { novice: json.data, included: json.included };
  },
);

export const Route = createFileRoute("/novice")({
  head: () => ({
    meta: [{ title: "Zgodbe o Pomurju — Novice" }],
  }),
  component: NovicePage,
  loader: () => getNovice(),
});

function NovicePage() {
  const { novice, included } = Route.useLoaderData();

  function getImageUrl(imageId: string | undefined): string | null {
    if (!imageId || !included) return null;
    const file = included.find(
      (f: DrupalIncluded) => f.id === imageId && f.type === "file--file",
    );
    return file?.attributes.uri
      ? `${DRUPAL_BASE}${file.attributes.uri.url}`
      : null;
  }

  function getSlug(novica: DrupalNovica): string {
    const alias = novica.attributes.path.alias;
    if (alias) {
      const parts = alias.split("/").filter(Boolean);
      return parts[parts.length - 1];
    }
    return novica.id;
  }

  return (
    <main>
      <div className="columns-1 sm:columns-2 lg:columns-3 px-6">
        {novice.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500 py-20">
            Še ni novic.
          </p>
        ) : (
          novice.map((novica: DrupalNovica, index: number) => {
            const imageId =
              novica.relationships.field_field_naslovna_slika.data?.id;
            const imageUrl = getImageUrl(imageId);
            const slug = getSlug(novica);
            const date = new Date(novica.attributes.created).toLocaleDateString(
              "sl-SI",
              { day: "numeric", month: "numeric", year: "2-digit" },
            );

            return (
              <ScrollReveal
                key={novica.id}
                delay={index * 80}
                className="break-inside-avoid mb-6"
              >
                <article className="break-inside-avoid mb-6">
                  <Link to="/novica/$slug" params={{ slug }}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={novica.attributes.title}
                        className="w-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100" />
                    )}

                    <div className="px-6 pt-4 pb-8 text-center">
                      <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase mb-2">
                        {date}
                      </p>
                      <h2 className="text-4xl font-black uppercase leading-tight text-black hover:text-gray-700 transition-colors">
                        {novica.attributes.title}
                      </h2>
                      <span className="inline-block mt-4 text-sm font-semibold text-[#ec3032] hover:underline">
                        Preberi več
                      </span>
                    </div>
                  </Link>
                </article>
              </ScrollReveal>
            );
          })
        )}
      </div>
    </main>
  );
}
