# 에러 처리

<span class="badge-intermediate">중급</span>

Rust는 안전성을 최우선으로 하는 언어답게, 에러 처리에 대해서도 체계적인 접근 방식을 제공합니다. 이 장에서는 `panic!`부터 커스텀 에러 타입, 외부 크레이트까지 Rust의 에러 처리 전략을 종합적으로 살펴봅니다.

---

## 에러 처리 의사결정 트리

```mermaid
flowchart TD
    A["에러 발생 가능?"] -->|예| B{"복구 가능한가?"}
    A -->|아니오| Z["그냥 실행"]
    B -->|예| C["Result<T, E> 사용"]
    B -->|아니오| D["panic! 사용"]
    C --> E{"에러를 호출자에게 전파?"}
    E -->|예| F["? 연산자 사용"]
    E -->|아니오| G{"기본값 있는가?"}
    G -->|예| H["unwrap_or / unwrap_or_else"]
    G -->|아니오| I{"프로토타입 코드?"}
    I -->|예| J["unwrap() / expect()"]
    I -->|아니오| K["match로 명시적 처리"]
    F --> L{"여러 에러 타입?"}
    L -->|예| M["커스텀 에러 + From 트레이트"]
    L -->|아니오| N["단일 Result 반환"]
    M --> O{"빠른 개발?"}
    O -->|예| P["anyhow 크레이트"]
    O -->|아니오| Q["thiserror 크레이트"]

    style A fill:#4a90d9,color:#fff
    style C fill:#27ae60,color:#fff
    style D fill:#e74c3c,color:#fff
    style P fill:#f39c12,color:#fff
    style Q fill:#f39c12,color:#fff
```

---

## 이 장에서 다루는 내용

- **panic!과 Result** — 복구 불가능한 에러와 복구 가능한 에러 처리의 기본
- **에러 전파와 커스텀 에러** — `?` 연산자, 커스텀 에러 타입, `From` 트레이트를 활용한 에러 변환
- **에러 처리 크레이트와 실전** — `thiserror`와 `anyhow` 크레이트, 연습문제, 퀴즈
