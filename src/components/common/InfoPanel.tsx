interface InfoItem {
  readonly label: string
  readonly value: string
}

interface InfoPanelProps {
  readonly title: string
  readonly subtitle?: string
  readonly items: readonly InfoItem[]
  readonly accentColor?: string
}

export function InfoPanel({ title, subtitle, items, accentColor = '#22c55e' }: InfoPanelProps) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-base" style={{ color: accentColor }}>{title}</h3>
        {subtitle && <p className="text-text-muted text-[11px] mt-0.5">{subtitle}</p>}
      </div>
      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between items-baseline gap-4 text-xs">
            <span className="text-text-muted shrink-0">{item.label}</span>
            <span className="text-text-primary font-mono text-[11px] text-right">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
