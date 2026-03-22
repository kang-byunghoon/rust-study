# Cargo 심화

<span class="badge-intermediate">중급</span>

Cargo는 Rust의 빌드 시스템이자 패키지 매니저입니다. 이 장에서는 의존성 관리, 피처 플래그, 빌드 프로파일, 조건부 컴파일 등 Cargo의 심화 기능을 살펴봅니다.

이 장에서 다루는 내용:

- [의존성 관리와 피처 플래그](ch14-01-dependencies-features.md) — Cargo.toml 구조, 의존성 지정 방법, SemVer, 피처 플래그
- [빌드 프로파일과 조건부 컴파일](ch14-02-profiles-build.md) — 빌드 프로파일(dev/release), 빌드 스크립트(build.rs), 조건부 컴파일(#[cfg], cfg!)
- [배포, 도구, 실전 연습](ch14-03-publishing-practice.md) — Cargo.lock, crates.io 배포, Cargo 서브커맨드, 실전 Cargo.toml 작성, 연습문제, 퀴즈
