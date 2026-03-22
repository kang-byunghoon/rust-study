# Fn 트레이트와 클로저 활용

## 3. Fn, FnMut, FnOnce 트레이트

```rust,editable
// Fn: 불변 참조로 캡처, 여러 번 호출 가능
fn apply_fn<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {
    f(x)
}

// FnMut: 가변 참조로 캡처, 여러 번 호출 가능
fn apply_twice<F: FnMut()>(mut f: F) {
    f();
    f();
}

// FnOnce: 소유권 이동, 한 번만 호출 가능
fn consume_and_run<F: FnOnce() -> String>(f: F) -> String {
    f()
}

fn main() {
    // Fn 예제
    let double = |x| x * 2;
    println!("double(5) = {}", apply_fn(double, 5));

    // FnMut 예제
    let mut total = 0;
    apply_twice(|| {
        total += 10;
        println!("total = {}", total);
    });

    // FnOnce 예제
    let name = String::from("Rust");
    let result = consume_and_run(|| {
        format!("안녕하세요, {}!", name)
        // name의 소유권이 이동됨
    });
    println!("{}", result);
}
```

<div class="tip-box">

**트레이트 계층**:
- `FnOnce` ← 모든 클로저가 구현
- `FnMut: FnOnce` ← 여러 번 호출 가능한 클로저
- `Fn: FnMut` ← 환경을 변경하지 않는 클로저

매개변수 타입으로는 가능한 한 **가장 일반적인 트레이트**를 사용하세요.
`FnOnce` > `FnMut` > `Fn` 순으로 일반적입니다.

</div>

---

## 4. 클로저를 매개변수로 받기

```rust,editable
// 제네릭으로 받기 (정적 디스패치, 성능 좋음)
fn transform<F>(items: &[i32], f: F) -> Vec<i32>
where
    F: Fn(i32) -> i32,
{
    items.iter().map(|&x| f(x)).collect()
}

// 트레이트 객체로 받기 (동적 디스패치)
fn apply_operations(value: i32, ops: &[Box<dyn Fn(i32) -> i32>]) -> i32 {
    let mut result = value;
    for op in ops {
        result = op(result);
    }
    result
}

fn main() {
    let numbers = vec![1, 2, 3, 4, 5];

    let doubled = transform(&numbers, |x| x * 2);
    println!("두 배: {:?}", doubled);

    let squared = transform(&numbers, |x| x * x);
    println!("제곱: {:?}", squared);

    // 연산 체인
    let ops: Vec<Box<dyn Fn(i32) -> i32>> = vec![
        Box::new(|x| x + 10),
        Box::new(|x| x * 2),
        Box::new(|x| x - 5),
    ];
    println!("연산 결과: {}", apply_operations(5, &ops));
    // (5 + 10) = 15, * 2 = 30, - 5 = 25
}
```

---

## 5. 클로저를 반환값으로 사용

```rust,editable
// impl Fn으로 반환 (정적 디스패치)
fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

// Box<dyn Fn>으로 반환 (동적 디스패치)
fn make_multiplier(factor: i32) -> Box<dyn Fn(i32) -> i32> {
    Box::new(move |x| x * factor)
}

// 클로저 팩토리
fn make_greeting(language: &str) -> Box<dyn Fn(&str) -> String> {
    match language {
        "ko" => Box::new(|name| format!("안녕하세요, {}님!", name)),
        "en" => Box::new(|name| format!("Hello, {}!", name)),
        "ja" => Box::new(|name| format!("こんにちは、{}さん！", name)),
        _ => Box::new(|name| format!("Hi, {}!", name)),
    }
}

fn main() {
    let add5 = make_adder(5);
    println!("10 + 5 = {}", add5(10));

    let triple = make_multiplier(3);
    println!("7 * 3 = {}", triple(7));

    let greet_ko = make_greeting("ko");
    let greet_en = make_greeting("en");
    println!("{}", greet_ko("홍길동"));
    println!("{}", greet_en("Alice"));
}
```
