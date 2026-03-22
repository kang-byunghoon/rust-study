# 제네릭 실전 연습

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
