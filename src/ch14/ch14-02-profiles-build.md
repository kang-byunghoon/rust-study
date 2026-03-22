# 빌드 프로파일과 조건부 컴파일

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
