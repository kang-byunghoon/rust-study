# 의존성 관리와 피처 플래그

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
