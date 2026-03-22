# 실전 프로젝트 <span class="badge-advanced">고급</span>

이 장에서는 실제로 쓸 수 있는 프로젝트를 구축하면서 Rust의 생태계를 체험합니다. CLI 도구, 웹 서버, REST API, 데이터베이스 연동, 파일 처리, WebAssembly, 터미널 게임까지 다양한 분야를 다룹니다.

---

## 25.1 CLI 도구 (clap)

`clap`은 Rust에서 가장 인기 있는 명령줄 인수 파서입니다. derive 매크로로 간결하게 CLI를 정의할 수 있습니다.

### Cargo.toml

```toml
[dependencies]
clap = { version = "4", features = ["derive"] }
colored = "2"
```

### 완전한 CLI 도구: 파일 검색기

```rust,editable
// 간략화된 clap 예제 (실제로는 clap 크레이트가 필요합니다)

use std::path::PathBuf;

// clap의 derive 매크로로 CLI 정의
// #[derive(Parser)]
// #[command(name = "rsearch")]
// #[command(about = "빠른 파일 검색 도구", long_about = None)]
struct Cli {
    /// 검색할 패턴
    pattern: String,

    /// 검색할 디렉토리 (기본: 현재 디렉토리)
    path: Option<PathBuf>,

    /// 대소문자 무시
    ignore_case: bool,

    /// 최대 검색 깊이
    max_depth: Option<usize>,

    /// 파일 확장자 필터
    extension: Option<String>,

    /// 결과 수 제한
    limit: Option<usize>,
}

// 실제 clap 코드 예시:
/*
use clap::Parser;

#[derive(Parser)]
#[command(name = "rsearch")]
#[command(about = "빠른 파일 검색 도구")]
#[command(version)]
struct Cli {
    /// 검색할 패턴
    pattern: String,

    /// 검색할 디렉토리
    #[arg(default_value = ".")]
    path: PathBuf,

    /// 대소문자 무시
    #[arg(short, long)]
    ignore_case: bool,

    /// 최대 검색 깊이
    #[arg(short = 'd', long)]
    max_depth: Option<usize>,

    /// 파일 확장자 필터 (예: rs, txt)
    #[arg(short, long)]
    extension: Option<String>,

    /// 결과 수 제한
    #[arg(short, long)]
    limit: Option<usize>,
}

fn main() {
    let cli = Cli::parse();

    println!("패턴: {}", cli.pattern);
    println!("경로: {:?}", cli.path);

    if cli.ignore_case {
        println!("대소문자 무시 모드");
    }
}
*/

// 서브 커맨드 예시:
/*
#[derive(Parser)]
#[command(name = "mytool")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// 새 프로젝트 생성
    Init {
        /// 프로젝트 이름
        name: String,

        /// 템플릿 사용
        #[arg(short, long, default_value = "default")]
        template: String,
    },
    /// 프로젝트 빌드
    Build {
        /// 릴리스 모드
        #[arg(short, long)]
        release: bool,
    },
    /// 테스트 실행
    Test {
        /// 특정 테스트만 실행
        filter: Option<String>,
    },
}
*/

fn main() {
    // 시뮬레이션
    let cli = Cli {
        pattern: "main".to_string(),
        path: Some(PathBuf::from("./src")),
        ignore_case: true,
        max_depth: Some(3),
        extension: Some("rs".to_string()),
        limit: Some(10),
    };

    println!("=== rsearch - 파일 검색 도구 ===");
    println!("패턴: \"{}\"", cli.pattern);
    println!("경로: {:?}", cli.path.as_ref().unwrap());
    println!("대소문자 무시: {}", cli.ignore_case);
    println!("최대 깊이: {:?}", cli.max_depth);
    println!("확장자: {:?}", cli.extension);
    println!("결과 제한: {:?}", cli.limit);

    // 실제 검색 로직은 walkdir + regex 조합으로 구현
    println!("\n검색 결과:");
    let mock_results = vec![
        "./src/main.rs:1: fn main() {",
        "./src/lib.rs:10: pub fn main_logic() {",
        "./src/test.rs:5: fn test_main() {",
    ];

    for (i, result) in mock_results.iter().enumerate() {
        if let Some(limit) = cli.limit {
            if i >= limit { break; }
        }
        println!("  {}", result);
    }
    println!("\n총 {} 건의 결과", mock_results.len());
}
```

---

## 25.2 웹 서버 (Axum)

Axum은 Tokio 기반의 인체공학적 웹 프레임워크입니다.

### Cargo.toml

```toml
[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tower-http = { version = "0.5", features = ["cors", "trace"] }
tracing = "0.1"
tracing-subscriber = "0.3"
```

### 기본 웹 서버

```rust,editable
// Axum 웹 서버 기본 구조
// (실행하려면 axum, tokio 크레이트가 필요합니다)

/*
use axum::{
    extract::{Path, Query, State, Json},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post, put, delete},
    Router,
};
use serde::{Serialize, Deserialize};
use std::sync::Arc;
use tokio::sync::RwLock;

// 공유 상태
type AppState = Arc<RwLock<Vec<Todo>>>;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Todo {
    id: u64,
    title: String,
    completed: bool,
}

#[derive(Deserialize)]
struct CreateTodo {
    title: String,
}

#[derive(Deserialize)]
struct QueryParams {
    completed: Option<bool>,
    limit: Option<usize>,
}

// 핸들러 함수들
async fn list_todos(
    State(state): State<AppState>,
    Query(params): Query<QueryParams>,
) -> Json<Vec<Todo>> {
    let todos = state.read().await;
    let mut result: Vec<Todo> = todos.iter()
        .filter(|t| params.completed.map_or(true, |c| t.completed == c))
        .cloned()
        .collect();

    if let Some(limit) = params.limit {
        result.truncate(limit);
    }

    Json(result)
}

async fn get_todo(
    State(state): State<AppState>,
    Path(id): Path<u64>,
) -> Result<Json<Todo>, StatusCode> {
    let todos = state.read().await;
    todos.iter()
        .find(|t| t.id == id)
        .cloned()
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

async fn create_todo(
    State(state): State<AppState>,
    Json(input): Json<CreateTodo>,
) -> (StatusCode, Json<Todo>) {
    let mut todos = state.write().await;
    let id = todos.len() as u64 + 1;
    let todo = Todo {
        id,
        title: input.title,
        completed: false,
    };
    todos.push(todo.clone());
    (StatusCode::CREATED, Json(todo))
}

async fn toggle_todo(
    State(state): State<AppState>,
    Path(id): Path<u64>,
) -> Result<Json<Todo>, StatusCode> {
    let mut todos = state.write().await;
    if let Some(todo) = todos.iter_mut().find(|t| t.id == id) {
        todo.completed = !todo.completed;
        Ok(Json(todo.clone()))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

async fn delete_todo(
    State(state): State<AppState>,
    Path(id): Path<u64>,
) -> StatusCode {
    let mut todos = state.write().await;
    if let Some(pos) = todos.iter().position(|t| t.id == id) {
        todos.remove(pos);
        StatusCode::NO_CONTENT
    } else {
        StatusCode::NOT_FOUND
    }
}

#[tokio::main]
async fn main() {
    // 로깅 초기화
    tracing_subscriber::init();

    let state: AppState = Arc::new(RwLock::new(Vec::new()));

    let app = Router::new()
        .route("/todos", get(list_todos).post(create_todo))
        .route("/todos/:id", get(get_todo).put(toggle_todo).delete(delete_todo))
        .route("/health", get(|| async { "OK" }))
        .with_state(state);

    println!("서버 시작: http://localhost:3000");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
*/

fn main() {
    println!("=== Axum 웹 서버 구조 ===\n");
    println!("라우트:");
    println!("  GET    /todos      - 목록 조회 (쿼리: ?completed=true&limit=10)");
    println!("  POST   /todos      - 할 일 생성");
    println!("  GET    /todos/:id  - 단건 조회");
    println!("  PUT    /todos/:id  - 완료 토글");
    println!("  DELETE /todos/:id  - 삭제");
    println!("  GET    /health     - 헬스 체크");
    println!("\nAPI 테스트 (curl):");
    println!("  curl -X POST http://localhost:3000/todos \\");
    println!("    -H 'Content-Type: application/json' \\");
    println!("    -d '{{\"title\": \"Rust 공부\"}}'");
    println!("  curl http://localhost:3000/todos");
    println!("  curl -X PUT http://localhost:3000/todos/1");
}
```

---

## 25.3 REST API + 미들웨어

```rust,editable
// REST API 미들웨어와 에러 처리 구조
/*
use axum::{
    extract::Request,
    middleware::{self, Next},
    response::Response,
    http::{StatusCode, HeaderMap},
};
use std::time::Instant;

// 로깅 미들웨어
async fn logging_middleware(req: Request, next: Next) -> Response {
    let method = req.method().clone();
    let uri = req.uri().clone();
    let start = Instant::now();

    let response = next.run(req).await;

    let duration = start.elapsed();
    tracing::info!(
        "{} {} -> {} ({:?})",
        method, uri, response.status(), duration
    );

    response
}

// 인증 미들웨어
async fn auth_middleware(
    headers: HeaderMap,
    req: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let token = headers
        .get("Authorization")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.strip_prefix("Bearer "));

    match token {
        Some(token) if validate_token(token) => {
            Ok(next.run(req).await)
        }
        _ => Err(StatusCode::UNAUTHORIZED),
    }
}

fn validate_token(token: &str) -> bool {
    token == "valid-token" // 실제로는 JWT 검증 등
}

// 에러 응답 타입
#[derive(serde::Serialize)]
struct ApiError {
    error: String,
    code: u16,
}

// 라우터 구성
fn create_router() -> Router<AppState> {
    let public_routes = Router::new()
        .route("/health", get(health))
        .route("/login", post(login));

    let protected_routes = Router::new()
        .route("/users", get(list_users))
        .route("/users/:id", get(get_user))
        .layer(middleware::from_fn(auth_middleware));

    Router::new()
        .merge(public_routes)
        .merge(protected_routes)
        .layer(middleware::from_fn(logging_middleware))
}
*/

fn main() {
    println!("=== REST API 미들웨어 구조 ===\n");
    println!("미들웨어 체인:");
    println!("  요청 → 로깅 → 인증 → 핸들러 → 로깅 → 응답\n");
    println!("공개 라우트:");
    println!("  GET  /health - 헬스 체크");
    println!("  POST /login  - 로그인\n");
    println!("보호된 라우트 (Bearer 토큰 필요):");
    println!("  GET /users     - 사용자 목록");
    println!("  GET /users/:id - 사용자 상세");
}
```

---

## 25.4 데이터베이스 연동 (sqlx)

`sqlx`는 컴파일 타임에 SQL 쿼리를 검증하는 비동기 데이터베이스 라이브러리입니다.

### Cargo.toml

```toml
[dependencies]
sqlx = { version = "0.8", features = ["runtime-tokio", "sqlite", "postgres"] }
tokio = { version = "1", features = ["full"] }
```

```rust,editable
// sqlx 데이터베이스 연동 구조
/*
use sqlx::{SqlitePool, FromRow};

#[derive(Debug, FromRow)]
struct User {
    id: i64,
    name: String,
    email: String,
    created_at: String,
}

struct UserRepository {
    pool: SqlitePool,
}

impl UserRepository {
    fn new(pool: SqlitePool) -> Self {
        UserRepository { pool }
    }

    // 테이블 생성
    async fn create_table(&self) -> Result<(), sqlx::Error> {
        sqlx::query(
            "CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                created_at TEXT DEFAULT (datetime('now'))
            )"
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    // 사용자 추가
    async fn create(&self, name: &str, email: &str) -> Result<User, sqlx::Error> {
        // 컴파일 타임 SQL 검증 (query_as! 매크로)
        let user = sqlx::query_as::<_, User>(
            "INSERT INTO users (name, email) VALUES (?, ?) RETURNING *"
        )
        .bind(name)
        .bind(email)
        .fetch_one(&self.pool)
        .await?;

        Ok(user)
    }

    // 전체 조회
    async fn find_all(&self) -> Result<Vec<User>, sqlx::Error> {
        let users = sqlx::query_as::<_, User>("SELECT * FROM users")
            .fetch_all(&self.pool)
            .await?;
        Ok(users)
    }

    // ID로 조회
    async fn find_by_id(&self, id: i64) -> Result<Option<User>, sqlx::Error> {
        let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = ?")
            .bind(id)
            .fetch_optional(&self.pool)
            .await?;
        Ok(user)
    }

    // 삭제
    async fn delete(&self, id: i64) -> Result<bool, sqlx::Error> {
        let result = sqlx::query("DELETE FROM users WHERE id = ?")
            .bind(id)
            .execute(&self.pool)
            .await?;
        Ok(result.rows_affected() > 0)
    }
}

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    // SQLite 메모리 DB 연결
    let pool = SqlitePool::connect("sqlite::memory:").await?;
    let repo = UserRepository::new(pool);

    // 테이블 생성
    repo.create_table().await?;

    // 사용자 추가
    let user1 = repo.create("Alice", "alice@example.com").await?;
    let user2 = repo.create("Bob", "bob@example.com").await?;
    println!("생성: {:?}", user1);
    println!("생성: {:?}", user2);

    // 전체 조회
    let all = repo.find_all().await?;
    println!("\n전체 사용자: {:#?}", all);

    Ok(())
}
*/

fn main() {
    println!("=== sqlx 데이터베이스 연동 ===\n");
    println!("지원 DB: SQLite, PostgreSQL, MySQL");
    println!("핵심 기능:");
    println!("  - 컴파일 타임 SQL 검증 (query! 매크로)");
    println!("  - 비동기 쿼리 실행");
    println!("  - 자동 매핑 (FromRow derive)");
    println!("  - 마이그레이션 지원");
    println!("  - 커넥션 풀링\n");
    println!("사용 패턴:");
    println!("  1. SqlitePool::connect(url).await");
    println!("  2. sqlx::query_as::<_, User>(sql).bind(param)");
    println!("  3. .fetch_one / .fetch_all / .fetch_optional");
    println!("  4. .execute (INSERT, UPDATE, DELETE)");
}
```

---

## 25.5 파일 처리 (walkdir)

`walkdir`은 디렉토리 트리를 효율적으로 순회하는 크레이트입니다.

### Cargo.toml

```toml
[dependencies]
walkdir = "2"
```

```rust,editable
// walkdir 파일 처리 예제 (시뮬레이션)

use std::collections::HashMap;
use std::path::Path;

// 실제 walkdir 사용 코드:
/*
use walkdir::WalkDir;

fn analyze_directory(path: &str) -> DirectoryStats {
    let mut stats = DirectoryStats::default();

    for entry in WalkDir::new(path)
        .max_depth(10)
        .follow_links(false)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        if entry.file_type().is_file() {
            stats.file_count += 1;

            if let Some(ext) = entry.path().extension() {
                let ext = ext.to_string_lossy().to_string();
                *stats.extensions.entry(ext).or_insert(0) += 1;
            }

            if let Ok(metadata) = entry.metadata() {
                stats.total_size += metadata.len();
            }
        } else if entry.file_type().is_dir() {
            stats.dir_count += 1;
        }
    }

    stats
}
*/

#[derive(Default, Debug)]
struct DirectoryStats {
    file_count: usize,
    dir_count: usize,
    total_size: u64,
    extensions: HashMap<String, usize>,
}

impl DirectoryStats {
    fn display(&self) {
        println!("=== 디렉토리 분석 결과 ===");
        println!("파일 수: {}", self.file_count);
        println!("디렉토리 수: {}", self.dir_count);
        println!("총 크기: {} bytes ({:.2} KB)", self.total_size, self.total_size as f64 / 1024.0);
        println!("\n확장자별 파일 수:");

        let mut sorted: Vec<_> = self.extensions.iter().collect();
        sorted.sort_by(|a, b| b.1.cmp(a.1));

        for (ext, count) in sorted {
            let bar = "#".repeat(*count);
            println!("  .{:<8} {:>4} {}", ext, count, bar);
        }
    }
}

fn main() {
    // 시뮬레이션 데이터
    let mut stats = DirectoryStats {
        file_count: 47,
        dir_count: 12,
        total_size: 156_800,
        extensions: HashMap::new(),
    };

    stats.extensions.insert("rs".to_string(), 15);
    stats.extensions.insert("toml".to_string(), 3);
    stats.extensions.insert("md".to_string(), 8);
    stats.extensions.insert("json".to_string(), 5);
    stats.extensions.insert("lock".to_string(), 1);
    stats.extensions.insert("txt".to_string(), 10);
    stats.extensions.insert("yaml".to_string(), 5);

    stats.display();

    println!("\n=== 실제 코드 구조 ===");
    println!("WalkDir::new(\"./src\")");
    println!("    .max_depth(5)         // 최대 깊이");
    println!("    .follow_links(false)  // 심볼릭 링크 무시");
    println!("    .sort_by_file_name()  // 이름순 정렬");
    println!("    .into_iter()");
    println!("    .filter_entry(|e| !is_hidden(e))  // 숨김 파일 제외");
    println!("    .filter_map(|e| e.ok())");
}
```

---

## 25.6 WebAssembly (wasm-pack)

Rust를 WebAssembly로 컴파일하여 브라우저에서 실행할 수 있습니다.

### 프로젝트 설정

```bash
# wasm-pack 설치
cargo install wasm-pack

# 프로젝트 생성
cargo new --lib wasm-demo
cd wasm-demo
```

### Cargo.toml

```toml
[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
web-sys = { version = "0.3", features = ["Document", "Element", "HtmlElement", "Window"] }
js-sys = "0.3"
```

```rust,editable
// WebAssembly 모듈 예제 구조

/*
use wasm_bindgen::prelude::*;

// JavaScript에서 호출 가능한 함수
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("안녕하세요, {}! (Rust WASM에서)", name)
}

#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => {
            let mut a: u64 = 0;
            let mut b: u64 = 1;
            for _ in 2..=n {
                let temp = b;
                b = a + b;
                a = temp;
            }
            b
        }
    }
}

// JavaScript 함수 호출
#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// DOM 조작
#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    let window = web_sys::window().unwrap();
    let document = window.document().unwrap();
    let body = document.body().unwrap();

    let element = document.create_element("p")?;
    element.set_text_content(Some("Rust WASM이 DOM을 조작합니다!"));
    body.append_child(&element)?;

    Ok(())
}
*/

fn fibonacci(n: u32) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => {
            let mut a: u64 = 0;
            let mut b: u64 = 1;
            for _ in 2..=n {
                let temp = b;
                b = a + b;
                a = temp;
            }
            b
        }
    }
}

fn main() {
    println!("=== WebAssembly (WASM) 기본 ===\n");
    println!("빌드: wasm-pack build --target web\n");
    println!("피보나치 테스트:");
    for n in [5, 10, 20, 30, 40] {
        println!("  fib({}) = {}", n, fibonacci(n));
    }

    println!("\n자바스크립트 사용:");
    println!(r#"
    import init, {{ greet, fibonacci }} from './pkg/wasm_demo.js';

    async function main() {{
        await init();
        console.log(greet("세계"));
        console.log("fib(40) =", fibonacci(40));
    }}

    main();
    "#);
}
```

### HTML에서 WASM 사용

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rust WASM Demo</title>
</head>
<body>
    <h1>Rust WebAssembly</h1>
    <div id="output"></div>
    <script type="module">
        import init, { greet, fibonacci } from './pkg/wasm_demo.js';

        async function main() {
            await init();

            const output = document.getElementById('output');
            output.innerHTML = greet("세계");

            // 성능 비교
            const start = performance.now();
            const result = fibonacci(40);
            const elapsed = performance.now() - start;

            output.innerHTML += `<br>fib(40) = ${result} (${elapsed.toFixed(2)}ms)`;
        }

        main();
    </script>
</body>
</html>
```

---

## 25.7 터미널 게임 아이디어

### 숫자 맞추기 게임 (완전한 예제)

```rust,editable
use std::io::{self, Write};

struct Game {
    secret: u32,
    attempts: u32,
    max_attempts: u32,
    history: Vec<(u32, String)>,
}

impl Game {
    fn new(max: u32, max_attempts: u32) -> Self {
        // 간단한 의사 난수 (실제로는 rand 크레이트 사용)
        let secret = (std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .subsec_nanos() % max) + 1;

        Game {
            secret,
            attempts: 0,
            max_attempts,
            history: Vec::new(),
        }
    }

    fn guess(&mut self, number: u32) -> GameResult {
        self.attempts += 1;

        let hint = if number < self.secret {
            "더 높은 숫자입니다 ↑".to_string()
        } else if number > self.secret {
            "더 낮은 숫자입니다 ↓".to_string()
        } else {
            "정답입니다! 🎉".to_string()
        };

        self.history.push((number, hint.clone()));

        if number == self.secret {
            GameResult::Won
        } else if self.attempts >= self.max_attempts {
            GameResult::Lost
        } else {
            GameResult::Continue(hint)
        }
    }

    fn display_status(&self) {
        println!("\n--- 시도 {}/{} ---", self.attempts, self.max_attempts);
        for (num, hint) in &self.history {
            println!("  {} → {}", num, hint);
        }
    }
}

enum GameResult {
    Won,
    Lost,
    Continue(String),
}

fn main() {
    println!("╔══════════════════════════════╗");
    println!("║     숫자 맞추기 게임         ║");
    println!("║   1~100 사이 숫자를 맞춰보세요  ║");
    println!("╚══════════════════════════════╝\n");

    let mut game = Game::new(100, 7);

    // 자동 플레이 시뮬레이션
    let guesses = vec![50, 75, 62, 68, 71, 70, 69];

    for guess in guesses {
        println!("입력: {}", guess);

        match game.guess(guess) {
            GameResult::Won => {
                game.display_status();
                println!("\n🎊 {}번 만에 맞추셨습니다!", game.attempts);
                return;
            }
            GameResult::Lost => {
                game.display_status();
                println!("\n😢 게임 오버! 정답은 {}이었습니다.", game.secret);
                return;
            }
            GameResult::Continue(hint) => {
                println!("  힌트: {}", hint);
            }
        }
    }

    game.display_status();
    println!("\n정답: {}", game.secret);
}
```

<div class="tip-box">
<strong>💡 터미널 게임 확장 아이디어</strong><br>
<ul>
<li><strong>crossterm</strong> + <strong>ratatui</strong>: 풍부한 TUI (텍스트 기반 UI) 구현</li>
<li><strong>뱀 게임</strong>: crossterm으로 키 입력 처리, 격자 렌더링</li>
<li><strong>테트리스</strong>: ratatui 위젯으로 블록 표시, 타이머로 자동 낙하</li>
<li><strong>텍스트 어드벤처</strong>: 열거형으로 방/상태 모델링, serde로 세이브/로드</li>
<li><strong>타이핑 게임</strong>: 랜덤 단어 표시, WPM 측정</li>
</ul>
</div>

---

<div class="exercise-box">

### 연습문제

**연습 1**: 위 숫자 맞추기 게임을 확장하여 난이도 선택(쉬움/보통/어려움)과 점수 시스템을 추가하세요.

```rust,editable
// 난이도별 설정:
// 쉬움: 1~50, 10회 시도
// 보통: 1~100, 7회 시도
// 어려움: 1~200, 5회 시도
// 점수: 남은 시도 횟수 * 난이도 보너스

fn main() {
    println!("난이도 선택과 점수 시스템을 구현하세요!");
}
```

**연습 2**: clap을 사용하여 간단한 TODO CLI 도구를 설계하세요. 서브커맨드: `add`, `list`, `done`, `remove`.

```rust,editable
// TODO CLI 도구 구조 설계
// 데이터는 JSON 파일에 저장

// mytodo add "Rust 공부하기"
// mytodo list
// mytodo list --completed
// mytodo done 1
// mytodo remove 1

fn main() {
    println!("TODO CLI 도구의 구조를 설계하세요!");
    println!("힌트: clap의 Subcommand, serde_json으로 파일 저장");
}
```

</div>

---

<div class="summary-box">

### 요약

| 프로젝트 | 핵심 크레이트 | 주요 개념 |
|---------|-------------|----------|
| **CLI 도구** | clap | Parser derive, 서브커맨드, 인수 검증 |
| **웹 서버** | axum, tokio | 라우팅, 핸들러, 비동기 처리 |
| **REST API** | axum, tower-http | 미들웨어, 인증, 에러 처리 |
| **데이터베이스** | sqlx | 비동기 쿼리, FromRow, 커넥션 풀 |
| **파일 처리** | walkdir | 디렉토리 순회, 필터링, 통계 |
| **WebAssembly** | wasm-bindgen, web-sys | WASM 빌드, JS 연동, DOM 조작 |
| **터미널 게임** | crossterm, ratatui | 키 입력, TUI 렌더링 |

</div>
