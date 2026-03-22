# 클로저

<span class="badge-intermediate">중급</span>

클로저(Closure)는 주변 환경의 변수를 **캡처**할 수 있는 익명 함수입니다. Rust의 클로저는 소유권 시스템과 결합되어 `Fn`, `FnMut`, `FnOnce` 세 가지 트레이트로 분류됩니다.

이 장에서 다루는 내용:

- [클로저 기본 문법과 캡처 모드](ch11-01-closure-basics.md) — 클로저 문법, 캡처 방식(불변 참조, 가변 참조, 소유권 이동), `move` 키워드
- [Fn 트레이트와 클로저 활용](ch11-02-closure-traits.md) — `Fn`, `FnMut`, `FnOnce` 트레이트, 클로저를 매개변수/반환값으로 사용
- [실전 패턴과 연습문제](ch11-03-closure-practice.md) — 정렬, 지연 초기화, 필터링 체인 등 실전 패턴과 연습문제, 퀴즈
