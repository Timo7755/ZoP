import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ScrollReveal } from "../components/ScrollReveal";

const DRUPAL_BASE = "http://zop-web-blog.ddev.site";

interface ContentCard {
  id: string;
  contentType: "article" | "novica";
  title: string;
  created: string;
  slug: string;
  imageUrl: string | null;
  tags: string[];
}

interface HomeData {
  featuredArticles: ContentCard[];
  featuredNovice: ContentCard[];
  umetnostArticles: ContentCard[];
  turContent: ContentCard[];
}

function resolveCards(
  data: any[],
  included: any[],
  contentType: "article" | "novica",
  imageField: string,
): ContentCard[] {
  return data.map((item) => {
    const imageId = item.relationships?.[imageField]?.data?.id;
    const imageFile = included.find(
      (f: any) => f.id === imageId && f.type === "file--file",
    );
    const imageUrl = imageFile?.attributes?.uri
      ? `${DRUPAL_BASE}${imageFile.attributes.uri.url}`
      : null;

    const tagRefs: Array<{ id: string }> =
      item.relationships?.field_oznake?.data ?? [];
    const tags = tagRefs
      .map(
        (ref) =>
          included.find((f: any) => f.id === ref.id && f.type === "node--tag")
            ?.attributes?.title as string | undefined,
      )
      .filter((t): t is string => Boolean(t));

    const alias = item.attributes?.path?.alias as string | null;
    const slug = alias
      ? (alias.split("/").filter(Boolean).pop() ?? item.id)
      : item.id;

    return {
      id: item.id,
      contentType,
      title: item.attributes.title,
      created: item.attributes.created,
      slug,
      imageUrl,
      tags,
    };
  });
}

const getHomeData = createServerFn({ method: "GET" }).handler(
  async (): Promise<HomeData> => {
    const [
      featArtRes,
      featNovRes,
      umetnostRes,
      turArt1Res,
      turArt2Res,
      turNov1Res,
      turNov2Res,
    ] = await Promise.all([
      fetch(
        `${DRUPAL_BASE}/jsonapi/node/article?filter[promote]=1&sort=-created&page[limit]=3&include=field_naslovna_slika,field_oznake`,
      ),
      fetch(
        `${DRUPAL_BASE}/jsonapi/node/novica?filter[promote]=1&sort=-created&page[limit]=3&include=field_field_naslovna_slika,field_oznake`,
      ),
      fetch(
        `${DRUPAL_BASE}/jsonapi/node/article?filter[field_kategorija.title]=Umetnost%20in%20Kultura&sort=-created&page[limit]=3&include=field_naslovna_slika,field_oznake`,
      ),
      fetch(
        `${DRUPAL_BASE}/jsonapi/node/article?filter[field_kategorija.title]=Kam%20na%20izlet&sort=-created&page[limit]=6&include=field_naslovna_slika,field_oznake`,
      ),
      fetch(
        `${DRUPAL_BASE}/jsonapi/node/article?filter[field_kategorija.title]=Kulinarika&sort=-created&page[limit]=6&include=field_naslovna_slika,field_oznake`,
      ),
      fetch(
        `${DRUPAL_BASE}/jsonapi/node/novica?filter[field_oznake.title]=Kam%20na%20izlet&sort=-created&page[limit]=6&include=field_field_naslovna_slika,field_oznake`,
      ),
      fetch(
        `${DRUPAL_BASE}/jsonapi/node/novica?filter[field_oznake.title]=Kulinarika&sort=-created&page[limit]=6&include=field_field_naslovna_slika,field_oznake`,
      ),
    ]);

    const [featArt, featNov, umetnost, turArt1, turArt2, turNov1, turNov2] =
      await Promise.all([
        featArtRes.json() as Promise<{ data: any[]; included?: any[] }>,
        featNovRes.json() as Promise<{ data: any[]; included?: any[] }>,
        umetnostRes.json() as Promise<{ data: any[]; included?: any[] }>,
        turArt1Res.json() as Promise<{ data: any[]; included?: any[] }>,
        turArt2Res.json() as Promise<{ data: any[]; included?: any[] }>,
        turNov1Res.json() as Promise<{ data: any[]; included?: any[] }>,
        turNov2Res.json() as Promise<{ data: any[]; included?: any[] }>,
      ]);

    // Merge + deduplicate turizem articles
    const turArtSeen = new Set<string>();
    const turArtMerged = [...(turArt1.data ?? []), ...(turArt2.data ?? [])]
      .filter((item) => {
        if (turArtSeen.has(item.id)) return false;
        turArtSeen.add(item.id);
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.attributes.created).getTime() -
          new Date(a.attributes.created).getTime(),
      );
    const turArtIncluded = [
      ...(turArt1.included ?? []),
      ...(turArt2.included ?? []),
    ];

    // Merge + deduplicate turizem novice
    const turNovSeen = new Set<string>();
    const turNovMerged = [...(turNov1.data ?? []), ...(turNov2.data ?? [])]
      .filter((item) => {
        if (turNovSeen.has(item.id)) return false;
        turNovSeen.add(item.id);
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.attributes.created).getTime() -
          new Date(a.attributes.created).getTime(),
      );
    const turNovIncluded = [
      ...(turNov1.included ?? []),
      ...(turNov2.included ?? []),
    ];

    // Combine articles + novice for turizem, sort, take 3
    const turContent = [
      ...resolveCards(
        turArtMerged,
        turArtIncluded,
        "article",
        "field_naslovna_slika",
      ),
      ...resolveCards(
        turNovMerged,
        turNovIncluded,
        "novica",
        "field_field_naslovna_slika",
      ),
    ]
      .sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
      )
      .slice(0, 3);

    return {
      featuredArticles: resolveCards(
        featArt.data ?? [],
        featArt.included ?? [],
        "article",
        "field_naslovna_slika",
      ),
      featuredNovice: resolveCards(
        featNov.data ?? [],
        featNov.included ?? [],
        "novica",
        "field_field_naslovna_slika",
      ),
      umetnostArticles: resolveCards(
        umetnost.data ?? [],
        umetnost.included ?? [],
        "article",
        "field_naslovna_slika",
      ),
      turContent,
    };
  },
);

export const Route = createFileRoute("/")({
  component: Home,
  loader: () => getHomeData(),
});

function ContentCard({ card, index }: { card: ContentCard; index: number }) {
  const href =
    card.contentType === "article"
      ? `/clanek/${card.slug}`
      : `/novica/${card.slug}`;

  return (
    <ScrollReveal delay={index * 80}>
      <article>
        <a href={href}>
          {card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt={card.title}
              className="w-full aspect-4/3 object-cover"
            />
          ) : (
            <div className="w-full aspect-4/3 bg-gray-100" />
          )}
          <div className="pt-4 pb-6 text-center">
            <h3 className="text-2xl font-black uppercase leading-tight text-black hover:text-gray-700 transition-colors mb-3">
              {card.title}
            </h3>
            {card.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold tracking-widest uppercase text-[#ec3032] border border-[#ec3032] px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </a>
      </article>
    </ScrollReveal>
  );
}

function Section({ title, cards }: { title: string; cards: ContentCard[] }) {
  if (cards.length === 0) return null;
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <ScrollReveal>
        <h2 className="text-xl font-semibold tracking-widest uppercase text-gray-700 mb-8 border-b border-gray-200 pb-4">
          {title}
        </h2>
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <ContentCard key={card.id} card={card} index={i} />
        ))}
      </div>
    </section>
  );
}

function Home() {
  const { featuredArticles, featuredNovice, umetnostArticles, turContent } =
    Route.useLoaderData();

  return (
    <main>
      <Section title="Aktualni članki" cards={featuredArticles} />
      <Section title="Aktualne novice" cards={featuredNovice} />
      <Section title="Umetnost in Kultura" cards={umetnostArticles} />
      <Section title="Turizem" cards={turContent} />
    </main>
  );
}
