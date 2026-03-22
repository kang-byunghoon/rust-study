# CLI 도구와 웹 서버

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
