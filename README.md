# Blackwell GPU Visualizer

NVIDIA Blackwell (B200 / B300) GPU 아키텍처와 DGX 노드 토폴로지를 인터랙티브하게 탐색하는 웹앱.

**Live**: https://hoyajigi.github.io/b200-visualizer/

## Views

| View | Description |
|------|-------------|
| **Full Die Layout** | 듀얼 다이 MCM — GPC, SM, HBM3e, L2, NV-HBI (10 TB/s) |
| **Overview** | 아키텍처 계층 구조, 주요 수치, Key Features |
| **SM Detail** | SM100 내부 — Processing Block, Tensor/CUDA Cores, Warp Scheduler |
| **Specifications** | B200 vs B300 vs H100 스펙 비교 (차이 하이라이트) |
| **DGX Node** | 8-GPU 노드 토폴로지 — NVSwitch, CPU, Storage |

## Quick Start

```bash
npm install
npm run dev
```

## Tech Stack

React + TypeScript + Vite + Tailwind CSS 4

## Data Sources

- NVIDIA Blackwell Architecture documentation
- NVIDIA B200/B300/H100 datasheets
- [Microbenchmarking Blackwell](https://arxiv.org/html/2512.02189v1)

## Inspired by

[CUDA Programming for NVIDIA H100s](https://cudacourseh100.github.io/) — Prateek Shukla
