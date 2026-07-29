import type { Post } from "@/lib/blog";

const PALETTES = [
  { bg: "bg-sage", fg: "text-ink", pill: "bg-ink/10 text-ink", rule: "bg-ink/20" },
  { bg: "bg-ink", fg: "text-paper", pill: "bg-paper/15 text-paper", rule: "bg-paper/25" },
  { bg: "bg-clay", fg: "text-paper", pill: "bg-paper/20 text-paper", rule: "bg-paper/30" },
  { bg: "bg-cream", fg: "text-ink", pill: "bg-ink/10 text-ink", rule: "bg-ink/15" },
];

function pickPalette(slug: string) {
  let sum = 0;
  for (let i = 0; i < slug.length; i++) sum += slug.charCodeAt(i);
  return PALETTES[sum % PALETTES.length];
}

export function BlogCard({ post, large = false }: { post: Post; large?: boolean }) {
  const p = pickPalette(post.slug);
  return (
    <a
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-[26px] bg-warm no-underline shadow-[0_18px_50px_-30px_rgba(34,29,23,.5)] ring-1 ring-ink/[.06] transition-shadow hover:shadow-[0_24px_60px_-26px_rgba(34,29,23,.5)]"
    >
      <div
        className={`relative flex w-full flex-col justify-between overflow-hidden p-6 ${large ? `bg-ink text-paper aspect-[16/10] sm:aspect-[2.6/1]` : `${p.bg} ${p.fg} aspect-[16/11]`}`}
      >
        {large && (
          <>
            <video
              src="/products/pills-pen.mp4"
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "center 35%" }}
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/40" />
          </>
        )}
        <span
          className={`relative z-10 w-fit rounded-full px-[11px] py-[5px] text-[11px] font-semibold uppercase tracking-[.1em] ${
            large ? "bg-paper/20 text-paper" : p.pill
          }`}
        >
          {post.category}
        </span>
        <div className="relative z-10">
          <span aria-hidden className={`mb-3 block h-px w-10 ${large ? "bg-paper/30" : p.rule}`} />
          <p
            className={`font-serif italic leading-[1.08] ${large ? "text-[clamp(26px,3.4vw,40px)]" : "text-[clamp(22px,4vw,28px)]"}`}
          >
            {post.keyword}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3
          className={`text-balance font-light leading-[1.14] text-ink ${large ? "text-[clamp(24px,3vw,34px)]" : "text-[21px]"}`}
        >
          {post.h1}
        </h3>
        <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-ink-soft">{post.excerpt}</p>
        <div className="mt-5 flex items-center gap-3 text-[13px] text-ink-mute">
          <span>{post.readMins} min de lectura</span>
          <span aria-hidden>·</span>
          <span className="font-medium text-clay group-hover:underline">Leer más →</span>
        </div>
      </div>
    </a>
  );
}
