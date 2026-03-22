# 반복자

<span class="badge-intermediate">중급</span>

반복자(Iterator)는 Rust에서 컬렉션을 순회하는 핵심 추상화입니다. **지연 평가(lazy evaluation)**를 기반으로 하며, 체이닝을 통해 선언적이고 효율적인 데이터 처리를 가능하게 합니다.

이 장에서 다루는 내용:

- [Iterator 트레이트와 어댑터](ch12-01-iterator-basics.md) — Iterator 트레이트, `iter()`/`iter_mut()`/`into_iter()`, 어댑터(map, filter, zip 등)
- [소비자와 커스텀 반복자](ch12-02-consumers-custom.md) — 소비자(collect, sum, fold 등), 커스텀 반복자 구현, 제로 비용 추상화
- [실전 예제와 연습문제](ch12-03-iterator-practice.md) — 데이터 파이프라인 예제, 연습문제, 퀴즈
