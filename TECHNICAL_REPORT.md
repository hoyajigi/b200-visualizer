# Blackwell GPU Visualizer — Technical Report

## Overview

NVIDIA Blackwell 아키텍처(B200, B300) GPU 다이 레이아웃 및 DGX 노드 토폴로지를 인터랙티브하게 시각화하는 웹 애플리케이션. H100 (Hopper) 대비 아키텍처 변화를 비교할 수 있다.

**참고 프로젝트**: [cudacourseh100.github.io](https://cudacourseh100.github.io/) (H100용 인터랙티브 비주얼라이저, Prateek Shukla)

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.x |
| Language | TypeScript | 5.x |
| Build | Vite | 6.x (8.x runtime) |
| Styling | Tailwind CSS | 4.x |
| Deploy | GitHub Pages | via Actions |

## Project Structure

```
src/
├── App.tsx                           # 메인 앱 — GPU 모델/뷰 모드 전환
├── main.tsx                          # 엔트리 포인트
├── index.css                         # 다크 테마 + Tailwind 테마 변수 + 애니메이션
├── data/
│   └── specs.ts                      # B200/B300/H100/DGX 스펙 데이터 + 타입
├── components/
│   ├── common/
│   │   ├── TabBar.tsx                # 밑줄 스타일 탭 네비게이션
│   │   ├── InfoPanel.tsx             # 정보 패널 (재사용)
│   │   └── DetailDrawer.tsx          # 슬라이드인 상세 드로어 (클릭 시)
│   ├── gpu/
│   │   ├── GpuVisualizer.tsx         # GPU 뷰 래퍼 (탭 관리)
│   │   ├── FullDieLayout.tsx         # 듀얼 다이 풀 레이아웃 + 인터랙션
│   │   ├── BriefOverview.tsx         # 아키텍처 계층 구조 + 주요 수치
│   │   ├── SmDetail.tsx              # SM100 내부 구조 상세 뷰
│   │   └── Specifications.tsx        # B200 vs B300 vs H100 3칼럼 비교
│   └── dgx/
│       ├── DgxVisualizer.tsx         # DGX 뷰 래퍼
│       ├── NodeLayout.tsx            # DGX 노드 토폴로지 + 인터랙션
│       └── DgxSpecs.tsx              # DGX B200 vs B300 비교
.github/
└── workflows/
    └── deploy.yml                    # GitHub Pages 자동 배포
```

**Total**: 15 source files, ~1,800 lines

## Features

### 1. GPU Die Layout Visualizer

**Full Die Layout** — B200/B300 듀얼 다이 MCM 구조

- 2개 다이(Die 0, Die 1) + NV-HBI 인터커넥트(10 TB/s)
- 다이당 4 GPC, 각 GPC 내 SM 그리드 (활성/비활성 구분)
- HBM3e 스택 8개 (스택 높이 시각화: 8-high vs 12-high)
- L2 Cache, NVLink 5.0, PCIe Gen 5 인터페이스
- 클릭 시 우측에서 Detail Drawer 슬라이드인
- 상단 Summary Bar: Dies, SMs, CUDA Cores, Memory, TDP

**Overview** — 아키텍처 계층 구조

- Key Numbers: CUDA Cores, Tensor Cores, Memory, FP4 성능
- 계층 구조: GPU → Die → GPC → TPC → SM
- Key Features 목록, Die-to-Die 인터커넥트 다이어그램

**SM Detail** — SM100 내부 구조

- 4개 Processing Block (32 FP32 Cores, 1 Tensor Core, 1 Warp Scheduler)
- Shared Resources: 256 KB Register File, 228 KB Shared Mem + L1
- FP4/FP6/FP8 지원, 2-SM TMA Multicast 표시

**Specifications** — B200 vs B300 vs H100 3칼럼 비교

- 전체 스펙 항목 (아키텍처, 컴퓨트, 메모리, 인터커넥트, 성능)
- H100 대비 차이나는 항목 초록색 하이라이트
- 현재 선택된 GPU 모델이 좌측에 강조

### 2. DGX Node Visualizer

**Node Topology** — DGX B200/B300 노드

- 8x GPU (4+4 배치) + NVSwitch Fabric (All-to-all)
- PCIe Gen 5 → CPU 연결
- System Memory, Storage, Network 표시
- 컴포넌트 클릭 시 Detail Drawer

**DGX Specifications** — DGX B200 vs DGX B300 비교

### 3. UX

- **GPU 모델 전환**: B200 ↔ B300 원클릭 (key prop으로 리마운트 보장)
- **뷰 모드 전환**: GPU Die ↔ DGX Node
- **Detail Drawer**: 클릭 시에만 열림 → 메인 레이아웃 전체 너비 사용
- **Dark theme**: 반투명 오버레이, 미세 blur 효과
- **컬러 코딩**: GPC(초록), HBM(파랑), L2(앰버), NV-HBI(빨강), NVLink(보라)

## Architecture Data

| Spec | H100 | B200 | B300 |
|------|------|------|------|
| Architecture | Hopper | Blackwell | Blackwell Ultra |
| SM | SM90 | SM100 | SM100 |
| Process | TSMC 4N | TSMC 4NP | TSMC 4NP |
| Dies | 1 (80B) | 2 (208B) | 2 (208B) |
| Active SMs | 132/144 | 148/160 | 160/160 |
| CUDA Cores | 16,896 | 18,944 | 20,480 |
| Tensor Cores | 528 (4th) | 592 (5th) | 640 (5th) |
| Memory | 80 GB HBM3 | 192 GB HBM3e | 288 GB HBM3e |
| Memory BW | 3.35 TB/s | 8 TB/s | 8 TB/s |
| NVLink | 4.0 @ 900 GB/s | 5.0 @ 1.8 TB/s | 5.0 @ 1.8 TB/s |
| FP4 Dense | N/A | 9 PFLOPS | 15 PFLOPS |
| TDP | 700 W | 1,000 W | 1,100 W |

Sources:
- NVIDIA Blackwell Architecture documentation
- NVIDIA B200/B300/H100 datasheets
- Microbenchmarking papers (arxiv.org/html/2512.02189v1)
- glennklockwood.com GPU specs

## How to Run

```bash
cd b200-visualizer
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build → dist/
```

## Deploy

GitHub Pages via Actions (`.github/workflows/deploy.yml`):
1. GitHub에서 레포 생성
2. Settings → Pages → Source: GitHub Actions
3. `main` 브랜치에 push하면 자동 배포

## Build Output

```
dist/index.html                   0.52 kB
dist/assets/index-*.css          29.97 kB (gzip: 5.67 kB)
dist/assets/index-*.js          228.55 kB (gzip: 67.63 kB)
```

## Future Work

- GB200/GB300 NVL72 토폴로지 (72-GPU NVLink 도메인)
- WGMMA / TMA 파이프라인 비주얼라이저
- A100 스펙 추가 (Hopper 이전 세대 비교)
- 반응형 모바일 레이아웃
