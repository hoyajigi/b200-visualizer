import { useState } from 'react'
import type { DgxSpec, GpuModel } from '../../data/specs'
import { useI18n } from '../../i18n/context'
import { DetailModal } from '../common/DetailDrawer'
import { getUnitInfo } from '../../data/unitInfo'
import type { UnitKey } from '../../data/unitInfo'

interface NodeLayoutProps {
  readonly spec: DgxSpec
  readonly gpuModel: GpuModel
}

type SelectedNode =
  | { type: 'gpu'; index: number }
  | { type: 'nvswitch' }
  | { type: 'cpu'; index: number }
  | null

const NODE_KEY_MAP: Record<string, UnitKey> = {
  gpu: 'gpc', nvswitch: 'nvswitch', cpu: 'cpu',
}

function getUnitKey(s: SelectedNode): UnitKey | null {
  if (!s) return null
  return NODE_KEY_MAP[s.type] ?? null
}

function GpuCard({
  index, model, isSelected, onSelect,
}: {
  index: number; model: string; isSelected: boolean; onSelect: () => void
}) {
  return (
    <div
      onClick={onSelect}
      className={`
        bg-gpc rounded-lg p-4 cursor-pointer transition-all duration-150 text-center border
        ${isSelected
          ? 'border-accent-green/60 shadow-[0_0_20px_rgba(34,197,94,0.12)]'
          : 'border-gpc-border hover:border-accent-green/30'}
      `}
    >
      <div className="text-sm font-medium text-text-primary">{model}</div>
      <div className="text-[10px] text-text-muted mt-0.5">GPU {index}</div>
      <div className="flex justify-center gap-[3px] mt-2">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="w-[5px] h-[5px] bg-accent-green/40 rounded-[1px]" />
        ))}
      </div>
    </div>
  )
}

export function NodeLayout({ spec }: NodeLayoutProps) {
  const [selected, setSelected] = useState<SelectedNode>(null)
  const { locale, t } = useI18n()
  const unitKey = getUnitKey(selected)
  const info = unitKey ? getUnitInfo(unitKey, locale) : null

  return (
    <>
      <div className="max-w-[720px] mx-auto space-y-3">
        {/* Title */}
        <div className="text-center text-xs text-text-muted py-1">
          {spec.name} — {spec.formFactor}
        </div>

        <div className="bg-bg-secondary border border-border-subtle rounded-xl p-6 space-y-4">
          {/* GPUs 0-3 */}
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <GpuCard key={i} index={i} model={spec.gpuModel}
                isSelected={selected?.type === 'gpu' && selected.index === i}
                onSelect={() => setSelected({ type: 'gpu', index: i })} />
            ))}
          </div>

          {/* NVLink lines */}
          <div className="flex justify-center gap-4 py-0.5">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="w-px h-4 bg-accent-purple/25" />
            ))}
          </div>

          {/* NVSwitch */}
          <div
            onClick={() => setSelected({ type: 'nvswitch' })}
            className={`
              bg-nvlink rounded-xl p-5 cursor-pointer transition-all duration-150 text-center border
              ${selected?.type === 'nvswitch'
                ? 'border-accent-purple/60 shadow-[0_0_24px_rgba(139,92,246,0.15)]'
                : 'border-nvlink-border hover:border-accent-purple/30'}
            `}
          >
            <div className="text-sm font-medium text-accent-purple/70">NVSwitch Fabric</div>
            <div className="text-[11px] text-text-muted mt-1">
              {spec.nvlinkBandwidthPerGpu} per GPU — All-to-all
            </div>
          </div>

          {/* NVLink lines */}
          <div className="flex justify-center gap-4 py-0.5">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="w-px h-4 bg-accent-purple/25" />
            ))}
          </div>

          {/* GPUs 4-7 */}
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <GpuCard key={i + 4} index={i + 4} model={spec.gpuModel}
                isSelected={selected?.type === 'gpu' && selected.index === i + 4}
                onSelect={() => setSelected({ type: 'gpu', index: i + 4 })} />
            ))}
          </div>

          <div className="border-t border-border-subtle" />

          <div className="text-center text-[10px] text-text-muted">PCIe Gen 5</div>

          {/* CPUs */}
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: spec.cpuCount }, (_, i) => (
              <div
                key={i}
                onClick={() => setSelected({ type: 'cpu', index: i })}
                className={`
                  bg-hbm rounded-lg p-4 cursor-pointer transition-all duration-150 text-center border
                  ${selected?.type === 'cpu' && selected.index === i
                    ? 'border-accent-blue/60 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                    : 'border-hbm-border hover:border-accent-blue/30'}
                `}
              >
                <div className="text-xs font-medium">CPU {i}</div>
                <div className="text-[10px] text-text-muted mt-0.5">{spec.cpuModel}</div>
              </div>
            ))}
          </div>

          {/* System info */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: t.dgx.systemMemory, value: spec.systemMemory },
              { label: t.dgx.storage, value: spec.storage },
              { label: t.dgx.network, value: spec.networkBandwidth },
            ].map(({ label, value }) => (
              <div key={label} className="bg-bg-card border border-border-subtle rounded-lg p-3 text-center">
                <div className="text-[10px] text-text-muted">{label}</div>
                <div className="text-[11px] font-mono text-text-secondary mt-1 break-words">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* System summary */}
        <div className="flex items-center justify-center gap-6 text-[11px] text-text-muted py-1">
          {[
            { label: 'GPUs', value: `${spec.gpuCount}x ${spec.gpuModel}` },
            { label: t.dgx.gpuMem, value: spec.totalGpuMemory },
            { label: 'TDP', value: spec.tdp },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span>{label}</span>
              <span className="font-mono text-text-secondary">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <DetailModal info={info} onClose={() => setSelected(null)} />
    </>
  )
}
