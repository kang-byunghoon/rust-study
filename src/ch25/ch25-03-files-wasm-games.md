# 파일 처리, WASM, 터미널 게임

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
