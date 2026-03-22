# FFI (Foreign Function Interface) <span class="badge-advanced">고급</span>

FFI를 사용하면 Rust에서 C 라이브러리를 호출하거나, C/C++ 프로그램에서 Rust 함수를 호출할 수 있습니다. 이 장에서는 안전한 FFI 사용법을 다룹니다.

이 장에서 다루는 내용:

- [C에서 Rust 호출, Rust에서 C 호출](ch23-01-calling-c.md) — extern "C", C 문자열 처리, Rust 함수 노출
- [메모리 레이아웃과 콜백](ch23-02-repr-c-and-callbacks.md) — `#[repr(C)]`, 패딩, Opaque 타입, 콜백 패턴
- [bindgen과 안전한 래퍼](ch23-03-bindgen-and-wrappers.md) — 자동 바인딩 생성, RAII 래퍼, 실전 프로젝트 구조
