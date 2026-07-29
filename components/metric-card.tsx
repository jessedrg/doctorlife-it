export function MetricCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-[18px] border border-ink/10 bg-warm p-5">
      <p className="text-[12.5px] uppercase tracking-[.05em] text-ink-mute">{label}</p>
      <p className="mt-2 text-[28px] font-light leading-none tracking-[-.02em] text-ink">{value}</p>
      {hint && <p className="mt-1.5 text-[13px] text-ink-soft">{hint}</p>}
    </div>
  )
}
