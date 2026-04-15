import { useState, useMemo } from 'react'
import type { GpuModel } from '../../data/specs'
import { DGX_SPECS } from '../../data/specs'
import { useI18n } from '../../i18n/context'
import { TabBar } from '../common/TabBar'
import { NodeLayout } from './NodeLayout'
import { DgxSpecs } from './DgxSpecs'

interface DgxVisualizerProps {
  readonly gpuModel: GpuModel
}

export function DgxVisualizer({ gpuModel }: DgxVisualizerProps) {
  const [activeTab, setActiveTab] = useState('topology')
  const { t } = useI18n()
  const spec = DGX_SPECS[gpuModel]

  const tabs = useMemo(() => [
    { id: 'topology', label: t.tabs.nodeTopology },
    { id: 'specs', label: t.tabs.specifications },
  ] as const, [t])

  return (
    <div className="space-y-4">
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="min-h-[500px]">
        {activeTab === 'topology' && <NodeLayout spec={spec} gpuModel={gpuModel} />}
        {activeTab === 'specs' && <DgxSpecs spec={spec} />}
      </div>
    </div>
  )
}
