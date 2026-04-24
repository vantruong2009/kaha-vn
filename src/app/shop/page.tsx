import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ProductTeaserGrid } from "@/components/product-teaser-grid";
import { getSiteUrl } from "@/lib/site-url";
import {
  getShopFacets,
  getShopProducts,
  type ShopFacet,
} from "@/server/content";

const PAGE_SIZE = 12;
const site = getSiteUrl();

type PageProps = {
  searchParams?: Promise<{
    page?: string;
    q?: string;
    category?: string;
    tag?: string;
    sort?: string;
  }>;
};

function norm(v?: string): string {
  return (v ?? "").trim();
}

function qs(input: {
  q: string;
  category: string;
  tag: string;
  sort: string;
  page: number;
}) {
  const p = new URLSearchParams();
  if (input.q) p.set("q", input.q);
  if (input.category) p.set("category", input.category);
  if (input.tag) p.set("tag", input.tag);
  if (input.sort && input.sort !== "newest") p.set("sort", input.sort);
  if (input.page > 1) p.set("page", String(input.page));
  const s = p.toString();
  return s ? `?${s}` : "";
}

function facetLink(
  type: "category" | "tag",
  value: string,
  current: { q: string; category: string; tag: string; sort: string },
) {
  const next = {
    q: current.q,
    category: type === "category" ? value : "",
    tag: type === "tag" ? value : "",
    sort: current.sort,
    page: 1,
  };
  return `/shop${qs(next)}`;
}

function FacetList({
  label,
  items,
  selected,
  hrefFor,
}: {
  label: string;
  items: ShopFacet[];
  selected: string;
  hrefFor: (value: string) => string;
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-500">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((f) => {
          const active = selected === f.value;
          return (
            <Link
              key={f.value}
              href={hrefFor(f.value)}
              className={`rounded-sm border px-3 py-1.5 text-xs uppercase tracking-[0.06em] transition-colors ${
                active
                  ? "border-ink-900 text-ink-900"
                  : "border-hairline text-ink-600 hover:border-ink-300 hover:text-ink-900"
              }`}
            >
              {f.value} ({f.n})
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = (await searchParams) ?? {};
  const q = norm(sp.q);
  const category = norm(sp.category);
  const tag = norm(sp.tag);
  const sortRaw = norm(sp.sort);
  const sort =
    sortRaw === "title_asc" || sortRaw === "title_desc" ? sortRaw : "newest";
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const canonical = `${site}/shop${qs({ q, category, tag, sort, page })}`;
  const suffix = [
    q && `q: ${q}`,
    category && `cat: ${category}`,
    tag && `tag: ${tag}`,
    sort !== "newest" && `sort: ${sort}`,
  ]
    .filter(Boolean)
    .join(" · ");
  const title = suffix ? `Shop — ${suffix}` : "Shop";
  return {
    title,
    description: "Danh mục sản phẩm KAHA.VN",
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      title: `${title} · KAHA.VN`,
      description: "Danh mục sản phẩm KAHA.VN",
      url: canonical,
      locale: "vi_VN",
    },
  };
}

export default async function ShopPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const q = norm(sp.q);
  const category = norm(sp.category);
  const tag = norm(sp.tag);
  const sortRaw = norm(sp.sort);
  const sort =
    sortRaw === "title_asc" || sortRaw === "title_desc" ? sortRaw : "newest";
  const requestedPage = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const facets = await getShopFacets();

  const first = await getShopProducts({
    q,
    category,
    tag,
    sort,
    limit: PAGE_SIZE,
    offset: (requestedPage - 1) * PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(first.total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const data =
    page === requestedPage
      ? first
      : await getShopProducts({
          q,
          category,
          tag,
          sort,
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
        });

  const prevHref =
    page <= 1
      ? null
      : `/shop${qs({ q, category, tag, sort, page: page - 1 })}`;
  const nextHref =
    page >= totalPages
      ? null
      : `/shop${qs({ q, category, tag, sort, page: page + 1 })}`;

  return (
    <PageShell mainClassName="flex-1 px-5 py-10 md:px-12 md:py-14">
        <div className="mx-auto max-w-[1600px]">
          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-500">
            KAHA.VN
          </p>
          <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.4rem)] [font-family:var(--font-display),serif]">
            Shop
          </h1>
          <p className="mt-3 text-sm text-ink-600">
            {data.total} sản phẩm
            {q ? ` · tìm "${q}"` : ""}
            {category ? ` · danh mục ${category}` : ""}
            {tag ? ` · tag ${tag}` : ""}
            {sort !== "newest" ? ` · sort ${sort}` : ""}
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[290px_1fr]">
            <aside className="h-fit space-y-6 border border-hairline bg-paper p-5 lg:sticky lg:top-24">
              <form action="/shop" className="space-y-4">
                <label className="flex flex-col gap-2 text-sm text-ink-600">
                  Tìm sản phẩm
                  <input
                    name="q"
                    defaultValue={q}
                    className="w-full border border-hairline bg-paper px-3 py-2 text-sm outline-none focus:border-ink-300"
                    placeholder="Nhập tên hoặc mô tả"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-ink-600">
                  Sắp xếp
                  <select
                    name="sort"
                    defaultValue={sort}
                    className="border border-hairline bg-paper px-3 py-2 text-sm outline-none focus:border-ink-300"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="title_asc">Tên A → Z</option>
                    <option value="title_desc">Tên Z → A</option>
                  </select>
                </label>
                {category ? <input type="hidden" name="category" value={category} /> : null}
                {tag ? <input type="hidden" name="tag" value={tag} /> : null}
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="border border-ink-900 bg-ink-900 px-4 py-2 text-xs uppercase tracking-[0.08em] text-paper hover:bg-paper hover:text-ink-900"
                  >
                    Lọc
                  </button>
                  <Link href="/shop" className="text-xs uppercase tracking-[0.08em] text-ink-600 underline-offset-4 hover:underline">
                    Xóa bộ lọc
                  </Link>
                </div>
              </form>
              <FacetList
                label="Danh mục"
                items={facets.categories}
                selected={category}
                hrefFor={(v) => facetLink("category", v, { q, category, tag, sort })}
              />
              <FacetList
                label="Tag"
                items={facets.tags}
                selected={tag}
                hrefFor={(v) => facetLink("tag", v, { q, category, tag, sort })}
              />
            </aside>
            <section>
              <ProductTeaserGrid items={data.items} heading="Danh sách sản phẩm" />
            </section>
          </div>
        </div>

        {totalPages > 1 ? (
          <div className="mx-auto mt-8 flex max-w-[1600px] items-center justify-between border-t border-hairline pt-8 text-[13px] uppercase tracking-[0.08em] text-ink-600">
            {prevHref ? (
              <Link href={prevHref} className="hover:underline hover:decoration-platinum-deep">
                ← Trang trước
              </Link>
            ) : (
              <span className="text-ink-400">← Trang trước</span>
            )}
            <span className="text-ink-500">
              {page} / {totalPages}
            </span>
            {nextHref ? (
              <Link href={nextHref} className="hover:underline hover:decoration-platinum-deep">
                Trang sau →
              </Link>
            ) : (
              <span className="text-ink-400">Trang sau →</span>
            )}
          </div>
        ) : null}
    </PageShell>
  );
}
