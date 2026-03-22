# 트레이트 객체와 고급 기능

## 6. 트레이트 객체 (dyn Trait) vs 정적 디스패치

```rust,editable
trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> &str;
}

struct Circle { radius: f64 }
struct Rectangle { width: f64, height: f64 }

impl Shape for Circle {
    fn area(&self) -> f64 { std::f64::consts::PI * self.radius * self.radius }
    fn name(&self) -> &str { "원" }
}

impl Shape for Rectangle {
    fn area(&self) -> f64 { self.width * self.height }
    fn name(&self) -> &str { "직사각형" }
}

// 정적 디스패치 (컴파일 타임에 타입 결정, 빠름)
fn print_area_static(shape: &impl Shape) {
    println!("[정적] {}: 넓이 = {:.2}", shape.name(), shape.area());
}

// 동적 디스패치 (런타임에 vtable 조회, 유연함)
fn print_area_dynamic(shape: &dyn Shape) {
    println!("[동적] {}: 넓이 = {:.2}", shape.name(), shape.area());
}

// 트레이트 객체의 핵심: 이질적 컬렉션
fn total_area(shapes: &[Box<dyn Shape>]) -> f64 {
    shapes.iter().map(|s| s.area()).sum()
}

fn main() {
    let circle = Circle { radius: 5.0 };
    let rect = Rectangle { width: 4.0, height: 6.0 };

    print_area_static(&circle);
    print_area_dynamic(&rect);

    // 서로 다른 타입을 하나의 벡터에 저장
    let shapes: Vec<Box<dyn Shape>> = vec![
        Box::new(Circle { radius: 3.0 }),
        Box::new(Rectangle { width: 2.0, height: 5.0 }),
        Box::new(Circle { radius: 1.0 }),
    ];

    println!("총 넓이: {:.2}", total_area(&shapes));
}
```

<div class="info-box">

**정적 디스패치 vs 동적 디스패치**

| 특성 | 정적 (`impl Trait` / 제네릭) | 동적 (`dyn Trait`) |
|------|------|------|
| 성능 | 빠름 (인라인 가능) | vtable 간접 호출 비용 |
| 바이너리 크기 | 타입별 코드 생성 | 코드 하나로 공유 |
| 이질적 컬렉션 | 불가 | 가능 |
| 타입 결정 시점 | 컴파일 타임 | 런타임 |

</div>

---

## 7. 객체 안전성 (Object Safety)

트레이트 객체(`dyn Trait`)로 사용하려면 트레이트가 **객체 안전(object-safe)**해야 합니다.

```rust,editable
// 객체 안전한 트레이트
trait Drawable {
    fn draw(&self);
}

// 객체 안전하지 않은 트레이트 (제네릭 메서드 포함)
// trait NotObjectSafe {
//     fn convert<T>(&self) -> T;  // 제네릭 메서드 -> 객체 안전 위반
// }

// 객체 안전하지 않은 트레이트 (Self를 반환)
// trait Clonable {
//     fn clone_self(&self) -> Self;  // Self 반환 -> 객체 안전 위반
// }

struct Square { size: f64 }
struct Triangle { base: f64, height: f64 }

impl Drawable for Square {
    fn draw(&self) { println!("■ (크기: {})", self.size); }
}
impl Drawable for Triangle {
    fn draw(&self) { println!("▲ (밑변: {}, 높이: {})", self.base, self.height); }
}

fn main() {
    let shapes: Vec<Box<dyn Drawable>> = vec![
        Box::new(Square { size: 3.0 }),
        Box::new(Triangle { base: 4.0, height: 5.0 }),
    ];

    for shape in &shapes {
        shape.draw();
    }
}
```

<div class="tip-box">

**객체 안전성 조건**: (1) 메서드가 `Self`를 반환하지 않아야 하며, (2) 제네릭 타입 매개변수가 없어야 합니다.

</div>

---

## 8. 연관 타입 (Associated Types)

```rust,editable
// 연관 타입을 사용하는 트레이트
trait Container {
    type Item;

    fn first(&self) -> Option<&Self::Item>;
    fn last(&self) -> Option<&Self::Item>;
    fn len(&self) -> usize;
}

struct NumberList {
    items: Vec<i32>,
}

impl Container for NumberList {
    type Item = i32;

    fn first(&self) -> Option<&i32> {
        self.items.first()
    }

    fn last(&self) -> Option<&i32> {
        self.items.last()
    }

    fn len(&self) -> usize {
        self.items.len()
    }
}

fn print_container(c: &impl Container<Item = i32>) {
    println!("첫 번째: {:?}, 마지막: {:?}, 길이: {}",
             c.first(), c.last(), c.len());
}

fn main() {
    let list = NumberList { items: vec![10, 20, 30, 40] };
    print_container(&list);
}
```

---

## 9. 블랭킷 구현 (Blanket Implementations)

```rust,editable
use std::fmt::Display;

// 모든 Display를 구현하는 타입에 대해 자동으로 Printable 구현
trait Printable {
    fn print_with_label(&self, label: &str);
}

impl<T: Display> Printable for T {
    fn print_with_label(&self, label: &str) {
        println!("[{}] {}", label, self);
    }
}

fn main() {
    42.print_with_label("숫자");
    "안녕하세요".print_with_label("문자열");
    3.14.print_with_label("실수");
}
```

<div class="info-box">

**블랭킷 구현**은 표준 라이브러리에서 흔히 사용됩니다. 예를 들어 `From<T>`를 구현하면 `Into<T>`가 자동으로 제공되는 것이 바로 블랭킷 구현 덕분입니다.

</div>
