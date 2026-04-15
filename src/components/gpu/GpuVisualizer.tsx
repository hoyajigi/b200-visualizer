import { useState, useMemo } from 'react'
import type { GpuSpec } from '../../data/specs'
import { useI18n } from '../../i18n/context'
import { TabBar } from '../common/TabBar'
import { FullDieLayout } from './FullDieLayout'
import { BriefOverview } from './BriefOverview'
import { SmDetail } from './SmDetail'
import { Specifications } from './Specifications'

interface GpuVisualizerProps {
  readonly spec: GpuSpec
}

export function GpuVisualizer({ spec }: GpuVisualizerProps) {
  const [activeTab, setActiveTab] = useState('die')
  const { t } = useI18n()

  const tabs = useMemo(() => [
    { id: 'die', label: t.tabs.fullDie },
    { id: 'overview', label: t.tabs.overview },
    { id: 'sm', label: t.tabs.smDetail },
    { id: 'specs', label: t.tabs.specs },
  ] as const, [t])

  return (
    <div className="space-y-4">
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="min-h-[500px]">
        {activeTab === 'die' && <FullDieLayout spec={spec} />}
        {activeTab === 'overview' && <BriefOverview spec={spec} />}
        {activeTab === 'sm' && <SmDetail spec={spec} />}
        {activeTab === 'specs' && <Specifications spec={spec} />}
      </div>
    </div>
  )
}
