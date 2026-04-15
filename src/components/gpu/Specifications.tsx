import { useMemo } from 'react'
import type { GpuSpec } from '../../data/specs'
import { B200_SPEC, B300_SPEC, H100_SPEC } from '../../data/specs'
import { useI18n } from '../../i18n/context'
import type { UiStrings } from '../../i18n/types'

interface SpecificationsProps {
  readonly spec: GpuSpec
}

function buildRow(label: string, fn: (s: GpuSpec) => string) {
  return { label, b200: fn(B200_SPEC), b300: fn(B300_SPEC), h100: fn(H100_SPEC) }
}

function buildRows(t: UiStrings) {
  return [
    buildRow(t.specs.architecture, s => s.architecture),
    buildRow(t.specs.smVersion, s => s.smVersion),
    buildRow(t.specs.process, s => s.processNode),
    buildRow(t.specs.transistors, s => s.transistors),
    buildRow(t.specs.tdp, s => s.tdp),
    buildRow(t.specs.dies, s => `${s.dieCount}`),
    buildRow(t.specs.dieInterconnect, s => s.dieInterconnect === 'N/A' ? 'N/A (single die)' : `${s.dieInterconnect} @ ${s.dieInterconnectBandwidth}`),
    buildRow(t.specs.gpcs, s => `${s.gpcsTotal}`),
    buildRow(t.specs.tpcsPerGpc, s => `${s.tpcsPerGpc}`),
    buildRow(t.specs.smsActiveTotal, s => `${s.smsActive} / ${s.smsTotal}`),
    buildRow(t.specs.cudaCores, s => s.cudaCoresTotal.toLocaleString()),
    buildRow(t.specs.tensorCores, s => `${s.tensorCoresTotal} (${s.tensorCoreGen})`),
    buildRow(t.specs.transformerEngine, s => s.transformerEngineGen),
    buildRow(t.specs.memoryLabel, s => `${s.hbmCapacity} ${s.hbmType}`),
    buildRow(t.specs.memoryBw, s => s.hbmBandwidth),
    buildRow(t.specs.hbmStacks, s => `${s.hbmStacks} (${s.hbmStackHeight})`),
    buildRow(t.specs.l2Cache, s => s.l2Cache),
    buildRow(t.specs.nvlink, s => `${s.nvlinkGen} @ ${s.nvlinkBandwidth}`),
    buildRow(t.specs.pcie, s => s.pcieGen),
    buildRow(t.specs.fp4Dense, s => s.fp4Dense),
    buildRow(t.specs.fp8Dense, s => s.fp8Dense),
    buildRow(t.specs.fp16Dense, s => s.fp16Dense),
    buildRow(t.specs.tf32Dense, s => s.tf32Dense),
    buildRow(t.specs.fp64, s => s.fp64),
    buildRow(t.specs.fp64Tensor, s => s.fp64Tensor),
  ]
}

export function Specifications({ spec }: SpecificationsProps) {
  const { t } = useI18n()
  const current = spec.name as string
  const rows = useMemo(() => buildRows(t), [t])

  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-5 py-3 text-text-muted font-medium w-[160px]">{t.specs.spec}</th>
            <th className={`text-left px-5 py-3 font-semibold ${current === 'B200' ? 'text-accent-green' : 'text-text-muted'}`}>B200</th>
            <th className={`text-left px-5 py-3 font-semibold ${current === 'B300' ? 'text-accent-green' : 'text-text-muted'}`}>B300</th>
            <th className="text-left px-5 py-3 text-text-muted font-medium">H100</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const diff200 = r.b200 !== r.h100
            const diff300 = r.b300 !== r.h100
            return (
              <tr key={r.label} className="border-b border-border-subtle last:border-0 hover:bg-bg-hover/20 transition-colors">
                <td className="px-5 py-2.5 text-text-secondary">{r.label}</td>
                <td className={`px-5 py-2.5 font-mono text-[11px] ${current === 'B200' ? (diff200 ? 'text-accent-green' : 'text-text-primary') : 'text-text-muted'}`}>{r.b200}</td>
                <td className={`px-5 py-2.5 font-mono text-[11px] ${current === 'B300' ? (diff300 ? 'text-accent-green' : 'text-text-primary') : 'text-text-muted'}`}>{r.b300}</td>
                <td className="px-5 py-2.5 font-mono text-[11px] text-text-muted">{r.h100}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
