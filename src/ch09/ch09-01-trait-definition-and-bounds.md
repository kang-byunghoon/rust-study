# 트레이트 정의와 바운드

## 1. 트레이트 정의와 구현

```rust,editable
trait Describable {
    fn describe(&self) -> String;

    // 기본 구현 (오버라이드 가능)
    fn summary(&self) -> String {
        format!("요약: {}", self.describe())
    }
}

struct Article {
    title: String,
    content: String,
}

struct Tweet {
    username: String,
    message: String,
}

impl Describable for Article {
    fn describe(&self) -> String {
        format!("[기사] {}: {}", self.title, self.content)
    }
}

impl Describable for Tweet {
    fn describe(&self) -> String {
        format!("@{}: {}", self.username, self.message)
    }

    // 기본 구현을 오버라이드
    fn summary(&self) -> String {
        format!("트윗 - {}", self.describe())
    }
}

fn main() {
    let article = Article {
        title: "Rust 배우기".to_string(),
        content: "Rust는 안전한 시스템 프로그래밍 언어입니다.".to_string(),
    };
    let tweet = Tweet {
        username: "rustlang".to_string(),
        message: "Rust 2024 에디션이 출시되었습니다!".to_string(),
    };

    println!("{}", article.summary());  // 기본 구현 사용
    println!("{}", tweet.summary());    // 오버라이드된 구현 사용
}
```

---

## 2. 트레이트 바운드

```rust,editable
use std::fmt::Display;

// 방법 1: 트레이트 바운드 문법
fn print_item<T: Display>(item: &T) {
    println!("항목: {}", item);
}

// 방법 2: where 절 (복잡한 바운드에 적합)
fn compare_and_display<T, U>(t: &T, u: &U)
where
    T: Display + PartialOrd,
    U: Display + Clone,
{
    println!("t = {}, u = {}", t, u);
}

// 방법 3: impl Trait 문법 (간결함)
fn show(item: &impl Display) {
    println!("표시: {}", item);
}

// 여러 트레이트 바운드
fn process<T: Display + Clone + PartialOrd>(item: T) -> T {
    println!("처리 중: {}", item);
    item.clone()
}

fn main() {
    print_item(&42);
    print_item(&"hello");
    compare_and_display(&10, &"world");
    show(&3.14);
    let result = process(100);
    println!("결과: {}", result);
}
```

---

## 3. impl Trait — 매개변수와 반환 타입

```rust,editable
use std::fmt::Display;

// 매개변수에 impl Trait
fn notify(item: &impl Display) {
    println!("알림: {}", item);
}

// 반환 타입에 impl Trait
fn make_greeting(name: &str) -> impl Display {
    format!("안녕하세요, {}님!", name)
}

fn main() {
    notify(&"긴급 메시지");
    let greeting = make_greeting("홍길동");
    println!("{}", greeting);
}
```

<div class="warning-box">

**주의**: `impl Trait`를 반환 타입으로 사용할 때, 함수 내에서 **단 하나의 구체 타입**만 반환할 수 있습니다. 조건에 따라 서로 다른 타입을 반환해야 하면 트레이트 객체(`Box<dyn Trait>`)를 사용해야 합니다.

</div>
