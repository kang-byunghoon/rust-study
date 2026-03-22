# 동시성 <span class="badge-advanced">고급</span>

Rust는 **"두려움 없는 동시성(Fearless Concurrency)"**을 제공합니다. 소유권 시스템과 타입 시스템을 활용하여 많은 동시성 버그를 컴파일 타임에 잡아냅니다.

<div class="info-box">

**동시성 vs 병렬성:**
- **동시성(Concurrency)**: 여러 작업이 겹치는 시간 동안 진행되는 것 (논리적)
- **병렬성(Parallelism)**: 여러 작업이 물리적으로 동시에 실행되는 것
- Rust는 두 가지 모두를 안전하게 지원합니다.

</div>

## 스레드 통신 흐름

```mermaid
graph TB
    MAIN["메인 스레드"]

    subgraph "스레드 생성"
        MAIN -->|"thread::spawn"| T1["스레드 1"]
        MAIN -->|"thread::spawn"| T2["스레드 2"]
        MAIN -->|"thread::spawn"| T3["스레드 3"]
    end

    subgraph "통신 방법"
        CH["채널 (mpsc)"]
        MU["뮤텍스 (Mutex)"]
        AT["원자적 타입 (Atomic)"]
    end

    T1 -->|"tx.send()"| CH
    T2 -->|"tx.send()"| CH
    CH -->|"rx.recv()"| MAIN
    T3 -->|"lock()"| MU
    MAIN -->|"lock()"| MU

    style MAIN fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    style CH fill:#e8f5e9,stroke:#4caf50
    style MU fill:#fff3e0,stroke:#ff9800
    style AT fill:#f3e5f5,stroke:#9c27b0
```

이 장에서 다루는 내용:

- [스레드와 move 클로저](ch16-01-threads.md) — 스레드 생성, JoinHandle, move 클로저와 데이터 공유
- [채널](ch16-02-channels.md) — mpsc 채널, 여러 생산자, 동기 채널
- [공유 상태와 동기화](ch16-03-shared-state.md) — Mutex, RwLock, Arc<Mutex<T>>, Send/Sync, 교착 상태 방지, Rayon, 스레드 풀
