# 성능과 최적화 <span class="badge-advanced">고급</span>

Rust의 가장 큰 강점 중 하나는 **제로 비용 추상화(zero-cost abstraction)**입니다. 높은 수준의 추상화를 사용하면서도 수동으로 최적화한 코드와 동등한 성능을 얻을 수 있습니다.

## 제로 비용 추상화

> "사용하지 않는 것에 대해 비용을 지불하지 않는다. 사용하는 것에 대해 더 나은 코드를 손으로 작성할 수 없다." — Bjarne Stroustrup (C++), Rust가 채택한 원칙

```rust,editable
fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // 반복자 체이닝 — 루프와 동일한 성능으로 컴파일됨
    let sum: i32 = numbers.iter()
        .filter(|&&x| x % 2 == 0)
        .map(|&x| x * x)
        .sum();

    println!("짝수의 제곱 합: {}", sum); // 4 + 16 + 36 + 64 + 100 = 220
}
```

<div class="info-box">
위 반복자 코드는 컴파일러가 아래와 동일한 기계어로 최적화합니다:

```rust,editable
fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let mut sum = 0;
    for &x in &numbers {
        if x % 2 == 0 {
            sum += x * x;
        }
    }
    println!("짝수의 제곱 합: {}", sum);
}
```
</div>

## 컴파일러 최적화와 릴리스 빌드

### Debug vs Release

```bash
cargo build          # Debug: 빠른 컴파일, 느린 실행
cargo build --release  # Release: 느린 컴파일, 빠른 실행
```

| 항목 | Debug | Release |
|------|-------|---------|
| 최적화 레벨 | 0 | 3 |
| 컴파일 속도 | 빠름 | 느림 |
| 실행 속도 | 느림 | 빠름 (10~100배) |
| 바이너리 크기 | 큼 | 작음 |
| 디버그 정보 | 포함 | 미포함 |

### Cargo.toml 최적화 설정

```toml
[profile.release]
opt-level = 3       # 최적화 레벨 (0~3, "s", "z")
lto = true           # Link-Time Optimization
codegen-units = 1    # 단일 코드젠 유닛 (느리지만 더 최적화)
panic = "abort"      # 패닉 시 되감기 대신 즉시 종료 (바이너리 크기 감소)
strip = true         # 디버그 심볼 제거
```

<div class="tip-box">
<code>opt-level = "s"</code>는 크기 최적화, <code>"z"</code>는 더 공격적인 크기 최적화입니다. 임베디드 환경에서 유용합니다.
</div>

## 벤치마킹 (`criterion`)

성능 측정 없이 최적화하지 마세요. `criterion`은 Rust의 표준 벤치마킹 크레이트입니다.

### 설정

```toml
# Cargo.toml
[dev-dependencies]
criterion = { version = "0.5", features = ["html_reports"] }

[[bench]]
name = "my_benchmark"
harness = false
```

### 벤치마크 작성

```rust,editable
// benches/my_benchmark.rs 예시 (실제 파일에서 실행)
fn fibonacci_recursive(n: u64) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        n => fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2),
    }
}

fn fibonacci_iterative(n: u64) -> u64 {
    let mut a = 0u64;
    let mut b = 1u64;
    for _ in 0..n {
        let temp = b;
        b = a + b;
        a = temp;
    }
    a
}

fn main() {
    // 간단 비교
    use std::time::Instant;

    let start = Instant::now();
    let result = fibonacci_recursive(30);
    let recursive_time = start.elapsed();

    let start = Instant::now();
    let result2 = fibonacci_iterative(30);
    let iterative_time = start.elapsed();

    println!("재귀: {} ({:?})", result, recursive_time);
    println!("반복: {} ({:?})", result2, iterative_time);
}
```

```bash
cargo bench  # criterion 벤치마크 실행
```

## 프로파일링 도구

### flamegraph

```bash
cargo install flamegraph
cargo flamegraph --release  # SVG 플레임 그래프 생성
```

```mermaid
graph TD
    A["main()"] --> B["process_data() — 60%"]
    A --> C["read_file() — 25%"]
    A --> D["write_output() — 15%"]
    B --> E["parse() — 40%"]
    B --> F["transform() — 20%"]
    E --> G["regex_match() — 35%"]
    E --> H["tokenize() — 5%"]
    style G fill:#ff6b6b,color:#fff
    style E fill:#ffa94d,color:#000
    style B fill:#ffd43b,color:#000
```

<div class="tip-box">
플레임 그래프에서 넓은 블록이 가장 시간을 많이 쓰는 함수입니다. 여기를 먼저 최적화하세요.
</div>

## 메모리 사용 최적화

### 구조체 필드 순서

Rust 컴파일러가 패딩을 최적화하지만, `#[repr(C)]`를 쓸 때는 필드 순서가 중요합니다.

```rust,editable
use std::mem;

// 패딩으로 인해 크기가 커질 수 있음
#[repr(C)]
struct Bad {
    a: u8,   // 1바이트 + 7바이트 패딩
    b: u64,  // 8바이트
    c: u8,   // 1바이트 + 7바이트 패딩
}

#[repr(C)]
struct Good {
    b: u64,  // 8바이트
    a: u8,   // 1바이트
    c: u8,   // 1바이트 + 6바이트 패딩
}

fn main() {
    println!("Bad 크기: {} 바이트", mem::size_of::<Bad>());   // 24
    println!("Good 크기: {} 바이트", mem::size_of::<Good>()); // 16

    // Rust 기본 레이아웃은 자동 최적화
    struct Auto {
        a: u8,
        b: u64,
        c: u8,
    }
    println!("Auto 크기: {} 바이트", mem::size_of::<Auto>()); // 16 (자동 재배치)
}
```

### Box로 큰 구조체 힙에 배치

```rust,editable
fn main() {
    // 스택에 큰 배열 → 스택 오버플로우 위험
    // let big = [0u8; 10_000_000];

    // 힙에 배치
    let big = vec![0u8; 10_000_000];
    println!("크기: {} 바이트", big.len());
}
```

## `Cow<T>` — 불필요한 복사 방지

`Cow` (Clone on Write)는 빌림으로 시작하여 수정이 필요할 때만 복제합니다.

```rust,editable
use std::borrow::Cow;

fn process_text(input: &str) -> Cow<str> {
    if input.contains("bad") {
        // 수정이 필요한 경우에만 새 String 생성
        Cow::Owned(input.replace("bad", "good"))
    } else {
        // 수정 불필요 → 복사 없이 참조 반환
        Cow::Borrowed(input)
    }
}

fn main() {
    let text1 = "this is fine";
    let text2 = "this is bad";

    let result1 = process_text(text1);
    let result2 = process_text(text2);

    println!("{}", result1); // 복사 없음
    println!("{}", result2); // "this is good" (복사 발생)

    // Cow는 &str처럼 사용 가능
    println!("길이: {}", result1.len());
}
```

```mermaid
graph TD
    A["process_text(input)"] --> B{"수정 필요?"}
    B -->|No| C["Cow::Borrowed(&str)"]
    B -->|Yes| D["Cow::Owned(String)"]
    C --> E["복사 없음 ✅"]
    D --> F["필요한 경우만 복사"]
    style C fill:#2ecc71,color:#fff
    style E fill:#2ecc71,color:#fff
```

## 일반적인 성능 팁

### 1. 적절한 컬렉션 선택

| 작업 | 최적 컬렉션 |
|------|-------------|
| 순차 접근 | `Vec<T>` |
| 키-값 조회 | `HashMap<K, V>` |
| 정렬된 키 | `BTreeMap<K, V>` |
| 중복 제거 | `HashSet<T>` |
| FIFO 큐 | `VecDeque<T>` |

### 2. 미리 용량 확보

```rust,editable
fn main() {
    // ❌ 느림: 여러 번 재할당
    let mut v1 = Vec::new();
    for i in 0..1000 {
        v1.push(i);
    }

    // ✅ 빠름: 한 번만 할당
    let mut v2 = Vec::with_capacity(1000);
    for i in 0..1000 {
        v2.push(i);
    }

    println!("v1 용량: {}, v2 용량: {}", v1.capacity(), v2.capacity());
}
```

### 3. 문자열 연결

```rust,editable
fn main() {
    let parts = vec!["hello", "world", "rust", "is", "fast"];

    // ❌ 느림: 매번 새 String 생성
    let mut slow = String::new();
    for part in &parts {
        slow = slow + " " + part;
    }

    // ✅ 빠름: 제자리 수정
    let mut fast = String::with_capacity(100);
    for part in &parts {
        if !fast.is_empty() {
            fast.push(' ');
        }
        fast.push_str(part);
    }

    // ✅ 가장 간단: join 사용
    let best = parts.join(" ");

    println!("{}", best);
}
```

### 4. 불필요한 clone() 제거

```rust,editable
fn main() {
    let data = vec![1, 2, 3, 4, 5];

    // ❌ 불필요한 clone
    // let sum: i32 = data.clone().iter().sum();

    // ✅ 참조로 충분
    let sum: i32 = data.iter().sum();
    println!("합: {}", sum);
    println!("데이터: {:?}", data); // 여전히 사용 가능
}
```

## SIMD 기초

SIMD (Single Instruction, Multiple Data)는 하나의 명령으로 여러 데이터를 동시 처리합니다.

```rust,editable
fn main() {
    // 일반적으로는 컴파일러가 자동 벡터화를 수행
    // --release 빌드에서 SIMD 명령을 자동 생성

    let a = [1.0f32; 1000];
    let b = [2.0f32; 1000];
    let mut c = [0.0f32; 1000];

    // 컴파일러가 이 루프를 SIMD로 자동 최적화할 수 있음
    for i in 0..1000 {
        c[i] = a[i] + b[i];
    }

    println!("c[0] = {}, c[999] = {}", c[0], c[999]);
}
```

<div class="info-box">
대부분의 경우 컴파일러의 자동 벡터화로 충분합니다. 수동 SIMD는 <code>std::arch</code> 모듈이나 <code>packed_simd</code> 크레이트를 사용하며, 매우 성능이 중요한 경우에만 필요합니다.
</div>

---

<div class="exercise-box">
<strong>연습문제 1:</strong> 아래 두 함수의 성능 차이를 <code>std::time::Instant</code>로 측정해보세요.

```rust,editable
fn count_with_loop(data: &[i32]) -> usize {
    let mut count = 0;
    for &x in data {
        if x > 50 {
            count += 1;
        }
    }
    count
}

fn count_with_iter(data: &[i32]) -> usize {
    data.iter().filter(|&&x| x > 50).count()
}

fn main() {
    let data: Vec<i32> = (0..1_000_000).collect();

    let start = std::time::Instant::now();
    let c1 = count_with_loop(&data);
    let t1 = start.elapsed();

    let start = std::time::Instant::now();
    let c2 = count_with_iter(&data);
    let t2 = start.elapsed();

    println!("루프: {} ({:?})", c1, t1);
    println!("반복자: {} ({:?})", c2, t2);
}
```
</div>

<div class="exercise-box">
<strong>연습문제 2:</strong> <code>Cow</code>를 사용하여 입력 문자열이 이미 소문자이면 복사하지 않고, 대문자가 포함되어 있을 때만 소문자로 변환하는 함수를 작성하세요.

```rust,editable
use std::borrow::Cow;

fn to_lowercase_cow(input: &str) -> Cow<str> {
    // TODO: 이미 소문자면 Cow::Borrowed, 아니면 Cow::Owned
    todo!()
}

fn main() {
    let a = to_lowercase_cow("already lowercase");
    let b = to_lowercase_cow("Has UPPERCASE");
    println!("{}", a);
    println!("{}", b);
}
```
</div>

---

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">
<strong>Q1:</strong> 제로 비용 추상화란 무엇인가요?
<div class="quiz-answer">
<strong>A:</strong> 추상화를 사용해도 수동으로 최적화한 저수준 코드와 동일한 성능을 보장하는 설계 원칙입니다. Rust의 반복자, 제네릭, 트레이트 등이 대표적인 예입니다. 런타임 비용 없이 컴파일 타임에 모두 해결됩니다.
</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">
<strong>Q2:</strong> <code>Vec::with_capacity(n)</code>을 사용하면 왜 빨라지나요?
<div class="quiz-answer">
<strong>A:</strong> <code>Vec</code>은 용량이 부족하면 새로운 더 큰 메모리를 할당하고 기존 데이터를 복사합니다. <code>with_capacity</code>로 미리 충분한 크기를 할당하면 이런 재할당과 복사가 발생하지 않습니다.
</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">
<strong>Q3:</strong> <code>Cow&lt;str&gt;</code>은 언제 사용하면 좋나요?
<div class="quiz-answer">
<strong>A:</strong> 입력 데이터를 대부분의 경우 수정 없이 그대로 사용하고, 일부 경우에만 수정이 필요할 때 적합합니다. 불필요한 <code>String</code> 할당과 복사를 피하면서도 필요할 때는 소유된 데이터를 생성할 수 있습니다.
</div>
</div>

---

<div class="summary-box">
<h3>핵심 정리</h3>

- **제로 비용 추상화**: 반복자, 제네릭 등은 수동 최적화와 동일 성능
- **릴리스 빌드**: `--release` 플래그로 10~100배 성능 향상
- **벤치마킹**: `criterion`으로 정확한 성능 측정 후 최적화
- **프로파일링**: `flamegraph`로 병목 지점 찾기
- **Cow<T>**: 필요한 경우에만 복사하여 불필요한 할당 방지
- **실용 팁**: `with_capacity`, 적절한 컬렉션 선택, 불필요한 `clone()` 제거
- **측정 먼저, 최적화 나중에**: 추측이 아닌 데이터 기반 최적화
</div>
