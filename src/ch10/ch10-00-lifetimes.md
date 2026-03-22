# 라이프타임

<span class="badge-intermediate">중급</span>

라이프타임(Lifetime)은 Rust의 핵심 개념으로, **참조가 유효한 범위**를 명시적으로 표현합니다. 컴파일러가 댕글링 참조(dangling reference)를 방지하기 위해 사용하는 메커니즘입니다.

---

## 라이프타임 스코프 다이어그램

```mermaid
graph LR
    subgraph "'a 라이프타임"
        A["let x = 5;"] --> B["let r = &x;"]
        B --> C["println!(r);"]
        C --> D["// r 사용 종료"]
    end
    subgraph "'b 라이프타임 (짧음)"
        E["let y = 10;"] --> F["let s = &y;"]
        F --> G["// s 사용 종료"]
    end

    style A fill:#27ae60,color:#fff
    style B fill:#27ae60,color:#fff
    style C fill:#27ae60,color:#fff
    style D fill:#95a5a6,color:#fff
    style E fill:#3498db,color:#fff
    style F fill:#3498db,color:#fff
    style G fill:#95a5a6,color:#fff
```

```mermaid
flowchart TD
    A["함수가 참조를 반환하는가?"] -->|아니오| B["라이프타임 불필요"]
    A -->|예| C{"매개변수가 참조인가?"}
    C -->|하나만| D["생략 규칙 적용 (자동)"]
    C -->|여러 개| E["명시적 라이프타임 필요"]
    C -->|없음| F["'static 또는 소유 타입 반환"]
    E --> G["출력 라이프타임 = 입력 중 하나"]

    style A fill:#4a90d9,color:#fff
    style D fill:#27ae60,color:#fff
    style E fill:#e74c3c,color:#fff
    style F fill:#f39c12,color:#fff
```

---

## 이 장에서 다루는 내용

- **라이프타임 기초** — 라이프타임의 개념, 함수와 구조체에서의 라이프타임 어노테이션
- **라이프타임 심화** — 생략 규칙, `'static` 라이프타임, 복합적인 시나리오
- **라이프타임 실전 연습** — 연습문제와 퀴즈
