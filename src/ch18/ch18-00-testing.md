# 테스트 <span class="badge-advanced">고급</span>

Rust는 테스트를 일급(first-class) 기능으로 지원합니다. 별도의 테스트 프레임워크 없이도 단위 테스트, 통합 테스트, 문서 테스트, 벤치마크까지 풍부한 테스트를 작성할 수 있습니다.

```mermaid
graph TD
    TEST["Rust 테스트"]
    TEST --> UNIT["단위 테스트<br/>#[cfg(test)] mod tests"]
    TEST --> INTEG["통합 테스트<br/>tests/ 디렉토리"]
    TEST --> DOC["문서 테스트<br/>/// 주석의 코드"]
    TEST --> BENCH["벤치마크<br/>criterion"]

    UNIT --> U1["#[test]"]
    UNIT --> U2["assert! 매크로들"]
    UNIT --> U3["#[should_panic]"]

    INTEG --> I1["별도 크레이트로 컴파일"]
    INTEG --> I2["공개 API만 테스트"]

    style TEST fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    style UNIT fill:#e8f5e9,stroke:#4caf50
    style INTEG fill:#fff3e0,stroke:#ff9800
    style DOC fill:#f3e5f5,stroke:#9c27b0
    style BENCH fill:#fce4ec,stroke:#e91e63
```

---

## 이 장에서 다루는 내용

- **[테스트 기초](./ch18-01-testing-basics.md)** — 단위 테스트, `#[should_panic]`, 테스트 실행 옵션, 통합 테스트
- **[테스트 심화](./ch18-02-testing-advanced.md)** — 문서 테스트, 테스트 픽스처, Criterion 벤치마킹, Property-Based Testing
