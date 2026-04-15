import { useEffect } from 'react'
import type { UnitInfo } from '../../data/unitInfo'

interface DetailModalProps {
  readonly info: UnitInfo | null
  readonly onClose: () => void
}

export function DetailModal({ info, onClose }: DetailModalProps) {
  useEffect(() => {
    if (!info) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [info, onClose])

  if (!info) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
        <div
          className="
            pointer-events-auto w-full max-w-[640px] max-h-[80vh] overflow-y-auto
            bg-bg-card/95 backdrop-blur-md border border-accent-green/15
            rounded-2xl shadow-[0_0_60px_rgba(34,197,94,0.08)]
            animate-modal-in
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-bg-card/95 backdrop-blur-md border-b border-border-subtle px-6 py-4 flex items-start justify-between z-10">
            <div>
              <h2 className="text-lg font-semibold text-accent-green">{info.title}</h2>
              <p className="text-xs text-text-muted mt-1 leading-relaxed max-w-[500px]">{info.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition-colors text-sm ml-4 shrink-0 w-7 h-7 flex items-center justify-center rounded-md hover:bg-bg-hover"
            >
              &times;
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-5">
            {/* Sections */}
            {info.sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-medium text-accent-green/70 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
                <ul className="space-y-1.5">
                  {section.content.map((item) => (
                    <li key={item} className="text-xs text-text-secondary leading-relaxed flex gap-2">
                      <span className="text-accent-green/40 shrink-0 mt-0.5">-</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Specs Table */}
            {info.specs.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-accent-green/70 uppercase tracking-wider mb-2">
                  Specifications
                </h3>
                <div className="bg-bg-secondary rounded-lg border border-border-subtle overflow-hidden">
                  {info.specs.map((spec, i) => (
                    <div
                      key={spec.label}
                      className={`flex justify-between items-baseline px-4 py-2 text-xs ${
                        i < info.specs.length - 1 ? 'border-b border-border-subtle' : ''
                      }`}
                    >
                      <span className="text-text-muted">{spec.label}</span>
                      <span className="text-text-primary font-mono text-[11px]">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
