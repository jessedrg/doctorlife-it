import { Check } from "lucide-react";

/** Caja "Puntos clave" escaneable, optimizada para GEO (citabilidad). */
export function KeyTakeaways({ items }: { items: readonly string[] }) {
  return (
    <aside
      aria-label="Puntos clave"
      className="my-8 rounded-[24px] border border-teal/30 bg-sage/15 p-6 sm:p-8"
    >
      <h2 className="text-[13px] font-semibold uppercase tracking-[.16em] text-olive">
        Puntos clave
      </h2>
      <ul className="mt-5 flex flex-col gap-3.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[16px] leading-relaxed text-ink">
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-olive text-paper">
              <Check aria-hidden className="h-3 w-3" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
