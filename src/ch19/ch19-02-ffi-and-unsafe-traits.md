# FFI, 가변 정적 변수, unsafe 트레이트

## 4. unsafe 함수 호출 — FFI

**FFI (Foreign Function Interface)**를 통해 C 라이브러리를 호출할 수 있습니다.

```rust,editable
// C 표준 라이브러리의 abs 함수 선언
extern "C" {
    fn abs(input: i32) -> i32;
}

// Rust 함수를 C에서 호출 가능하게 만들기
#[no_mangle]
pub extern "C" fn rust_add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    // extern 함수 호출은 항상 unsafe
    unsafe {
        println!("C abs(-3) = {}", abs(-3));
        println!("C abs(5) = {}", abs(5));
    }

    // Rust 함수는 안전하게 호출 가능
    println!("rust_add(2, 3) = {}", rust_add(2, 3));
}
```

<div class="tip-box">

**FFI 안전 가이드:**
- C 함수의 동작을 정확히 이해하고 호출하세요
- 문자열 변환 시 `CString`/`CStr` 사용
- 메모리 할당/해제 규칙을 확인하세요 (누가 해제 책임?)
- `bindgen` 크레이트로 C 헤더에서 자동으로 바인딩 생성 가능

</div>

---

## 5. 가변 정적 변수

정적 변수(`static`)는 프로그램 전체에서 하나만 존재합니다. 가변 정적 변수는 데이터 레이스 가능성이 있으므로 `unsafe`입니다.

```rust,editable
static mut COUNTER: u32 = 0;

fn increment() {
    unsafe {
        COUNTER += 1;
    }
}

fn get_count() -> u32 {
    unsafe { COUNTER }
}

fn main() {
    increment();
    increment();
    increment();

    println!("카운트: {}", get_count());
}
```

<div class="danger-box">

**가변 정적 변수는 가능하면 피하세요!** 멀티스레드 환경에서 데이터 레이스가 발생할 수 있습니다. 대신 `std::sync::atomic` 타입이나 `Mutex`를 사용하세요.

</div>

```rust,editable
use std::sync::atomic::{AtomicU32, Ordering};

// ✅ 안전한 대안: 원자적 정적 변수
static SAFE_COUNTER: AtomicU32 = AtomicU32::new(0);

fn safe_increment() {
    SAFE_COUNTER.fetch_add(1, Ordering::SeqCst);
}

fn safe_get_count() -> u32 {
    SAFE_COUNTER.load(Ordering::SeqCst)
}

fn main() {
    safe_increment();
    safe_increment();
    safe_increment();

    println!("안전한 카운트: {}", safe_get_count());
    // unsafe 블록이 전혀 필요 없습니다!
}
```

---

## 6. unsafe 트레이트

트레이트의 계약(contract)을 컴파일러가 검증할 수 없을 때 `unsafe trait`으로 선언합니다.

```rust,editable
// unsafe 트레이트: 구현자가 안전성을 보증해야 함
unsafe trait TrustedLen {
    fn len(&self) -> usize;
}

// unsafe impl: "이 구현이 안전함을 보증합니다"
unsafe impl TrustedLen for Vec<i32> {
    fn len(&self) -> usize {
        self.len()
    }
}

fn process<T: TrustedLen>(item: &T) {
    println!("길이: {} (신뢰할 수 있음)", item.len());
}

fn main() {
    let v = vec![1, 2, 3];
    process(&v);

    println!();
    println!("대표적인 unsafe 트레이트:");
    println!("  Send  — 스레드 간 소유권 이전 안전");
    println!("  Sync  — 스레드 간 참조 공유 안전");
}
```
