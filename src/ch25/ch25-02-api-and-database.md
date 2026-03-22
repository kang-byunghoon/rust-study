# REST API와 데이터베이스

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
