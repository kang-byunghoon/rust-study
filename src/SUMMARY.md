# Summary

[소개](./introduction.md)

---

# 기초

- [시작하기](./ch01/ch01-00-getting-started.md)
  - [Rust란 무엇인가?](./ch01/ch01-01-what-is-rust.md)
  - [Rust 설치](./ch01/ch01-02-installation.md)
  - [Hello, World!](./ch01/ch01-03-hello-world.md)
  - [Cargo 사용법](./ch01/ch01-04-cargo.md)

- [기본 문법](./ch02/ch02-00-basic-syntax.md)
  - [변수와 가변성](./ch02/ch02-01-variables.md)
  - [데이터 타입](./ch02/ch02-02-data-types.md)
  - [함수](./ch02/ch02-03-functions.md)
  - [제어 흐름](./ch02/ch02-04-control-flow.md)

- [소유권](./ch03/ch03-00-ownership.md)
  - [소유권 규칙](./ch03/ch03-01-ownership-rules.md)
  - [참조와 빌림](./ch03/ch03-02-references-and-borrowing.md)
  - [슬라이스](./ch03/ch03-03-slices.md)

- [구조체](./ch04/ch04-00-structs.md)
  - [구조체 정의와 사용](./ch04/ch04-01-defining-structs.md)
  - [메서드](./ch04/ch04-02-methods.md)

- [열거형과 패턴 매칭](./ch05/ch05-00-enums.md)
  - [열거형 정의](./ch05/ch05-01-defining-enums.md)
  - [match 표현식](./ch05/ch05-02-match.md)
  - [if let과 while let](./ch05/ch05-03-if-let.md)

- [컬렉션](./ch06/ch06-00-collections.md)
  - [벡터](./ch06/ch06-01-vectors.md)
  - [문자열](./ch06/ch06-02-strings.md)
  - [해시맵](./ch06/ch06-03-hashmaps.md)

---

# 중급

- [에러 처리](./ch07/ch07-00-error-handling.md)
  - [panic!과 Result](./ch07/ch07-01-panic-and-result.md)
  - [에러 전파와 커스텀 에러](./ch07/ch07-02-error-propagation.md)
  - [에러 처리 크레이트와 실전](./ch07/ch07-03-error-crates.md)

- [제네릭](./ch08/ch08-00-generics.md)
  - [제네릭 함수와 타입](./ch08/ch08-01-generic-functions-and-types.md)
  - [단형성화와 Const 제네릭](./ch08/ch08-02-monomorphization-and-const-generics.md)
  - [제네릭 실전 연습](./ch08/ch08-03-generics-exercises.md)

- [트레이트](./ch09/ch09-00-traits.md)
  - [트레이트 정의와 바운드](./ch09/ch09-01-trait-definition-and-bounds.md)
  - [표준 트레이트와 연산자 오버로딩](./ch09/ch09-02-std-traits-and-operators.md)
  - [트레이트 객체와 고급 기능](./ch09/ch09-03-trait-objects-and-advanced.md)
  - [트레이트 실전 연습](./ch09/ch09-04-traits-exercises.md)

- [라이프타임](./ch10/ch10-00-lifetimes.md)
  - [라이프타임 기초](./ch10/ch10-01-lifetime-basics.md)
  - [라이프타임 규칙과 'static](./ch10/ch10-02-lifetime-rules-and-static.md)
  - [라이프타임 실전 연습](./ch10/ch10-03-lifetime-exercises.md)

- [클로저](./ch11/ch11-00-closures.md)
  - [클로저 기본 문법과 캡처 모드](./ch11/ch11-01-closure-basics.md)
  - [Fn 트레이트와 클로저 활용](./ch11/ch11-02-closure-traits.md)
  - [실전 패턴과 연습문제](./ch11/ch11-03-closure-practice.md)

- [반복자](./ch12/ch12-00-iterators.md)
  - [Iterator 트레이트와 어댑터](./ch12/ch12-01-iterator-basics.md)
  - [소비자와 커스텀 반복자](./ch12/ch12-02-consumers-custom.md)
  - [실전 예제와 연습문제](./ch12/ch12-03-iterator-practice.md)

- [모듈과 패키지](./ch13/ch13-00-modules.md)
  - [크레이트와 모듈 기초](./ch13/ch13-01-crates-modules.md)
  - [파일 기반 모듈과 재내보내기](./ch13/ch13-02-file-modules-reexport.md)
  - [워크스페이스와 실전 패턴](./ch13/ch13-03-workspace-practice.md)

- [Cargo 심화](./ch14/ch14-00-cargo-advanced.md)
  - [의존성 관리와 피처 플래그](./ch14/ch14-01-dependencies-features.md)
  - [빌드 프로파일과 조건부 컴파일](./ch14/ch14-02-profiles-build.md)
  - [배포, 도구, 실전 연습](./ch14/ch14-03-publishing-practice.md)

---

# 고급

- [스마트 포인터](./ch15/ch15-00-smart-pointers.md)
  - [Box, Deref, Drop](./ch15/ch15-01-box-deref-drop.md)
  - [Rc와 Arc](./ch15/ch15-02-rc-arc.md)
  - [RefCell, Cow, Weak](./ch15/ch15-03-refcell-cow-weak.md)

- [동시성](./ch16/ch16-00-concurrency.md)
  - [스레드와 move 클로저](./ch16/ch16-01-threads.md)
  - [채널](./ch16/ch16-02-channels.md)
  - [공유 상태와 동기화](./ch16/ch16-03-shared-state.md)

- [비동기 프로그래밍](./ch17/ch17-00-async.md)
  - [async/await와 Future](./ch17/ch17-01-async-await.md)
  - [Tokio 런타임](./ch17/ch17-02-tokio.md)
  - [스트림, Pin, 실전 패턴](./ch17/ch17-03-streams-pin-patterns.md)

- [테스트](./ch18/ch18-00-testing.md)
  - [단위 테스트 기초](./ch18/ch18-01-unit-tests.md)
  - [통합 테스트와 문서 테스트](./ch18/ch18-02-integration-doc-tests.md)
  - [헬퍼, 벤치마킹, Property 테스트](./ch18/ch18-03-helpers-bench-proptest.md)

- [unsafe Rust](./ch19/ch19-00-unsafe.md)
  - [원시 포인터와 unsafe 블록](./ch19/ch19-01-raw-pointers.md)
  - [FFI와 unsafe 트레이트](./ch19/ch19-02-ffi-and-unsafe-traits.md)
  - [안전한 추상화](./ch19/ch19-03-safe-abstractions.md)

- [매크로](./ch20/ch20-00-macros.md)
  - [선언적 매크로](./ch20/ch20-01-declarative-macros.md)
  - [표준 매크로와 고급 패턴](./ch20/ch20-02-standard-and-advanced-macros.md)
  - [절차적 매크로와 디버깅](./ch20/ch20-03-procedural-macros.md)

- [타입 시스템 심화](./ch21/ch21-00-type-system.md)
  - [타입 별칭과 Newtype](./ch21/ch21-01-type-aliases-and-newtype.md)
  - [DST와 변환](./ch21/ch21-02-dst-and-conversions.md)
  - [고급 타입 패턴](./ch21/ch21-03-advanced-type-patterns.md)

- [직렬화와 역직렬화](./ch22/ch22-00-serde.md)
  - [serde 기본](./ch22/ch22-01-serde-basics.md)
  - [serde 심화](./ch22/ch22-02-serde-advanced.md)

- [FFI](./ch23/ch23-00-ffi.md)
  - [C와 Rust 상호 호출](./ch23/ch23-01-calling-c.md)
  - [repr(C)와 콜백](./ch23/ch23-02-repr-c-and-callbacks.md)

- [디자인 패턴](./ch24/ch24-00-patterns.md)
  - [빌더, RAII, Newtype](./ch24/ch24-01-builder-raii-newtype.md)
  - [상태, 전략, 이터레이터](./ch24/ch24-02-state-strategy-iterator.md)
  - [에러 처리와 변환 패턴](./ch24/ch24-03-error-and-conversion.md)

- [실전 프로젝트](./ch25/ch25-00-projects.md)
  - [CLI 도구와 웹 서버](./ch25/ch25-01-cli-and-web.md)
  - [REST API와 데이터베이스](./ch25/ch25-02-api-and-database.md)
  - [파일 처리, WASM, 게임](./ch25/ch25-03-files-wasm-games.md)

- [성능과 최적화](./ch26/ch26-00-performance.md)
  - [제로 비용 추상화와 벤치마킹](./ch26/ch26-01-zero-cost-and-benchmarking.md)
  - [메모리 최적화와 성능 팁](./ch26/ch26-02-memory-and-tips.md)
