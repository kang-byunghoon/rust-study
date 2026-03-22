# 반복자

<span class="badge-intermediate">중급</span>

반복자(Iterator)는 Rust에서 컬렉션을 순회하는 핵심 추상화입니다. **지연 평가(lazy evaluation)**를 기반으로 하며, 체이닝을 통해 선언적이고 효율적인 데이터 처리를 가능하게 합니다.

---

## 1. Iterator 트레이트와 next()

```rust,editable
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];

    // iter()로 반복자 생성
    let mut iter = numbers.iter();

    // next()로 하나씩 꺼내기
    println!("{:?}", iter.next()); // Some(1)
    println!("{:?}", iter.next()); // Some(2)
    println!("{:?}", iter.next()); // Some(3)
    println!("{:?}", iter.next()); // Some(4)
    println!("{:?}", iter.next()); // Some(5)
    println!("{:?}", iter.next()); // None

    // for 루프는 내부적으로 반복자를 사용
    for n in &numbers {
        print!("{} ", n);
    }
    println!();
}
```

<div class="info-box">

**Iterator 트레이트 정의**:

```rust
trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
    // ... 수십 가지 기본 메서드 제공
}
```

`next()` 하나만 구현하면 `map`, `filter`, `collect` 등 모든 어댑터와 소비자를 무료로 사용할 수 있습니다.

</div>

---

## 2. iter(), iter_mut(), into_iter()

```rust,editable
fn main() {
    let mut names = vec![
        String::from("Alice"),
        String::from("Bob"),
        String::from("Charlie"),
    ];

    // iter(): 불변 참조 (&T)
    println!("== iter() ==");
    for name in names.iter() {
        println!("  {} (길이: {})", name, name.len());
    }

    // iter_mut(): 가변 참조 (&mut T)
    println!("== iter_mut() ==");
    for name in names.iter_mut() {
        name.push_str("!");
    }
    println!("  수정 후: {:?}", names);

    // into_iter(): 소유권 이동 (T)
    println!("== into_iter() ==");
    for name in names.into_iter() {
        println!("  소유: {}", name);
    }
    // println!("{:?}", names); // 에러! 소유권 이동됨
}
```

| 메서드 | 반환 타입 | 소유권 | 원본 사용 |
|--------|-----------|--------|-----------|
| `iter()` | `&T` | 빌림 | 가능 |
| `iter_mut()` | `&mut T` | 가변 빌림 | 가능 |
| `into_iter()` | `T` | 이동 | 불가 |

---

## 3. 어댑터 (Adapters) — 지연 평가

어댑터는 반복자를 다른 반복자로 변환합니다. **지연 평가**이므로 소비자가 호출될 때까지 실행되지 않습니다.

```rust,editable
fn main() {
    let numbers: Vec<i32> = (1..=10).collect();

    // map: 각 요소를 변환
    let doubled: Vec<i32> = numbers.iter().map(|&x| x * 2).collect();
    println!("map (두 배): {:?}", doubled);

    // filter: 조건에 맞는 요소만 선택
    let evens: Vec<&i32> = numbers.iter().filter(|&&x| x % 2 == 0).collect();
    println!("filter (짝수): {:?}", evens);

    // enumerate: 인덱스와 함께
    for (i, &val) in numbers.iter().enumerate().take(3) {
        println!("  [{}] = {}", i, val);
    }

    // zip: 두 반복자를 묶기
    let names = vec!["Alice", "Bob", "Charlie"];
    let scores = vec![95, 87, 92];
    let pairs: Vec<_> = names.iter().zip(scores.iter()).collect();
    println!("zip: {:?}", pairs);

    // chain: 두 반복자를 연결
    let first = vec![1, 2, 3];
    let second = vec![4, 5, 6];
    let combined: Vec<&i32> = first.iter().chain(second.iter()).collect();
    println!("chain: {:?}", combined);

    // flat_map: 각 요소를 반복자로 변환 후 평탄화
    let sentences = vec!["hello world", "foo bar baz"];
    let words: Vec<&str> = sentences.iter().flat_map(|s| s.split_whitespace()).collect();
    println!("flat_map: {:?}", words);

    // take, skip
    let first_three: Vec<&i32> = numbers.iter().take(3).collect();
    let skip_five: Vec<&i32> = numbers.iter().skip(5).collect();
    println!("take(3): {:?}", first_three);
    println!("skip(5): {:?}", skip_five);
}
```

---

## 4. 소비자 (Consumers)

소비자는 반복자를 소비하여 최종 결과를 생성합니다.

```rust,editable
fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // collect: 컬렉션으로 변환
    let evens: Vec<i32> = numbers.iter().filter(|&&x| x % 2 == 0).copied().collect();
    println!("collect: {:?}", evens);

    // sum: 합계
    let total: i32 = numbers.iter().sum();
    println!("sum: {}", total);

    // fold: 누적 연산
    let product = numbers.iter().fold(1, |acc, &x| acc * x);
    println!("fold (곱): {}", product);

    // 문자열 합치기
    let csv = numbers.iter()
        .map(|x| x.to_string())
        .collect::<Vec<_>>()
        .join(", ");
    println!("CSV: {}", csv);

    // any: 하나라도 조건 만족?
    let has_even = numbers.iter().any(|&x| x % 2 == 0);
    println!("짝수 포함? {}", has_even);

    // all: 모두 조건 만족?
    let all_positive = numbers.iter().all(|&x| x > 0);
    println!("모두 양수? {}", all_positive);

    // find: 첫 번째 일치 요소
    let first_gt5 = numbers.iter().find(|&&x| x > 5);
    println!("5보다 큰 첫 요소: {:?}", first_gt5);

    // count: 개수
    let even_count = numbers.iter().filter(|&&x| x % 2 == 0).count();
    println!("짝수 개수: {}", even_count);

    // min, max
    println!("최소: {:?}, 최대: {:?}", numbers.iter().min(), numbers.iter().max());
}
```

---

## 5. 커스텀 반복자

```rust,editable
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
        let current = self.a;
        let new_next = self.a + self.b;
        self.a = self.b;
        self.b = new_next;
        Some(current) // 무한 반복자
    }
}

// 범위 반복자
struct CountDown {
    current: i32,
}

impl CountDown {
    fn from(start: i32) -> Self {
        CountDown { current: start }
    }
}

impl Iterator for CountDown {
    type Item = i32;

    fn next(&mut self) -> Option<Self::Item> {
        if self.current > 0 {
            let val = self.current;
            self.current -= 1;
            Some(val)
        } else {
            None
        }
    }
}

fn main() {
    // 피보나치 처음 10개
    let fibs: Vec<u64> = Fibonacci::new().take(10).collect();
    println!("피보나치: {:?}", fibs);

    // 100 미만인 피보나치 수의 합
    let sum: u64 = Fibonacci::new().take_while(|&x| x < 100).sum();
    println!("100 미만 피보나치 합: {}", sum);

    // 카운트다운
    let countdown: Vec<i32> = CountDown::from(5).collect();
    println!("카운트다운: {:?}", countdown);
}
```

---

## 6. 제로 비용 추상화

<div class="info-box">

**제로 비용 추상화**: Rust의 반복자 체이닝은 수동 루프와 동일한 성능을 발휘합니다. 컴파일러가 반복자 체인을 최적화하여 중간 컬렉션 없이 직접 계산합니다.

```rust
// 이 두 코드는 동일한 기계어로 컴파일됩니다:

// 반복자 방식
let sum: i32 = (0..1000).filter(|x| x % 2 == 0).sum();

// 수동 루프 방식
let mut sum = 0;
for i in 0..1000 {
    if i % 2 == 0 { sum += i; }
}
```

반복자 체인은 **지연 평가**이므로 중간 `Vec`이 생성되지 않으며, 컴파일러 최적화 덕분에 루프와 동일한 어셈블리가 출력됩니다.

</div>

---

## 7. 실전 예제: 데이터 파이프라인

```rust,editable
#[derive(Debug)]
struct Student {
    name: String,
    score: f64,
}

fn main() {
    let students = vec![
        Student { name: "김철수".into(), score: 85.0 },
        Student { name: "이영희".into(), score: 92.5 },
        Student { name: "박민수".into(), score: 78.3 },
        Student { name: "정하나".into(), score: 95.0 },
        Student { name: "최동욱".into(), score: 88.7 },
    ];

    // 평균 점수
    let avg = students.iter().map(|s| s.score).sum::<f64>() / students.len() as f64;
    println!("평균: {:.1}", avg);

    // 90점 이상 학생 이름
    let honor: Vec<&str> = students.iter()
        .filter(|s| s.score >= 90.0)
        .map(|s| s.name.as_str())
        .collect();
    println!("우등생: {:?}", honor);

    // 최고 점수 학생
    let top = students.iter()
        .max_by(|a, b| a.score.partial_cmp(&b.score).unwrap());
    println!("1등: {:?}", top.map(|s| &s.name));

    // 점수순 정렬된 이름
    let mut sorted = students.iter().collect::<Vec<_>>();
    sorted.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap());
    let ranking: Vec<String> = sorted.iter()
        .enumerate()
        .map(|(i, s)| format!("{}위: {} ({:.1}점)", i + 1, s.name, s.score))
        .collect();
    for r in &ranking {
        println!("  {}", r);
    }
}
```

---

## 연습문제

<div class="exercise-box">

**연습 1**: 반복자 메서드를 사용하여 다음을 구현하세요.

```rust,editable
fn main() {
    let words = vec!["hello", "world", "rust", "is", "awesome", "and", "fast"];

    // TODO 1: 4글자 이상인 단어만 대문자로 변환하여 수집
    // let long_upper: Vec<String> = ...
    // 기대 결과: ["HELLO", "WORLD", "RUST", "AWESOME", "FAST"]

    // TODO 2: 모든 단어의 총 글자 수 계산
    // let total_chars: usize = ...
    // 기대 결과: 30

    // TODO 3: 단어를 " | "로 연결한 문자열 만들기
    // let joined: String = ...
    // 기대 결과: "hello | world | rust | is | awesome | and | fast"
}
```

</div>

<div class="exercise-box">

**연습 2**: 무한 반복자 `Primes`를 구현하세요. 소수를 순서대로 생성합니다.

```rust,editable
struct Primes {
    current: u64,
}

impl Primes {
    fn new() -> Self {
        Primes { current: 2 }
    }
}

fn is_prime(n: u64) -> bool {
    if n < 2 { return false; }
    if n == 2 { return true; }
    if n % 2 == 0 { return false; }
    let mut i = 3;
    while i * i <= n {
        if n % i == 0 { return false; }
        i += 2;
    }
    true
}

impl Iterator for Primes {
    type Item = u64;

    fn next(&mut self) -> Option<Self::Item> {
        // TODO: 다음 소수를 찾아 반환
        todo!()
    }
}

fn main() {
    let first_10: Vec<u64> = Primes::new().take(10).collect();
    println!("처음 10개 소수: {:?}", first_10);
    // [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]

    let sum: u64 = Primes::new().take_while(|&p| p < 100).sum();
    println!("100 미만 소수의 합: {}", sum);
}
```

</div>

---

## 퀴즈

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q1**: 어댑터(adapter)와 소비자(consumer)의 차이는 무엇인가요?

<div class="quiz-answer">

**어댑터**(`map`, `filter`, `take` 등)는 반복자를 다른 반복자로 변환하며, **지연 평가**됩니다. 즉, 소비자가 호출될 때까지 실제로 실행되지 않습니다. **소비자**(`collect`, `sum`, `fold`, `for_each` 등)는 반복자를 소비하여 최종 결과를 생성하며, 실제 연산을 **실행**합니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q2**: `iter()`, `iter_mut()`, `into_iter()`는 각각 어떤 타입의 요소를 제공하나요?

<div class="quiz-answer">

- `iter()`: 불변 참조 `&T`를 제공합니다. 원본 컬렉션을 그대로 유지합니다.
- `iter_mut()`: 가변 참조 `&mut T`를 제공합니다. 요소를 수정할 수 있습니다.
- `into_iter()`: 소유권 `T`를 이동합니다. 원본 컬렉션은 더 이상 사용할 수 없습니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q3**: 반복자가 "제로 비용 추상화"인 이유는?

<div class="quiz-answer">

Rust 컴파일러가 반복자 체인을 **수동 루프와 동일한 기계어 코드**로 최적화하기 때문입니다. 중간 컬렉션이 생성되지 않으며, 인라이닝과 루프 언롤링 등의 최적화가 적용됩니다. 추상화를 사용해도 성능 손실이 없습니다.

</div>
</div>

---

<div class="summary-box">

**요약**

- `Iterator` 트레이트의 `next()` 메서드 하나만 구현하면 수십 가지 메서드를 사용할 수 있습니다.
- `iter()` (불변 참조), `iter_mut()` (가변 참조), `into_iter()` (소유권 이동)로 반복자를 생성합니다.
- 어댑터(`map`, `filter`, `zip`, `chain`, `flat_map`, `take`, `skip`)는 지연 평가됩니다.
- 소비자(`collect`, `sum`, `fold`, `any`, `all`, `find`)가 실제 연산을 실행합니다.
- 커스텀 반복자를 만들어 도메인 특화 순회 로직을 구현할 수 있습니다.
- 반복자 체이닝은 제로 비용 추상화로, 수동 루프와 동일한 성능을 제공합니다.

</div>
