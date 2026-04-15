import { useState } from 'react'
import type { GpuSpec } from '../../data/specs'
import { DetailDrawer } from '../common/DetailDrawer'

type SelectedComponent =
  | { type: 'gpc'; dieIndex: number; gpcIndex: number }
  | { type: 'hbm'; dieIndex: number; stackIndex: number }
  | { type: 'l2'; dieIndex: number }
  | { type: 'nvhbi' }
  | { type: 'nvlink' }
  | { type: 'pcie' }
  | null

function getInfoForComponent(c: SelectedComponent, spec: GpuSpec) {
  if (!c) return null
  const smsInGpc = spec.tpcsPerGpc * spec.smsPerTpc
  switch (c.type) {
    case 'gpc': {
      const gIdx = c.dieIndex * spec.gpcsPerDie + c.gpcIndex
      return {
        title: `GPC ${gIdx}`, subtitle: `Die ${c.dieIndex}`, color: '#22c55e',
        items: [
          { label: 'TPCs', value: `${spec.tpcsPerGpc}` },
          { label: 'SMs', value: `${smsInGpc}` },
          { label: 'CUDA Cores', value: `${smsInGpc * spec.cudaCoresPerSm}` },
          { label: 'Tensor Cores', value: `${smsInGpc * spec.tensorCoresPerSm} (${spec.tensorCoreGen})` },
          { label: 'RT Core', value: `${smsInGpc} (${spec.rtCoreGen})` },
        ],
      }
    }
    case 'hbm': {
      const stacksPerDie = spec.hbmStacks / spec.dieCount
      const gIdx = c.dieIndex * stacksPerDie + c.stackIndex
      return {
        title: `HBM3e Stack ${gIdx}`, subtitle: `Die ${c.dieIndex}`, color: '#3b82f6',
        items: [
          { label: 'Type', value: spec.hbmType },
          { label: 'Per stack', value: `${parseInt(spec.hbmCapacity) / spec.hbmStacks} GB` },
          { label: 'Stack height', value: spec.hbmStackHeight },
          { label: 'Total capacity', value: spec.hbmCapacity },
          { label: 'Total bandwidth', value: spec.hbmBandwidth },
          { label: 'Bus width', value: spec.hbmBusWidth },
        ],
      }
    }
    case 'l2':
      return {
        title: 'L2 Cache', subtitle: `Die ${c.dieIndex}`, color: '#f59e0b',
        items: [
          { label: 'Total', value: spec.l2Cache },
          { label: 'Partitions per die', value: `${spec.l2PartitionsPerDie}` },
        ],
      }
    case 'nvhbi':
      return {
        title: 'NV-HBI', subtitle: 'Die-to-Die Interconnect', color: '#ef4444',
        items: [
          { label: 'Bandwidth', value: spec.dieInterconnectBandwidth },
          { label: 'Purpose', value: 'Unified dual-die domain' },
          { label: 'vs HBM BW', value: '10 > 8 TB/s' },
        ],
      }
    case 'nvlink':
      return {
        title: spec.nvlinkGen, subtitle: 'GPU-to-GPU Interconnect', color: '#8b5cf6',
        items: [
          { label: 'Bandwidth', value: spec.nvlinkBandwidth },
          { label: 'Links', value: `${spec.nvlinkLinks}` },
        ],
      }
    case 'pcie':
      return {
        title: spec.pcieGen, subtitle: 'Host Interface', color: '#06b6d4',
        items: [{ label: 'Bandwidth', value: '128 GB/s bidirectional' }],
      }
  }
}

function SmGrid({ total, active }: { total: number; active: number }) {
  return (
    <div className="grid grid-cols-5 gap-[3px]">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-[2px] transition-colors ${
            i < active ? 'bg-accent-green/70' : 'bg-text-muted/15'
          }`}
        />
      ))}
    </div>
  )
}

function GpcBlock({
  gpcIndex, dieIndex, spec, isSelected, onSelect,
}: {
  gpcIndex: number; dieIndex: number; spec: GpuSpec; isSelected: boolean; onSelect: () => void
}) {
  const smsInGpc = spec.tpcsPerGpc * spec.smsPerTpc
  const activeSmsPerDie = Math.floor(spec.smsActive / spec.dieCount)
  const fullGpcs = Math.floor(activeSmsPerDie / smsInGpc)
  const active = gpcIndex < fullGpcs
    ? smsInGpc
    : gpcIndex === fullGpcs
      ? activeSmsPerDie % smsInGpc
      : 0

  return (
    <div
      onClick={onSelect}
      className={`
        bg-gpc rounded-lg p-3 cursor-pointer transition-all duration-150 border
        ${isSelected
          ? 'border-accent-green/60 shadow-[0_0_20px_rgba(34,197,94,0.12)]'
          : 'border-gpc-border hover:border-accent-green/30'}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-accent-green/70 font-medium">
          GPC {dieIndex * spec.gpcsPerDie + gpcIndex}
        </span>
        <span className="text-[10px] text-text-muted font-mono">{active}/{smsInGpc}</span>
      </div>
      <SmGrid total={smsInGpc} active={active} />
    </div>
  )
}

function HbmStack({
  spec, isSelected, onSelect,
}: {
  stackIndex: number; dieIndex: number; spec: GpuSpec; isSelected: boolean; onSelect: () => void
}) {
  const capacity = parseInt(spec.hbmCapacity) / spec.hbmStacks
  const layers = spec.hbmStackHeight === '12-high' ? 12 : 8

  return (
    <div
      onClick={onSelect}
      className={`
        bg-hbm rounded-lg p-2.5 cursor-pointer transition-all duration-150 border
        flex flex-col items-center justify-center gap-1.5 min-h-[72px]
        ${isSelected
          ? 'border-accent-blue/60 shadow-[0_0_20px_rgba(59,130,246,0.12)]'
          : 'border-hbm-border hover:border-accent-blue/30'}
      `}
    >
      <div className="flex flex-col gap-[1.5px]">
        {Array.from({ length: layers }, (_, i) => (
          <div key={i} className="w-6 h-[3px] bg-accent-blue/30 rounded-[1px]" />
        ))}
      </div>
      <div className="text-[9px] text-text-muted font-mono">{capacity}G</div>
    </div>
  )
}

function Die({
  dieIndex, spec, selected, onSelect,
}: {
  dieIndex: number; spec: GpuSpec; selected: SelectedComponent; onSelect: (c: SelectedComponent) => void
}) {
  const stacksPerDie = spec.hbmStacks / spec.dieCount
  const halfStacks = Math.floor(stacksPerDie / 2)

  return (
    <div className="bg-bg-secondary rounded-xl p-5 flex-1 border border-border-subtle">
      <div className="text-[11px] text-text-muted mb-4 text-center tracking-wide">
        Die {dieIndex} — {spec.codename}
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col gap-2 justify-center">
          {Array.from({ length: halfStacks }, (_, i) => (
            <HbmStack key={i} stackIndex={i} dieIndex={dieIndex} spec={spec}
              isSelected={selected?.type === 'hbm' && selected.dieIndex === dieIndex && selected.stackIndex === i}
              onSelect={() => onSelect({ type: 'hbm', dieIndex, stackIndex: i })} />
          ))}
        </div>

        <div className="flex-1 flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: spec.gpcsPerDie }, (_, i) => (
              <GpcBlock key={i} gpcIndex={i} dieIndex={dieIndex} spec={spec}
                isSelected={selected?.type === 'gpc' && selected.dieIndex === dieIndex && selected.gpcIndex === i}
                onSelect={() => onSelect({ type: 'gpc', dieIndex, gpcIndex: i })} />
            ))}
          </div>
          <div
            onClick={() => onSelect({ type: 'l2', dieIndex })}
            className={`
              bg-l2 rounded-lg p-2.5 cursor-pointer transition-all duration-150 text-center border
              ${selected?.type === 'l2' && selected.dieIndex === dieIndex
                ? 'border-accent-amber/60 shadow-[0_0_20px_rgba(245,158,11,0.12)]'
                : 'border-l2-border hover:border-accent-amber/30'}
            `}
          >
            <span className="text-[11px] text-accent-amber/70">L2 Cache</span>
            <span className="text-[10px] text-text-muted ml-2">{spec.l2PartitionsPerDie} partitions</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 justify-center">
          {Array.from({ length: stacksPerDie - halfStacks }, (_, i) => (
            <HbmStack key={i} stackIndex={halfStacks + i} dieIndex={dieIndex} spec={spec}
              isSelected={selected?.type === 'hbm' && selected.dieIndex === dieIndex && selected.stackIndex === halfStacks + i}
              onSelect={() => onSelect({ type: 'hbm', dieIndex, stackIndex: halfStacks + i })} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function FullDieLayout({ spec }: { readonly spec: GpuSpec }) {
  const [selected, setSelected] = useState<SelectedComponent>(null)
  const info = getInfoForComponent(selected, spec)

  return (
    <>
      <div className="space-y-2">
        {/* Summary bar */}
        <div className="flex items-center justify-center gap-6 text-[11px] text-text-muted py-2">
          {[
            { label: 'Dies', value: `${spec.dieCount}` },
            { label: 'SMs', value: `${spec.smsActive}/${spec.smsTotal}` },
            { label: 'CUDA', value: spec.cudaCoresTotal.toLocaleString() },
            { label: 'Memory', value: spec.hbmCapacity },
            { label: 'TDP', value: spec.tdp },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-text-muted">{label}</span>
              <span className="font-mono text-text-secondary">{value}</span>
            </div>
          ))}
        </div>

        {/* NVLink */}
        <div
          onClick={() => setSelected({ type: 'nvlink' })}
          className={`
            bg-nvlink rounded-lg px-4 py-2.5 text-center cursor-pointer transition-all duration-150 border
            ${selected?.type === 'nvlink'
              ? 'border-accent-purple/60 shadow-[0_0_20px_rgba(139,92,246,0.12)]'
              : 'border-nvlink-border hover:border-accent-purple/30'}
          `}
        >
          <span className="text-[11px] text-accent-purple/70">{spec.nvlinkGen}</span>
          <span className="text-[10px] text-text-muted ml-2">{spec.nvlinkBandwidth} bidirectional</span>
        </div>

        {/* Dual die */}
        <div className="flex items-stretch gap-0">
          <Die dieIndex={0} spec={spec} selected={selected} onSelect={setSelected} />

          <div
            onClick={() => setSelected({ type: 'nvhbi' })}
            className={`
              w-9 flex flex-col items-center justify-center cursor-pointer transition-all duration-150
              bg-nvhbi border-y mx-[-1px] z-10 shrink-0
              ${selected?.type === 'nvhbi' ? 'border-accent-red/40' : 'border-nvhbi-border hover:border-accent-red/30'}
            `}
          >
            <div className="text-[8px] text-accent-red/60 font-medium tracking-widest"
              style={{ writingMode: 'vertical-rl' }}>NV-HBI</div>
            <div className="text-[7px] text-text-muted mt-1"
              style={{ writingMode: 'vertical-rl' }}>{spec.dieInterconnectBandwidth}</div>
          </div>

          <Die dieIndex={1} spec={spec} selected={selected} onSelect={setSelected} />
        </div>

        {/* PCIe */}
        <div
          onClick={() => setSelected({ type: 'pcie' })}
          className={`
            bg-bg-secondary rounded-lg px-4 py-2.5 text-center cursor-pointer transition-all duration-150 border
            ${selected?.type === 'pcie' ? 'border-accent-cyan/60' : 'border-border-subtle hover:border-accent-cyan/30'}
          `}
        >
          <span className="text-[11px] text-text-muted">{spec.pcieGen}</span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-5 justify-center pt-1">
          {[
            { color: 'bg-accent-green/60', label: 'Active SM' },
            { color: 'bg-text-muted/15', label: 'Disabled' },
            { color: 'bg-accent-blue/30', label: 'HBM3e' },
            { color: 'bg-accent-amber/30', label: 'L2' },
            { color: 'bg-accent-red/30', label: 'NV-HBI' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
              <span className="text-[10px] text-text-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail drawer */}
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
