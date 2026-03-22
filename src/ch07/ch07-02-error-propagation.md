# 에러 전파와 커스텀 에러

## 3. ? 연산자

`?` 연산자는 `Result`의 에러를 자동으로 호출자에게 전파합니다.

```rust,editable
use std::num::ParseIntError;

fn parse_and_double(s: &str) -> Result<i32, ParseIntError> {
    // ? 연산자: Ok면 값 추출, Err면 즉시 반환
    let n = s.parse::<i32>()?;
    Ok(n * 2)
}

fn main() {
    println!("\"5\" -> {:?}", parse_and_double("5"));
    println!("\"abc\" -> {:?}", parse_and_double("abc"));
}
```

<div class="tip-box">

**팁**: `?` 연산자는 `From` 트레이트를 자동으로 호출하여 에러 타입을 변환합니다. 이를 통해 서로 다른 에러 타입을 하나의 커스텀 에러 타입으로 통합할 수 있습니다.

</div>

---

## 4. 커스텀 에러 타입

실제 프로젝트에서는 여러 종류의 에러를 하나의 타입으로 통합해야 합니다.

```rust,editable
use std::fmt;
use std::num::ParseIntError;

#[derive(Debug)]
enum AppError {
    ParseError(ParseIntError),
    ValidationError(String),
    NotFound(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppError::ParseError(e) => write!(f, "파싱 에러: {}", e),
            AppError::ValidationError(msg) => write!(f, "검증 에러: {}", msg),
            AppError::NotFound(item) => write!(f, "찾을 수 없음: {}", item),
        }
    }
}

// From 트레이트로 자동 변환 지원
impl From<ParseIntError> for AppError {
    fn from(e: ParseIntError) -> Self {
        AppError::ParseError(e)
    }
}

fn process_input(input: &str) -> Result<i32, AppError> {
    let n: i32 = input.parse()?; // ParseIntError -> AppError 자동 변환
    if n < 0 {
        return Err(AppError::ValidationError(
            "음수는 허용되지 않습니다".to_string(),
        ));
    }
    Ok(n * 10)
}

fn main() {
    println!("{:?}", process_input("42"));
    println!("{:?}", process_input("abc"));
    println!("{:?}", process_input("-5"));
}
```

---

## 5. From 트레이트를 활용한 에러 변환

`From` 트레이트를 구현하면 `?` 연산자가 자동으로 에러 타입을 변환합니다.

```rust,editable
use std::num::ParseIntError;
use std::fmt;

#[derive(Debug)]
enum MyError {
    Parse(ParseIntError),
    TooLarge(i32),
}

impl fmt::Display for MyError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            MyError::Parse(e) => write!(f, "파싱 실패: {}", e),
            MyError::TooLarge(n) => write!(f, "값이 너무 큼: {}", n),
        }
    }
}

impl From<ParseIntError> for MyError {
    fn from(e: ParseIntError) -> Self {
        MyError::Parse(e)
    }
}

fn parse_and_validate(s: &str) -> Result<i32, MyError> {
    let n: i32 = s.parse()?; // From 자동 호출
    if n > 1000 {
        return Err(MyError::TooLarge(n));
    }
    Ok(n)
}

fn main() {
    for input in &["42", "not_a_number", "9999"] {
        match parse_and_validate(input) {
            Ok(v) => println!("{} -> 성공: {}", input, v),
            Err(e) => println!("{} -> 에러: {}", input, e),
        }
    }
}
```
