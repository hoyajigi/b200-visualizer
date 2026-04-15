export type Locale = 'ko' | 'en'

export interface UiStrings {
  readonly header: {
    readonly title: string
    readonly gpuDie: string
    readonly dgxNode: string
  }
  readonly tabs: {
    readonly fullDie: string
    readonly overview: string
    readonly smDetail: string
    readonly specs: string
    readonly nodeTopology: string
    readonly specifications: string
  }
  readonly die: {
    readonly die: string
    readonly partitions: string
    readonly activeSm: string
    readonly disabled: string
    readonly bidirectional: string
    readonly clickAny: string
  }
  readonly overview: {
    readonly keyNumbers: string
    readonly architectureHierarchy: string
    readonly keyFeatures: string
    readonly dieInterconnect: string
    readonly cudaCores: string
    readonly tensorCores: string
    readonly memory: string
    readonly peakTensor: string
  }
  readonly sm: {
    readonly smContains: string
    readonly processingBlock: string
    readonly sharedResources: string
    readonly registerFile: string
    readonly sharedMemL1: string
    readonly textureUnits: string
    readonly warpSchedulers: string
    readonly dispatchUnits: string
  }
  readonly dgx: {
    readonly rackmount: string
    readonly systemMemory: string
    readonly storage: string
    readonly network: string
    readonly gpuMem: string
  }
  readonly specs: {
    readonly spec: string
    readonly architecture: string
    readonly smVersion: string
    readonly process: string
    readonly transistors: string
    readonly tdp: string
    readonly dies: string
    readonly dieInterconnect: string
    readonly gpcs: string
    readonly tpcsPerGpc: string
    readonly smsActiveTotal: string
    readonly cudaCores: string
    readonly tensorCores: string
    readonly transformerEngine: string
    readonly memoryLabel: string
    readonly memoryBw: string
    readonly hbmStacks: string
    readonly l2Cache: string
    readonly nvlink: string
    readonly pcie: string
    readonly fp4Dense: string
    readonly fp8Dense: string
    readonly fp16Dense: string
    readonly tf32Dense: string
    readonly fp64: string
    readonly fp64Tensor: string
  }
  readonly footer: string
}
