# 소비자와 커스텀 반복자

## 4. 소비자 (Consumers)

소비자는 반복자를 **소비**하여 최종 값을 생성합니다. 소비자를 호출하면 반복자의 `next()`가 반복 호출됩니다.

```rust,editable
fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // collect: 반복자를 컬렉션으로 수집
    let doubled: Vec<i32> = numbers.iter().map(|&x| x * 2).collect();
    println!("collect: {:?}", doubled);

    // sum: 합계
    let total: i32 = numbers.iter().sum();
    println!("sum: {}", total);

    // product: 곱
    let factorial: u64 = (1..=10).product();
    println!("product (10!): {}", factorial);

    // count: 개수
    let even_count = numbers.iter().filter(|&&x| x % 2 == 0).count();
    println!("count (짝수): {}", even_count);

    // any, all: 조건 검사
    let has_negative = numbers.iter().any(|&x| x < 0);
    let all_positive = numbers.iter().all(|&x| x > 0);
    println!("any(음수): {}, all(양수): {}", has_negative, all_positive);

    // find: 조건에 맞는 첫 요소
    let first_even = numbers.iter().find(|&&x| x % 2 == 0);
    println!("find (첫 짝수): {:?}", first_even);

    // position: 조건에 맞는 첫 인덱스
    let pos = numbers.iter().position(|&x| x == 5);
    println!("position (5): {:?}", pos);

    // min, max
    println!("min: {:?}, max: {:?}", numbers.iter().min(), numbers.iter().max());
}
```

---

## 5. fold와 reduce

```rust,editable
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];

    // fold: 초깃값과 함께 누적
    let sum = numbers.iter().fold(0, |acc, &x| acc + x);
    println!("fold (합): {}", sum);

    let product = numbers.iter().fold(1, |acc, &x| acc * x);
    println!("fold (곱): {}", product);

    // fold로 문자열 만들기
    let csv = numbers.iter().fold(String::new(), |mut acc, &x| {
        if !acc.is_empty() {
            acc.push_str(", ");
        }
        acc.push_str(&x.to_string());
        acc
    });
    println!("fold (CSV): {}", csv);

    // reduce: 첫 요소를 초깃값으로 사용
    let max = numbers.iter().copied().reduce(|a, b| if a > b { a } else { b });
    println!("reduce (최대): {:?}", max);

    // scan: fold의 중간 결과를 반복자로
    let running_sum: Vec<i32> = numbers.iter().scan(0, |state, &x| {
        *state += x;
        Some(*state)
    }).collect();
    println!("scan (누적합): {:?}", running_sum);
}
```

---

## 6. collect의 다양한 활용

```rust,editable
use std::collections::{HashMap, HashSet};

fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 3, 2, 1];

    // Vec으로 수집
    let doubled: Vec<i32> = numbers.iter().map(|&x| x * 2).collect();
    println!("Vec: {:?}", doubled);

    // HashSet으로 수집 (중복 제거)
    let unique: HashSet<&i32> = numbers.iter().collect();
    println!("HashSet: {:?}", unique);

    // HashMap으로 수집
    let names = vec!["Alice", "Bob", "Charlie"];
    let scores = vec![95, 87, 92];
    let score_map: HashMap<&&str, &i32> = names.iter().zip(scores.iter()).collect();
    println!("HashMap: {:?}", score_map);

    // String으로 수집
    let chars = vec!['H', 'e', 'l', 'l', 'o'];
    let word: String = chars.iter().collect();
    println!("String: {}", word);

    // Result의 Vec을 Vec의 Result로 변환
    let results: Vec<Result<i32, &str>> = vec![Ok(1), Ok(2), Ok(3)];
    let collected: Result<Vec<i32>, &str> = results.into_iter().collect();
    println!("Result<Vec>: {:?}", collected);

    let results_with_err: Vec<Result<i32, &str>> = vec![Ok(1), Err("오류!"), Ok(3)];
    let collected_err: Result<Vec<i32>, &str> = results_with_err.into_iter().collect();
    println!("Result<Vec> with error: {:?}", collected_err);
}
```

---

## 7. 커스텀 반복자 구현

```rust,editable
// 피보나치 수열 반복자
struct Fibonacci {
    a: u64,
    b: u64,
}

impl Fibonacci {
    fn new() -> Self {
        Fibonacci { a: 0, b: 1 }
    }
}

impl Iterator for Fibonacci {
    type Item = u64;

    fn next(&mut self) -> Option<Self::Item> {
        let result = self.a;
        let new_b = self.a + self.b;
        self.a = self.b;
        self.b = new_b;
        Some(result)  // 무한 반복자
    }
}

// 범위 반복자
struct Range {
    current: i32,
    end: i32,
    step: i32,
}

impl Range {
    fn new(start: i32, end: i32, step: i32) -> Self {
        Range { current: start, end, step }
    }
}

impl Iterator for Range {
    type Item = i32;

    fn next(&mut self) -> Option<Self::Item> {
        if self.current < self.end {
            let result = self.current;
            self.current += self.step;
            Some(result)
        } else {
            None
        }
    }
}

fn main() {
    // 피보나치 처음 10개
    let fibs: Vec<u64> = Fibonacci::new().take(10).collect();
    println!("피보나치: {:?}", fibs);

    // 피보나치에서 100 이하인 짝수의 합
    let sum: u64 = Fibonacci::new()
        .take_while(|&x| x <= 100)
        .filter(|x| x % 2 == 0)
        .sum();
    println!("100 이하 짝수 피보나치 합: {}", sum);

    // 커스텀 Range
    let stepped: Vec<i32> = Range::new(0, 20, 3).collect();
    println!("Range(0, 20, 3): {:?}", stepped);
}
```

---

## 제로 비용 추상화

<div class="info-box">

**제로 비용 추상화(Zero-Cost Abstraction)**

Rust의 반복자는 제로 비용 추상화입니다. 반복자 체이닝은 컴파일 시 수동 루프와 동일한 기계 코드로 최적화됩니다.

```rust
// 이 두 코드는 동일한 성능을 가집니다:

// 반복자 스타일
let sum: i32 = (0..1000).filter(|x| x % 2 == 0).map(|x| x * x).sum();

// 수동 루프 스타일
let mut sum = 0;
for i in 0..1000 {
    if i % 2 == 0 {
        sum += i * i;
    }
}
```

컴파일러가 반복자 체이닝을 **인라인**하고 **루프 퓨전**을 적용하여, 중간 컬렉션 없이 단일 루프로 변환합니다.

</div>
