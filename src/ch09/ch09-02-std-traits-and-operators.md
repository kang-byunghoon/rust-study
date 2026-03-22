# 표준 트레이트와 연산자 오버로딩

## 4. 핵심 표준 트레이트

```rust,editable
use std::fmt;

#[derive(Debug, Clone, PartialEq, Default)]
struct Color {
    r: u8,
    g: u8,
    b: u8,
}

// Display 트레이트 구현
impl fmt::Display for Color {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "#{:02X}{:02X}{:02X}", self.r, self.g, self.b)
    }
}

// From 트레이트 구현
impl From<(u8, u8, u8)> for Color {
    fn from((r, g, b): (u8, u8, u8)) -> Self {
        Color { r, g, b }
    }
}

fn main() {
    let red = Color { r: 255, g: 0, b: 0 };
    let blue = Color::from((0, 0, 255));
    let default_color = Color::default(); // (0, 0, 0)

    // Display
    println!("빨강: {}", red);
    // Debug
    println!("파랑: {:?}", blue);
    // Clone
    let red_clone = red.clone();
    // PartialEq
    println!("같은가? {}", red == red_clone);
    // Into (From이 있으면 자동 제공)
    let green: Color = (0_u8, 255_u8, 0_u8).into();
    println!("초록: {}", green);
    println!("기본값: {}", default_color);
}
```

---

## 5. 연산자 오버로딩

```rust,editable
use std::ops::{Add, Index};

#[derive(Debug, Clone, Copy)]
struct Vec2 {
    x: f64,
    y: f64,
}

impl Add for Vec2 {
    type Output = Vec2;

    fn add(self, other: Vec2) -> Vec2 {
        Vec2 {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

impl std::fmt::Display for Vec2 {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

// Index 트레이트로 [] 연산자 오버로딩
struct Grid {
    data: Vec<Vec<i32>>,
}

impl Index<(usize, usize)> for Grid {
    type Output = i32;

    fn index(&self, (row, col): (usize, usize)) -> &i32 {
        &self.data[row][col]
    }
}

fn main() {
    let a = Vec2 { x: 1.0, y: 2.0 };
    let b = Vec2 { x: 3.0, y: 4.0 };
    println!("{} + {} = {}", a, b, a + b);

    let grid = Grid {
        data: vec![vec![1, 2, 3], vec![4, 5, 6]],
    };
    println!("grid[(1,2)] = {}", grid[(1, 2)]);
}
```
