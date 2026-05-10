import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import { DRUPAL_BASE } from "#/config";

interface DrupalIncluded {
  id: string;
  type: string;
  attributes: {
    uri?: { url: string };
    title?: string;
  };
}

interface DrupalComment {
  id: string;
  attributes: {
    created: string;
    name: string;
    comment_body: { processed: string };
  };
}

interface DrupalArticle {
  id: string;
  attributes: {
    title: string;
    created: string;
    field_telo: Array<{ value: string; format: string; processed: string }>;

    path: { alias: string | null };
  };
  relationships: {
    field_naslovna_slika: { data: { id: string } | null };
    field_kategorija: { data: { id: string } | null };
    field_avtor: { data: { id: string } | null };
    field_galerija: { data: Array<{ id: string }> };
    field_oznake: { data: Array<{ id: string }> };
  };
}

interface DrupalResponse {
  data: DrupalArticle[];
  included?: DrupalIncluded[];
  nextArticle?: { title: string; path: { alias: string | null } } | null;
  prevArticle?: { title: string; path: { alias: string | null } } | null;
  articleId: string;
  comments: DrupalComment[];
}

const getArticle = createServerFn({ method: "GET" }).handler(
  async (ctx): Promise<DrupalResponse> => {
    const slug = ctx.data as unknown as string;
    const isUuid = /^[0-9a-f-]{36}$/.test(slug);

    let uuid: string;

    if (isUuid) {
      uuid = slug;
    } else {
      const routerRes = await fetch(
        `${DRUPAL_BASE}/router/translate-path?path=/clanek/${slug}`,
      );
      if (!routerRes.ok) throw new Error("Article not found");
      const routerData = (await routerRes.json()) as {
        entity: { uuid: string };
      };
      uuid = routerData.entity.uuid;
    }

    const res = await fetch(
      `${DRUPAL_BASE}/jsonapi/node/article/${uuid}?include=field_naslovna_slika,field_kategorija,field_avtor,field_galerija,field_oznake`,
    );
    if (!res.ok) throw new Error("Failed to fetch article");
    const json = (await res.json()) as {
      data: DrupalArticle;
      included?: DrupalIncluded[];
    };

    const currentCreated = json.data.attributes.created;
    const createdTs = Math.floor(new Date(currentCreated).getTime() / 1000);

    const nextRes = await fetch(
      `${DRUPAL_BASE}/jsonapi/node/article` +
        `?filter[created][condition][path]=created` +
        `&filter[created][condition][operator]=%3E` +
        `&filter[created][condition][value]=${createdTs}` +
        `&sort=created&page[limit]=1` +
        `&fields[node--article]=title,path`,
    );
    let nextArticle = null;
    if (nextRes.ok) {
      const nextJson = (await nextRes.json()) as {
        data: Array<{
          attributes: { title: string; path: { alias: string | null } };
        }>;
      };
      if (nextJson.data.length > 0) {
        nextArticle = nextJson.data[0].attributes;
      }
    }
    const prevRes = await fetch(
      `${DRUPAL_BASE}/jsonapi/node/article` +
        `?filter[created][condition][path]=created` +
        `&filter[created][condition][operator]=%3C` +
        `&filter[created][condition][value]=${createdTs}` +
        `&sort=-created&page[limit]=1` +
        `&fields[node--article]=title,path`,
    );

    let prevArticle = null;
    if (prevRes.ok) {
      const prevJson = (await prevRes.json()) as {
        data: Array<{
          attributes: { title: string; path: { alias: string | null } };
        }>;
      };
      if (prevJson.data.length > 0) {
        prevArticle = prevJson.data[0].attributes;
      }
    }

    const comments = await getComments({ data: uuid as never });

    return {
      data: [json.data],
      included: json.included,
      nextArticle,
      prevArticle,
      articleId: uuid,
      comments,
    };
  },
);

const getComments = createServerFn({ method: "GET" }).handler(
  async (ctx): Promise<DrupalComment[]> => {
    const uuid = ctx.data as unknown as string;
    const res = await fetch(
      `${DRUPAL_BASE}/jsonapi/comment/comment?filter[entity_id.id]=${uuid}&sort=created`,
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { data: DrupalComment[] };
    return json.data;
  },
);

const postComment = createServerFn({ method: "POST" }).handler(async (ctx) => {
  const { articleId, name, body } = ctx.data as unknown as {
    articleId: string;
    name: string;
    body: string;
  };

  const tokenRes = await fetch(`${DRUPAL_BASE}/session/token`);
  const token = (await tokenRes.text()).trim();
  const sessionCookie = tokenRes.headers.get("set-cookie") ?? "";

  const res = await fetch(`${DRUPAL_BASE}/jsonapi/comment/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/vnd.api+json",
      "X-CSRF-Token": token,
      ...(sessionCookie ? { Cookie: sessionCookie } : {}),
    },
    body: JSON.stringify({
      data: {
        type: "comment--comment",
        attributes: {
          entity_type: "node",
          field_name: "field_komentarji",
          subject: name,
          name: name,
          comment_body: { value: body, format: "plain_text" },
        },
        relationships: {
          entity_id: { data: { type: "node--article", id: articleId } },
        },
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${res.status}: ${errText}`);
  }
});

export const Route = createFileRoute("/clanek/$slug")({
  head: ({ loaderData }) => {
    const d = loaderData as DrupalResponse | undefined;
    return {
      meta: [
        {
          title: `Zgodbe o Pomurju — ${d?.data?.[0]?.attributes?.title ?? ""}`,
        },
      ],
    };
  },
  component: ClanekPage,
  loader: ({ params }) => getArticle({ data: params.slug as never }),
});

function ClanekPage() {
  const {
    data,
    included,
    nextArticle,
    prevArticle,
    articleId,
    comments: initialComments,
  } = Route.useLoaderData() as DrupalResponse;

  const article = data[0];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [comments, setComments] = useState<DrupalComment[]>(initialComments);
  const [commentAuthorName, setCommentAuthorName] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCommentSubmit(e: FormEvent) {
    e.preventDefault();
    if (!commentAuthorName.trim() || !commentBody.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await postComment({
        data: {
          articleId,
          name: commentAuthorName,
          body: commentBody,
        } as never,
      });
      const fresh = await getComments({ data: articleId as never });
      setComments(fresh);
      setCommentAuthorName("");
      setCommentBody("");
    } catch {
      setError("Napaka pri oddaji komentarja. Poskusi znova.");
    } finally {
      setSubmitting(false);
    }
  }

  const galleryIds = article.relationships.field_galerija?.data ?? [];
  const galleryImages = galleryIds
    .map((ref: { id: string }) =>
      included?.find(
        (f: DrupalIncluded) => f.id === ref.id && f.type === "file--file",
      ),
    )

    .filter(Boolean)
    .map((f) => `${DRUPAL_BASE}${f!.attributes.uri!.url}`);

  const tagRefs = article.relationships.field_oznake?.data ?? [];
  const tags = tagRefs
    .map((ref: { id: string }) =>
      included?.find(
        (f: DrupalIncluded) => f.id === ref.id && f.type === "node--tag",
      ),
    )
    .filter(Boolean);

  if (!article) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-10">
        <p>Članek ni bil najden.</p>
      </main>
    );
  }

  const imageId = article.relationships.field_naslovna_slika.data?.id;
  const imageUrl = included?.find(
    (f: DrupalIncluded) => f.id === imageId && f.type === "file--file",
  )?.attributes.uri
    ? `${DRUPAL_BASE}${included?.find((f: DrupalIncluded) => f.id === imageId && f.type === "file--file")?.attributes.uri?.url}`
    : null;

  const categoryId = article.relationships.field_kategorija.data?.id;
  const categoryName = included?.find(
    (f: DrupalIncluded) => f.id === categoryId && f.type === "node--category",
  )?.attributes.title;

  const authorId = article.relationships.field_avtor.data?.id;
  const authorName = included?.find(
    (f: DrupalIncluded) => f.id === authorId && f.type === "node--author",
  )?.attributes.title;

  const date = new Date(article.attributes.created).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" },
  );

  return (
    <main className="fade-in-up">
      {/* Meta + Title */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-6 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-5 flex items-center justify-center gap-3 flex-wrap">
          {categoryName && (
            <span className="text-[#ec3032]">{categoryName}</span>
          )}
          {categoryName && <span>•</span>}
          <span>{date}</span>
          {authorName && <span>•</span>}
          {authorName && <span>Written By {authorName}</span>}
        </p>
        <h1 className="text-4xl font-black uppercase leading-tight text-black">
          {article.attributes.title}
        </h1>
      </div>

      {/* Body */}
      <ScrollReveal>
        <div className="max-w-3xl mx-auto px-6 pb-16">
          {article.attributes.field_telo[0] && (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: article.attributes.field_telo[0].processed.replace(
                  /src="\/sites\//g,
                  `src="${DRUPAL_BASE}/sites/`,
                ),
              }}
            />
          )}
        </div>
      </ScrollReveal>
      {/* Gallery */}
      <ScrollReveal delay={100}>
        {galleryImages.length > 0 && (
          <div className="max-w-5xl mx-auto px-6 pb-16">
            <h2 className="text-xl font-black uppercase tracking-widest mb-6 text-center">
              Galerija
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {galleryImages.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="overflow-hidden aspect-square cursor-pointer"
                >
                  <img
                    src={url}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </ScrollReveal>
      {/* Tags */}
      <ScrollReveal delay={150}>
        {tags.length > 0 && (
          <div className="max-w-3xl mx-auto px-6 pb-10 flex flex-wrap gap-2 justify-center">
            {tags.map((tag) => (
              <a
                key={tag!.id}
                href={`/clanki?oznaka=${encodeURIComponent(tag!.attributes.title ?? "")}`}
                className="text-xs font-semibold tracking-widest uppercase text-[#ec3032] border border-[#ec3032] px-3 py-1 hover:bg-[#ec3032] hover:text-white transition-colors"
              >
                {tag!.attributes.title}
              </a>
            ))}
          </div>
        )}
      </ScrollReveal>
      {/* Article Navigation */}
      <ScrollReveal delay={200}>
        {(prevArticle?.path?.alias || nextArticle?.path?.alias) && (
          <div className="border-t border-gray-200 max-w-5xl mx-auto px-6 mt-4 mb-16">
            <div className="flex items-center justify-between py-10">
              {nextArticle?.path?.alias ? (
                <a
                  href={nextArticle.path.alias}
                  className="flex items-center gap-4 group flex-1"
                >
                  <span className="text-[#ec3032] text-3xl">←</span>
                  <span className="text-base font-black uppercase text-black group-hover:text-[#ec3032] transition-colors">
                    {nextArticle.title}
                  </span>
                </a>
              ) : (
                <div className="flex-1" />
              )}
              {prevArticle?.path?.alias ? (
                <a
                  href={prevArticle.path.alias}
                  className="flex items-center gap-4 group flex-1 justify-end text-right"
                >
                  <span className="text-base font-black uppercase text-black group-hover:text-[#ec3032] transition-colors">
                    {prevArticle.title}
                  </span>
                  <span className="text-[#ec3032] text-3xl">→</span>
                </a>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </div>
        )}
      </ScrollReveal>

      {/* Comments */}
      <ScrollReveal delay={250}>
        <div className="max-w-3xl mx-auto px-6 pb-16">
          <h2 className="text-3xl font-black uppercase tracking-widest mb-8 text-center">
            Komentarji{" "}
            {comments.length > 0 && (
              <span className="text-gray-400">({comments.length})</span>
            )}
          </h2>

          {comments.length === 0 && (
            <p className="text-center text-gray-400 text-sm mb-10">
              Še ni komentarjev. Bodi prvi!
            </p>
          )}

          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 py-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold uppercase tracking-widest">
                  {comment.attributes.name}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.attributes.created).toLocaleDateString(
                    "sl-SI",
                    {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {comment.attributes.comment_body.processed.replace(
                  /<[^>]+>/g,
                  "",
                )}
              </p>
            </div>
          ))}

          {/* Comment form */}
          <form
            onSubmit={handleCommentSubmit}
            className="mt-10 flex flex-col gap-4"
          >
            <h3 className="text-sm font-black uppercase tracking-widest">
              Dodaj komentar
            </h3>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <input
              type="text"
              placeholder="Ime"
              value={commentAuthorName}
              onChange={(e) => setCommentAuthorName(e.target.value)}
              required
              className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
            />
            <textarea
              placeholder="Komentar"
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              required
              rows={4}
              className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 resize-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="self-start bg-[#ec3032] text-white text-xs font-bold tracking-widest uppercase px-6 py-3 hover:bg-[#c42527] transition-colors disabled:opacity-50"
            >
              {submitting ? "Pošiljam..." : "Objavi"}
            </button>
          </form>
        </div>
      </ScrollReveal>
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
                (lightboxIndex - 1 + galleryImages.length) %
                  galleryImages.length,
              );
            }}
          >
            ‹
          </button>
          <img
            src={galleryImages[lightboxIndex]}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 text-white text-4xl font-light px-4 py-2"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
            }}
          >
            ›
          </button>
          <span className="absolute bottom-4 text-white/60 text-sm">
            {lightboxIndex + 1} / {galleryImages.length}
          </span>
        </div>
      )}
    </main>
  );
}
