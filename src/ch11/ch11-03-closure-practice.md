# 실전 패턴과 연습문제

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
