# 벡터 <span class="badge-beginner">기초</span>

`Vec<T>`(벡터)는 같은 타입의 여러 값을 순서대로 저장하는 **가변 크기 배열**입니다. 메모리의 힙 영역에 연속적으로 데이터를 저장하며, 프로그램 실행 중에 크기가 자유롭게 변할 수 있습니다.

## 벡터 생성

```rust,editable
fn main() {
    // 방법 1: Vec::new()로 빈 벡터 생성
    let mut v1: Vec<i32> = Vec::new();
    v1.push(1);
    v1.push(2);
    v1.push(3);
    println!("v1: {:?}", v1);

    // 방법 2: vec![] 매크로 사용 (가장 일반적)
    let v2 = vec![10, 20, 30, 40, 50];
    println!("v2: {:?}", v2);

    // 방법 3: 반복 값으로 초기화
    let v3 = vec![0; 5];  // [0, 0, 0, 0, 0]
    println!("v3: {:?}", v3);

    // 방법 4: from으로 생성
    let v4 = Vec::from([1, 2, 3]);
    println!("v4: {:?}", v4);

    // 방법 5: 이터레이터에서 수집
    let v5: Vec<i32> = (1..=5).collect();
    println!("v5: {:?}", v5);
}
```

## 요소 추가와 제거

```rust,editable
fn main() {
    let mut fruits = vec!["사과", "바나나", "체리"];
    println!("초기: {:?}", fruits);

    // push: 끝에 추가
    fruits.push("딸기");
    println!("push 후: {:?}", fruits);

    // insert: 특정 위치에 삽입
    fruits.insert(1, "귤");
    println!("insert(1) 후: {:?}", fruits);

    // pop: 마지막 요소 제거 (Option<T> 반환)
    if let Some(last) = fruits.pop() {
        println!("pop: {} 제거됨", last);
    }
    println!("pop 후: {:?}", fruits);

    // remove: 특정 인덱스 제거
    let removed = fruits.remove(0);
    println!("remove(0): {} 제거됨", removed);
    println!("remove 후: {:?}", fruits);

    // retain: 조건에 맞는 요소만 유지
    let mut numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    numbers.retain(|&x| x % 2 == 0);  // 짝수만 유지
    println!("짝수만: {:?}", numbers);

    // clear: 모든 요소 제거
    numbers.clear();
    println!("clear 후: {:?} (길이: {})", numbers, numbers.len());
}
```

## 요소 접근

```rust,editable
fn main() {
    let scores = vec![85, 92, 78, 95, 88];

    // 방법 1: 인덱스로 접근 (범위 초과시 패닉!)
    let first = scores[0];
    println!("첫 번째: {}", first);

    // 방법 2: get()으로 안전하게 접근 (Option<&T> 반환)
    match scores.get(2) {
        Some(score) => println!("세 번째: {}", score),
        None => println!("인덱스 범위 초과"),
    }

    // 존재하지 않는 인덱스
    match scores.get(100) {
        Some(score) => println!("값: {}", score),
        None => println!("인덱스 100은 범위 밖입니다"),
    }

    // 유용한 접근 메서드들
    println!("첫 번째: {:?}", scores.first());
    println!("마지막: {:?}", scores.last());
    println!("길이: {}", scores.len());
    println!("비어있나? {}", scores.is_empty());
    println!("포함 여부: {}", scores.contains(&92));
}
```

<div class="warning-box">

**주의**: `scores[100]`처럼 범위를 벗어난 인덱스로 접근하면 프로그램이 **패닉(panic)**합니다! 인덱스가 유효한지 확실하지 않을 때는 항상 `get()` 메서드를 사용하세요.

</div>

## 벡터 반복

```rust,editable
fn main() {
    let names = vec!["Alice", "Bob", "Charlie", "Diana"];

    // 불변 참조로 반복
    println!("=== 이름 목록 ===");
    for name in &names {
        println!("  {}", name);
    }

    // 가변 참조로 반복하며 수정
    let mut prices = vec![1000, 2000, 3000, 4000];
    println!("\n원래 가격: {:?}", prices);
    for price in &mut prices {
        *price = (*price as f64 * 1.1) as i32;  // 10% 인상
    }
    println!("인상 후: {:?}", prices);

    // enumerate: 인덱스와 함께 반복
    println!("\n=== 인덱스와 함께 ===");
    for (i, name) in names.iter().enumerate() {
        println!("  [{}] {}", i, name);
    }

    // 이터레이터 메서드 활용
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    let sum: i32 = numbers.iter().sum();
    let max = numbers.iter().max();
    let min = numbers.iter().min();

    println!("\n숫자: {:?}", numbers);
    println!("합계: {}", sum);
    println!("최대: {:?}", max);
    println!("최소: {:?}", min);

    // map + collect로 변환
    let doubled: Vec<i32> = numbers.iter().map(|&x| x * 2).collect();
    println!("두 배: {:?}", doubled);

    // filter + collect로 필터링
    let evens: Vec<&i32> = numbers.iter().filter(|&&x| x % 2 == 0).collect();
    println!("짝수: {:?}", evens);
}
```

## 소유권과 빌림

벡터에 대한 소유권과 빌림 규칙은 매우 중요합니다.

```rust,editable
fn main() {
    // 1. 벡터에 값을 넣으면 소유권이 이전됩니다
    let name = String::from("Alice");
    let mut names = vec![name];
    // println!("{}", name);  // 에러! name의 소유권이 벡터로 이동함

    names.push(String::from("Bob"));
    println!("이름들: {:?}", names);

    // 2. 참조와 가변 참조는 동시에 존재할 수 없습니다
    let mut v = vec![1, 2, 3, 4, 5];

    // 이것은 OK: 불변 참조 사용 후 가변 수정
    let third = v[2];  // Copy 타입이므로 복사됨
    v.push(6);
    println!("세 번째 값: {}, 벡터: {:?}", third, v);
}
```

<div class="info-box">

**왜 불변 참조와 가변 참조를 동시에 사용할 수 없을까요?**

벡터에 `push`하면 메모리를 재할당할 수 있습니다. 기존 참조가 재할당 전의 메모리를 가리키고 있다면, 재할당 후에는 해제된 메모리를 가리키게 되어 **댕글링 포인터**가 됩니다. Rust는 이를 컴파일 타임에 방지합니다.

</div>

```rust,editable
fn main() {
    // 3. 벡터의 요소를 이동시키는 방법들
    let mut animals = vec![
        String::from("고양이"),
        String::from("강아지"),
        String::from("토끼"),
    ];

    // swap_remove: 마지막 요소와 교체하며 제거 (O(1))
    let removed = animals.swap_remove(0);
    println!("제거됨: {}, 남은: {:?}", removed, animals);

    // drain: 범위의 요소들을 이동
    let mut nums = vec![1, 2, 3, 4, 5];
    let drained: Vec<i32> = nums.drain(1..3).collect();
    println!("빠진 요소: {:?}, 남은: {:?}", drained, nums);

    // clone으로 복사본 만들기
    let original = vec![String::from("hello"), String::from("world")];
    let cloned = original.clone();
    println!("원본: {:?}", original);
    println!("복사: {:?}", cloned);
}
```

## 열거형으로 다양한 타입 저장하기

벡터는 같은 타입의 요소만 저장할 수 있지만, 열거형을 활용하면 **다양한 타입의 데이터**를 하나의 벡터에 담을 수 있습니다.

```rust,editable
#[derive(Debug)]
enum CellValue {
    Int(i64),
    Float(f64),
    Text(String),
    Bool(bool),
    Empty,
}

impl CellValue {
    fn to_string_display(&self) -> String {
        match self {
            CellValue::Int(n) => n.to_string(),
            CellValue::Float(f) => format!("{:.2}", f),
            CellValue::Text(s) => s.clone(),
            CellValue::Bool(b) => if *b { "참".to_string() } else { "거짓".to_string() },
            CellValue::Empty => "-".to_string(),
        }
    }
}

fn main() {
    // 스프레드시트 행처럼 다양한 타입의 데이터를 저장
    let row: Vec<CellValue> = vec![
        CellValue::Text("김철수".to_string()),
        CellValue::Int(25),
        CellValue::Float(175.5),
        CellValue::Bool(true),
        CellValue::Empty,
    ];

    let headers = vec!["이름", "나이", "키", "활성", "비고"];

    println!("=== 사용자 정보 ===");
    for (header, cell) in headers.iter().zip(row.iter()) {
        println!("  {}: {}", header, cell.to_string_display());
    }
}
```

## 슬라이스로 벡터의 일부 참조하기

```rust,editable
fn sum_slice(slice: &[i32]) -> i32 {
    slice.iter().sum()
}

fn print_slice(label: &str, slice: &[i32]) {
    println!("{}: {:?} (합계: {})", label, slice, sum_slice(slice));
}

fn main() {
    let numbers = vec![10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    // 슬라이스로 일부분 참조
    print_slice("전체", &numbers);
    print_slice("앞 3개", &numbers[..3]);
    print_slice("뒤 3개", &numbers[7..]);
    print_slice("중간", &numbers[3..7]);

    // windows: 슬라이딩 윈도우
    println!("\n이동 평균 (3개씩):");
    for window in numbers.windows(3) {
        let avg: f64 = window.iter().sum::<i32>() as f64 / 3.0;
        println!("  {:?} -> 평균: {:.1}", window, avg);
    }

    // chunks: 고정 크기 블록
    println!("\n2개씩 묶기:");
    for chunk in numbers.chunks(2) {
        println!("  {:?}", chunk);
    }
}
```

## 유용한 벡터 메서드들

```rust,editable
fn main() {
    // 정렬
    let mut nums = vec![5, 2, 8, 1, 9, 3, 7, 4, 6];
    nums.sort();
    println!("오름차순: {:?}", nums);

    nums.sort_by(|a, b| b.cmp(a));
    println!("내림차순: {:?}", nums);

    // 중복 제거 (정렬 후)
    let mut with_dups = vec![1, 3, 2, 1, 4, 3, 2, 5];
    with_dups.sort();
    with_dups.dedup();
    println!("중복 제거: {:?}", with_dups);

    // 검색
    let fruits = vec!["사과", "바나나", "체리", "딸기", "바나나"];
    println!("'체리' 위치: {:?}", fruits.iter().position(|&x| x == "체리"));
    println!("'포도' 위치: {:?}", fruits.iter().position(|&x| x == "포도"));

    // 벡터 결합
    let mut a = vec![1, 2, 3];
    let mut b = vec![4, 5, 6];
    a.append(&mut b);
    println!("결합: {:?}", a);
    println!("b는 비었음: {:?}", b);

    // extend
    let mut c = vec![1, 2, 3];
    c.extend(vec![4, 5, 6]);
    c.extend([7, 8, 9]);
    println!("확장: {:?}", c);

    // 용량 관리
    let mut v = Vec::with_capacity(10);
    println!("길이: {}, 용량: {}", v.len(), v.capacity());
    for i in 0..10 {
        v.push(i);
    }
    println!("길이: {}, 용량: {}", v.len(), v.capacity());
}
```

---

<div class="exercise-box">

**연습문제 1: 성적 통계** <span class="badge-beginner">기초</span>

벡터를 사용하여 학생들의 성적 통계를 계산하는 프로그램을 완성하세요.

```rust,editable
fn statistics(scores: &[f64]) -> Option<(f64, f64, f64, f64)> {
    // TODO: 빈 슬라이스면 None 반환
    // 아니면 Some((평균, 최소, 최대, 중앙값)) 반환
    // 힌트: 중앙값을 구하려면 정렬된 복사본이 필요합니다
    if scores.is_empty() {
        return None;
    }
    todo!()
}

fn main() {
    let scores = vec![78.5, 92.0, 65.5, 88.0, 71.0, 95.5, 84.0];

    match statistics(&scores) {
        Some((avg, min, max, median)) => {
            println!("성적: {:?}", scores);
            println!("평균: {:.1}", avg);
            println!("최소: {:.1}", min);
            println!("최대: {:.1}", max);
            println!("중앙값: {:.1}", median);
        }
        None => println!("데이터가 없습니다"),
    }

    // 빈 벡터 테스트
    let empty: Vec<f64> = vec![];
    println!("\n빈 데이터: {:?}", statistics(&empty));
}
```

</div>

<div class="exercise-box">

**연습문제 2: 간단한 스택 구현** <span class="badge-beginner">기초</span>

벡터를 사용하여 스택을 구현하세요.

```rust,editable
struct Stack<T> {
    elements: Vec<T>,
}

impl<T: std::fmt::Debug> Stack<T> {
    fn new() -> Self {
        todo!()
    }

    fn push(&mut self, item: T) {
        todo!()
    }

    fn pop(&mut self) -> Option<T> {
        todo!()
    }

    fn peek(&self) -> Option<&T> {
        todo!()
    }

    fn is_empty(&self) -> bool {
        todo!()
    }

    fn size(&self) -> usize {
        todo!()
    }
}

fn main() {
    let mut stack = Stack::new();

    stack.push(1);
    stack.push(2);
    stack.push(3);

    println!("크기: {}", stack.size());
    println!("top: {:?}", stack.peek());

    while let Some(val) = stack.pop() {
        println!("꺼냄: {}", val);
    }

    println!("비었나? {}", stack.is_empty());
}
```

</div>

<div class="exercise-box">

**연습문제 3: 행렬 연산** <span class="badge-beginner">기초</span>

2차원 벡터로 행렬을 표현하고 전치(transpose) 연산을 구현하세요.

```rust,editable
fn print_matrix(name: &str, matrix: &Vec<Vec<i32>>) {
    println!("{}:", name);
    for row in matrix {
        println!("  {:?}", row);
    }
}

fn transpose(matrix: &Vec<Vec<i32>>) -> Vec<Vec<i32>> {
    // TODO: 행렬의 전치를 구현하세요
    // 예: [[1,2,3], [4,5,6]] -> [[1,4], [2,5], [3,6]]
    // 힌트: 결과 행렬의 행 수 = 원본의 열 수
    //        결과 행렬의 열 수 = 원본의 행 수
    todo!()
}

fn main() {
    let matrix = vec![
        vec![1, 2, 3],
        vec![4, 5, 6],
    ];

    print_matrix("원본", &matrix);
    let transposed = transpose(&matrix);
    print_matrix("전치", &transposed);
}
```

</div>

---

<div class="summary-box">

**정리**

- **`Vec<T>`**: 같은 타입의 여러 값을 힙에 연속 저장하는 가변 크기 컬렉션
- **생성**: `Vec::new()`, `vec![]`, `Vec::from()`, `.collect()`
- **추가/제거**: `push`, `pop`, `insert`, `remove`, `retain`, `clear`
- **접근**: 인덱스(`[]`) 또는 안전한 `get()` (Option 반환)
- **반복**: `for in &v` (불변), `for in &mut v` (가변), `.iter()` (이터레이터)
- **소유권**: 벡터에 값을 넣으면 소유권이 이동하며, 불변/가변 참조 규칙이 적용됩니다
- **다양한 타입**: 열거형을 사용하면 서로 다른 타입의 데이터를 하나의 벡터에 저장할 수 있습니다
- **슬라이스**: `&v[a..b]`로 벡터의 일부를 참조할 수 있습니다

</div>
