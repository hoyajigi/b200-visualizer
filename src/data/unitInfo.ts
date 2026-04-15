export interface UnitSection {
  readonly title: string
  readonly content: readonly string[]
}

export interface UnitSpec {
  readonly label: string
  readonly value: string
}

export interface UnitInfo {
  readonly title: string
  readonly description: string
  readonly sections: readonly UnitSection[]
  readonly specs: readonly UnitSpec[]
}

export type UnitKey =
  | 'gpc' | 'sm' | 'tpc' | 'tensor-core' | 'cuda-core'
  | 'hbm3e' | 'l2-cache' | 'nv-hbi' | 'nvlink' | 'pcie'
  | 'register-file' | 'shared-memory' | 'warp-scheduler'
  | 'rt-core' | 'transformer-engine' | 'nvswitch' | 'cpu'

export const unitInfoData: Record<UnitKey, UnitInfo> = {
  'gpc': {
    title: 'Graphics Processing Cluster',
    description: 'GPU의 기본 연산 단위. 각 GPC는 독립적인 래스터 엔진과 다수의 TPC를 포함하며, 병렬 워크로드를 독립적으로 처리할 수 있다.',
    sections: [
      {
        title: '구조',
        content: [
          '10개 TPC (Texture Processing Cluster) 포함',
          'TPC당 2개 SM → GPC당 20개 SM',
          '독립적 래스터 엔진 탑재',
          'Blackwell에서 H100 대비 TPC 수 증가 (9→10)',
        ],
      },
      {
        title: 'Blackwell 변화',
        content: [
          'B200: 8 GPC 중 148/160 SM 활성화',
          'B300: 8 GPC 전체 160 SM 활성화',
          'H100 대비 GPC당 SM 수 ~11% 증가',
        ],
      },
    ],
    specs: [
      { label: 'GPCs per die', value: '4' },
      { label: 'TPCs per GPC', value: '10' },
      { label: 'SMs per GPC', value: '20' },
      { label: 'CUDA Cores per GPC', value: '2,560' },
    ],
  },
  'sm': {
    title: 'Streaming Multiprocessor (SM100)',
    description: 'GPU의 핵심 연산 유닛. 각 SM은 독립적으로 스레드 블록을 스케줄링하고 실행한다. Blackwell SM100은 Hopper SM90 대비 FP4/FP6 지원과 2-SM TMA Multicast가 추가되었다.',
    sections: [
      {
        title: '내부 구조',
        content: [
          '4개 Processing Block (Partition)',
          'Block당: 32 FP32 Cores + 1 Tensor Core + 1 Warp Scheduler',
          '공유: 256 KB Register File, 228 KB Shared Mem + L1',
          '1 RT Core (4th Gen), 4 Texture Units',
        ],
      },
      {
        title: 'SM100 vs SM90',
        content: [
          'FP4, FP6 정밀도 추가 지원',
          '2-SM TMA Multicast: 두 SM에 동시 데이터 브로드캐스트',
          'Shared Memory: 256 KB → 228 KB (L1 배분 변경)',
          '5th Gen Tensor Core로 업그레이드',
        ],
      },
    ],
    specs: [
      { label: 'CUDA Cores', value: '128 (32×4)' },
      { label: 'Tensor Cores', value: '4 (5th Gen)' },
      { label: 'RT Core', value: '1 (4th Gen)' },
      { label: 'Register File', value: '256 KB' },
      { label: 'Shared Mem + L1', value: '228 KB' },
      { label: 'Warp Schedulers', value: '4' },
    ],
  },
  'tpc': {
    title: 'Texture Processing Cluster',
    description: 'GPC의 하위 단위로, 2개의 SM을 묶어 텍스처 유닛과 폴리모프 엔진을 공유한다.',
    sections: [
      {
        title: '구조',
        content: [
          '2개 SM 포함',
          '공유 텍스처 캐시',
          'PolyMorph Engine 포함',
        ],
      },
    ],
    specs: [
      { label: 'SMs per TPC', value: '2' },
      { label: 'Total TPCs', value: '80 (B200/B300)' },
    ],
  },
  'tensor-core': {
    title: '5th Gen Tensor Core',
    description: 'Blackwell의 핵심 혁신. 행렬 연산 전용 가속기로, FP4/FP6/FP8/FP16/BF16/TF32/FP64 정밀도를 지원하며 대규모 언어 모델(LLM) 학습과 추론에 최적화되어 있다.',
    sections: [
      {
        title: '지원 정밀도',
        content: [
          'FP4: 새로 추가 — 추론 전용, B200 9 PFLOPS / B300 15 PFLOPS',
          'FP6: 새로 추가 — FP4와 FP8 사이의 정밀도-성능 밸런스',
          'FP8 (E4M3/E5M2): 학습 및 추론',
          'FP16/BF16: 표준 mixed-precision 학습',
          'TF32: FP32 대체 (정밀도 유지, 처리량 증가)',
          'FP64: 과학 연산용 배정밀도',
        ],
      },
      {
        title: '4th Gen (H100) 대비 변화',
        content: [
          'FP4/FP6 정밀도 추가 (처리량 2배)',
          '2nd Gen Transformer Engine 연동',
          'Dynamic scaling 알고리즘 개선',
          'B300은 2x attention acceleration 추가',
        ],
      },
    ],
    specs: [
      { label: 'Per SM', value: '4' },
      { label: 'Total (B200)', value: '592' },
      { label: 'Total (B300)', value: '640' },
      { label: 'FP4 Dense (B200)', value: '9 PFLOPS' },
      { label: 'FP4 Dense (B300)', value: '15 PFLOPS' },
    ],
  },
  'cuda-core': {
    title: 'CUDA Core (FP32)',
    description: '범용 부동소수점 연산 유닛. Blackwell에서는 INT32/FP32 통합 실행 유닛으로, 동일 코어에서 정수와 부동소수점 연산을 처리한다.',
    sections: [
      {
        title: '특징',
        content: [
          'INT32/FP32 통합 (Unified) 실행',
          'SM당 128개 (32개 × 4 Processing Block)',
          'H100 대비 SM당 코어 수 동일 (128)',
          'B200: 18,944 / B300: 20,480 (전체 SM 활성화로 증가)',
        ],
      },
    ],
    specs: [
      { label: 'Per Processing Block', value: '32' },
      { label: 'Per SM', value: '128' },
      { label: 'Total (B200)', value: '18,944' },
      { label: 'Total (B300)', value: '20,480' },
    ],
  },
  'hbm3e': {
    title: 'HBM3e Memory',
    description: '고대역폭 메모리. Blackwell은 8개 HBM3e 스택을 사용하며, 다이 양쪽에 배치하여 최대 8 TB/s 대역폭을 제공한다.',
    sections: [
      {
        title: 'B200 vs B300',
        content: [
          'B200: 8스택 × 24GB (8-high) = 192 GB',
          'B300: 8스택 × 36GB (12-high) = 288 GB',
          '동일 대역폭: 8 TB/s, 8192-bit 버스',
          'H100 대비 대역폭 2.4배 증가 (3.35→8 TB/s)',
        ],
      },
      {
        title: 'H100 (HBM3) 대비',
        content: [
          '용량: 80GB → 192/288 GB (2.4~3.6배)',
          '대역폭: 3.35 TB/s → 8 TB/s',
          '스택: 5개 → 8개',
          'HBM3 → HBM3e (더 빠른 I/O, 낮은 전력)',
        ],
      },
    ],
    specs: [
      { label: 'Type', value: 'HBM3e' },
      { label: 'Bus Width', value: '8,192-bit' },
      { label: 'Bandwidth', value: '8 TB/s' },
      { label: 'Stacks', value: '8' },
    ],
  },
  'l2-cache': {
    title: 'L2 Cache',
    description: 'GPU 전체에서 공유하는 마지막 단계 온칩 캐시. Blackwell은 다이당 4개 파티션, 총 96 MB를 제공한다.',
    sections: [
      {
        title: 'H100 대비',
        content: [
          'H100: 50 MB (단일 다이)',
          'Blackwell: 96 MB (다이당 48 MB × 2)',
          '약 1.9배 증가',
          '파티션 수 증가로 대역폭 확대',
        ],
      },
    ],
    specs: [
      { label: 'Total', value: '96 MB' },
      { label: 'Per Die', value: '48 MB' },
      { label: 'Partitions per Die', value: '4' },
    ],
  },
  'nv-hbi': {
    title: 'NV-HBI (High-Bandwidth Interface)',
    description: 'Blackwell의 듀얼 다이를 연결하는 전용 인터커넥트. 10 TB/s 대역폭으로 HBM 대역폭(8 TB/s)을 초과하여, 두 다이가 단일 GPU처럼 동작하게 한다.',
    sections: [
      {
        title: '핵심 설계',
        content: [
          '다이간 대역폭이 메모리 대역폭을 초과 (10 > 8 TB/s)',
          '투명한 메모리 접근: 소프트웨어는 단일 GPU로 인식',
          '전력 효율적 커스텀 설계',
          'H100에는 없음 (단일 다이)',
        ],
      },
    ],
    specs: [
      { label: 'Bandwidth', value: '10 TB/s' },
      { label: 'vs HBM BW', value: '> 8 TB/s (1.25x)' },
      { label: 'H100', value: 'N/A (single die)' },
    ],
  },
  'nvlink': {
    title: 'NVLink 5.0',
    description: 'GPU간 고속 인터커넥트. 5세대 NVLink는 GPU당 1.8 TB/s 대역폭을 제공하며, NVSwitch를 통해 최대 8GPU all-to-all 연결을 지원한다.',
    sections: [
      {
        title: 'H100 (NVLink 4.0) 대비',
        content: [
          '대역폭: 900 GB/s → 1.8 TB/s (2배)',
          '링크 수: 동일 18개',
          '링크당 대역폭 2배 증가',
          'GB200 NVL72: 최대 72 GPU NVLink 도메인 가능',
        ],
      },
    ],
    specs: [
      { label: 'Bandwidth', value: '1.8 TB/s bidirectional' },
      { label: 'Links', value: '18' },
      { label: 'Per Link', value: '100 GB/s' },
      { label: 'vs H100', value: '2x (900 GB/s → 1.8 TB/s)' },
    ],
  },
  'pcie': {
    title: 'PCIe Gen 5',
    description: 'CPU-GPU 호스트 인터페이스. PCIe Gen 5 x16으로 128 GB/s 양방향 대역폭을 제공한다.',
    sections: [
      {
        title: '특징',
        content: [
          'H100과 동일 세대 (Gen 5)',
          '128 GB/s bidirectional',
          'CPU 메모리 접근 및 시스템 통신용',
          'NVLink 대비 낮은 대역폭 (GPU간 통신은 NVLink 사용)',
        ],
      },
    ],
    specs: [
      { label: 'Generation', value: 'Gen 5' },
      { label: 'Lanes', value: 'x16' },
      { label: 'Bandwidth', value: '128 GB/s bidirectional' },
    ],
  },
  'register-file': {
    title: 'Register File',
    description: 'SM 내 가장 빠른 스토리지. 각 스레드가 사용하는 레지스터를 저장하며, SM당 256 KB를 제공한다.',
    sections: [
      { title: '특징', content: ['SM당 256 KB (H100과 동일)', '1 사이클 접근 지연', '스레드당 레지스터 수로 Occupancy 결정'] },
    ],
    specs: [{ label: 'Per SM', value: '256 KB' }, { label: 'Latency', value: '~1 cycle' }],
  },
  'shared-memory': {
    title: 'Shared Memory + L1 Cache',
    description: 'SM 내 프로그래머블 고속 메모리. L1 캐시와 공유하며 소프트웨어로 파티셔닝 가능하다.',
    sections: [
      { title: 'SM100 vs SM90', content: ['SM100: 228 KB (Blackwell)', 'SM90: 256 KB (H100)', '배분 비율 변경 — L1에 더 많은 용량 할당', '여전히 프로그래머블 파티셔닝 지원'] },
    ],
    specs: [{ label: 'Per SM (Blackwell)', value: '228 KB' }, { label: 'Per SM (H100)', value: '256 KB' }],
  },
  'warp-scheduler': {
    title: 'Warp Scheduler',
    description: '32개 스레드로 구성된 Warp의 실행을 스케줄링한다. SM당 4개가 독립적으로 동작하며, 각각 1개의 Dispatch Unit과 쌍을 이룬다.',
    sections: [
      { title: '특징', content: ['SM당 4개 (Processing Block당 1개)', '독립적 Warp 스케줄링', '명령어 발행 → Dispatch Unit → 실행 유닛'] },
    ],
    specs: [{ label: 'Per SM', value: '4' }, { label: 'Warp Size', value: '32 threads' }],
  },
  'rt-core': {
    title: 'RT Core (4th Gen)',
    description: '레이 트레이싱 가속 유닛. BVH 트래버설과 레이-삼각형 교차 테스트를 하드웨어로 가속한다.',
    sections: [
      { title: '특징', content: ['SM당 1개', 'H100과 동일 세대 유지 (4th Gen)', '주로 그래픽/렌더링 워크로드용'] },
    ],
    specs: [{ label: 'Generation', value: '4th Gen' }, { label: 'Per SM', value: '1' }],
  },
  'transformer-engine': {
    title: '2nd Gen Transformer Engine',
    description: 'Transformer 모델의 학습/추론을 자동 최적화하는 하드웨어+소프트웨어 레이어. FP8/FP4를 레이어별로 동적으로 관리한다.',
    sections: [
      {
        title: '1st Gen (H100) 대비',
        content: [
          'FP4 지원 추가 (처리량 2배)',
          'Attention, LayerNorm, MLP 등 더 넓은 범위 적용',
          '더 정교한 dynamic scaling 알고리즘',
          'B300: 2x attention acceleration',
        ],
      },
      {
        title: '동작 원리',
        content: [
          '각 레이어 텐서 값 분포 실시간 모니터링',
          'FP8 안전 여부 판단 → 불안전하면 BF16 폴백',
          'Dynamic scaling factor 자동 조정',
        ],
      },
    ],
    specs: [
      { label: 'Generation', value: '2nd Gen' },
      { label: 'FP4 Support', value: 'Yes (new)' },
      { label: 'H100', value: '1st Gen (FP8 only)' },
    ],
  },
  'nvswitch': {
    title: 'NVSwitch (5th Gen)',
    description: 'DGX 시스템 내 GPU 간 all-to-all NVLink 연결을 중재하는 스위치 칩. 8개 GPU가 동일한 대역폭으로 통신할 수 있게 한다.',
    sections: [
      {
        title: 'H100 (4th Gen) 대비',
        content: [
          'GPU당 대역폭: 900 GB/s → 1.8 TB/s',
          'GB200 NVL72에서는 외부 스위치 트레이로 분리 → 72 GPU 단일 NVLink 도메인',
          'DGX B200/B300에서는 기존과 같이 노드 내부 8-GPU all-to-all',
        ],
      },
    ],
    specs: [
      { label: 'Generation', value: '5th Gen' },
      { label: 'Topology', value: 'All-to-all (8 GPUs)' },
      { label: 'Per GPU BW', value: '1.8 TB/s' },
    ],
  },
  'cpu': {
    title: 'Intel Xeon Platinum 8570',
    description: 'DGX B200/B300의 호스트 CPU. PCIe Gen 5로 GPU와 연결되며, 시스템 메모리 관리와 I/O 처리를 담당한다.',
    sections: [
      { title: '구성', content: ['DGX당 2소켓', 'PCIe Gen 5 x16으로 GPU 연결', '시스템 메모리: 4 TB DDR5'] },
    ],
    specs: [
      { label: 'Sockets', value: '2' },
      { label: 'System Memory', value: '4 TB DDR5' },
      { label: 'Host Interface', value: 'PCIe Gen 5' },
    ],
  },
}
