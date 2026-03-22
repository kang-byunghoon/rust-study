# 제네릭 함수와 타입

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
