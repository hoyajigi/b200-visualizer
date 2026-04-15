import { useState } from 'react'
import type { GpuSpec } from '../../data/specs'
import { TabBar } from '../common/TabBar'
import { FullDieLayout } from './FullDieLayout'
import { BriefOverview } from './BriefOverview'
import { SmDetail } from './SmDetail'
import { Specifications } from './Specifications'

const TABS = [
  { id: 'die', label: 'Full Die Layout' },
  { id: 'overview', label: 'Overview' },
  { id: 'sm', label: 'SM Detail' },
  { id: 'specs', label: 'Specifications' },
] as const

interface GpuVisualizerProps {
  readonly spec: GpuSpec
}

export function GpuVisualizer({ spec }: GpuVisualizerProps) {
  const [activeTab, setActiveTab] = useState('die')

  return (
    <div className="space-y-4">
      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="min-h-[500px]">
        {activeTab === 'die' && <FullDieLayout spec={spec} />}
        {activeTab === 'overview' && <BriefOverview spec={spec} />}
        {activeTab === 'sm' && <SmDetail spec={spec} />}
        {activeTab === 'specs' && <Specifications spec={spec} />}
      </div>
    </div>
  )
}
