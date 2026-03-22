# 단형성화와 Const 제네릭

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
