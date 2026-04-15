import { useState } from 'react'
import type { GpuModel } from '../../data/specs'
import { DGX_SPECS } from '../../data/specs'
import { TabBar } from '../common/TabBar'
import { NodeLayout } from './NodeLayout'
import { DgxSpecs } from './DgxSpecs'

const TABS = [
  { id: 'topology', label: 'Node Topology' },
  { id: 'specs', label: 'Specifications' },
] as const

interface DgxVisualizerProps {
  readonly gpuModel: GpuModel
}

export function DgxVisualizer({ gpuModel }: DgxVisualizerProps) {
  const [activeTab, setActiveTab] = useState('topology')
  const spec = DGX_SPECS[gpuModel]

  return (
    <div className="space-y-4">
      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="min-h-[500px]">
        {activeTab === 'topology' && <NodeLayout spec={spec} gpuModel={gpuModel} />}
        {activeTab === 'specs' && <DgxSpecs spec={spec} />}
      </div>
    </div>
  )
}
