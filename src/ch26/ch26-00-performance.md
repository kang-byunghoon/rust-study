# 성능과 최적화 <span class="badge-advanced">고급</span>

Rust의 가장 큰 강점 중 하나는 **제로 비용 추상화(zero-cost abstraction)**입니다. 높은 수준의 추상화를 사용하면서도 수동으로 최적화한 코드와 동등한 성능을 얻을 수 있습니다.

이 장에서 다루는 내용:

- [제로 비용 추상화와 벤치마킹](ch26-01-zero-cost-and-benchmarking.md) — 컴파일러 최적화, 릴리스 빌드, criterion, 프로파일링
- [메모리 최적화와 성능 팁](ch26-02-memory-and-tips.md) — 구조체 레이아웃, Cow, 컬렉션 선택, SIMD
