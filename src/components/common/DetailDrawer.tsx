interface InfoItem {
  readonly label: string
  readonly value: string
}

interface DetailDrawerProps {
  readonly isOpen: boolean
  readonly title: string
  readonly subtitle?: string
  readonly items: readonly InfoItem[]
  readonly accentColor?: string
  readonly onClose: () => void
}

export function DetailDrawer({ isOpen, title, subtitle, items, accentColor = '#22c55e', onClose }: DetailDrawerProps) {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-bg-primary/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-[300px] bg-bg-card border-l border-border z-50 shadow-2xl flex flex-col animate-slide-in">
        <div className="p-5 border-b border-border flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-base" style={{ color: accentColor }}>{title}</h3>
            {subtitle && <p className="text-text-muted text-[11px] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors text-lg leading-none p-1"
          >
            x
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.label} className="flex justify-between items-baseline gap-4">
                <span className="text-xs text-text-muted">{item.label}</span>
                <span className="text-xs text-text-primary font-mono text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
