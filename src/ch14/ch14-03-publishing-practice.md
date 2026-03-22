# 배포, 도구, 실전 연습

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
