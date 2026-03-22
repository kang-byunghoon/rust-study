# 트레이트 실전 연습

## 연습문제

<div class="exercise-box">

**연습 1**: `Summable` 트레이트를 정의하고, `Vec<i32>`와 `Vec<f64>`에 구현하세요.

```rust,editable
trait Summable {
    type Output;
    fn total(&self) -> Self::Output;
}

// TODO: Vec<i32>에 대해 Summable 구현
// TODO: Vec<f64>에 대해 Summable 구현

fn main() {
    let ints = vec![1, 2, 3, 4, 5];
    let floats = vec![1.5, 2.5, 3.5];

    // println!("정수 합: {}", ints.total());    // 15
    // println!("실수 합: {}", floats.total());  // 7.5
}
```

</div>

<div class="exercise-box">

**연습 2**: `dyn Trait`을 활용하여 다양한 동물 소리를 출력하는 프로그램을 작성하세요.

```rust,editable
trait Animal {
    fn name(&self) -> &str;
    fn sound(&self) -> &str;
    fn info(&self) -> String {
        format!("{}은(는) '{}'라고 울어요", self.name(), self.sound())
    }
}

struct Dog;
struct Cat;
struct Duck;

// TODO: 각 동물에 대해 Animal 트레이트를 구현하세요

fn animal_chorus(animals: &[Box<dyn Animal>]) {
    for animal in animals {
        println!("{}", animal.info());
    }
}

fn main() {
    // TODO: 동물 벡터를 만들고 animal_chorus 호출
}
```

</div>

---

## 퀴즈

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q1**: `impl Trait`와 `dyn Trait`의 핵심 차이는 무엇인가요?

<div class="quiz-answer">

`impl Trait`는 **정적 디스패치**(컴파일 타임에 타입이 결정, 단형성화)를 사용하고, `dyn Trait`는 **동적 디스패치**(런타임에 vtable을 통해 메서드 호출)를 사용합니다. `dyn Trait`는 이질적 컬렉션에 사용할 수 있지만 약간의 런타임 비용이 있습니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q2**: 연관 타입(Associated Type)과 제네릭 타입 매개변수의 차이는?

<div class="quiz-answer">

제네릭 타입 매개변수를 사용하면 하나의 타입에 대해 **여러 번** 트레이트를 구현할 수 있지만, 연관 타입은 **한 번만** 구현할 수 있습니다. `Iterator` 트레이트의 `type Item`처럼, 구현이 하나뿐이어야 할 때 연관 타입을 사용합니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q3**: 블랭킷 구현이란 무엇인가요?

<div class="quiz-answer">

특정 트레이트를 구현하는 **모든 타입**에 대해 다른 트레이트를 자동으로 구현하는 것입니다. 예: `impl<T: Display> ToString for T`는 `Display`를 구현하는 모든 타입에 `ToString`을 자동 제공합니다.

</div>
</div>

---

<div class="summary-box">

**요약**

- 트레이트는 공유 동작을 정의하며, 기본 구현을 포함할 수 있습니다.
- 트레이트 바운드(`T: Trait`, `where` 절)로 제네릭 타입에 제약을 추가합니다.
- 핵심 표준 트레이트: `Display`, `Debug`, `Clone`, `Copy`, `From/Into`, `PartialEq`, `Default`, `Iterator`.
- `Add`, `Index` 등의 트레이트로 연산자를 오버로딩할 수 있습니다.
- `dyn Trait`(동적 디스패치)는 이질적 컬렉션에 사용하며, 객체 안전성이 필요합니다.
- 연관 타입은 트레이트 구현당 하나의 타입만 지정할 때 사용합니다.
- 블랭킷 구현으로 특정 트레이트를 구현하는 모든 타입에 자동으로 기능을 부여합니다.

</div>
