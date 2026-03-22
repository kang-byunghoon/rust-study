# 절차적 매크로와 매크로 디버깅

## 5. 절차적 매크로 개요

절차적 매크로는 Rust 코드를 입력받아 새로운 코드를 출력합니다. 별도의 크레이트에서 정의해야 합니다.

```mermaid
graph LR
    INPUT["입력 토큰<br/>TokenStream"] --> PROC["절차적 매크로<br/>(Rust 함수)"]
    PROC --> OUTPUT["출력 토큰<br/>TokenStream"]

    subgraph "종류"
        D["derive 매크로<br/>#[derive(MyTrait)]"]
        A["속성 매크로<br/>#[my_attr]"]
        F["함수형 매크로<br/>my_macro!(...)"]
    end

    style PROC fill:#fff3e0,stroke:#ff9800,stroke-width:2px
```

### derive 매크로

```rust,editable
// derive 매크로는 구조체/열거형에 트레이트 구현을 자동 생성합니다.

#[derive(Debug, Clone, PartialEq)]
struct User {
    name: String,
    age: u32,
}

// 커스텀 derive 매크로 정의 (별도 크레이트 필요)
// Cargo.toml:
// [lib]
// proc-macro = true
//
// [dependencies]
// syn = "2"
// quote = "1"
// proc_macro2 = "1"

// use proc_macro::TokenStream;
// use quote::quote;
// use syn;
//
// #[proc_macro_derive(HelloMacro)]
// pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
//     let ast = syn::parse(input).unwrap();
//     impl_hello_macro(&ast)
// }
//
// fn impl_hello_macro(ast: &syn::DeriveInput) -> TokenStream {
//     let name = &ast.ident;
//     let gen = quote! {
//         impl HelloMacro for #name {
//             fn hello() {
//                 println!("안녕하세요! 저는 {}입니다.", stringify!(#name));
//             }
//         }
//     };
//     gen.into()
// }

fn main() {
    let u1 = User { name: "Alice".to_string(), age: 30 };
    let u2 = u1.clone();
    println!("{:?}", u1);
    println!("같은가? {}", u1 == u2);

    println!();
    println!("대표적인 derive 매크로:");
    println!("  표준: Debug, Clone, Copy, PartialEq, Eq, Hash, Default");
    println!("  serde: Serialize, Deserialize");
    println!("  기타: Display (thiserror), Builder (derive_builder)");
}
```

### serde의 `#[derive(Serialize, Deserialize)]`

```rust,editable
// serde — Rust에서 가장 널리 사용되는 직렬화 프레임워크
// Cargo.toml:
// serde = { version = "1", features = ["derive"] }
// serde_json = "1"

// use serde::{Serialize, Deserialize};
//
// #[derive(Serialize, Deserialize, Debug)]
// struct Config {
//     #[serde(rename = "serverName")]
//     server_name: String,
//
//     #[serde(default = "default_port")]
//     port: u16,
//
//     #[serde(skip_serializing_if = "Option::is_none")]
//     debug: Option<bool>,
// }
//
// fn default_port() -> u16 { 8080 }
//
// fn main() -> Result<(), serde_json::Error> {
//     // 직렬화 (Rust → JSON)
//     let config = Config {
//         server_name: "my-server".to_string(),
//         port: 3000,
//         debug: Some(true),
//     };
//     let json = serde_json::to_string_pretty(&config)?;
//     println!("JSON:\n{}", json);
//
//     // 역직렬화 (JSON → Rust)
//     let json_str = r#"{ "serverName": "prod-server", "port": 443 }"#;
//     let parsed: Config = serde_json::from_str(json_str)?;
//     println!("파싱: {:?}", parsed);
//
//     Ok(())
// }

fn main() {
    println!("serde derive 매크로 주요 속성:");
    println!("  #[serde(rename = \"...\")]        — 필드 이름 변경");
    println!("  #[serde(default)]               — 누락 시 기본값");
    println!("  #[serde(skip)]                  — 직렬화/역직렬화 제외");
    println!("  #[serde(skip_serializing_if)]    — 조건부 제외");
    println!("  #[serde(flatten)]               — 중첩 구조 평탄화");
    println!("  #[serde(tag = \"type\")]          — 열거형 태그 지정");
}
```

### 속성 매크로와 함수형 매크로

```rust,editable
fn main() {
    println!("=== 속성 매크로 ===");
    println!("사용자 정의 속성을 만들어 코드를 변환합니다.");
    println!();
    println!("예시: 웹 프레임워크의 라우트 정의");
    println!("  #[get(\"/users/:id\")]");
    println!("  async fn get_user(id: u64) -> Response {{ ... }}");
    println!();
    println!("예시: Tokio의 async main");
    println!("  #[tokio::main]");
    println!("  async fn main() {{ ... }}");
    println!();
    println!("=== 함수형 매크로 ===");
    println!("함수 호출처럼 보이지만 컴파일 타임에 코드를 생성합니다.");
    println!();
    println!("예시: SQL 쿼리 검증");
    println!("  let query = sqlx::query!(\"SELECT * FROM users WHERE id = $1\", id);");
    println!();
    println!("예시: HTML 템플릿");
    println!("  let html = html! {{ <div class=\"container\">{{content}}</div> }};");
}
```

---

## 6. 매크로 디버깅

```rust,editable
// cargo expand (cargo-expand 설치 필요)
// 매크로가 확장된 결과 코드를 볼 수 있습니다.

macro_rules! debug_demo {
    ($x:expr) => {
        {
            // stringify!로 매크로 입력을 문자열로
            let expr_str = stringify!($x);
            let result = $x;
            println!("[매크로 확장] {} = {:?}", expr_str, result);
            result
        }
    };
}

fn main() {
    let a = debug_demo!(2 + 3);
    let b = debug_demo!(vec![1, 2, 3].len());
    let c = debug_demo!("hello".to_uppercase());

    println!();
    println!("매크로 디버깅 도구:");
    println!("  cargo expand              — 매크로 확장 결과 확인");
    println!("  cargo install cargo-expand — 설치");
    println!("  stringify!(...)            — 코드를 문자열로 변환");
    println!("  trace_macros!(true)        — 매크로 확장 과정 추적 (nightly)");
}
```

---

<div class="exercise-box">

### 연습문제

**연습 1: `min!` / `max!` 매크로 확장**

가변 인자를 받는 `clamp!` 매크로를 작성하세요.

```rust,editable
// clamp! 매크로: 값을 최소~최대 범위로 제한
macro_rules! clamp {
    ($value:expr, $min:expr, $max:expr) => {
        // TODO: $value가 $min보다 작으면 $min, $max보다 크면 $max 반환
        // 힌트: if-else 또는 .max($min).min($max) 사용
        todo!()
    };
}

fn main() {
    println!("clamp(5, 0, 10) = {}", clamp!(5, 0, 10));   // 5
    println!("clamp(-3, 0, 10) = {}", clamp!(-3, 0, 10)); // 0
    println!("clamp(15, 0, 10) = {}", clamp!(15, 0, 10)); // 10
}
```

**연습 2: `enum_str!` 매크로**

열거형을 정의하면서 자동으로 Display 구현을 생성하는 매크로를 작성하세요.

```rust,editable
macro_rules! enum_str {
    (enum $name:ident { $( $variant:ident ),* $(,)? }) => {
        #[derive(Debug)]
        enum $name {
            $( $variant, )*
        }

        impl std::fmt::Display for $name {
            fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
                match self {
                    // TODO: 각 변형을 문자열로 변환
                    // 힌트: $( $name::$variant => write!(f, stringify!($variant)), )*
                    _ => todo!()
                }
            }
        }
    };
}

// 사용 예:
// enum_str!(enum Color { Red, Green, Blue });
//
// fn main() {
//     let c = Color::Red;
//     println!("{}", c);  // "Red"
// }

fn main() {
    println!("enum_str! 매크로를 구현하세요");
}
```

**연습 3: `log!` 매크로**

로그 레벨을 지원하는 매크로를 작성하세요.

```rust,editable
macro_rules! log {
    (INFO, $($arg:tt)*) => {
        println!("[INFO] {}", format!($($arg)*));
    };
    (WARN, $($arg:tt)*) => {
        println!("[WARN] ⚠ {}", format!($($arg)*));
    };
    (ERROR, $($arg:tt)*) => {
        eprintln!("[ERROR] ✗ {}", format!($($arg)*));
    };
}

fn main() {
    log!(INFO, "서버 시작: 포트 {}", 8080);
    log!(WARN, "메모리 사용량 {}%", 85);
    log!(ERROR, "연결 실패: {}", "timeout");
}
```

</div>

---

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**퀴즈 1:** `macro_rules!` 매크로에서 `$x:expr`과 `$x:tt`의 차이점은 무엇인가요?

<div class="quiz-answer">

- **`$x:expr`**: 유효한 Rust **표현식**만 매칭합니다. 파서가 표현식으로 인식할 수 있는 것만 가능합니다 (예: `2 + 3`, `"hello"`, `func()`).
- **`$x:tt`**: **토큰 트리(Token Tree)** 하나를 매칭합니다. 단일 토큰(식별자, 리터럴, 연산자) 또는 괄호로 묶인 그룹이 가능합니다. 가장 유연한 지정자로, 거의 모든 것을 받을 수 있습니다.

`tt`는 매크로가 다른 매크로에 토큰을 전달할 때 특히 유용합니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**퀴즈 2:** 선언적 매크로와 절차적 매크로의 차이점은 무엇인가요?

<div class="quiz-answer">

- **선언적 매크로 (`macro_rules!`)**: 패턴 매칭을 기반으로 코드를 치환합니다. 간단하고 배우기 쉬우며, 같은 크레이트에서 정의할 수 있습니다.
- **절차적 매크로**: Rust 함수로 작성되며, `TokenStream`을 입력받아 새로운 `TokenStream`을 출력합니다. **별도의 크레이트**에서 정의해야 하며(`proc-macro = true`), `syn`과 `quote` 크레이트를 주로 사용합니다. derive, 속성, 함수형 세 종류가 있습니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**퀴즈 3:** `dbg!` 매크로의 장점은 무엇인가요?

<div class="quiz-answer">

`dbg!` 매크로는 디버깅에 특화된 매크로로:
1. **파일명과 줄 번호**를 자동으로 출력합니다.
2. 표현식을 **문자열로 변환**하여 어떤 값이 출력되는지 알려줍니다.
3. **표준 에러(stderr)**로 출력하여 표준 출력과 섞이지 않습니다.
4. 값의 **소유권을 반환**하므로 표현식 중간에 삽입할 수 있습니다.

예: `dbg!(x * 2)` → `[src/main.rs:5] x * 2 = 10`을 출력하고 `10`을 반환합니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**퀴즈 4:** `$(,)?` 패턴의 용도는 무엇인가요?

<div class="quiz-answer">

`$(,)?`는 **선택적 후행 쉼표(trailing comma)**를 허용하는 패턴입니다. `?`는 "0개 또는 1개"를 의미합니다. 이를 통해 매크로 사용자가 마지막 항목 뒤에 쉼표를 붙여도 되고 붙이지 않아도 됩니다.

```rust,ignore
my_macro![1, 2, 3]    // OK
my_macro![1, 2, 3,]   // OK (후행 쉼표)
```

Rust 커뮤니티에서는 후행 쉼표를 허용하는 것이 관례이며, `vec![]` 등 표준 매크로도 이를 지원합니다.

</div>
</div>

---

<div class="summary-box">

### 요약

1. **매크로 vs 함수**: 매크로는 컴파일 타임에 코드를 생성하며, 가변 인자와 새로운 문법을 지원합니다.
2. **`macro_rules!`**: 패턴 매칭 기반의 선언적 매크로입니다. `expr`, `ident`, `ty`, `tt` 등의 지정자로 입력을 매칭합니다.
3. **반복**: `$( ... ),*`로 가변 개수의 인자를 처리합니다.
4. **표준 매크로**: `println!`, `vec!`, `dbg!`, `todo!`, `cfg!`, `format!` 등이 자주 사용됩니다.
5. **절차적 매크로**: derive, 속성, 함수형 세 종류가 있으며, 별도 크레이트에서 정의합니다.
6. **serde**: `#[derive(Serialize, Deserialize)]`로 직렬화를 자동 구현하는 대표적인 절차적 매크로입니다.
7. **디버깅**: `cargo expand`로 매크로 확장 결과를 확인할 수 있습니다.

</div>
