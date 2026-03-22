# 실전 예제와 연습문제

## 데이터 파이프라인 예제

```rust,editable
use std::collections::HashMap;

fn main() {
    // 학생 성적 데이터
    let students = vec![
        ("Alice", vec![85, 92, 78, 95, 88]),
        ("Bob", vec![72, 68, 75, 80, 71]),
        ("Charlie", vec![95, 98, 92, 97, 94]),
        ("Diana", vec![60, 55, 65, 70, 58]),
        ("Eve", vec![88, 91, 85, 89, 92]),
    ];

    // 평균 80점 이상인 학생만 선별하여 등급 매기기
    let honor_roll: Vec<(&&str, f64, &str)> = students.iter()
        .map(|(name, scores)| {
            let avg = scores.iter().sum::<i32>() as f64 / scores.len() as f64;
            (name, avg)
        })
        .filter(|(_, avg)| *avg >= 80.0)
        .map(|(name, avg)| {
            let grade = if avg >= 95.0 { "A+" }
                       else if avg >= 90.0 { "A" }
                       else if avg >= 85.0 { "B+" }
                       else { "B" };
            (name, avg, grade)
        })
        .collect();

    println!("=== 우등생 목록 ===");
    for (name, avg, grade) in &honor_roll {
        println!("  {} - 평균: {:.1}, 등급: {}", name, avg, grade);
    }

    // 전체 최고 점수와 학생 찾기
    let top_score = students.iter()
        .flat_map(|(name, scores)| {
            scores.iter().map(move |&score| (*name, score))
        })
        .max_by_key(|&(_, score)| score);

    if let Some((name, score)) = top_score {
        println!("\n최고 점수: {} ({}점)", name, score);
    }

    // 점수 분포 (구간별 카운트)
    let distribution: HashMap<&str, usize> = students.iter()
        .flat_map(|(_, scores)| scores.iter())
        .fold(HashMap::new(), |mut map, &score| {
            let range = match score {
                90..=100 => "90-100",
                80..=89 => "80-89",
                70..=79 => "70-79",
                60..=69 => "60-69",
                _ => "60 미만",
            };
            *map.entry(range).or_insert(0) += 1;
            map
        });

    println!("\n=== 점수 분포 ===");
    for (range, count) in &distribution {
        println!("  {}: {}명", range, count);
    }
}
```

---

## 텍스트 처리 파이프라인

```rust,editable
fn main() {
    let text = "Rust is a systems programming language.
    It focuses on safety, speed, and concurrency.
    Rust achieves memory safety without garbage collection.
    The borrow checker is a key feature of Rust.";

    // 단어 빈도 분석
    let word_count: std::collections::HashMap<&str, usize> = text
        .split_whitespace()
        .map(|word| word.trim_matches(|c: char| !c.is_alphanumeric()))
        .filter(|word| !word.is_empty())
        .map(|word| word.to_lowercase())
        .collect::<Vec<String>>()
        .iter()
        .fold(std::collections::HashMap::new(), |mut map, word| {
            *map.entry(word.as_str()).or_insert(0) += 1;
            map
        });

    // 빈도 기준 정렬 (내림차순)
    let mut sorted: Vec<_> = word_count.iter().collect();
    sorted.sort_by(|a, b| b.1.cmp(a.1));

    println!("=== 단어 빈도 (상위 5개) ===");
    for (word, count) in sorted.iter().take(5) {
        println!("  {}: {}회", word, count);
    }

    // 문장별 단어 수
    let sentence_lengths: Vec<usize> = text
        .lines()
        .map(|line| line.split_whitespace().count())
        .collect();
    println!("\n문장별 단어 수: {:?}", sentence_lengths);

    let avg_words = sentence_lengths.iter().sum::<usize>() as f64
        / sentence_lengths.len() as f64;
    println!("평균 단어 수: {:.1}", avg_words);
}
```

---

## 연습문제

<div class="exercise-box">

**연습 1**: 반복자를 사용하여 주어진 숫자 벡터에서 **짝수만 골라 제곱한 뒤 합계**를 구하세요.

```rust,editable
fn sum_of_even_squares(numbers: &[i32]) -> i32 {
    // TODO: 반복자 체이닝으로 구현하세요
    // 1. 짝수만 필터링
    // 2. 제곱
    // 3. 합계
    todo!()
}

fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let result = sum_of_even_squares(&numbers);
    println!("짝수 제곱의 합: {}", result);
    // 기대값: 2^2 + 4^2 + 6^2 + 8^2 + 10^2 = 4 + 16 + 36 + 64 + 100 = 220
}
```

</div>

<div class="exercise-box">

**연습 2**: 커스텀 반복자를 만들어 보세요. `Countdown` 구조체를 구현하여 주어진 숫자부터 0까지 카운트다운하세요.

```rust,editable
struct Countdown {
    current: i32,
}

impl Countdown {
    fn new(start: i32) -> Self {
        Countdown { current: start }
    }
}

// TODO: Iterator 트레이트를 구현하세요
// impl Iterator for Countdown { ... }

fn main() {
    // 사용 예시:
    // let countdown: Vec<i32> = Countdown::new(5).collect();
    // println!("{:?}", countdown); // [5, 4, 3, 2, 1, 0]
    //
    // let sum: i32 = Countdown::new(10).sum();
    // println!("합: {}", sum); // 55
}
```

</div>

<div class="exercise-box">

**연습 3**: `fold`를 사용하여 문자열 벡터를 하나의 문장으로 합치세요. 단어 사이에 공백을 넣으세요.

```rust,editable
fn join_words(words: &[&str]) -> String {
    // TODO: fold를 사용하여 구현하세요
    todo!()
}

fn main() {
    let words = vec!["Rust", "is", "awesome"];
    let sentence = join_words(&words);
    println!("{}", sentence); // "Rust is awesome"
}
```

</div>

---

## 퀴즈

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q1**: `iter()`, `iter_mut()`, `into_iter()`의 차이는 무엇인가요?

<div class="quiz-answer">

- **`iter()`**: 불변 참조(`&T`)를 반복합니다. 원본 컬렉션을 그대로 유지합니다.
- **`iter_mut()`**: 가변 참조(`&mut T`)를 반복합니다. 요소를 수정할 수 있지만 소유권은 유지합니다.
- **`into_iter()`**: 소유권(`T`)을 이동하며 반복합니다. 원본 컬렉션은 사용 불가합니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q2**: 어댑터와 소비자의 차이는?

<div class="quiz-answer">

- **어댑터**(map, filter, take 등)는 반복자를 다른 반복자로 변환하며, **지연 평가**됩니다. 소비자가 호출될 때까지 실제 계산이 일어나지 않습니다.
- **소비자**(collect, sum, count, for_each 등)는 반복자를 **소비**하여 최종 값을 생성합니다. 소비자를 호출하면 체인의 모든 어댑터가 실행됩니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q3**: Rust의 반복자가 "제로 비용 추상화"인 이유는?

<div class="quiz-answer">

컴파일러가 반복자 체이닝을 **인라인 확장**하고 **루프 퓨전(loop fusion)**을 적용하여, 수동으로 작성한 루프와 동일한 기계 코드를 생성합니다. 중간 컬렉션이 만들어지지 않으며, 가상 함수 호출(dynamic dispatch)도 없습니다. 따라서 추상화의 편의를 누리면서도 성능 손실이 없습니다.

</div>
</div>
