export interface GpuSpec {
  readonly name: string
  readonly codename: string
  readonly architecture: string
  readonly smVersion: string
  readonly processNode: string
  readonly transistors: string
  readonly dieCount: number
  readonly dieInterconnect: string
  readonly dieInterconnectBandwidth: string
  readonly gpcsTotal: number
  readonly gpcsPerDie: number
  readonly tpcsPerGpc: number
  readonly smsPerTpc: number
  readonly smsTotal: number
  readonly smsActive: number
  readonly cudaCoresPerSm: number
  readonly cudaCoresTotal: number
  readonly tensorCoresPerSm: number
  readonly tensorCoreGen: string
  readonly tensorCoresTotal: number
  readonly rtCoresPerSm: number
  readonly rtCoreGen: string
  readonly registerFilePerSm: string
  readonly sharedMemoryPerSm: string
  readonly l2Cache: string
  readonly l2PartitionsPerDie: number
  readonly hbmType: string
  readonly hbmCapacity: string
  readonly hbmStacks: number
  readonly hbmStackHeight: string
  readonly hbmBandwidth: string
  readonly hbmBusWidth: string
  readonly nvlinkGen: string
  readonly nvlinkBandwidth: string
  readonly nvlinkLinks: number
  readonly pcieGen: string
  readonly tdp: string
  readonly fp4Dense: string
  readonly fp4Sparse: string
  readonly fp8Dense: string
  readonly fp8Sparse: string
  readonly fp16Dense: string
  readonly fp16Sparse: string
  readonly tf32Dense: string
  readonly tf32Sparse: string
  readonly fp64: string
  readonly fp64Tensor: string
  readonly transformerEngineGen: string
  readonly keyFeatures: readonly string[]
}

export interface DgxSpec {
  readonly name: string
  readonly gpuModel: string
  readonly gpuCount: number
  readonly cpuModel: string
  readonly cpuCount: number
  readonly systemMemory: string
  readonly nvlinkBandwidthPerGpu: string
  readonly nvlinkTopology: string
  readonly networkBandwidth: string
  readonly storage: string
  readonly totalGpuMemory: string
  readonly tdp: string
  readonly formFactor: string
}

export const B200_SPEC: GpuSpec = {
  name: 'B200',
  codename: 'GB202',
  architecture: 'Blackwell',
  smVersion: 'SM100',
  processNode: 'TSMC 4NP',
  transistors: '208B',
  dieCount: 2,
  dieInterconnect: 'NV-HBI',
  dieInterconnectBandwidth: '10 TB/s',
  gpcsTotal: 8,
  gpcsPerDie: 4,
  tpcsPerGpc: 10,
  smsPerTpc: 2,
  smsTotal: 160,
  smsActive: 148,
  cudaCoresPerSm: 128,
  cudaCoresTotal: 18944,
  tensorCoresPerSm: 4,
  tensorCoreGen: '5th Gen',
  tensorCoresTotal: 592,
  rtCoresPerSm: 1,
  rtCoreGen: '4th Gen',
  registerFilePerSm: '256 KB',
  sharedMemoryPerSm: '228 KB',
  l2Cache: '96 MB (48 MB per die)',
  l2PartitionsPerDie: 4,
  hbmType: 'HBM3e',
  hbmCapacity: '192 GB',
  hbmStacks: 8,
  hbmStackHeight: '8-high',
  hbmBandwidth: '8 TB/s',
  hbmBusWidth: '8192-bit',
  nvlinkGen: 'NVLink 5.0',
  nvlinkBandwidth: '1.8 TB/s',
  nvlinkLinks: 18,
  pcieGen: 'PCIe Gen 5 x16',
  tdp: '1,000 W',
  fp4Dense: '9 PFLOPS',
  fp4Sparse: '18 PFLOPS',
  fp8Dense: '4.5 PFLOPS',
  fp8Sparse: '9 PFLOPS',
  fp16Dense: '2.25 PFLOPS',
  fp16Sparse: '4.5 PFLOPS',
  tf32Dense: '1.125 PFLOPS',
  tf32Sparse: '2.25 PFLOPS',
  fp64: '40 TFLOPS',
  fp64Tensor: '80 TFLOPS',
  transformerEngineGen: '2nd Gen',
  keyFeatures: [
    'Dual-die MCM with NV-HBI at 10 TB/s',
    '5th Gen Tensor Cores with FP4/FP6 support',
    '2nd Gen Transformer Engine',
    'Decompression Engine',
    '2-SM TMA Multicast',
    'HBM3e with 8 TB/s bandwidth',
  ],
}

export const B300_SPEC: GpuSpec = {
  name: 'B300',
  codename: 'GB202 Ultra',
  architecture: 'Blackwell Ultra',
  smVersion: 'SM100',
  processNode: 'TSMC 4NP',
  transistors: '208B',
  dieCount: 2,
  dieInterconnect: 'NV-HBI',
  dieInterconnectBandwidth: '10 TB/s',
  gpcsTotal: 8,
  gpcsPerDie: 4,
  tpcsPerGpc: 10,
  smsPerTpc: 2,
  smsTotal: 160,
  smsActive: 160,
  cudaCoresPerSm: 128,
  cudaCoresTotal: 20480,
  tensorCoresPerSm: 4,
  tensorCoreGen: '5th Gen',
  tensorCoresTotal: 640,
  rtCoresPerSm: 1,
  rtCoreGen: '4th Gen',
  registerFilePerSm: '256 KB',
  sharedMemoryPerSm: '228 KB',
  l2Cache: '96 MB (48 MB per die)',
  l2PartitionsPerDie: 4,
  hbmType: 'HBM3e',
  hbmCapacity: '288 GB',
  hbmStacks: 8,
  hbmStackHeight: '12-high',
  hbmBandwidth: '8 TB/s',
  hbmBusWidth: '8192-bit',
  nvlinkGen: 'NVLink 5.0',
  nvlinkBandwidth: '1.8 TB/s',
  nvlinkLinks: 18,
  pcieGen: 'PCIe Gen 5 x16',
  tdp: '1,100 W',
  fp4Dense: '15 PFLOPS',
  fp4Sparse: '30 PFLOPS',
  fp8Dense: '5 PFLOPS',
  fp8Sparse: '10 PFLOPS',
  fp16Dense: '2.5 PFLOPS',
  fp16Sparse: '5 PFLOPS',
  tf32Dense: '1.25 PFLOPS',
  tf32Sparse: '2.5 PFLOPS',
  fp64: '45 TFLOPS',
  fp64Tensor: '90 TFLOPS',
  transformerEngineGen: '2nd Gen',
  keyFeatures: [
    'All 160 SMs active (vs 148 on B200)',
    '288 GB HBM3e with 12-high stacks',
    '2x faster attention acceleration',
    'NVFP4 optimized Tensor Cores',
    '2nd Gen Transformer Engine',
    'CX8 800 Gbps networking support',
  ],
}

export const DGX_B200_SPEC: DgxSpec = {
  name: 'DGX B200',
  gpuModel: 'B200',
  gpuCount: 8,
  cpuModel: 'Intel Xeon Platinum 8570',
  cpuCount: 2,
  systemMemory: '4 TB DDR5',
  nvlinkBandwidthPerGpu: '1.8 TB/s',
  nvlinkTopology: 'All-to-all via NVSwitch',
  networkBandwidth: '400 Gbps (CX7)',
  storage: '2x 1.92 TB NVMe M.2 + 8x 3.84 TB NVMe',
  totalGpuMemory: '1.44 TB',
  tdp: '~14.3 kW',
  formFactor: '8U Rackmount',
}

export const DGX_B300_SPEC: DgxSpec = {
  name: 'DGX B300',
  gpuModel: 'B300',
  gpuCount: 8,
  cpuModel: 'Intel Xeon Platinum 8570',
  cpuCount: 2,
  systemMemory: '4 TB DDR5',
  nvlinkBandwidthPerGpu: '1.8 TB/s',
  nvlinkTopology: 'All-to-all via NVSwitch',
  networkBandwidth: '800 Gbps (CX8)',
  storage: '2x 1.92 TB NVMe M.2 + 8x 3.84 TB NVMe',
  totalGpuMemory: '2.3 TB',
  tdp: '~15.5 kW',
  formFactor: '8U Rackmount',
}

export const H100_SPEC: GpuSpec = {
  name: 'H100',
  codename: 'GH100',
  architecture: 'Hopper',
  smVersion: 'SM90',
  processNode: 'TSMC 4N',
  transistors: '80B',
  dieCount: 1,
  dieInterconnect: 'N/A',
  dieInterconnectBandwidth: 'N/A',
  gpcsTotal: 8,
  gpcsPerDie: 8,
  tpcsPerGpc: 9,
  smsPerTpc: 2,
  smsTotal: 144,
  smsActive: 132,
  cudaCoresPerSm: 128,
  cudaCoresTotal: 16896,
  tensorCoresPerSm: 4,
  tensorCoreGen: '4th Gen',
  tensorCoresTotal: 528,
  rtCoresPerSm: 1,
  rtCoreGen: '3rd Gen',
  registerFilePerSm: '256 KB',
  sharedMemoryPerSm: '256 KB',
  l2Cache: '50 MB',
  l2PartitionsPerDie: 1,
  hbmType: 'HBM3',
  hbmCapacity: '80 GB',
  hbmStacks: 5,
  hbmStackHeight: '8-high',
  hbmBandwidth: '3.35 TB/s',
  hbmBusWidth: '5120-bit',
  nvlinkGen: 'NVLink 4.0',
  nvlinkBandwidth: '900 GB/s',
  nvlinkLinks: 18,
  pcieGen: 'PCIe Gen 5 x16',
  tdp: '700 W',
  fp4Dense: 'N/A',
  fp4Sparse: 'N/A',
  fp8Dense: '1.979 PFLOPS',
  fp8Sparse: '3.958 PFLOPS',
  fp16Dense: '989.4 TFLOPS',
  fp16Sparse: '1,979 TFLOPS',
  tf32Dense: '494.7 TFLOPS',
  tf32Sparse: '989.4 TFLOPS',
  fp64: '33.5 TFLOPS',
  fp64Tensor: '66.9 TFLOPS',
  transformerEngineGen: '1st Gen',
  keyFeatures: [
    'Single-die design',
    '4th Gen Tensor Cores with FP8',
    '1st Gen Transformer Engine',
    'Thread Block Clusters',
    'TMA (Tensor Memory Accelerator)',
    'HBM3 with 3.35 TB/s',
  ],
}

export type GpuModel = 'B200' | 'B300'

export const GPU_SPECS: Record<GpuModel, GpuSpec> = {
  B200: B200_SPEC,
  B300: B300_SPEC,
}

export const DGX_SPECS: Record<GpuModel, DgxSpec> = {
  B200: DGX_B200_SPEC,
  B300: DGX_B300_SPEC,
}
