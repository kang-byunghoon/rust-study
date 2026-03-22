# Tokio 런타임

## 3. 비동기 런타임 — Tokio

<div class="info-box">

Rust 표준 라이브러리는 비동기 런타임을 포함하지 않습니다. 가장 널리 사용되는 런타임은 **Tokio**입니다. `Cargo.toml`에 추가:

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
```

</div>

### Tokio 기본 사용법

```rust,editable
// 실행하려면 tokio 크레이트가 필요합니다.
// #[tokio::main]은 async main을 가능하게 합니다.

// #[tokio::main]
// async fn main() {
//     println!("비동기 시작!");
//
//     let result = fetch_data().await;
//     println!("결과: {}", result);
// }
//
// async fn fetch_data() -> String {
//     // 네트워크 요청 시뮬레이션
//     tokio::time::sleep(std::time::Duration::from_secs(1)).await;
//     "데이터 수신 완료".to_string()
// }

fn main() {
    println!("#[tokio::main] 매크로 사용 예시");
    println!();
    println!("#[tokio::main]");
    println!("async fn main() {{");
    println!("    let data = fetch_data().await;");
    println!("}}");
}
```

### `tokio::spawn` — 비동기 태스크 생성

```rust,editable
// Tokio 태스크 생성 예시 (실행하려면 tokio 필요)

// #[tokio::main]
// async fn main() {
//     // 여러 비동기 태스크를 동시에 실행
//     let task1 = tokio::spawn(async {
//         tokio::time::sleep(std::time::Duration::from_millis(500)).await;
//         println!("태스크 1 완료");
//         42
//     });
//
//     let task2 = tokio::spawn(async {
//         tokio::time::sleep(std::time::Duration::from_millis(300)).await;
//         println!("태스크 2 완료");
//         "hello"
//     });
//
//     // 태스크 결과 수집
//     let result1 = task1.await.unwrap();
//     let result2 = task2.await.unwrap();
//
//     println!("결과: {}, {}", result1, result2);
// }

fn main() {
    println!("tokio::spawn으로 비동기 태스크를 생성합니다.");
    println!("각 태스크는 독립적으로 실행되며, .await로 결과를 기다립니다.");
}
```

### `tokio::select!` — 경쟁 실행

```rust,editable
// tokio::select! 예시
// 여러 비동기 작업 중 먼저 완료되는 것을 선택합니다.

// #[tokio::main]
// async fn main() {
//     tokio::select! {
//         val = async {
//             tokio::time::sleep(std::time::Duration::from_secs(1)).await;
//             "느린 작업"
//         } => {
//             println!("완료: {}", val);
//         }
//         val = async {
//             tokio::time::sleep(std::time::Duration::from_millis(500)).await;
//             "빠른 작업"
//         } => {
//             println!("완료: {}", val);  // 이것이 먼저!
//         }
//     }
// }

fn main() {
    println!("select! 매크로는 여러 Future 중 먼저 완료되는 것을 선택합니다.");
    println!();
    println!("사용 사례:");
    println!("  - 타임아웃 구현");
    println!("  - 여러 소스에서 데이터 수신");
    println!("  - 취소 가능한 작업");
}
```

---

## 4. 비동기 I/O

```rust,editable
// Tokio 비동기 I/O 예시

// use tokio::fs;
// use tokio::io::{self, AsyncReadExt, AsyncWriteExt};
//
// #[tokio::main]
// async fn main() -> io::Result<()> {
//     // 비동기 파일 쓰기
//     fs::write("hello.txt", "안녕하세요, 비동기!").await?;
//
//     // 비동기 파일 읽기
//     let contents = fs::read_to_string("hello.txt").await?;
//     println!("파일 내용: {}", contents);
//
//     // 비동기 TCP 서버
//     // let listener = tokio::net::TcpListener::bind("127.0.0.1:8080").await?;
//     // loop {
//     //     let (socket, addr) = listener.accept().await?;
//     //     tokio::spawn(async move {
//     //         handle_connection(socket).await;
//     //     });
//     // }
//
//     Ok(())
// }

fn main() {
    println!("Tokio 비동기 I/O 특징:");
    println!("  - tokio::fs — 비동기 파일 시스템 작업");
    println!("  - tokio::net — 비동기 네트워킹 (TCP, UDP)");
    println!("  - tokio::io — 비동기 읽기/쓰기 트레이트");
}
```
