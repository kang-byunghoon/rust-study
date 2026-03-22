# 워크스페이스와 실전 패턴

## 7. 워크스페이스

<div class="info-box">

**워크스페이스**는 여러 패키지를 하나의 프로젝트로 관리합니다.

```toml
# 최상위 Cargo.toml
[workspace]
members = [
    "core",
    "api",
    "cli",
]

# 공통 의존성 관리
[workspace.dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
```

```
my-workspace/
├── Cargo.toml          # 워크스페이스 정의
├── Cargo.lock          # 공유 잠금 파일
├── core/
│   ├── Cargo.toml
│   └── src/lib.rs
├── api/
│   ├── Cargo.toml
│   └── src/lib.rs
└── cli/
    ├── Cargo.toml
    └── src/main.rs
```

멤버 패키지에서 워크스페이스 의존성 사용:

```toml
# core/Cargo.toml
[dependencies]
serde.workspace = true
```

</div>

---

## 8. 실전 모듈 설계 예제

```rust,editable
mod app {
    // 공개 API 레이어
    pub mod api {
        pub fn handle_request(path: &str) -> String {
            match path {
                "/users" => super::service::get_users(),
                "/health" => "OK".to_string(),
                _ => "404 Not Found".to_string(),
            }
        }
    }

    // 비즈니스 로직 (외부에 비공개)
    mod service {
        pub(super) fn get_users() -> String {
            let users = super::repository::fetch_all();
            format!("사용자 목록: {:?}", users)
        }
    }

    // 데이터 접근 (외부에 비공개)
    mod repository {
        pub(super) fn fetch_all() -> Vec<String> {
            vec!["Alice".into(), "Bob".into(), "Charlie".into()]
        }
    }
}

fn main() {
    // 외부에서는 api 모듈만 접근 가능
    println!("{}", app::api::handle_request("/users"));
    println!("{}", app::api::handle_request("/health"));
    println!("{}", app::api::handle_request("/other"));

    // app::service::get_users(); // 에러! 비공개
    // app::repository::fetch_all(); // 에러! 비공개
}
```

---

## 연습문제

<div class="exercise-box">

**연습 1**: 다음 모듈 구조를 완성하세요. `pub use`를 활용하여 깔끔한 공개 API를 만드세요.

```rust,editable
mod ecommerce {
    mod models {
        pub struct Product {
            pub name: String,
            pub price: f64,
        }

        pub struct Order {
            pub items: Vec<Product>,
        }

        impl Order {
            pub fn total(&self) -> f64 {
                self.items.iter().map(|p| p.price).sum()
            }
        }
    }

    // TODO: pub use로 Product와 Order를 재내보내기 하세요

    pub fn create_sample_order() -> Order {
        Order {
            items: vec![
                Product { name: "키보드".into(), price: 89000.0 },
                Product { name: "마우스".into(), price: 45000.0 },
            ],
        }
    }
}

fn main() {
    // 재내보내기 후 이렇게 사용 가능해야 합니다:
    // let order = ecommerce::create_sample_order();
    // println!("총 금액: {}원", order.total());
}
```

</div>

<div class="exercise-box">

**연습 2**: 가시성 수준을 올바르게 설정하여 컴파일이 되도록 수정하세요.

```rust,editable
mod library {
    mod catalog {
        pub struct Book {
            pub title: String,
            pub(super) isbn: String,  // library 모듈 내에서만 접근
            pages: u32,               // catalog 내에서만 접근
        }

        impl Book {
            pub fn new(title: &str, isbn: &str, pages: u32) -> Self {
                Book {
                    title: title.to_string(),
                    isbn: isbn.to_string(),
                    pages,
                }
            }

            pub fn page_count(&self) -> u32 {
                self.pages
            }
        }
    }

    pub use catalog::Book;

    pub fn find_book(title: &str) -> Book {
        let book = Book::new(title, "978-0-000", 300);
        // isbn에 접근 가능 (pub(super)이므로)
        println!("ISBN: {}", book.isbn);
        book
    }
}

fn main() {
    let book = library::find_book("Rust 프로그래밍");
    println!("제목: {}", book.title);
    println!("페이지: {}", book.page_count());
    // println!("{}", book.isbn);   // 에러! pub(super)
    // println!("{}", book.pages);  // 에러! 비공개
}
```

</div>

---

## 퀴즈

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q1**: `pub`, `pub(crate)`, `pub(super)`의 차이는?

<div class="quiz-answer">

- **`pub`**: 어디서든 접근 가능 (완전 공개).
- **`pub(crate)`**: 같은 크레이트 내에서만 접근 가능.
- **`pub(super)`**: 부모 모듈에서만 접근 가능.
- **(기본값)**: 같은 모듈과 자식 모듈에서만 접근 가능.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q2**: `pub use`는 어떤 목적으로 사용하나요?

<div class="quiz-answer">

`pub use`는 **재내보내기(re-export)**로, 내부 모듈의 항목을 상위 모듈에서 직접 접근할 수 있게 합니다. 이를 통해 내부 구조를 숨기면서도 깔끔한 공개 API를 제공할 수 있습니다. 내부 리팩터링 시 외부 API에 영향을 주지 않습니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q3**: 워크스페이스의 장점은 무엇인가요?

<div class="quiz-answer">

(1) 여러 패키지가 하나의 `Cargo.lock`을 공유하여 의존성 버전이 통일됩니다. (2) 공통 의존성을 `[workspace.dependencies]`로 한 곳에서 관리합니다. (3) `cargo build`로 전체를 한 번에 빌드할 수 있습니다. (4) 패키지 간 로컬 의존성을 쉽게 설정할 수 있습니다.

</div>
</div>

---

<div class="summary-box">

**요약**

- **크레이트**는 바이너리(`src/main.rs`)와 라이브러리(`src/lib.rs`) 두 종류가 있습니다.
- `mod`로 모듈을 정의하고, `pub`으로 공개, `use`/`as`로 경로를 단축합니다.
- 가시성: `pub` (완전 공개), `pub(crate)` (크레이트 내부), `pub(super)` (부모 모듈).
- 파일 기반 모듈: `module.rs` + `module/` 디렉터리 방식을 권장합니다.
- `pub use`로 재내보내기하여 깔끔한 공개 API를 설계할 수 있습니다.
- **워크스페이스**로 여러 패키지를 하나의 프로젝트로 관리합니다.

</div>
