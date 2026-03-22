# 표준 매크로와 고급 패턴

## 3. 유용한 표준 매크로들

```rust,editable
fn main() {
    // === println! / eprintln! — 출력 ===
    println!("표준 출력: {}", 42);
    eprintln!("표준 에러: {}", "에러 메시지");

    // === dbg! — 디버그 출력 (파일명, 줄 번호 포함) ===
    let x = 5;
    let y = dbg!(x * 2) + 1;  // [src/main.rs:3] x * 2 = 10
    println!("y = {}", y);

    // === vec! — 벡터 생성 ===
    let v = vec![1, 2, 3];
    let zeros = vec![0; 10];  // 0이 10개
    println!("{:?}, {:?}", v, zeros);

    // === format! — 문자열 포맷팅 ===
    let s = format!("{}+{} = {}", 2, 3, 2 + 3);
    println!("{}", s);

    // === todo! — 미구현 표시 (실행 시 패닉) ===
    // fn not_yet() -> i32 { todo!("나중에 구현") }

    // === unimplemented! — 구현하지 않을 것 ===
    // fn never() { unimplemented!() }

    // === unreachable! — 도달 불가능한 코드 ===
    let x = 1;
    match x {
        1 => println!("하나"),
        2 => println!("둘"),
        _ => unreachable!("1 또는 2만 가능"),
    }

    // === cfg! — 조건부 컴파일 검사 (bool 반환) ===
    if cfg!(target_os = "linux") {
        println!("리눅스에서 실행 중");
    } else if cfg!(target_os = "windows") {
        println!("윈도우에서 실행 중");
    }

    // === include_str! / include_bytes! — 파일 포함 ===
    // let config = include_str!("config.toml");
    // let icon = include_bytes!("icon.png");

    // === concat! — 문자열 연결 (컴파일 타임) ===
    let s = concat!("hello", " ", "world");
    println!("{}", s);

    // === env! — 환경변수 (컴파일 타임) ===
    let version = env!("CARGO_PKG_VERSION");
    println!("패키지 버전: {}", version);

    // === stringify! — 코드를 문자열로 ===
    println!("{}", stringify!(1 + 2 + 3));  // "1 + 2 + 3"
}
```

---

## 4. 고급 매크로 패턴

### 재귀 매크로

```rust,editable
// 재귀적 카운팅 매크로
macro_rules! count {
    () => { 0usize };
    ($head:tt $($tail:tt)*) => { 1usize + count!($($tail)*) };
}

// 재귀적 max 매크로
macro_rules! max {
    ($x:expr) => { $x };
    ($x:expr, $($rest:expr),+) => {
        {
            let other = max!($($rest),+);
            if $x > other { $x } else { other }
        }
    };
}

// 재귀적 min 매크로
macro_rules! min {
    ($x:expr) => { $x };
    ($x:expr, $($rest:expr),+) => {
        {
            let other = min!($($rest),+);
            if $x < other { $x } else { other }
        }
    };
}

fn main() {
    println!("토큰 개수: {}", count!(a b c d e));  // 5

    println!("max: {}", max!(3, 7, 2, 9, 4));  // 9
    println!("min: {}", min!(3, 7, 2, 9, 4));  // 2
}
```

### 테스트 생성 매크로

```rust,editable
macro_rules! generate_tests {
    ( $func:ident : $( ($input:expr, $expected:expr) ),+ $(,)? ) => {
        #[cfg(test)]
        mod tests {
            use super::*;

            $(
                paste::paste! {
                    // 실제로는 paste 크레이트가 필요합니다
                }
            )+
        }

        // 간단한 실행 시 검증
        fn verify() {
            $(
                let result = $func($input);
                assert_eq!(result, $expected,
                    "{}({}) = {} (기대값: {})",
                    stringify!($func), stringify!($input),
                    result, $expected
                );
                println!("✓ {}({}) = {}", stringify!($func), $input, result);
            )+
        }
    };
}

fn double(x: i32) -> i32 {
    x * 2
}

generate_tests! {
    double:
    (0, 0),
    (1, 2),
    (5, 10),
    (-3, -6),
}

fn main() {
    verify();
    println!("모든 테스트 통과!");
}
```

---

## 매크로 vs 제네릭 vs 트레이트

| 특성 | 매크로 | 제네릭 | 트레이트 |
|---|---|---|---|
| 동작 시점 | 컴파일 전 (확장) | 컴파일 (단형화) | 런타임 (동적 디스패치 가능) |
| 타입 검사 | 확장 후 | 확장 시 | 정의 시 |
| 가변 인자 | 가능 | 불가 | 불가 |
| 새 문법 | 가능 | 불가 | 불가 |
| 에러 메시지 | 복잡할 수 있음 | 양호 | 양호 |
| 사용 시기 | 코드 생성, DSL | 타입 추상화 | 동작 추상화 |
