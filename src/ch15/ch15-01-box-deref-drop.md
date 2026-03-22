# `Box<T>`, `Deref`, `Drop`

## 1. `Box<T>` — 힙 할당

`Box<T>`는 데이터를 힙에 할당하고, 스택에는 힙 데이터를 가리키는 포인터만 남깁니다.

### 기본 사용법

```rust,editable
fn main() {
    // 스택 대신 힙에 i32 값을 저장
    let b = Box::new(5);
    println!("Box 안의 값: {}", b);

    // Box는 자동으로 역참조됩니다
    let sum = *b + 10;
    println!("합계: {}", sum);

    // Box가 스코프를 벗어나면 힙 메모리가 자동 해제됩니다
}
```

### 재귀적 타입 정의

`Box<T>`의 가장 중요한 사용 사례는 **재귀적 타입**을 만들 때입니다. 컴파일러는 재귀적 구조의 크기를 알 수 없지만, `Box`는 항상 고정 크기(포인터 크기)입니다.

```rust,editable
// 연결 리스트 (Cons List)
#[derive(Debug)]
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
    println!("{:?}", list);

    // 리스트 순회
    fn print_list(list: &List) {
        match list {
            Cons(val, next) => {
                print!("{} -> ", val);
                print_list(next);
            }
            Nil => println!("끝"),
        }
    }

    print_list(&list);
}
```

### 이진 트리 구현

```rust,editable
#[derive(Debug)]
struct TreeNode {
    value: i32,
    left: Option<Box<TreeNode>>,
    right: Option<Box<TreeNode>>,
}

impl TreeNode {
    fn new(value: i32) -> Self {
        TreeNode { value, left: None, right: None }
    }

    fn insert(&mut self, value: i32) {
        if value < self.value {
            match self.left {
                Some(ref mut left) => left.insert(value),
                None => self.left = Some(Box::new(TreeNode::new(value))),
            }
        } else {
            match self.right {
                Some(ref mut right) => right.insert(value),
                None => self.right = Some(Box::new(TreeNode::new(value))),
            }
        }
    }

    fn inorder(&self) {
        if let Some(ref left) = self.left {
            left.inorder();
        }
        print!("{} ", self.value);
        if let Some(ref right) = self.right {
            right.inorder();
        }
    }
}

fn main() {
    let mut root = TreeNode::new(5);
    root.insert(3);
    root.insert(7);
    root.insert(1);
    root.insert(4);
    root.insert(6);
    root.insert(8);

    print!("중위 순회: ");
    root.inorder();
    println!();
}
```

<div class="tip-box">

**`Box<T>`를 사용하는 경우:**
- 컴파일 타임에 크기를 알 수 없는 타입을 사용할 때
- 대량의 데이터의 소유권을 복사 없이 이전할 때
- 트레이트 객체(`Box<dyn Trait>`)를 사용할 때

</div>

---

## 2. `Deref` 트레이트와 역참조 강제 변환

`Deref` 트레이트를 구현하면 역참조 연산자 `*`의 동작을 커스터마이즈할 수 있습니다.

```rust,editable
use std::ops::Deref;

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}

fn hello(name: &str) {
    println!("안녕하세요, {}님!", name);
}

fn main() {
    let x = 5;
    let y = MyBox::new(x);

    assert_eq!(5, x);
    assert_eq!(5, *y);  // *(y.deref()) 와 동일

    // Deref 강제 변환 (Deref Coercion)
    // MyBox<String> -> &String -> &str 로 자동 변환
    let m = MyBox::new(String::from("Rust"));
    hello(&m);  // &MyBox<String>이 &str로 자동 변환!

    // Deref 강제 변환이 없다면 이렇게 써야 합니다:
    // hello(&(*m)[..]);
}
```

```mermaid
graph LR
    A["&MyBox&lt;String&gt;"] -->|"Deref"| B["&String"]
    B -->|"Deref"| C["&str"]

    style A fill:#e3f2fd,stroke:#2196f3
    style B fill:#fff3e0,stroke:#ff9800
    style C fill:#e8f5e9,stroke:#4caf50
```

<div class="info-box">

**Deref 강제 변환 규칙:**
- `&T` → `&U` (T: Deref\<Target=U\>)
- `&mut T` → `&mut U` (T: DerefMut\<Target=U\>)
- `&mut T` → `&U` (T: Deref\<Target=U\>)
  ※ 가변 참조에서 불변 참조로의 변환은 가능하지만, 그 반대는 불가능합니다.

</div>

---

## 3. `Drop` 트레이트와 `std::mem::drop`

`Drop` 트레이트를 사용하면 값이 스코프를 벗어날 때 실행될 코드를 지정할 수 있습니다.

```rust,editable
struct CustomSmartPointer {
    data: String,
}

impl Drop for CustomSmartPointer {
    fn drop(&mut self) {
        println!("CustomSmartPointer 해제: `{}`", self.data);
    }
}

fn main() {
    let a = CustomSmartPointer {
        data: String::from("첫 번째"),
    };
    let b = CustomSmartPointer {
        data: String::from("두 번째"),
    };

    println!("CustomSmartPointer 생성 완료");

    // 스코프가 끝나면 역순으로 drop 됩니다 (b → a)

    // 조기 해제가 필요하면 std::mem::drop 사용
    let c = CustomSmartPointer {
        data: String::from("세 번째"),
    };
    println!("c 생성 완료");
    drop(c);  // 여기서 즉시 해제
    println!("c가 main 끝나기 전에 해제되었습니다");
}
```

<div class="warning-box">

**주의:** `c.drop()`을 직접 호출할 수 없습니다! 이중 해제(double free) 방지를 위해 Rust는 명시적 `.drop()` 호출을 금지합니다. 대신 `std::mem::drop()` 함수를 사용하세요.

</div>
