import { useState } from 'react'
import type { DgxSpec, GpuModel } from '../../data/specs'
import { GPU_SPECS } from '../../data/specs'
import { DetailDrawer } from '../common/DetailDrawer'

interface NodeLayoutProps {
  readonly spec: DgxSpec
  readonly gpuModel: GpuModel
}

type SelectedNode =
  | { type: 'gpu'; index: number }
  | { type: 'nvswitch' }
  | { type: 'cpu'; index: number }
  | null

function getNodeInfo(s: SelectedNode, spec: DgxSpec, gpuModel: GpuModel) {
  if (!s) return null
  const gpu = GPU_SPECS[gpuModel]
  switch (s.type) {
    case 'gpu':
      return {
        title: `${spec.gpuModel} GPU ${s.index}`, subtitle: gpu.architecture, color: '#22c55e',
        items: [
          { label: 'CUDA Cores', value: gpu.cudaCoresTotal.toLocaleString() },
          { label: 'Tensor Cores', value: `${gpu.tensorCoresTotal} (${gpu.tensorCoreGen})` },
          { label: 'Memory', value: `${gpu.hbmCapacity} ${gpu.hbmType}` },
          { label: 'Memory BW', value: gpu.hbmBandwidth },
          { label: 'NVLink BW', value: spec.nvlinkBandwidthPerGpu },
          { label: 'FP4 Dense', value: gpu.fp4Dense },
          { label: 'TDP', value: gpu.tdp },
        ],
      }
    case 'nvswitch':
      return {
        title: 'NVSwitch Fabric', subtitle: '5th Gen NVSwitch', color: '#8b5cf6',
        items: [
          { label: 'Topology', value: spec.nvlinkTopology },
          { label: 'Per GPU', value: spec.nvlinkBandwidthPerGpu },
          { label: 'Aggregate', value: `${parseFloat(spec.nvlinkBandwidthPerGpu) * spec.gpuCount} TB/s` },
          { label: 'GPUs connected', value: `${spec.gpuCount} all-to-all` },
        ],
      }
    case 'cpu':
      return {
        title: `CPU ${s.index}`, subtitle: spec.cpuModel, color: '#3b82f6',
        items: [
          { label: 'Model', value: spec.cpuModel },
          { label: 'System Memory', value: spec.systemMemory },
          { label: 'Host interface', value: 'PCIe Gen 5' },
        ],
      }
  }
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

export function NodeLayout({ spec, gpuModel }: NodeLayoutProps) {
  const [selected, setSelected] = useState<SelectedNode>(null)
  const info = getNodeInfo(selected, spec, gpuModel)

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
              { label: 'System Memory', value: spec.systemMemory },
              { label: 'Storage', value: spec.storage },
              { label: 'Network', value: spec.networkBandwidth },
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
            { label: 'GPU Mem', value: spec.totalGpuMemory },
            { label: 'TDP', value: spec.tdp },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span>{label}</span>
              <span className="font-mono text-text-secondary">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {info && (
        <DetailDrawer
          isOpen={true}
          title={info.title}
          subtitle={info.subtitle}
          items={info.items}
          accentColor={info.color}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
