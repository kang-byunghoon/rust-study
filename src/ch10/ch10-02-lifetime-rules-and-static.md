# 라이프타임 규칙과 'static

## 4. 라이프타임 생략 규칙

컴파일러는 세 가지 규칙으로 라이프타임을 자동 추론합니다.

```rust,editable
// 규칙 1: 각 참조 매개변수에 고유 라이프타임 부여
// fn foo(x: &str) → fn foo<'a>(x: &'a str)

// 규칙 2: 참조 매개변수가 하나면 출력에 같은 라이프타임 적용
// fn foo(x: &str) -> &str → fn foo<'a>(x: &'a str) -> &'a str

// 규칙 3: &self나 &mut self가 있으면 self의 라이프타임을 출력에 적용

struct Parser {
    input: String,
}

impl Parser {
    // 생략 규칙 3 적용: &self의 라이프타임이 반환 참조에 적용됨
    fn first_token(&self) -> &str {
        &self.input[..self.input.find(' ').unwrap_or(self.input.len())]
    }

    // 명시적으로 쓰면 이렇게 됩니다:
    // fn first_token<'a>(&'a self) -> &'a str { ... }
}

// 생략 가능한 경우
fn first_char(s: &str) -> &str {
    &s[..1]
}

fn main() {
    let parser = Parser {
        input: "hello world rust".to_string(),
    };
    println!("첫 토큰: {}", parser.first_token());
    println!("첫 글자: {}", first_char("안녕"));
}
```

<div class="tip-box">

**팁**: 생략 규칙만으로 라이프타임을 결정할 수 없을 때만 명시적으로 작성하면 됩니다. 대부분의 경우 컴파일러가 알아서 처리합니다.

</div>

---

## 5. 'static 라이프타임

`'static`은 프로그램 전체 실행 기간 동안 유효한 참조입니다.

```rust,editable
// 문자열 리터럴은 항상 'static
fn get_greeting() -> &'static str {
    "안녕하세요, Rust 세계에 오신 것을 환영합니다!"
}

// 'static은 트레이트 바운드로도 사용 가능
fn print_static(s: &'static str) {
    println!("정적 문자열: {}", s);
}

fn main() {
    let greeting = get_greeting();
    println!("{}", greeting);

    // 문자열 리터럴은 'static
    let s: &'static str = "이것은 바이너리에 포함됩니다";
    print_static(s);

    // String은 'static이 아닙니다
    let dynamic = String::from("동적 문자열");
    // print_static(&dynamic); // 컴파일 에러!
    println!("{}", dynamic);
}
```

<div class="warning-box">

**주의**: `'static`을 남용하지 마세요. 에러 메시지에서 `'static`을 요구하는 경우, 대부분 소유 타입(`String` 등)을 사용하는 것이 더 나은 해결책입니다.

</div>

---

## 6. 복합적인 라이프타임 시나리오

```rust,editable
use std::fmt::Display;

// 여러 라이프타임 매개변수
fn longest_with_announcement<'a, T>(
    x: &'a str,
    y: &'a str,
    ann: T,
) -> &'a str
where
    T: Display,
{
    println!("알림: {}", ann);
    if x.len() > y.len() { x } else { y }
}

// 서로 다른 라이프타임
fn different_lifetimes<'a, 'b>(x: &'a str, _y: &'b str) -> &'a str {
    // 반환값은 'a 라이프타임만 사용
    x
}

fn main() {
    let s1 = "긴 문자열";
    let s2 = "짧은";

    let result = longest_with_announcement(s1, s2, "비교 시작!");
    println!("결과: {}", result);

    let result2 = different_lifetimes(s1, s2);
    println!("첫 번째: {}", result2);
}
```
