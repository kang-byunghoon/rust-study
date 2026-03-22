# panic!과 Result

## 1. panic!과 언와인딩

`panic!`은 복구 불가능한 에러 상황에서 프로그램을 즉시 중단시킵니다.

```rust,editable
fn main() {
    // panic!은 프로그램을 즉시 중단합니다
    // panic!("치명적인 오류 발생!");

    // 배열 범위를 벗어나면 자동으로 panic 발생
    let v = vec![1, 2, 3];
    // v[99]; // index out of bounds 패닉!

    println!("panic! 호출을 주석 해제하면 여기까지 도달하지 못합니다");
}
```

<div class="info-box">

**언와인딩(Unwinding) vs 중단(Abort)**

- **언와인딩**: 스택을 역추적하며 각 값의 소멸자를 호출합니다 (기본 동작).
- **중단(Abort)**: 즉시 프로세스를 종료합니다. `Cargo.toml`에서 설정 가능:

```toml
[profile.release]
panic = 'abort'
```

</div>

---

## 2. Result<T, E>

대부분의 에러는 `Result<T, E>`로 처리합니다.

```rust,editable
use std::fs::File;
use std::io::Read;

fn read_file_content(path: &str) -> Result<String, std::io::Error> {
    let mut file = File::open(path)?;
    let mut content = String::new();
    file.read_to_string(&mut content)?;
    Ok(content)
}

fn main() {
    match read_file_content("hello.txt") {
        Ok(content) => println!("파일 내용: {}", content),
        Err(e) => println!("파일 읽기 실패: {}", e),
    }
}
```

### unwrap()과 expect()

```rust,editable
fn main() {
    // unwrap: 성공하면 값을 반환, 실패하면 panic
    let val: Result<i32, &str> = Ok(42);
    println!("unwrap 결과: {}", val.unwrap());

    // expect: unwrap과 같지만 에러 메시지를 지정 가능
    let val2: Result<i32, &str> = Ok(100);
    println!("expect 결과: {}", val2.expect("값이 있어야 합니다"));

    // unwrap_or: 실패 시 기본값 반환
    let val3: Result<i32, &str> = Err("에러");
    println!("unwrap_or 결과: {}", val3.unwrap_or(0));

    // unwrap_or_else: 실패 시 클로저 실행
    let val4: Result<i32, &str> = Err("에러");
    println!("unwrap_or_else 결과: {}", val4.unwrap_or_else(|_| -1));
}
```

<div class="warning-box">

**주의**: `unwrap()`과 `expect()`는 프로토타입이나 테스트 코드에서만 사용하세요. 프로덕션 코드에서는 명시적 에러 처리를 권장합니다.

</div>
