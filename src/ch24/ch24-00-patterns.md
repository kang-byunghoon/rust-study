# 디자인 패턴 <span class="badge-advanced">고급</span>

Rust에서는 소유권, 트레이트, 열거형 등의 고유 특성 덕분에 전통적인 디자인 패턴이 더 안전하고 간결하게 구현됩니다. 이 장에서는 Rust에서 자주 사용되는 디자인 패턴을 상세히 다룹니다.

이 장에서 다루는 내용:

- [빌더, RAII, Newtype 패턴](ch24-01-builder-raii-newtype.md) — 객체 생성, 자원 관리, 타입 안전성
- [상태, 전략, 이터레이터 패턴](ch24-02-state-strategy-iterator.md) — 상태 전이, 알고리즘 교체, 데이터 변환
- [에러 처리와 변환 패턴](ch24-03-error-and-conversion.md) — 커스텀 에러, From/Into, 패턴 비교 및 연습문제
