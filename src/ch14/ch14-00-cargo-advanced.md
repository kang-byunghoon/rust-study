# Cargo 심화

<span class="badge-intermediate">중급</span>

Cargo는 Rust의 빌드 시스템이자 패키지 매니저입니다. 이 장에서는 의존성 관리, 피처 플래그, 빌드 프로파일, 조건부 컴파일 등 Cargo의 심화 기능을 살펴봅니다.

---

## 1. Cargo.toml 상세 구조

```rust,editable
// Cargo.toml의 주요 섹션을 코드로 설명

fn main() {
    println!("=== Cargo.toml 주요 섹션 ===");
    println!();
    println!("[package]         : 패키지 메타데이터");
    println!("[dependencies]    : 런타임 의존성");
    println!("[dev-dependencies]: 테스트/벤치마크 전용");
    println!("[build-dependencies]: 빌드 스크립트 전용");
    println!("[features]        : 피처 플래그");
    println!("[profile.*]       : 빌드 프로파일");
    println!("[workspace]       : 워크스페이스 설정");
}
```

<div class="info-box">

**Cargo.toml 예시**

```toml
[package]
name = "my-app"
version = "0.1.0"
edition = "2021"
authors = ["개발자 <dev@example.com>"]
description = "나의 Rust 애플리케이션"
license = "MIT"
repository = "https://github.com/user/my-app"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
reqwest = { version = "0.11", optional = true }

[dev-dependencies]
criterion = "0.5"
tempfile = "3.0"

[build-dependencies]
cc = "1.0"

[features]
default = ["logging"]
logging = []
networking = ["reqwest"]
full = ["logging", "networking"]
```

</div>

---

## 2. 의존성 지정 방법

<div class="info-box">

**다양한 의존성 소스**

```toml
[dependencies]
# crates.io에서 (기본)
serde = "1.0"

# 정확한 버전
exact = "=1.2.3"

# 버전 범위
range = ">=1.0, <2.0"

# Git 리포지토리
my_lib = { git = "https://github.com/user/lib.git", branch = "main" }
my_lib2 = { git = "https://github.com/user/lib2.git", tag = "v1.0" }

# 로컬 경로
local_lib = { path = "../my-local-lib" }

# 선택적 의존성 (피처로 활성화)
optional_dep = { version = "1.0", optional = true }
```

</div>

---

## 3. 시맨틱 버전 관리 (SemVer)

```rust,editable
fn main() {
    println!("=== SemVer: MAJOR.MINOR.PATCH ===");
    println!();
    println!("MAJOR (1.x.x → 2.0.0): 호환성이 깨지는 변경");
    println!("MINOR (1.0.x → 1.1.0): 하위 호환 기능 추가");
    println!("PATCH (1.0.0 → 1.0.1): 하위 호환 버그 수정");
    println!();
    println!("=== Cargo 버전 요구사항 ===");
    println!("\"1.2.3\"   → >=1.2.3, <2.0.0  (캐럿, 기본값)");
    println!("\"~1.2.3\"  → >=1.2.3, <1.3.0  (틸드)");
    println!("\"=1.2.3\"  → 정확히 1.2.3");
    println!("\">=1, <2\" → 범위 지정");
    println!("\"*\"       → 모든 버전 (비권장)");
}
```

---

## 4. 피처 플래그 (Feature Flags)

```rust,editable
// 피처 플래그로 조건부 컴파일

// Cargo.toml:
// [features]
// default = ["json"]
// json = []
// xml = []
// full = ["json", "xml"]

// 피처에 따라 코드 포함/제외
#[cfg(feature = "json")]
fn parse_json(data: &str) -> String {
    format!("JSON 파싱: {}", data)
}

#[cfg(feature = "xml")]
fn parse_xml(data: &str) -> String {
    format!("XML 파싱: {}", data)
}

// 런타임에서 피처 확인은 불가 — 컴파일 타임 결정
fn main() {
    // 피처 플래그 사용 예시 (실제로는 Cargo.toml에서 설정)
    println!("피처 플래그 예시:");
    println!("  cargo build                    → default 피처");
    println!("  cargo build --features xml     → default + xml");
    println!("  cargo build --features full    → json + xml");
    println!("  cargo build --no-default-features → 피처 없음");
    println!("  cargo build --no-default-features --features xml → xml만");
}
```

<div class="tip-box">

**팁**: 피처 플래그는 **추가적(additive)**이어야 합니다. 피처를 활성화하면 코드가 추가되는 방식으로 설계하세요. 피처 A와 B가 동시에 활성화되어도 충돌 없이 작동해야 합니다.

</div>

---

## 5. 빌드 프로파일 (Build Profiles)

<div class="info-box">

**기본 프로파일 설정**

```toml
# 개발용 (cargo build)
[profile.dev]
opt-level = 0         # 최적화 없음 (빠른 컴파일)
debug = true          # 디버그 정보 포함
overflow-checks = true # 정수 오버플로우 검사

# 릴리즈용 (cargo build --release)
[profile.release]
opt-level = 3         # 최대 최적화
debug = false         # 디버그 정보 제외
lto = true            # 링크 타임 최적화
panic = 'abort'       # panic 시 즉시 종료 (바이너리 크기 감소)
strip = true          # 심볼 제거

# 테스트용 (cargo test)
[profile.test]
opt-level = 0

# 벤치마크용 (cargo bench)
[profile.bench]
opt-level = 3

# 커스텀 프로파일
[profile.profiling]
inherits = "release"
debug = true          # 릴리즈 최적화 + 디버그 정보
```

</div>

```rust,editable
fn main() {
    // 현재 빌드 모드 확인
    if cfg!(debug_assertions) {
        println!("디버그 모드로 빌드됨");
    } else {
        println!("릴리즈 모드로 빌드됨");
    }

    // opt-level에 따른 성능 차이 시연
    let sum: u64 = (1..=1_000_000).sum();
    println!("1부터 1,000,000까지의 합: {}", sum);
}
```

---

## 6. 빌드 스크립트 (build.rs)

<div class="info-box">

**build.rs**는 컴파일 전에 실행되는 Rust 프로그램입니다.

```rust
// build.rs 예시
fn main() {
    // 환경 변수 설정 (코드에서 env!()로 접근)
    println!("cargo:rustc-env=BUILD_TIME=2024-01-01");

    // C 라이브러리 링크
    // println!("cargo:rustc-link-lib=sqlite3");

    // 파일 변경 감지 (이 파일이 변경되면 재빌드)
    // println!("cargo:rerun-if-changed=src/data.txt");

    // cfg 플래그 설정
    // println!("cargo:rustc-cfg=custom_feature");
}
```

</div>

```rust,editable
fn main() {
    // build.rs에서 설정한 환경 변수 사용 예시
    // let build_time = env!("BUILD_TIME");

    println!("빌드 스크립트 용도:");
    println!("  - C/C++ 코드 컴파일 (cc 크레이트)");
    println!("  - 프로토콜 버퍼 코드 생성");
    println!("  - 빌드 메타데이터 삽입");
    println!("  - 시스템 라이브러리 감지 및 링크");
}
```

---

## 7. 조건부 컴파일

```rust,editable
// #[cfg] 속성: 컴파일 조건
#[cfg(target_os = "linux")]
fn platform_info() -> &'static str {
    "Linux"
}

#[cfg(target_os = "macos")]
fn platform_info() -> &'static str {
    "macOS"
}

#[cfg(target_os = "windows")]
fn platform_info() -> &'static str {
    "Windows"
}

#[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
fn platform_info() -> &'static str {
    "기타 OS"
}

fn main() {
    println!("현재 OS: {}", platform_info());

    // cfg! 매크로: 런타임에 조건 확인 (실제로는 컴파일 타임)
    if cfg!(target_pointer_width = "64") {
        println!("64비트 시스템");
    } else {
        println!("32비트 시스템");
    }

    if cfg!(debug_assertions) {
        println!("디버그 빌드");
    }

    // 아키텍처 확인
    println!("아키텍처: {}", std::env::consts::ARCH);
    println!("OS: {}", std::env::consts::OS);
}
```

---

## 8. Cargo.lock

<div class="info-box">

**Cargo.lock의 역할**

| 항목 | 바이너리 프로젝트 | 라이브러리 프로젝트 |
|------|-------------------|---------------------|
| Git 커밋 | **포함** (재현 가능한 빌드) | **제외** (.gitignore) |
| 용도 | 정확한 버전 고정 | 유연한 버전 호환 |
| 업데이트 | `cargo update` | 사용자가 결정 |

- `cargo update`: `Cargo.toml` 범위 내에서 최신 버전으로 `Cargo.lock` 갱신
- `cargo update -p serde`: 특정 패키지만 업데이트

</div>

---

## 9. crates.io에 배포하기

```rust,editable
fn main() {
    println!("=== crates.io 배포 단계 ===");
    println!();
    println!("1. crates.io 계정 생성 및 API 토큰 발급");
    println!("   cargo login <토큰>");
    println!();
    println!("2. Cargo.toml 메타데이터 작성");
    println!("   name, version, edition, description, license 필수");
    println!();
    println!("3. 배포 전 확인");
    println!("   cargo package   → 패키지 생성 테스트");
    println!("   cargo publish --dry-run → 배포 시뮬레이션");
    println!();
    println!("4. 배포");
    println!("   cargo publish");
    println!();
    println!("5. 버전 철회 (삭제는 불가)");
    println!("   cargo yank --vers 1.0.0");
}
```

<div class="warning-box">

**주의**: crates.io에 배포된 크레이트는 **삭제할 수 없습니다**. `cargo yank`으로 새 프로젝트가 의존하지 못하게 할 수는 있지만, 기존 `Cargo.lock`에 포함된 경우 계속 다운로드 가능합니다.

</div>

---

## 10. 유용한 Cargo 서브커맨드

```rust,editable
fn main() {
    println!("=== 필수 Cargo 서브커맨드 ===");
    println!();
    println!("cargo-watch    : 파일 변경 감지하여 자동 재빌드");
    println!("  설치: cargo install cargo-watch");
    println!("  사용: cargo watch -x run");
    println!("        cargo watch -x test");
    println!("        cargo watch -x 'clippy -- -W warnings'");
    println!();
    println!("cargo-expand   : 매크로 확장 결과 확인");
    println!("  설치: cargo install cargo-expand");
    println!("  사용: cargo expand");
    println!("        cargo expand module_name");
    println!();
    println!("cargo-audit    : 의존성 보안 취약점 검사");
    println!("  설치: cargo install cargo-audit");
    println!("  사용: cargo audit");
    println!();
    println!("=== 기타 유용한 도구 ===");
    println!("cargo clippy   : 린트 검사 (기본 내장)");
    println!("cargo fmt      : 코드 포맷팅 (기본 내장)");
    println!("cargo doc      : 문서 생성");
    println!("cargo bench    : 벤치마크 실행");
    println!("cargo tree     : 의존성 트리 출력");
}
```

---

## 11. 실전: Cargo.toml 작성

<div class="info-box">

**완전한 Cargo.toml 예시**

```toml
[package]
name = "web-server"
version = "0.2.0"
edition = "2021"
rust-version = "1.70"
authors = ["홍길동 <hong@example.com>"]
description = "고성능 웹 서버"
license = "MIT OR Apache-2.0"
repository = "https://github.com/hong/web-server"
keywords = ["web", "server", "async"]
categories = ["web-programming::http-server"]

[dependencies]
tokio = { version = "1", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tracing = "0.1"
anyhow = "1.0"
reqwest = { version = "0.11", optional = true }

[dev-dependencies]
tokio-test = "0.4"
criterion = { version = "0.5", features = ["html_reports"] }

[build-dependencies]
built = "0.7"

[features]
default = ["logging"]
logging = ["tracing"]
proxy = ["reqwest"]
full = ["logging", "proxy"]

[profile.release]
opt-level = 3
lto = "thin"
strip = true

[[bench]]
name = "benchmark"
harness = false
```

</div>

---

## 연습문제

<div class="exercise-box">

**연습 1**: 다음 질문에 답하세요.

1. `cargo build`와 `cargo build --release`의 차이는 무엇인가요?
2. `dependencies`와 `dev-dependencies`의 차이는?
3. 버전 `"1.2.3"`이 의미하는 SemVer 범위는?

</div>

<div class="exercise-box">

**연습 2**: 조건부 컴파일을 활용하여 OS별로 다른 메시지를 출력하세요.

```rust,editable
fn get_config_path() -> String {
    // TODO: OS에 따라 다른 설정 파일 경로 반환
    // Linux: ~/.config/myapp/config.toml
    // macOS: ~/Library/Application Support/myapp/config.toml
    // Windows: C:\Users\<user>\AppData\Roaming\myapp\config.toml
    if cfg!(target_os = "linux") {
        "~/.config/myapp/config.toml".to_string()
    } else if cfg!(target_os = "macos") {
        todo!()
    } else if cfg!(target_os = "windows") {
        todo!()
    } else {
        todo!()
    }
}

fn main() {
    println!("설정 파일 경로: {}", get_config_path());
}
```

</div>

---

## 퀴즈

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q1**: `Cargo.lock`은 언제 Git에 커밋해야 하나요?

<div class="quiz-answer">

**바이너리 프로젝트**(애플리케이션)에서는 `Cargo.lock`을 커밋합니다. 재현 가능한 빌드를 보장하기 위해서입니다. **라이브러리 프로젝트**에서는 `.gitignore`에 추가하여 커밋하지 않습니다. 라이브러리 사용자가 자신의 의존성 해결을 결정해야 하기 때문입니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q2**: 피처 플래그가 "추가적(additive)"이어야 한다는 것은 무슨 의미인가요?

<div class="quiz-answer">

피처를 활성화하면 코드가 **추가**되는 방식으로 설계해야 합니다. 피처 A와 B가 동시에 활성화되어도 충돌 없이 작동해야 합니다. 피처로 기능을 **제거**하거나 **대체**하는 설계는 피해야 합니다. 의존성 트리에서 여러 크레이트가 같은 크레이트의 다른 피처를 요구하면, Cargo가 모든 피처를 **합집합**으로 활성화하기 때문입니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q3**: `#[cfg()]`와 `cfg!()`의 차이는?

<div class="quiz-answer">

`#[cfg(조건)]`은 **속성**으로, 조건이 거짓이면 해당 항목(함수, 구조체 등)이 **컴파일에서 완전히 제외**됩니다. `cfg!(조건)`은 **매크로**로, `true` 또는 `false` 불리언 값으로 평가되어 `if` 문 등에서 사용할 수 있습니다. 두 경우 모두 컴파일 타임에 결정됩니다.

</div>
</div>

---

<div class="summary-box">

**요약**

- `Cargo.toml`에서 `dependencies`, `dev-dependencies`, `build-dependencies`를 구분합니다.
- **SemVer**: `"1.2.3"`은 `>=1.2.3, <2.0.0` 범위를 의미합니다.
- **피처 플래그**로 선택적 기능을 컴파일 타임에 활성화/비활성화합니다.
- **빌드 프로파일**: `dev`(빠른 컴파일), `release`(최대 최적화)로 설정을 분리합니다.
- **빌드 스크립트**(build.rs)로 컴파일 전 코드 생성, 라이브러리 링크 등을 수행합니다.
- **조건부 컴파일**: `#[cfg()]`와 `cfg!()`로 플랫폼/피처별 코드를 제어합니다.
- `cargo-watch`, `cargo-expand`, `cargo-audit` 등의 서브커맨드로 개발 생산성을 높입니다.

</div>
