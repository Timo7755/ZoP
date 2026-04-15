import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ScrollReveal } from "../components/ScrollReveal";

const DRUPAL_BASE = "http://zop-web-blog.ddev.site";

interface DrupalCategory {
  id: string;
  attributes: {
    title: string;
    path: { alias: string | null };
  };
}

interface DrupalIncluded {
  id: string;
  type: string;
  attributes: {
    uri?: { url: string };
  };
}

interface DrupalArticle {
  id: string;
  attributes: {
    title: string;
    created: string;
    path: { alias: string | null };
  };
  relationships: {
    field_naslovna_slika: { data: { id: string } | null };
    field_kategorija: { data: { id: string } | null };
  };
}

interface ClankiData {
  categories: DrupalCategory[];
  articles: DrupalArticle[];
  included?: DrupalIncluded[];
}

const getClanki = createServerFn({ method: "GET" }).handler(
  async (ctx): Promise<ClankiData> => {
    const { kategorija: categorySlug, oznaka: tagName } =
      ctx.data as unknown as {
        kategorija?: string;
        oznaka?: string;
      };

    const catRes = await fetch(
      `${DRUPAL_BASE}/jsonapi/node/category?sort=title`,
    );
    if (!catRes.ok) throw new Error("Failed to fetch categories");
    const catJson = (await catRes.json()) as { data: DrupalCategory[] };

    let articleUrl = `${DRUPAL_BASE}/jsonapi/node/article?include=field_naslovna_slika&sort=-created`;

    if (tagName) {
      articleUrl = `${DRUPAL_BASE}/jsonapi/node/article?filter[field_oznake.title]=${encodeURIComponent(tagName)}&include=field_naslovna_slika&sort=-created`;
    } else if (categorySlug) {
      const category = catJson.data.find((c: DrupalCategory) => {
        const alias = c.attributes.path.alias;
        return alias && alias.split("/").pop() === categorySlug;
      });
      if (category) {
        articleUrl = `${DRUPAL_BASE}/jsonapi/node/article?filter[field_kategorija.id]=${category.id}&include=field_naslovna_slika&sort=-created`;
      }
    }

    const artRes = await fetch(articleUrl);
    if (!artRes.ok) throw new Error("Failed to fetch articles");
    const artJson = (await artRes.json()) as {
      data: DrupalArticle[];
      included?: DrupalIncluded[];
    };

    return {
      categories: catJson.data,
      articles: artJson.data,
      included: artJson.included,
    };
  },
);

export const Route = createFileRoute("/clanki")({
  head: () => ({
    meta: [{ title: "Zgodbe o Pomurju — Članki" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    kategorija:
      typeof search.kategorija === "string" ? search.kategorija : undefined,
    oznaka: typeof search.oznaka === "string" ? search.oznaka : undefined,
  }),
  loaderDeps: ({ search }) => ({
    kategorija: search.kategorija,
    oznaka: search.oznaka,
  }),
  loader: ({ deps }) =>
    getClanki({
      data: { kategorija: deps.kategorija, oznaka: deps.oznaka } as never,
    }),
  component: ClankiPage,
});

function ClankiPage() {
  const { categories, articles, included } = Route.useLoaderData();
  const { kategorija, oznaka } = Route.useSearch();
  const navigate = useNavigate();

  const categoryMap = new Map(
    categories.map((c: DrupalCategory) => [c.id, c.attributes.title]),
  );

  function getImageUrl(imageId: string | undefined): string | null {
    if (!imageId || !included) return null;
    const file = included.find(
      (f: DrupalIncluded) => f.id === imageId && f.type === "file--file",
    );
    return file?.attributes.uri
      ? `${DRUPAL_BASE}${file.attributes.uri.url}`
      : null;
  }

  function getSlug(article: DrupalArticle): string {
    const alias = article.attributes.path.alias;
    if (alias) {
      const parts = alias.split("/").filter(Boolean);
      return parts[parts.length - 1];
    }
    return article.id;
  }

  function getCategorySlug(category: DrupalCategory): string {
    const alias = category.attributes.path.alias;
    return alias ? (alias.split("/").pop() ?? category.id) : category.id;
  }

  function handleCategoryClick(slug: string) {
    if (kategorija === slug) {
      navigate({
        to: "/clanki",
        search: { kategorija: undefined, oznaka: undefined },
      });
    } else {
      navigate({
        to: "/clanki",
        search: { kategorija: slug, oznaka: undefined },
      });
    }
  }

  return (
    <main>
      {/* Active tag filter banner */}
      {oznaka && (
        <div className="max-w-5xl mx-auto px-6 pt-8 flex items-center gap-3">
          <span className="text-xs text-gray-400 tracking-widest uppercase">
            Oznaka:
          </span>
          <span className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#ec3032] border border-[#ec3032] px-3 py-1">
            {oznaka}
            <button
              onClick={() =>
                navigate({
                  to: "/clanki",
                  search: { kategorija: undefined, oznaka: undefined },
                })
              }
              className="text-base leading-none hover:text-[#7a1a1a]"
            >
              ×
            </button>
          </span>
        </div>
      )}

      {/* Category filter */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 max-w-2xl mx-auto">
          {categories.map((category: DrupalCategory) => {
            const slug = getCategorySlug(category);
            const isActive = kategorija === slug;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(slug)}
                className={`w-48 py-4 text-center text-sm font-bold tracking-widest uppercase border-b transition-colors cursor-pointer ${
                  isActive
                    ? "text-[#7a1a1a] border-[#7a1a1a]"
                    : "text-[#7a1a1a]/60 border-[#7a1a1a]/30 hover:text-[#7a1a1a] hover:border-[#7a1a1a]"
                }`}
              >
                {category.attributes.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Article grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 px-6 py-10">
        {articles.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500 py-20">
            V tej kategoriji še ni člankov.
          </p>
        ) : (
          articles.map((article: DrupalArticle, index: number) => {
            const imageId = article.relationships.field_naslovna_slika.data?.id;
            const imageUrl = getImageUrl(imageId);
            const slug = getSlug(article);
            const date = new Date(
              article.attributes.created,
            ).toLocaleDateString("sl-SI", {
              day: "numeric",
              month: "numeric",
              year: "2-digit",
            });

            return (
              <ScrollReveal
                key={article.id}
                delay={index * 80}
                className="break-inside-avoid mb-6"
              >
                <article>
                  <Link to="/clanek/$slug" params={{ slug }}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={article.attributes.title}
                        className="w-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100" />
                    )}
                    <div className="px-6 pt-4 pb-8 text-center">
                      <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase mb-2">
                        {article.relationships.field_kategorija.data
                          ? categoryMap.get(
                              article.relationships.field_kategorija.data.id,
                            )
                          : ""}{" "}
                        • {date}
                      </p>
                      <h2 className="text-4xl font-black uppercase leading-tight text-black hover:text-gray-700 transition-colors">
                        {article.attributes.title}
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
