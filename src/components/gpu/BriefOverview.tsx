import type { GpuSpec } from '../../data/specs'
import { useI18n } from '../../i18n/context'

interface BriefOverviewProps {
  readonly spec: GpuSpec
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5">
      <div className="text-text-muted text-[11px] mb-1">{label}</div>
      <div className="text-2xl font-semibold text-text-primary tracking-tight">{value}</div>
      {sub && <div className="text-text-muted text-[10px] mt-1">{sub}</div>}
    </div>
  )
}

export function BriefOverview({ spec }: BriefOverviewProps) {
  const { t } = useI18n()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-3">
        <Stat label={t.overview.cudaCores} value={spec.cudaCoresTotal.toLocaleString()} sub={`${spec.smsActive} SMs x ${spec.cudaCoresPerSm}`} />
        <Stat label={t.overview.tensorCores} value={`${spec.tensorCoresTotal}`} sub={spec.tensorCoreGen} />
        <Stat label={t.overview.memory} value={spec.hbmCapacity} sub={`${spec.hbmType} @ ${spec.hbmBandwidth}`} />
        <Stat label="FP4 Dense" value={spec.fp4Dense} sub={t.overview.peakTensor} />
      </div>

      <div>
        <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">{t.overview.architectureHierarchy}</h3>
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">{spec.name}</span>
            <span className="text-[11px] text-text-muted">{spec.architecture}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: spec.dieCount }, (_, dieIdx) => (
              <div key={dieIdx} className="bg-bg-secondary border border-border-subtle rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-text-secondary">Die {dieIdx}</span>
                  <span className="text-[10px] text-text-muted">{spec.gpcsPerDie} GPCs</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: spec.gpcsPerDie }, (_, gpcIdx) => (
                    <div key={gpcIdx} className="bg-gpc border border-gpc-border rounded-md p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-accent-green/70">GPC {dieIdx * spec.gpcsPerDie + gpcIdx}</span>
                        <span className="text-[9px] text-text-muted">{spec.tpcsPerGpc} TPCs</span>
                      </div>
                      <div className="text-[9px] text-text-muted mt-1">
                        {spec.tpcsPerGpc * spec.smsPerTpc} SMs / {spec.tpcsPerGpc * spec.smsPerTpc * spec.cudaCoresPerSm} cores
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">{t.overview.keyFeatures}</h3>
        <div className="grid grid-cols-2 gap-2">
          {spec.keyFeatures.map((feature) => (
            <div key={feature} className="bg-bg-card border border-border rounded-lg px-4 py-3 text-xs text-text-secondary">
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">{t.overview.dieInterconnect}</h3>
        <div className="bg-bg-card border border-border rounded-xl p-6 flex items-center justify-center gap-8">
          <div className="bg-bg-secondary border border-gpc-border rounded-lg px-8 py-4 text-center">
            <div className="text-sm font-medium">Die 0</div>
            <div className="text-[11px] text-text-muted mt-1">{spec.gpcsPerDie} GPCs, {Math.floor(spec.smsActive / 2)} SMs</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-accent-red/80">{spec.dieInterconnect}</span>
            <div className="w-28 h-px bg-accent-red/30" />
            <span className="text-[10px] text-text-muted">{spec.dieInterconnectBandwidth}</span>
          </div>
          <div className="bg-bg-secondary border border-gpc-border rounded-lg px-8 py-4 text-center">
            <div className="text-sm font-medium">Die 1</div>
            <div className="text-[11px] text-text-muted mt-1">{spec.gpcsPerDie} GPCs, {spec.smsActive - Math.floor(spec.smsActive / 2)} SMs</div>
          </div>
        </div>
      </div>
    </div>
  )
}
