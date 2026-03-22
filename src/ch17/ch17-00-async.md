# 비동기 프로그래밍 <span class="badge-advanced">고급</span>

비동기 프로그래밍은 I/O 바운드 작업(네트워크 요청, 파일 읽기 등)을 효율적으로 처리하기 위한 프로그래밍 패러다임입니다. Rust는 **제로 비용 추상화** 원칙에 따라 비동기 프로그래밍을 지원합니다.

<div class="info-box">

**왜 비동기인가?** 동기 코드에서 I/O 작업을 기다리는 동안 스레드는 아무것도 하지 않습니다. 비동기 코드는 대기 시간 동안 다른 작업을 실행할 수 있어 시스템 리소스를 훨씬 효율적으로 활용합니다. 수천 개의 동시 연결을 처리하는 웹 서버에서 특히 중요합니다.

</div>

## 동기 vs 비동기 실행 흐름

```mermaid
sequenceDiagram
    participant S as 동기 실행
    participant A as 비동기 실행

    Note over S: 요청 1 시작
    S->>S: I/O 대기 (블록됨)
    Note over S: 요청 1 완료
    Note over S: 요청 2 시작
    S->>S: I/O 대기 (블록됨)
    Note over S: 요청 2 완료

    Note over A: 요청 1 시작
    A->>A: I/O 대기 중...
    Note over A: 요청 2 시작 (대기 중에!)
    A->>A: I/O 대기 중...
    Note over A: 요청 1 완료
    Note over A: 요청 2 완료
```

```mermaid
graph LR
    subgraph "동기 (스레드 기반)"
        T1["스레드 1<br/>요청 처리 → 대기 → 응답"]
        T2["스레드 2<br/>요청 처리 → 대기 → 응답"]
        T3["스레드 3<br/>요청 처리 → 대기 → 응답"]
    end

    subgraph "비동기 (이벤트 루프)"
        EL["이벤트 루프<br/>(단일 스레드)"]
        F1["Future 1"]
        F2["Future 2"]
        F3["Future 3"]
        EL --> F1
        EL --> F2
        EL --> F3
    end

    style EL fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
```

이 장에서 다루는 내용:

- [async/await와 Future](ch17-01-async-await.md) — async fn, await, Future 트레이트
- [Tokio 런타임](ch17-02-tokio.md) — Tokio 기본 사용법, spawn, select!, 비동기 I/O
- [스트림, Pin, 에러 처리와 실전 패턴](ch17-03-streams-pin-patterns.md) — 비동기 스트림, Pin/Unpin, 에러 처리, 흔한 실수, 실전 패턴
