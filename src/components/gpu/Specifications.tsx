import type { GpuSpec } from '../../data/specs'
import { B200_SPEC, B300_SPEC, H100_SPEC } from '../../data/specs'

interface SpecificationsProps {
  readonly spec: GpuSpec
}

function row(label: string, fn: (s: GpuSpec) => string) {
  return { label, b200: fn(B200_SPEC), b300: fn(B300_SPEC), h100: fn(H100_SPEC) }
}

const ROWS = [
  row('Architecture', s => s.architecture),
  row('SM Version', s => s.smVersion),
  row('Process', s => s.processNode),
  row('Transistors', s => s.transistors),
  row('TDP', s => s.tdp),
  row('Dies', s => `${s.dieCount}`),
  row('Die Interconnect', s => s.dieInterconnect === 'N/A' ? 'N/A (single die)' : `${s.dieInterconnect} @ ${s.dieInterconnectBandwidth}`),
  row('GPCs', s => `${s.gpcsTotal}`),
  row('TPCs per GPC', s => `${s.tpcsPerGpc}`),
  row('SMs (active/total)', s => `${s.smsActive} / ${s.smsTotal}`),
  row('CUDA Cores', s => s.cudaCoresTotal.toLocaleString()),
  row('Tensor Cores', s => `${s.tensorCoresTotal} (${s.tensorCoreGen})`),
  row('Transformer Engine', s => s.transformerEngineGen),
  row('Memory', s => `${s.hbmCapacity} ${s.hbmType}`),
  row('Memory BW', s => s.hbmBandwidth),
  row('HBM Stacks', s => `${s.hbmStacks} (${s.hbmStackHeight})`),
  row('L2 Cache', s => s.l2Cache),
  row('NVLink', s => `${s.nvlinkGen} @ ${s.nvlinkBandwidth}`),
  row('PCIe', s => s.pcieGen),
  row('FP4 Dense', s => s.fp4Dense),
  row('FP8 Dense', s => s.fp8Dense),
  row('FP16/BF16 Dense', s => s.fp16Dense),
  row('TF32 Dense', s => s.tf32Dense),
  row('FP64', s => s.fp64),
  row('FP64 Tensor', s => s.fp64Tensor),
]

export function Specifications({ spec }: SpecificationsProps) {
  const current = spec.name as string

  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-5 py-3 text-text-muted font-medium w-[160px]">Spec</th>
            <th className={`text-left px-5 py-3 font-semibold ${current === 'B200' ? 'text-accent-green' : 'text-text-muted'}`}>B200</th>
            <th className={`text-left px-5 py-3 font-semibold ${current === 'B300' ? 'text-accent-green' : 'text-text-muted'}`}>B300</th>
            <th className="text-left px-5 py-3 text-text-muted font-medium">H100</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => {
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
