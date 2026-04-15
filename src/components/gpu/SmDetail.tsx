import type { GpuSpec } from '../../data/specs'
import { useI18n } from '../../i18n/context'

interface SmDetailProps {
  readonly spec: GpuSpec
}

function CoreGrid({ count, color, label }: { count: number; color: string; label: string }) {
  return (
    <div>
      <div className="text-[10px] text-text-muted mb-1">{label}</div>
      <div className="grid grid-cols-8 gap-[2px]">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className={`w-3 h-3 rounded-[2px] ${color}`} />
        ))}
      </div>
    </div>
  )
}

function ProcessingBlock({ index, spec, blockLabel }: { index: number; spec: GpuSpec; blockLabel: string }) {
  return (
    <div className="bg-bg-secondary border border-border rounded-lg p-3">
      <div className="text-xs font-medium text-text-secondary mb-2">
        {blockLabel} {index}
      </div>

      <div className="space-y-3">
        {/* CUDA Cores */}
        <CoreGrid
          count={32}
          color="bg-accent-green/50"
          label={`32 FP32 CUDA Cores (unified INT32/FP32)`}
        />

        {/* Tensor Core */}
        <div className="flex gap-2">
          <div>
            <div className="text-[10px] text-text-muted mb-1">Tensor Core ({spec.tensorCoreGen})</div>
            <div className="w-12 h-6 bg-accent-purple/40 rounded-md flex items-center justify-center">
              <span className="text-[8px] text-accent-purple">TC</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-text-muted mb-1">Warp Scheduler</div>
            <div className="w-12 h-6 bg-accent-cyan/30 rounded-md flex items-center justify-center">
              <span className="text-[8px] text-accent-cyan">WS</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-text-muted mb-1">Dispatch</div>
            <div className="w-12 h-6 bg-accent-amber/30 rounded-md flex items-center justify-center">
              <span className="text-[8px] text-accent-amber">DU</span>
            </div>
          </div>
        </div>

        {/* LD/ST + SFU */}
        <div className="flex gap-2">
          <div className="flex gap-[2px]">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="w-3 h-3 bg-accent-blue/30 rounded-[2px]" />
            ))}
            <span className="text-[8px] text-text-muted ml-1 self-center">LD/ST x4</span>
          </div>
          <div className="flex gap-[2px]">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="w-3 h-3 bg-accent-amber/30 rounded-[2px]" />
            ))}
            <span className="text-[8px] text-text-muted ml-1 self-center">SFU x4</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SmDetail({ spec }: SmDetailProps) {
  const { t } = useI18n()

  return (
    <div className="space-y-4">
      <div className="text-sm text-text-secondary">
        {t.sm.smContains}
      </div>

      {/* SM Overview */}
      <div className="bg-bg-card border border-gpc-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-accent-green">
            Streaming Multiprocessor ({spec.smVersion})
          </h3>
          <span className="text-xs text-text-muted bg-bg-secondary px-2 py-1 rounded">
            {spec.architecture}
          </span>
        </div>

        {/* 4 Processing Blocks */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {Array.from({ length: 4 }, (_, i) => (
            <ProcessingBlock key={i} index={i} spec={spec} blockLabel={t.sm.processingBlock} />
          ))}
        </div>

        {/* Shared Resources */}
        <div className="border-t border-border pt-3 space-y-2">
          <div className="text-xs font-medium text-text-secondary mb-2">{t.sm.sharedResources}</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-bg-secondary border border-border rounded-md p-2 text-center">
              <div className="text-[10px] text-text-muted">{t.sm.registerFile}</div>
              <div className="text-sm font-mono text-text-primary">{spec.registerFilePerSm}</div>
            </div>
            <div className="bg-bg-secondary border border-border rounded-md p-2 text-center">
              <div className="text-[10px] text-text-muted">{t.sm.sharedMemL1}</div>
              <div className="text-sm font-mono text-text-primary">{spec.sharedMemoryPerSm}</div>
            </div>
            <div className="bg-bg-secondary border border-border rounded-md p-2 text-center">
              <div className="text-[10px] text-text-muted">RT Core ({spec.rtCoreGen})</div>
              <div className="text-sm font-mono text-text-primary">{spec.rtCoresPerSm}</div>
            </div>
          </div>
        </div>

        {/* Tex units */}
        <div className="border-t border-border pt-3 mt-3">
          <div className="flex gap-2">
            <div className="bg-bg-secondary border border-border rounded-md p-2 text-center flex-1">
              <div className="text-[10px] text-text-muted">{t.sm.textureUnits}</div>
              <div className="text-sm font-mono text-text-primary">4</div>
            </div>
            <div className="bg-bg-secondary border border-border rounded-md p-2 text-center flex-1">
              <div className="text-[10px] text-text-muted">FP4/FP6/FP8 Support</div>
              <div className="text-sm font-mono text-accent-green">Yes</div>
            </div>
            <div className="bg-bg-secondary border border-border rounded-md p-2 text-center flex-1">
              <div className="text-[10px] text-text-muted">2-SM TMA Multicast</div>
              <div className="text-sm font-mono text-accent-green">Yes</div>
            </div>
          </div>
        </div>
      </div>

      {/* SM Summary */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-accent-green">{spec.cudaCoresPerSm}</div>
          <div className="text-xs text-text-muted">CUDA Cores</div>
        </div>
        <div className="bg-bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-accent-purple">{spec.tensorCoresPerSm}</div>
          <div className="text-xs text-text-muted">Tensor Cores</div>
        </div>
        <div className="bg-bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-accent-cyan">4</div>
          <div className="text-xs text-text-muted">{t.sm.warpSchedulers}</div>
        </div>
        <div className="bg-bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-accent-amber">4</div>
          <div className="text-xs text-text-muted">{t.sm.dispatchUnits}</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-[10px]">
        {[
          { color: 'bg-accent-green/50', label: 'FP32 CUDA Core' },
          { color: 'bg-accent-purple/40', label: 'Tensor Core' },
          { color: 'bg-accent-cyan/30', label: 'Warp Scheduler' },
          { color: 'bg-accent-amber/30', label: 'Dispatch / SFU' },
          { color: 'bg-accent-blue/30', label: 'Load/Store' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-text-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
