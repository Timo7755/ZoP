import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { DRUPAL_BASE } from "#/config";

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
  };
}

interface KategorijaData {
  categoryTitle: string;
  articles: DrupalArticle[];
  included?: DrupalIncluded[];
}

const getKategorija = createServerFn({ method: "GET" }).handler(
  async (ctx): Promise<KategorijaData> => {
    const slug = ctx.data as unknown as string;

    // Resolve slug to category UUID via Decoupled Router
    const routerRes = await fetch(
      `${DRUPAL_BASE}/router/translate-path?path=/kategorija/${slug}`,
    );
    if (!routerRes.ok) throw new Error("Category not found");
    const routerData = (await routerRes.json()) as {
      label: string;
      entity: { uuid: string };
    };

    const categoryUuid = routerData.entity.uuid;
    const categoryTitle = routerData.label;

    // Fetch articles filtered by this category
    const res = await fetch(
      `${DRUPAL_BASE}/jsonapi/node/article?filter[field_kategorija.id]=${categoryUuid}&include=field_naslovna_slika&sort=-created`,
    );
    if (!res.ok) throw new Error("Failed to fetch articles");
    const json = (await res.json()) as {
      data: DrupalArticle[];
      included?: DrupalIncluded[];
    };

    return {
      categoryTitle,
      articles: json.data,
      included: json.included,
    };
  },
);

export const Route = createFileRoute("/kategorija/$slug")({
  component: KategorijaPage,
  loader: ({ params }) => getKategorija({ data: params.slug as never }),
});

function KategorijaPage() {
  const { categoryTitle, articles, included } = Route.useLoaderData();

  function getImageUrl(imageId: string | undefined): string | null {
    if (!imageId || !included) return null;
    const file = included.find(
      (f) => f.id === imageId && f.type === "file--file",
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

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">{categoryTitle}</h1>
      {articles.length === 0 ? (
        <p className="text-gray-500">V tej kategoriji še ni člankov.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => {
            const imageId = article.relationships.field_naslovna_slika.data?.id;
            const imageUrl = getImageUrl(imageId);
            const slug = getSlug(article);

            return (
              <article key={article.id} className="flex flex-col">
                <Link to="/clanek/$slug" params={{ slug }}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={article.attributes.title}
                      className="w-full aspect-3/2 object-cover rounded-md mb-4"
                    />
                  ) : (
                    <div className="w-full aspect-4/3 bg-gray-100 rounded-md mb-4" />
                  )}
                  <h2 className="text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors">
                    {article.attributes.title}
                  </h2>
                </Link>
                <time className="text-sm text-gray-500 mt-1">
                  {new Date(article.attributes.created).toLocaleDateString(
                    "sl-SI",
                  )}
                </time>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
