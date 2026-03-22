# 제네릭

<span class="badge-intermediate">중급</span>

제네릭(Generics)은 코드 중복을 제거하면서 타입 안전성을 유지하는 강력한 도구입니다. Rust의 제네릭은 **단형성화(Monomorphization)**를 통해 런타임 비용 없이 추상화를 제공합니다.

---

## 1. 제네릭 함수

타입 매개변수를 사용하여 다양한 타입에 동작하는 함수를 작성할 수 있습니다.

```rust,editable
// 제네릭 없이: 타입마다 함수를 만들어야 함
fn largest_i32(list: &[i32]) -> &i32 {
    let mut largest = &list[0];
    for item in &list[1..] {
        if item > largest {
            largest = item;
        }
    }
    largest
}

// 제네릭으로: 하나의 함수로 모든 비교 가능한 타입에 대응
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in &list[1..] {
        if item > largest {
            largest = item;
        }
    }
    largest
}

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    println!("가장 큰 수: {}", largest(&numbers));

    let chars = vec!['y', 'm', 'a', 'q'];
    println!("가장 큰 문자: {}", largest(&chars));
}
```

---

## 2. 제네릭 구조체

```rust,editable
#[derive(Debug)]
struct Point<T> {
    x: T,
    y: T,
}

// 서로 다른 타입 매개변수도 가능
#[derive(Debug)]
struct MixedPoint<T, U> {
    x: T,
    y: U,
}

fn main() {
    let integer_point = Point { x: 5, y: 10 };
    let float_point = Point { x: 1.0, y: 4.0 };
    let mixed = MixedPoint { x: 5, y: 4.0 };

    println!("정수 좌표: {:?}", integer_point);
    println!("실수 좌표: {:?}", float_point);
    println!("혼합 좌표: {:?}", mixed);
}
```

---

## 3. 제네릭 열거형

Rust 표준 라이브러리의 핵심 타입들이 제네릭 열거형입니다.

```rust,editable
// Option<T>와 Result<T, E>의 정의 (표준 라이브러리)
// enum Option<T> { Some(T), None }
// enum Result<T, E> { Ok(T), Err(E) }

// 직접 만드는 제네릭 열거형
#[derive(Debug)]
enum Response<T> {
    Success(T),
    Error(String),
    Loading,
}

fn fetch_data(id: u32) -> Response<String> {
    match id {
        0 => Response::Error("ID가 0일 수 없습니다".to_string()),
        1..=100 => Response::Success(format!("데이터_{}", id)),
        _ => Response::Error("범위 초과".to_string()),
    }
}

fn main() {
    for id in [0, 42, 999] {
        println!("ID {} -> {:?}", id, fetch_data(id));
    }
}
```

---

## 4. 제네릭 메서드

```rust,editable
#[derive(Debug)]
struct Wrapper<T> {
    value: T,
}

// 모든 T에 대한 메서드
impl<T> Wrapper<T> {
    fn new(value: T) -> Self {
        Wrapper { value }
    }

    fn into_inner(self) -> T {
        self.value
    }
}

// 특정 타입에만 적용되는 메서드
impl Wrapper<f64> {
    fn round(&self) -> f64 {
        self.value.round()
    }
}

// 다른 제네릭 타입으로 변환하는 메서드
impl<T> Wrapper<T> {
    fn map<U, F: FnOnce(T) -> U>(self, f: F) -> Wrapper<U> {
        Wrapper { value: f(self.value) }
    }
}

fn main() {
    let w = Wrapper::new(3.14);
    println!("원본: {:?}", w);
    println!("반올림: {}", w.round());

    let w2 = Wrapper::new(42);
    let w3 = w2.map(|x| x.to_string());
    println!("변환 결과: {:?}", w3);
}
```

---

## 5. 단형성화 (Monomorphization) — 제로 비용 추상화

<div class="info-box">

**단형성화**란 컴파일러가 제네릭 코드를 사용되는 **구체적 타입별로 복제**하여 특수화하는 과정입니다. 이로 인해 런타임에서 어떠한 성능 비용도 발생하지 않습니다.

```rust
// 작성한 코드
fn identity<T>(x: T) -> T { x }

let a = identity(5);       // i32
let b = identity("hello"); // &str

// 컴파일러가 생성하는 코드 (개념적)
// fn identity_i32(x: i32) -> i32 { x }
// fn identity_str(x: &str) -> &str { x }
```

**장점**: 런타임 비용 없음 (정적 디스패치)
**단점**: 바이너리 크기가 커질 수 있음

</div>

---

## 6. Const 제네릭

Rust 1.51부터 **상수 제네릭(const generics)**을 지원합니다. 타입뿐 아니라 상수 값도 매개변수로 받을 수 있습니다.

```rust,editable
// N은 컴파일 타임 상수 매개변수
#[derive(Debug)]
struct Matrix<const ROWS: usize, const COLS: usize> {
    data: [[f64; COLS]; ROWS],
}

impl<const ROWS: usize, const COLS: usize> Matrix<ROWS, COLS> {
    fn new() -> Self {
        Matrix {
            data: [[0.0; COLS]; ROWS],
        }
    }

    fn set(&mut self, row: usize, col: usize, value: f64) {
        self.data[row][col] = value;
    }

    fn get(&self, row: usize, col: usize) -> f64 {
        self.data[row][col]
    }
}

// 배열의 크기를 제네릭으로 받는 함수
fn first_element<T: Copy, const N: usize>(arr: &[T; N]) -> T {
    arr[0]
}

fn main() {
    let mut mat = Matrix::<2, 3>::new();
    mat.set(0, 1, 5.0);
    mat.set(1, 2, 3.14);
    println!("mat[0][1] = {}", mat.get(0, 1));
    println!("mat[1][2] = {}", mat.get(1, 2));

    let arr = [10, 20, 30, 40, 50];
    println!("첫 번째 원소: {}", first_element(&arr));
}
```

<div class="tip-box">

**팁**: const 제네릭은 배열 크기, 버퍼 크기 등 컴파일 타임에 결정되는 값을 매개변수화할 때 유용합니다. `[T; N]` 배열에 대해 크기에 독립적인 함수를 작성할 수 있습니다.

</div>

---

## 연습문제

<div class="exercise-box">

**연습 1**: 제네릭 `Stack<T>` 구조체를 구현하세요.

```rust,editable
#[derive(Debug)]
struct Stack<T> {
    elements: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self {
        // TODO: 빈 스택 생성
        todo!()
    }

    fn push(&mut self, item: T) {
        // TODO: 스택에 요소 추가
        todo!()
    }

    fn pop(&mut self) -> Option<T> {
        // TODO: 스택에서 요소 제거 및 반환
        todo!()
    }

    fn peek(&self) -> Option<&T> {
        // TODO: 스택의 최상단 요소 참조 반환
        todo!()
    }

    fn is_empty(&self) -> bool {
        // TODO: 스택이 비어있는지 확인
        todo!()
    }
}

fn main() {
    let mut stack = Stack::new();
    stack.push(1);
    stack.push(2);
    stack.push(3);

    println!("peek: {:?}", stack.peek());  // Some(3)
    println!("pop: {:?}", stack.pop());    // Some(3)
    println!("pop: {:?}", stack.pop());    // Some(2)
    println!("비어있나?: {}", stack.is_empty()); // false
}
```

</div>

<div class="exercise-box">

**연습 2**: 두 개의 서로 다른 타입을 가진 `Pair<T, U>`를 구현하고, `swap()` 메서드로 `Pair<U, T>`를 반환하세요.

```rust,editable
#[derive(Debug)]
struct Pair<T, U> {
    first: T,
    second: U,
}

impl<T, U> Pair<T, U> {
    fn new(first: T, second: U) -> Self {
        Pair { first, second }
    }

    fn swap(self) -> Pair<U, T> {
        // TODO: first와 second를 교환한 새 Pair 반환
        todo!()
    }
}

// T와 U가 모두 Display를 구현할 때만 사용 가능한 메서드
impl<T: std::fmt::Display, U: std::fmt::Display> Pair<T, U> {
    fn print(&self) {
        println!("({}, {})", self.first, self.second);
    }
}

fn main() {
    let pair = Pair::new(42, "hello");
    pair.print();

    let swapped = pair.swap();
    swapped.print();
}
```

</div>

---

## 퀴즈

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q1**: 단형성화(Monomorphization)란 무엇이며 어떤 이점이 있나요?

<div class="quiz-answer">

컴파일러가 제네릭 코드를 사용되는 구체적 타입별로 특수화된 코드를 생성하는 과정입니다. **런타임 비용이 전혀 없는 제로 비용 추상화**를 제공합니다. 단, 바이너리 크기가 증가할 수 있습니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q2**: `impl<T> Wrapper<T>`와 `impl Wrapper<f64>`의 차이는 무엇인가요?

<div class="quiz-answer">

`impl<T> Wrapper<T>`는 **모든 타입 T**에 대해 메서드를 정의합니다. `impl Wrapper<f64>`는 **`f64` 타입**에 대해서만 사용 가능한 메서드를 정의합니다. 이를 통해 특정 타입에만 특화된 기능을 제공할 수 있습니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q3**: const 제네릭은 일반 제네릭과 어떻게 다른가요?

<div class="quiz-answer">

일반 제네릭은 **타입**을 매개변수로 받지만, const 제네릭은 **컴파일 타임 상수 값**(주로 `usize` 같은 정수)을 매개변수로 받습니다. 배열 크기 등을 일반화할 때 유용합니다. 예: `fn foo<const N: usize>(arr: [i32; N])`.

</div>
</div>

---

<div class="summary-box">

**요약**

- 제네릭 함수, 구조체, 열거형, 메서드로 타입에 독립적인 코드를 작성할 수 있습니다.
- **단형성화**를 통해 제네릭은 런타임 비용 없는 **제로 비용 추상화**입니다.
- 트레이트 바운드(`T: Trait`)로 제네릭 타입에 제약을 추가할 수 있습니다.
- **const 제네릭**으로 컴파일 타임 상수 값도 매개변수화할 수 있습니다.
- 특정 타입에만 적용되는 메서드를 별도로 정의할 수 있습니다.

</div>
