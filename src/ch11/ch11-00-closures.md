# 클로저

<span class="badge-intermediate">중급</span>

클로저(Closure)는 주변 환경의 변수를 **캡처**할 수 있는 익명 함수입니다. Rust의 클로저는 소유권 시스템과 결합되어 `Fn`, `FnMut`, `FnOnce` 세 가지 트레이트로 분류됩니다.

---

## 1. 클로저 기본 문법

```rust,editable
fn main() {
    // 기본 클로저
    let add = |a, b| a + b;
    println!("3 + 5 = {}", add(3, 5));

    // 타입 명시
    let multiply = |a: i32, b: i32| -> i32 { a * b };
    println!("4 * 6 = {}", multiply(4, 6));

    // 여러 줄 클로저
    let classify = |n: i32| {
        if n > 0 {
            "양수"
        } else if n < 0 {
            "음수"
        } else {
            "영"
        }
    };
    println!("7은 {}", classify(7));
    println!("-3은 {}", classify(-3));
    println!("0은 {}", classify(0));

    // 매개변수 없는 클로저
    let greet = || println!("안녕하세요!");
    greet();
}
```

---

## 2. 캡처 모드

클로저는 환경 변수를 세 가지 방식으로 캡처합니다.

```rust,editable
fn main() {
    // 1. 불변 참조로 캡처 (Fn)
    let name = String::from("Rust");
    let greet = || println!("안녕, {}!", name);
    greet();
    greet(); // 여러 번 호출 가능
    println!("원본 사용 가능: {}", name); // 원본도 사용 가능

    // 2. 가변 참조로 캡처 (FnMut)
    let mut count = 0;
    let mut increment = || {
        count += 1;
        println!("카운트: {}", count);
    };
    increment();
    increment();
    // println!("{}", count); // increment가 살아있는 동안 접근 불가
    drop(increment); // 클로저 해제
    println!("최종 카운트: {}", count);

    // 3. 소유권 이동 (FnOnce)
    let data = vec![1, 2, 3];
    let consume = || {
        println!("데이터 소비: {:?}", data);
        drop(data); // 소유권 가져옴 -> 소비
    };
    consume();
    // consume(); // 에러! 이미 소비됨
    // println!("{:?}", data); // 에러! 소유권 이동됨
}
```

### move 키워드

```rust,editable
use std::thread;

fn main() {
    let message = String::from("안녕하세요");

    // move: 캡처된 변수의 소유권을 클로저로 강제 이동
    let handle = thread::spawn(move || {
        println!("스레드에서: {}", message);
    });

    // println!("{}", message); // 에러! 소유권 이동됨
    handle.join().unwrap();

    // move로 Copy 타입 캡처 시 복사됨
    let x = 42;
    let closure = move || println!("x = {}", x);
    closure();
    println!("원본 x = {}", x); // Copy 타입이므로 여전히 사용 가능
}
```

<div class="info-box">

**캡처 모드 결정 기준**: 컴파일러가 클로저 본문을 분석하여 **가장 제한적이지 않은** 캡처 모드를 자동 선택합니다.

- 읽기만 하면 → 불변 참조 (`Fn`)
- 수정하면 → 가변 참조 (`FnMut`)
- 소유권이 필요하면 → 이동 (`FnOnce`)

</div>

---

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

---

## 6. 실전 패턴: 클로저 활용

```rust,editable
fn main() {
    // 정렬 커스터마이즈
    let mut names = vec!["Charlie", "Alice", "Bob", "Dave"];
    names.sort_by(|a, b| a.len().cmp(&b.len()));
    println!("길이순 정렬: {:?}", names);

    // 지연 초기화
    let expensive_value = || {
        println!("비싼 계산 수행 중...");
        42
    };

    let need_value = true;
    if need_value {
        println!("값: {}", expensive_value());
    }

    // Option과 클로저
    let config: Option<String> = None;
    let value = config.unwrap_or_else(|| "기본값".to_string());
    println!("설정: {}", value);

    // 필터링 체인
    let numbers: Vec<i32> = (1..=20).collect();
    let result: Vec<i32> = numbers
        .iter()
        .filter(|&&x| x % 2 == 0)
        .filter(|&&x| x > 10)
        .copied()
        .collect();
    println!("짝수이고 10보다 큰 수: {:?}", result);
}
```

---

## 연습문제

<div class="exercise-box">

**연습 1**: `make_validator` 함수를 작성하세요. 최소/최대 값을 받아 범위 검사 클로저를 반환합니다.

```rust,editable
fn make_validator(min: i32, max: i32) -> impl Fn(i32) -> bool {
    // TODO: min..=max 범위 안에 있는지 검사하는 클로저 반환
    todo!()
}

fn main() {
    let is_valid_age = make_validator(0, 150);
    let is_valid_score = make_validator(0, 100);

    println!("나이 25: {}", is_valid_age(25));     // true
    println!("나이 200: {}", is_valid_age(200));   // false
    println!("점수 85: {}", is_valid_score(85));   // true
    println!("점수 -5: {}", is_valid_score(-5));   // false
}
```

</div>

<div class="exercise-box">

**연습 2**: `apply_pipeline` 함수를 구현하세요. 여러 변환 함수를 순서대로 적용합니다.

```rust,editable
fn apply_pipeline(value: i32, transforms: &[Box<dyn Fn(i32) -> i32>]) -> i32 {
    // TODO: transforms의 각 함수를 순서대로 value에 적용
    todo!()
}

fn main() {
    let pipeline: Vec<Box<dyn Fn(i32) -> i32>> = vec![
        Box::new(|x| x + 1),      // 1 추가
        Box::new(|x| x * 3),      // 3 곱하기
        Box::new(|x| x - 2),      // 2 빼기
    ];

    // (5 + 1) * 3 - 2 = 16
    println!("결과: {}", apply_pipeline(5, &pipeline));
}
```

</div>

---

## 퀴즈

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q1**: `Fn`, `FnMut`, `FnOnce`의 차이점은 무엇인가요?

<div class="quiz-answer">

- **`FnOnce`**: 캡처한 변수의 소유권을 가져가며, **한 번만** 호출 가능합니다.
- **`FnMut`**: 캡처한 변수를 **가변 참조**로 빌리며, 여러 번 호출 가능합니다.
- **`Fn`**: 캡처한 변수를 **불변 참조**로 빌리며, 여러 번 호출 가능합니다.

계층: `Fn` ⊂ `FnMut` ⊂ `FnOnce` (모든 `Fn`은 `FnMut`이기도 하고 `FnOnce`이기도 합니다).

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q2**: `move` 키워드는 언제 필요한가요?

<div class="quiz-answer">

`move`는 클로저가 캡처하는 변수의 **소유권을 강제로 이동**시킬 때 사용합니다. 주로 (1) 클로저를 다른 스레드로 전달할 때, (2) 클로저가 원본 변수보다 오래 살아야 할 때 필요합니다. `Copy` 타입은 이동 대신 복사됩니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q3**: 클로저를 반환할 때 `impl Fn`과 `Box<dyn Fn>`의 차이는?

<div class="quiz-answer">

`impl Fn`은 **정적 디스패치**로 성능이 좋지만, 함수 내에서 **단일 타입**의 클로저만 반환할 수 있습니다. `Box<dyn Fn>`은 **동적 디스패치**로 약간의 런타임 비용이 있지만, 조건에 따라 **다른 타입**의 클로저를 반환할 수 있습니다.

</div>
</div>

---

<div class="summary-box">

**요약**

- 클로저는 `|매개변수| 본문` 문법으로 정의하며, 주변 환경을 캡처합니다.
- 캡처 모드: 불변 참조(`Fn`), 가변 참조(`FnMut`), 소유권 이동(`FnOnce`).
- `move` 키워드로 소유권 이동을 강제할 수 있습니다.
- 클로저는 매개변수와 반환값으로 사용하여 고차 함수 패턴을 구현합니다.
- 정적 디스패치(`impl Fn`)는 성능 우선, 동적 디스패치(`Box<dyn Fn>`)는 유연성 우선.

</div>
