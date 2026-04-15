interface Tab {
  readonly id: string
  readonly label: string
}

interface TabBarProps {
  readonly tabs: readonly Tab[]
  readonly activeTab: string
  readonly onTabChange: (tabId: string) => void
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex gap-0.5 border-b border-border-subtle pb-px">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-4 py-2 text-xs font-medium transition-all duration-150 relative
            ${activeTab === tab.id
              ? 'text-text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent-green after:rounded-full'
              : 'text-text-muted hover:text-text-secondary'}
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
