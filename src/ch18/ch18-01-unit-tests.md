# 단위 테스트 기초

## 1. 단위 테스트 기초

### `#[test]`와 `#[cfg(test)]`

```rust,editable
// 테스트 대상 함수들
fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("0으로 나눌 수 없습니다".to_string())
    } else {
        Ok(a / b)
    }
}

fn is_even(n: i32) -> bool {
    n % 2 == 0
}

// #[cfg(test)]는 cargo test 실행 시에만 컴파일됨
#[cfg(test)]
mod tests {
    use super::*;  // 상위 모듈의 모든 항목 가져오기

    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn test_add_negative() {
        assert_eq!(add(-1, 1), 0);
    }

    #[test]
    fn test_divide() {
        assert_eq!(divide(10.0, 2.0), Ok(5.0));
    }

    #[test]
    fn test_divide_by_zero() {
        assert!(divide(10.0, 0.0).is_err());
    }

    #[test]
    fn test_is_even() {
        assert!(is_even(4));
        assert!(!is_even(3));
    }
}

fn main() {
    println!("cargo test로 테스트를 실행하세요!");
    println!("위 코드의 테스트 함수들이 실행됩니다.");
}
```

### `assert!`, `assert_eq!`, `assert_ne!`

```rust,editable
#[derive(Debug, PartialEq)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_area() {
        let rect = Rectangle { width: 10, height: 5 };
        // assert_eq!는 실패 시 두 값을 출력 (Debug 필요)
        assert_eq!(rect.area(), 50);
    }

    #[test]
    fn test_not_equal() {
        let r1 = Rectangle { width: 10, height: 5 };
        let r2 = Rectangle { width: 5, height: 10 };
        // assert_ne!는 두 값이 다른지 확인
        assert_ne!(r1, r2);
    }

    #[test]
    fn test_can_hold() {
        let larger = Rectangle { width: 10, height: 8 };
        let smaller = Rectangle { width: 5, height: 3 };

        // assert!는 조건이 true인지 확인
        assert!(larger.can_hold(&smaller));
        assert!(!smaller.can_hold(&larger));
    }

    #[test]
    fn test_with_custom_message() {
        let rect = Rectangle { width: 10, height: 5 };
        assert_eq!(
            rect.area(),
            50,
            "넓이 계산 실패: {}x{} = {} (기대값: 50)",
            rect.width,
            rect.height,
            rect.area()
        );
    }
}

fn main() {
    println!("assert! 매크로 비교:");
    println!("  assert!(조건)      — 조건이 true인지 확인");
    println!("  assert_eq!(a, b)   — a == b 인지 확인 (실패 시 양쪽 값 출력)");
    println!("  assert_ne!(a, b)   — a != b 인지 확인");
    println!("  모든 매크로에 커스텀 메시지 추가 가능");
}
```

---

## 2. `#[should_panic]`과 Result 반환 테스트

### `#[should_panic]`

```rust,editable
fn validate_age(age: i32) -> i32 {
    if age < 0 || age > 150 {
        panic!("유효하지 않은 나이: {}", age);
    }
    age
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic]
    fn test_negative_age() {
        validate_age(-1);  // 패닉이 발생해야 테스트 통과
    }

    #[test]
    #[should_panic(expected = "유효하지 않은 나이")]
    fn test_too_old() {
        validate_age(200);  // "유효하지 않은 나이"를 포함하는 패닉 메시지 확인
    }

    // Result<(), E>를 반환하는 테스트 — ? 연산자 사용 가능
    #[test]
    fn test_result() -> Result<(), String> {
        let age = validate_age(25);
        if age == 25 {
            Ok(())
        } else {
            Err(format!("예상값 25, 실제값 {}", age))
        }
    }
}

fn main() {
    println!("#[should_panic] — 패닉이 발생해야 통과하는 테스트");
    println!("Result 반환 — ? 연산자를 사용할 수 있는 테스트");
}
```

---

## 3. 테스트 실행 옵션

```rust,editable
fn main() {
    println!("=== 테스트 실행 명령어 ===");
    println!();
    println!("기본 실행:");
    println!("  cargo test                    — 모든 테스트 실행");
    println!();
    println!("필터링:");
    println!("  cargo test test_add           — 이름에 'test_add' 포함된 테스트만");
    println!("  cargo test tests::            — tests 모듈의 테스트만");
    println!();
    println!("특수 옵션:");
    println!("  cargo test -- --ignored       — #[ignore] 테스트만 실행");
    println!("  cargo test -- --include-ignored  — 모든 테스트 + ignored 포함");
    println!("  cargo test -- --test-threads=1   — 단일 스레드로 실행 (순차)");
    println!("  cargo test -- --show-output      — 성공한 테스트의 출력도 표시");
    println!("  cargo test -- --nocapture        — 출력 캡처 비활성화");
}
```

### `#[ignore]` 속성

```rust,editable
#[cfg(test)]
mod tests {
    #[test]
    fn quick_test() {
        assert_eq!(2 + 2, 4);
    }

    #[test]
    #[ignore]  // 기본적으로 건너뜀 (느린 테스트에 사용)
    fn expensive_test() {
        // 시간이 오래 걸리는 테스트
        // cargo test -- --ignored 로 실행
        let sum: u64 = (1..=1_000_000).sum();
        assert_eq!(sum, 500_000_500_000);
    }
}

fn main() {
    println!("#[ignore] — 기본 실행에서 제외되는 테스트");
    println!("cargo test -- --ignored 로 따로 실행");
}
```
