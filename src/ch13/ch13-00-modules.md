# 모듈과 패키지

<span class="badge-intermediate">중급</span>

Rust의 모듈 시스템은 코드를 논리적으로 구성하고, 가시성을 제어하며, 네임스페이스를 관리합니다. 이 장에서는 크레이트, 모듈, 패키지, 워크스페이스까지 Rust의 코드 구성 체계를 종합적으로 살펴봅니다.

이 장에서 다루는 내용:

- [크레이트와 모듈 기초](ch13-01-crates-modules.md) — 크레이트 타입, mod/pub/use/as, 가시성 제어(pub, pub(crate), pub(super))
- [파일 기반 모듈과 재내보내기](ch13-02-file-modules-reexport.md) — 파일 기반 모듈 구조, pub use 재내보내기, use 그룹 가져오기
- [워크스페이스와 실전 패턴](ch13-03-workspace-practice.md) — 워크스페이스 설정, 실전 모듈 설계 예제, 연습문제, 퀴즈
