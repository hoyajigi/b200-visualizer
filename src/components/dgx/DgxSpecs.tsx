import type { DgxSpec } from '../../data/specs'
import { DGX_B200_SPEC, DGX_B300_SPEC } from '../../data/specs'

interface DgxSpecsProps {
  readonly spec: DgxSpec
}

export function DgxSpecs({ spec }: DgxSpecsProps) {
  const other = spec.name === 'DGX B200' ? DGX_B300_SPEC : DGX_B200_SPEC
  const isDiff = (a: string | number, b: string | number) => String(a) !== String(b)

  const rows = [
    { label: 'GPU Model', value: spec.gpuModel, compare: other.gpuModel, diff: isDiff(spec.gpuModel, other.gpuModel) },
    { label: 'GPU Count', value: `${spec.gpuCount}`, compare: `${other.gpuCount}` },
    { label: 'Total GPU Memory', value: spec.totalGpuMemory, compare: other.totalGpuMemory, diff: isDiff(spec.totalGpuMemory, other.totalGpuMemory) },
    { label: 'CPU', value: `${spec.cpuCount}x ${spec.cpuModel}`, compare: `${other.cpuCount}x ${other.cpuModel}` },
    { label: 'System Memory', value: spec.systemMemory, compare: other.systemMemory },
    { label: 'NVLink BW per GPU', value: spec.nvlinkBandwidthPerGpu, compare: other.nvlinkBandwidthPerGpu },
    { label: 'NVLink Topology', value: spec.nvlinkTopology, compare: other.nvlinkTopology },
    { label: 'Network', value: spec.networkBandwidth, compare: other.networkBandwidth, diff: isDiff(spec.networkBandwidth, other.networkBandwidth) },
    { label: 'Storage', value: spec.storage, compare: other.storage },
    { label: 'System TDP', value: spec.tdp, compare: other.tdp, diff: isDiff(spec.tdp, other.tdp) },
    { label: 'Form Factor', value: spec.formFactor, compare: other.formFactor },
  ]

  const otherName = spec.name === 'DGX B200' ? 'DGX B300' : 'DGX B200'

  return (
    <div className="bg-bg-card border border-border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-4 py-3 text-text-muted font-medium w-[200px]">Specification</th>
            <th className="text-left px-4 py-3 text-accent-green font-medium">{spec.name}</th>
            <th className="text-left px-4 py-3 text-text-muted font-medium">{otherName}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border/50 hover:bg-bg-hover/30 transition-colors">
              <td className="px-4 py-2 text-text-secondary">{row.label}</td>
              <td className={`px-4 py-2 font-mono text-xs ${row.diff ? 'text-accent-green' : 'text-text-primary'}`}>
                {row.value}
              </td>
              <td className="px-4 py-2 font-mono text-xs text-text-muted">
                {row.compare}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
