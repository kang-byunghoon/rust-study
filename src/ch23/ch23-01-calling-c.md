# C에서 Rust 호출, Rust에서 C 호출

```mermaid
graph LR
    subgraph "Rust 프로그램"
        A[Rust 코드]
        B["extern \"C\" 블록<br>(C 함수 선언)"]
        C["#[no_mangle]<br>pub extern \"C\" fn<br>(Rust 함수 노출)"]
    end
    subgraph "C 라이브러리"
        D[C 함수]
        E[C 헤더 파일]
    end
    A --> B
    B -->|"unsafe 호출"| D
    E -->|"bindgen"| B
    C -->|"링크"| D
```

## Rust에서 C 함수 호출

```rust,editable
// libc의 C 함수를 선언
extern "C" {
    fn abs(input: i32) -> i32;
    fn sqrt(x: f64) -> f64;
}

fn main() {
    // C 함수 호출은 항상 unsafe
    unsafe {
        println!("abs(-42) = {}", abs(-42));
        println!("sqrt(144.0) = {}", sqrt(144.0));
    }
}
```

<div class="warning-box">
<strong>⚠️ unsafe가 필요한 이유</strong><br>
Rust 컴파일러는 외부 함수의 안전성을 검증할 수 없습니다. C 함수가 null 포인터를 반환하거나, 메모리를 잘못 접근하거나, 정의되지 않은 동작을 할 수 있기 때문에, 호출자가 안전성을 보장해야 합니다.
</div>

## C 문자열 처리

```rust,editable
use std::ffi::{CStr, CString};
use std::os::raw::c_char;

// C 함수 시뮬레이션
extern "C" {
    fn strlen(s: *const c_char) -> usize;
}

fn main() {
    // Rust 문자열 -> C 문자열
    let rust_string = "Hello, FFI!";
    let c_string = CString::new(rust_string).expect("CString 생성 실패");

    // C 함수에 전달
    let len = unsafe { strlen(c_string.as_ptr()) };
    println!("C strlen 결과: {}", len);

    // C 문자열 -> Rust 문자열
    let c_str: &CStr = c_string.as_c_str();
    let rust_str: &str = c_str.to_str().expect("UTF-8 변환 실패");
    println!("Rust 문자열: {}", rust_str);

    // null 바이트가 포함된 문자열은 에러
    match CString::new("hello\0world") {
        Ok(_) => println!("성공"),
        Err(e) => println!("에러: {} (위치: {})", e, e.nul_position()),
    }
}
```

## Rust 함수를 C에서 호출

```rust,editable
use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_int};

// C에서 호출할 수 있는 Rust 함수
// #[no_mangle]: 이름 맹글링 비활성화
// extern "C": C 호출 규약 사용
#[no_mangle]
pub extern "C" fn rust_add(a: c_int, b: c_int) -> c_int {
    a + b
}

#[no_mangle]
pub extern "C" fn rust_greet(name: *const c_char) -> *mut c_char {
    // null 포인터 검사
    if name.is_null() {
        let empty = CString::new("").unwrap();
        return empty.into_raw();
    }

    let c_str = unsafe { CStr::from_ptr(name) };
    let name_str = c_str.to_str().unwrap_or("unknown");
    let greeting = format!("안녕하세요, {}!", name_str);
    let c_greeting = CString::new(greeting).unwrap();

    c_greeting.into_raw() // 소유권을 C로 이전
}

// C에서 할당한 문자열을 해제하는 함수도 제공해야 함
#[no_mangle]
pub extern "C" fn rust_free_string(s: *mut c_char) {
    if !s.is_null() {
        unsafe {
            let _ = CString::from_raw(s); // 소유권 회수 후 드롭
        }
    }
}

fn main() {
    // Rust 내에서 테스트
    let result = rust_add(3, 7);
    println!("rust_add(3, 7) = {}", result);

    let name = CString::new("세계").unwrap();
    let greeting_ptr = rust_greet(name.as_ptr());
    let greeting = unsafe { CStr::from_ptr(greeting_ptr) };
    println!("{}", greeting.to_str().unwrap());

    // 메모리 해제
    rust_free_string(greeting_ptr);
}
```

해당 C 헤더 파일은 다음과 같습니다:

```c
// rust_lib.h
#ifndef RUST_LIB_H
#define RUST_LIB_H

#include <stdint.h>

int32_t rust_add(int32_t a, int32_t b);
char* rust_greet(const char* name);
void rust_free_string(char* s);

#endif
```
