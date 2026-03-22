# Rust 학습 가이드

> **온라인으로 읽기:** [https://kang-byunghoon.github.io/rust-study/](https://kang-byunghoon.github.io/rust-study/)

Rust 프로그래밍 언어를 기초부터 고급까지 체계적으로 학습하기 위한 목차입니다.

---

## 1. 시작하기

- 1.1 Rust란 무엇인가? — 탄생 배경, 특징, 왜 배워야 하는가
- 1.2 Rust 설치 — `rustup`, `cargo`, `rustc`
- 1.3 개발 환경 설정 — VS Code + rust-analyzer, IntelliJ Rust
- 1.4 Hello, World! 작성과 실행
- 1.5 Cargo 프로젝트 구조 — `Cargo.toml`, `src/`, `target/`
- 1.6 Cargo 기본 명령어 — `new`, `build`, `run`, `check`, `fmt`, `clippy`

## 2. 기본 문법

- 2.1 변수와 가변성 — `let`, `mut`, `const`, `static`
- 2.2 섀도잉 (Shadowing)
- 2.3 스칼라 타입 — 정수(`i8`~`i128`, `u8`~`u128`, `isize`, `usize`), 부동소수점(`f32`, `f64`), `bool`, `char`
- 2.4 복합 타입 — 튜플 (Tuple), 배열 (Array)
- 2.5 타입 추론과 타입 어노테이션
- 2.6 함수 정의 — 매개변수, 반환값, 표현식 vs 구문
- 2.7 주석 — 일반 주석, 문서 주석 (`///`, `//!`)
- 2.8 제어 흐름
  - `if` / `else if` / `else`
  - `if`를 표현식으로 사용하기
  - `loop`, `while`, `for`
  - `break`와 `continue`, 루프 레이블 (`'label`)
  - `while let`과 `loop` + `match` 패턴

## 3. 소유권 (Ownership)

- 3.1 메모리 관리의 이해 — 스택 vs 힙
- 3.2 소유권 규칙 세 가지
- 3.3 변수 스코프와 `Drop`
- 3.4 이동 (Move) 시맨틱
- 3.5 복사 (Copy) 트레이트와 `Clone`
- 3.6 함수와 소유권 — 전달과 반환 시 소유권 이동
- 3.7 참조와 빌림 (References & Borrowing)
  - 불변 참조 (`&T`)
  - 가변 참조 (`&mut T`)
  - 빌림 규칙과 댕글링 참조 방지
- 3.8 슬라이스 (Slices) — 문자열 슬라이스, 배열 슬라이스

## 4. 구조체 (Struct)

- 4.1 구조체 정의와 인스턴스 생성
- 4.2 필드 초기화 축약법 (Field Init Shorthand)
- 4.3 구조체 업데이트 문법 (`..`)
- 4.4 튜플 구조체와 유닛 구조체
- 4.5 메서드 정의 (`impl` 블록)
- 4.6 연관 함수 (Associated Functions) — `Self`, `::` 호출
- 4.7 여러 `impl` 블록
- 4.8 `#[derive]`로 자동 구현 — `Debug`, `Clone`, `PartialEq` 등

## 5. 열거형 (Enum)과 패턴 매칭

- 5.1 열거형 정의와 변형(variant)에 데이터 담기
- 5.2 `Option<T>` — null 대신 사용하는 Rust의 방식
- 5.3 `Result<T, E>` — 에러를 표현하는 열거형
- 5.4 `match` 표현식
  - 패턴의 종류 (리터럴, 변수, 와일드카드 `_`)
  - 가드 조건 (`if` guard)
  - 바인딩 (`@`)
- 5.5 `if let`과 `while let`
- 5.6 `matches!` 매크로

## 6. 컬렉션

- 6.1 벡터 (`Vec<T>`)
  - 생성, 추가, 접근, 순회
  - `vec![]` 매크로
  - 소유권과 빌림 규칙 적용
- 6.2 문자열
  - `String` vs `&str` — 차이점과 변환
  - 문자열 연결 (`+`, `format!`)
  - UTF-8과 문자 처리 (`chars()`, `bytes()`)
  - 문자열 슬라이싱 주의점
- 6.3 해시맵 (`HashMap<K, V>`)
  - 생성, 삽입, 접근, 갱신
  - `entry` API
  - 소유권 규칙
- 6.4 기타 컬렉션 — `HashSet`, `BTreeMap`, `BTreeSet`, `VecDeque`, `LinkedList`

## 7. 에러 처리

- 7.1 `panic!`과 되감기(unwinding) vs 중단(abort)
- 7.2 `RUST_BACKTRACE` 환경 변수
- 7.3 `Result<T, E>`를 이용한 복구 가능한 에러
  - `unwrap()`, `expect()`
  - `map()`, `and_then()`, `unwrap_or_else()`
- 7.4 `?` 연산자와 에러 전파
- 7.5 커스텀 에러 타입 만들기
- 7.6 `From` 트레이트로 에러 변환
- 7.7 에러 처리 생태계 — `thiserror`, `anyhow`
- 7.8 `panic!` vs `Result` — 언제 무엇을 사용할 것인가

## 8. 제네릭 (Generics)

- 8.1 함수에서 제네릭 사용
- 8.2 구조체와 열거형에서 제네릭
- 8.3 메서드에서 제네릭
- 8.4 제네릭의 성능 — 단형화 (Monomorphization)
- 8.5 `const` 제네릭 (`const N: usize`)

## 9. 트레이트 (Trait)

- 9.1 트레이트 정의와 구현
- 9.2 기본 구현 (Default Implementation)
- 9.3 트레이트를 매개변수로 사용 — `impl Trait` 문법
- 9.4 트레이트 바운드 (`T: Trait`, `where` 절)
- 9.5 여러 트레이트 바운드 (`+`)
- 9.6 트레이트를 반환 타입으로 사용
- 9.7 표준 라이브러리 핵심 트레이트
  - `Display`, `Debug` — 출력 포맷팅
  - `Clone`, `Copy` — 값 복제
  - `PartialEq`, `Eq`, `PartialOrd`, `Ord` — 비교
  - `Default` — 기본값
  - `From`, `Into`, `TryFrom`, `TryInto` — 타입 변환
  - `Iterator` — 반복
  - `Hash` — 해싱
  - `AsRef`, `AsMut` — 참조 변환
- 9.8 연산자 오버로딩 — `Add`, `Sub`, `Mul`, `Index` 등
- 9.9 트레이트 객체와 동적 디스패치 (`dyn Trait`)
- 9.10 정적 디스패치 vs 동적 디스패치 — 성능 비교
- 9.11 객체 안전성 (Object Safety)
- 9.12 연관 타입 (Associated Types)
- 9.13 Blanket Implementation

## 10. 라이프타임 (Lifetime)

- 10.1 라이프타임이란 — 참조의 유효 범위
- 10.2 함수에서 라이프타임 어노테이션 (`'a`)
- 10.3 구조체에서 라이프타임
- 10.4 라이프타임 생략 규칙 (Elision Rules)
- 10.5 `'static` 라이프타임
- 10.6 제네릭 + 트레이트 바운드 + 라이프타임 조합
- 10.7 고급 라이프타임 — HRTB (`for<'a>`)

## 11. 클로저 (Closures)

- 11.1 클로저 정의와 문법
- 11.2 환경 캡처 방식 — 불변 빌림, 가변 빌림, 소유권 이동
- 11.3 `move` 클로저
- 11.4 클로저 트레이트 — `Fn`, `FnMut`, `FnOnce`
- 11.5 클로저를 매개변수와 반환값으로 사용

## 12. 반복자 (Iterators)

- 12.1 `Iterator` 트레이트와 `next()` 메서드
- 12.2 반복자 생성 — `iter()`, `iter_mut()`, `into_iter()`
- 12.3 반복자 어댑터 — `map`, `filter`, `enumerate`, `zip`, `chain`, `flat_map`, `take`, `skip`, `peekable`
- 12.4 반복자 소비자 — `collect`, `sum`, `fold`, `any`, `all`, `find`, `position`, `count`
- 12.5 커스텀 반복자 만들기
- 12.6 성능: 반복자 vs 루프 (제로 비용 추상화)

## 13. 모듈과 패키지 시스템

- 13.1 크레이트 — 바이너리 크레이트 vs 라이브러리 크레이트
- 13.2 모듈 정의 (`mod`)
- 13.3 가시성 — `pub`, `pub(crate)`, `pub(super)`, `pub(in path)`
- 13.4 경로 — 절대 경로, 상대 경로, `self`, `super`, `crate`
- 13.5 `use`로 경로 가져오기와 `as`로 별칭
- 13.6 재내보내기 (`pub use`)
- 13.7 파일로 모듈 분리 — `mod.rs` vs 파일명 방식
- 13.8 워크스페이스 (Workspace) — 여러 크레이트 관리

## 14. Cargo 심화

- 14.1 `Cargo.toml` 상세 — `[dependencies]`, `[dev-dependencies]`, `[build-dependencies]`
- 14.2 버전 관리와 SemVer
- 14.3 Feature 플래그
- 14.4 빌드 프로파일 — `dev`, `release`, 최적화 옵션
- 14.5 빌드 스크립트 (`build.rs`)
- 14.6 조건부 컴파일 — `#[cfg]`, `cfg!`
- 14.7 `Cargo.lock`의 역할
- 14.8 crates.io에 크레이트 배포하기
- 14.9 유용한 Cargo 서브커맨드 — `cargo-watch`, `cargo-expand`, `cargo-audit`

## 15. 스마트 포인터

- 15.1 `Box<T>` — 힙 할당, 재귀 타입
- 15.2 `Deref` 트레이트와 역참조 강제 변환 (Deref Coercion)
- 15.3 `Drop` 트레이트와 `std::mem::drop`
- 15.4 `Rc<T>` — 참조 카운팅을 통한 공유 소유권
- 15.5 `Arc<T>` — 스레드 안전한 참조 카운팅
- 15.6 `RefCell<T>` — 내부 가변성 (Interior Mutability)
- 15.7 `Rc<RefCell<T>>` 조합 패턴
- 15.8 `Cow<T>` — Clone on Write
- 15.9 순환 참조와 메모리 누수 — `Weak<T>`로 해결

## 16. 동시성 (Concurrency)

- 16.1 스레드 생성 — `std::thread::spawn`
- 16.2 `JoinHandle`과 스레드 결과 받기
- 16.3 `move` 클로저로 데이터 전달
- 16.4 메시지 전달 — 채널 (`mpsc::channel`, `mpsc::sync_channel`)
- 16.5 여러 생산자 패턴 (`mpsc::Sender::clone`)
- 16.6 공유 상태 — `Mutex<T>`, `RwLock<T>`
- 16.7 `Arc<Mutex<T>>` 패턴
- 16.8 `Send`와 `Sync` 마커 트레이트
- 16.9 데드락 방지 전략
- 16.10 `Rayon` — 데이터 병렬 처리
- 16.11 `crossbeam` — 스코프드 스레드, 채널

## 17. 비동기 프로그래밍 (Async)

- 17.1 동기 vs 비동기 — 왜 비동기가 필요한가
- 17.2 `async fn`과 `await`
- 17.3 `Future` 트레이트의 이해
- 17.4 비동기 런타임 — `tokio`, `async-std`
- 17.5 `tokio` 기본 사용법 — `#[tokio::main]`, `spawn`, `select!`
- 17.6 비동기 I/O — 파일, 네트워크
- 17.7 비동기 스트림 (`Stream`)
- 17.8 `Pin`과 `Unpin` — 왜 필요한가
- 17.9 비동기에서의 에러 처리
- 17.10 비동기 코드의 일반적인 함정과 해결법

## 18. 테스트

- 18.1 단위 테스트 — `#[test]`, `#[cfg(test)]`
- 18.2 `assert!`, `assert_eq!`, `assert_ne!`
- 18.3 `#[should_panic]`과 `Result` 반환 테스트
- 18.4 테스트 필터링과 실행 — `cargo test`, `--ignored`, `--test-threads`
- 18.5 통합 테스트 — `tests/` 디렉토리
- 18.6 문서 테스트 (Doctest)
- 18.7 테스트 헬퍼와 픽스처
- 18.8 벤치마킹 — `criterion` 크레이트
- 18.9 프로퍼티 기반 테스트 — `proptest`

## 19. unsafe Rust

- 19.1 `unsafe`가 필요한 이유
- 19.2 `unsafe` 블록과 `unsafe fn`
- 19.3 unsafe로 할 수 있는 것들
  - 원시 포인터 (`*const T`, `*mut T`) 역참조
  - unsafe 함수 호출
  - 가변 정적 변수 접근
  - unsafe 트레이트 구현
- 19.4 안전한 추상화 만들기 — unsafe를 감싸는 safe API
- 19.5 `unsafe`를 최소화하는 원칙

## 20. 매크로 (Macros)

- 20.1 매크로란 — 매크로 vs 함수
- 20.2 선언적 매크로 (`macro_rules!`)
  - 패턴과 반복자
  - `expr`, `ident`, `ty`, `tt` 등 지정자
- 20.3 유용한 표준 매크로 — `println!`, `vec!`, `todo!`, `dbg!`, `cfg!`
- 20.4 절차적 매크로 개요
  - derive 매크로 (`#[derive]`)
  - 속성 매크로 (`#[attribute]`)
  - 함수형 매크로
- 20.5 `serde`의 `#[derive(Serialize, Deserialize)]` 이해

## 21. 타입 시스템 심화

- 21.1 타입 별칭 (`type`)
- 21.2 newtype 패턴 — 타입 안전성 강화
- 21.3 절대 반환하지 않는 타입 (`!`, Never type)
- 21.4 동적 크기 타입 (DST) — `Sized` 트레이트
- 21.5 고급 타입 변환 — `Deref` 강제 변환, `AsRef`/`Borrow` 구분
- 21.6 열거형으로 상태 머신 구현
- 21.7 타입 상태 패턴 (Typestate Pattern)
- 21.8 phantom 타입 (`PhantomData`)

## 22. 직렬화와 역직렬화

- 22.1 `serde` 기초 — `Serialize`, `Deserialize`
- 22.2 JSON 처리 — `serde_json`
- 22.3 TOML, YAML, CSV 처리
- 22.4 `serde` 속성 — `rename`, `default`, `skip`, `flatten`
- 22.5 커스텀 직렬화/역직렬화 구현

## 23. FFI (Foreign Function Interface)

- 23.1 C 함수 호출하기 (`extern "C"`)
- 23.2 C에서 Rust 함수 호출하기
- 23.3 `#[repr(C)]`와 메모리 레이아웃
- 23.4 `bindgen`으로 바인딩 자동 생성
- 23.5 안전한 래퍼 만들기

## 24. 디자인 패턴과 관용구

- 24.1 빌더 패턴 (Builder Pattern)
- 24.2 RAII (Resource Acquisition Is Initialization)
- 24.3 newtype 패턴 활용
- 24.4 상태 패턴 (State Pattern) — 열거형 활용
- 24.5 전략 패턴 — 트레이트 객체와 클로저
- 24.6 반복자 체이닝 패턴
- 24.7 에러 처리 패턴 — 에러 변환, 에러 체인
- 24.8 `From`/`Into`를 활용한 유연한 API 설계

## 25. 실전 프로젝트

- 25.1 CLI 도구 만들기 — `clap`, `structopt`
- 25.2 웹 서버 만들기 — `Axum` / `Actix-web`
- 25.3 REST API 서버 — 라우팅, 미들웨어, 인증
- 25.4 데이터베이스 연동 — `sqlx`, `diesel`
- 25.5 파일 처리 유틸리티 — `std::fs`, `walkdir`
- 25.6 WebAssembly (WASM) — `wasm-pack`, `wasm-bindgen`
- 25.7 간단한 게임 만들기 — 터미널 기반

## 26. 성능과 최적화

- 26.1 제로 비용 추상화 이해
- 26.2 컴파일러 최적화와 릴리스 빌드
- 26.3 벤치마킹 (`criterion`)
- 26.4 프로파일링 도구 — `perf`, `flamegraph`
- 26.5 메모리 사용 최적화 — `Box`, 스택 vs 힙
- 26.6 `Cow<T>`를 활용한 불필요한 복사 방지
- 26.7 SIMD와 `std::arch`

---

## 참고 자료

- [The Rust Programming Language (공식 Book)](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Rustlings (연습 문제)](https://github.com/rust-lang/rustlings)
- [Rust 표준 라이브러리 문서](https://doc.rust-lang.org/std/)
- [Rust Design Patterns](https://rust-unofficial.github.io/patterns/)
- [Asynchronous Programming in Rust](https://rust-lang.github.io/async-book/)
- [The Rustonomicon (unsafe 심화)](https://doc.rust-lang.org/nomicon/)
- [Comprehensive Rust (Google)](https://google.github.io/comprehensive-rust/)
