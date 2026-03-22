# 에러 처리 크레이트와 실전

## 6. thiserror와 anyhow 크레이트

### thiserror - 라이브러리용 에러 정의

```rust,editable
// thiserror 크레이트 사용 예시 (의사 코드)
// Cargo.toml에 thiserror = "1.0" 추가 필요

/*
use thiserror::Error;

#[derive(Error, Debug)]
enum DataError {
    #[error("파일을 읽을 수 없습니다: {0}")]
    IoError(#[from] std::io::Error),

    #[error("잘못된 데이터 형식: {msg}")]
    FormatError { msg: String },

    #[error("데이터를 찾을 수 없습니다 (ID: {0})")]
    NotFound(u64),
}
*/

// 직접 구현한 동등한 코드
use std::fmt;

#[derive(Debug)]
enum DataError {
    FormatError { msg: String },
    NotFound(u64),
}

impl fmt::Display for DataError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            DataError::FormatError { msg } => write!(f, "잘못된 데이터 형식: {}", msg),
            DataError::NotFound(id) => write!(f, "데이터를 찾을 수 없습니다 (ID: {})", id),
        }
    }
}

fn find_data(id: u64) -> Result<String, DataError> {
    if id == 0 {
        Err(DataError::NotFound(id))
    } else {
        Ok(format!("데이터_{}", id))
    }
}

fn main() {
    println!("{:?}", find_data(1));
    println!("{}", find_data(0).unwrap_err());
}
```

### anyhow - 애플리케이션용 간편한 에러 처리

```rust,editable
// anyhow 크레이트 사용 예시 (의사 코드)
// Cargo.toml에 anyhow = "1.0" 추가 필요

/*
use anyhow::{Context, Result};

fn read_config(path: &str) -> Result<Config> {
    let content = std::fs::read_to_string(path)
        .context("설정 파일을 읽을 수 없습니다")?;

    let config: Config = serde_json::from_str(&content)
        .context("설정 파일 파싱 실패")?;

    Ok(config)
}
*/

fn main() {
    println!("anyhow는 다양한 에러 타입을 하나로 통합합니다.");
    println!("라이브러리에는 thiserror, 애플리케이션에는 anyhow를 사용하세요.");
}
```

<div class="info-box">

**thiserror vs anyhow 선택 기준**

| 기준 | thiserror | anyhow |
|------|-----------|--------|
| 용도 | 라이브러리 개발 | 애플리케이션 개발 |
| 에러 타입 | 구체적 enum 정의 | `anyhow::Error`로 통합 |
| 패턴 매칭 | 가능 | 불편함 |
| 컨텍스트 추가 | 수동 | `.context()` 메서드 |

</div>

---

## 연습문제

<div class="exercise-box">

**연습 1**: 다음 함수를 완성하세요. 문자열을 파싱하여 두 수의 나눗셈 결과를 반환합니다.

```rust,editable
use std::num::ParseIntError;
use std::fmt;

#[derive(Debug)]
enum CalcError {
    Parse(ParseIntError),
    DivisionByZero,
}

impl fmt::Display for CalcError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            CalcError::Parse(e) => write!(f, "파싱 에러: {}", e),
            CalcError::DivisionByZero => write!(f, "0으로 나눌 수 없습니다"),
        }
    }
}

impl From<ParseIntError> for CalcError {
    fn from(e: ParseIntError) -> Self {
        CalcError::Parse(e)
    }
}

fn divide(a_str: &str, b_str: &str) -> Result<f64, CalcError> {
    // TODO: a_str과 b_str을 파싱하고 나눗셈 결과를 반환하세요
    // b가 0이면 CalcError::DivisionByZero를 반환하세요
    todo!()
}

fn main() {
    println!("{:?}", divide("10", "3"));   // Ok(3.333...)
    println!("{:?}", divide("10", "0"));   // Err(DivisionByZero)
    println!("{:?}", divide("abc", "3"));  // Err(Parse(...))
}
```

</div>

<div class="exercise-box">

**연습 2**: `?` 연산자 체이닝을 활용하여 중첩된 JSON 문자열에서 값을 추출하는 함수를 작성하세요.

```rust,editable
fn extract_value(data: &str) -> Result<i32, String> {
    // 형식: "key:value" (예: "score:42")
    let parts: Vec<&str> = data.split(':').collect();
    let value_str = parts.get(1)
        .ok_or("값이 없습니다".to_string())?;
    let value: i32 = value_str.parse()
        .map_err(|e| format!("파싱 실패: {}", e))?;
    Ok(value)
}

fn main() {
    println!("{:?}", extract_value("score:42"));
    println!("{:?}", extract_value("score:abc"));
    println!("{:?}", extract_value("invalid"));
}
```

</div>

---

## 퀴즈

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q1**: `panic!`과 `Result`의 차이점은 무엇인가요?

<div class="quiz-answer">

`panic!`은 **복구 불가능한** 에러에 사용하며 프로그램을 즉시 중단합니다. `Result`는 **복구 가능한** 에러에 사용하며 호출자가 에러를 처리하거나 전파할 수 있습니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q2**: `?` 연산자는 내부적으로 어떤 동작을 수행하나요?

<div class="quiz-answer">

`?` 연산자는 `Result`가 `Ok`이면 내부 값을 추출하고, `Err`이면 `From::from()`을 호출하여 에러 타입을 변환한 후 함수에서 즉시 `Err`을 반환합니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q3**: `thiserror`와 `anyhow` 중 라이브러리 개발에 적합한 것은?

<div class="quiz-answer">

**thiserror**가 라이브러리 개발에 적합합니다. 구체적인 에러 타입을 정의하여 사용자가 패턴 매칭으로 에러를 처리할 수 있기 때문입니다. `anyhow`는 애플리케이션 개발에 적합합니다.

</div>
</div>

---

<div class="summary-box">

**요약**

- `panic!`은 복구 불가능한 에러, `Result<T, E>`는 복구 가능한 에러에 사용합니다.
- `unwrap()`, `expect()`는 프로토타입에만 사용하고, 프로덕션에서는 명시적 처리를 합니다.
- `?` 연산자로 에러를 간결하게 전파할 수 있습니다.
- `From` 트레이트를 구현하면 `?` 연산자가 에러 타입을 자동 변환합니다.
- 라이브러리에는 `thiserror`, 애플리케이션에는 `anyhow`를 사용합니다.

</div>
