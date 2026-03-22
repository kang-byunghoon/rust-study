# Rust 학습 가이드

Rust 프로그래밍 언어를 기초부터 고급까지 체계적으로 학습하기 위한 목차입니다.

---

## 1. 시작하기

- 1.1 Rust란 무엇인가?
- 1.2 Rust 설치 (rustup, cargo)
- 1.3 Hello, World!
- 1.4 Cargo 프로젝트 생성 및 구조 이해

## 2. 기본 문법

- 2.1 변수와 가변성 (`let`, `mut`, `const`)
- 2.2 데이터 타입 (정수, 부동소수점, 불리언, 문자)
- 2.3 함수 정의와 반환값
- 2.4 주석
- 2.5 제어 흐름 (`if`, `else`, `loop`, `while`, `for`)

## 3. 소유권 (Ownership)

- 3.1 소유권 규칙
- 3.2 변수 스코프와 메모리
- 3.3 이동(Move)과 복사(Copy)
- 3.4 참조와 빌림 (References & Borrowing)
- 3.5 슬라이스 (Slices)

## 4. 구조체와 열거형

- 4.1 구조체 (Struct) 정의와 사용
- 4.2 메서드와 연관 함수 (`impl`)
- 4.3 열거형 (Enum)
- 4.4 `Option<T>`과 `Result<T, E>`
- 4.5 패턴 매칭 (`match`, `if let`)

## 5. 컬렉션

- 5.1 벡터 (`Vec<T>`)
- 5.2 문자열 (`String` vs `&str`)
- 5.3 해시맵 (`HashMap<K, V>`)

## 6. 에러 처리

- 6.1 복구 불가능한 에러 (`panic!`)
- 6.2 복구 가능한 에러 (`Result<T, E>`)
- 6.3 `?` 연산자
- 6.4 커스텀 에러 타입

## 7. 제네릭과 트레이트

- 7.1 제네릭 타입
- 7.2 트레이트 (Trait) 정의와 구현
- 7.3 트레이트 바운드
- 7.4 라이프타임 (Lifetime)
- 7.5 라이프타임과 제네릭 조합

## 8. 클로저와 반복자

- 8.1 클로저 (Closures)
- 8.2 반복자 (Iterators)
- 8.3 반복자 어댑터와 소비자
- 8.4 성능 비교: 반복자 vs 루프

## 9. 모듈과 패키지

- 9.1 모듈 시스템 (`mod`, `pub`, `use`)
- 9.2 파일 분리와 모듈 구조
- 9.3 크레이트 (Crate)와 패키지
- 9.4 외부 크레이트 사용 (crates.io)

## 10. 스마트 포인터

- 10.1 `Box<T>` - 힙 할당
- 10.2 `Rc<T>` - 참조 카운팅
- 10.3 `RefCell<T>` - 내부 가변성
- 10.4 `Deref`와 `Drop` 트레이트

## 11. 동시성 (Concurrency)

- 11.1 스레드 생성과 관리
- 11.2 메시지 전달 (채널, `mpsc`)
- 11.3 공유 상태 (`Mutex<T>`, `Arc<T>`)
- 11.4 `Send`와 `Sync` 트레이트

## 12. 비동기 프로그래밍

- 12.1 `async`/`await` 기초
- 12.2 Future 트레이트
- 12.3 Tokio 런타임
- 12.4 비동기 I/O 실습

## 13. 테스트

- 13.1 단위 테스트 (`#[test]`)
- 13.2 통합 테스트
- 13.3 문서 테스트
- 13.4 테스트 구성과 실행

## 14. 고급 주제

- 14.1 unsafe Rust
- 14.2 고급 트레이트 (연관 타입, 기본 제네릭 타입)
- 14.3 매크로 (`macro_rules!`, 절차적 매크로)
- 14.4 FFI (Foreign Function Interface)

## 15. 실전 프로젝트

- 15.1 CLI 도구 만들기 (clap)
- 15.2 웹 서버 만들기 (Actix-web / Axum)
- 15.3 REST API 구축
- 15.4 파일 처리 유틸리티

---

## 참고 자료

- [The Rust Programming Language (공식 Book)](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Rustlings (연습 문제)](https://github.com/rust-lang/rustlings)
- [Rust 표준 라이브러리 문서](https://doc.rust-lang.org/std/)
