# Iterator 트레이트와 어댑터

## 1. Iterator 트레이트와 next()

```rust,editable
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];

    // iter()로 반복자 생성
    let mut iter = numbers.iter();

    // next()로 하나씩 꺼내기
    println!("{:?}", iter.next()); // Some(1)
    println!("{:?}", iter.next()); // Some(2)
    println!("{:?}", iter.next()); // Some(3)
    println!("{:?}", iter.next()); // Some(4)
    println!("{:?}", iter.next()); // Some(5)
    println!("{:?}", iter.next()); // None

    // for 루프는 내부적으로 반복자를 사용
    for n in &numbers {
        print!("{} ", n);
    }
    println!();
}
```

<div class="info-box">

**Iterator 트레이트 정의**:

```rust
trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
    // ... 수십 가지 기본 메서드 제공
}
```

`next()` 하나만 구현하면 `map`, `filter`, `collect` 등 모든 어댑터와 소비자를 무료로 사용할 수 있습니다.

</div>

---

## 2. iter(), iter_mut(), into_iter()

```rust,editable
fn main() {
    let mut names = vec![
        String::from("Alice"),
        String::from("Bob"),
        String::from("Charlie"),
    ];

    // iter(): 불변 참조 (&T)
    println!("== iter() ==");
    for name in names.iter() {
        println!("  {} (길이: {})", name, name.len());
    }

    // iter_mut(): 가변 참조 (&mut T)
    println!("== iter_mut() ==");
    for name in names.iter_mut() {
        name.push_str("!");
    }
    println!("  수정 후: {:?}", names);

    // into_iter(): 소유권 이동 (T)
    println!("== into_iter() ==");
    for name in names.into_iter() {
        println!("  소유: {}", name);
    }
    // println!("{:?}", names); // 에러! 소유권 이동됨
}
```

| 메서드 | 반환 타입 | 소유권 | 원본 사용 |
|--------|-----------|--------|-----------|
| `iter()` | `&T` | 빌림 | 가능 |
| `iter_mut()` | `&mut T` | 가변 빌림 | 가능 |
| `into_iter()` | `T` | 이동 | 불가 |

---

## 3. 어댑터 (Adapters) — 지연 평가

어댑터는 반복자를 다른 반복자로 변환합니다. **지연 평가**이므로 소비자가 호출될 때까지 실행되지 않습니다.

```rust,editable
fn main() {
    let numbers: Vec<i32> = (1..=10).collect();

    // map: 각 요소를 변환
    let doubled: Vec<i32> = numbers.iter().map(|&x| x * 2).collect();
    println!("map (두 배): {:?}", doubled);

    // filter: 조건에 맞는 요소만 선택
    let evens: Vec<&i32> = numbers.iter().filter(|&&x| x % 2 == 0).collect();
    println!("filter (짝수): {:?}", evens);

    // enumerate: 인덱스와 함께
    for (i, &val) in numbers.iter().enumerate().take(3) {
        println!("  [{}] = {}", i, val);
    }

    // zip: 두 반복자를 묶기
    let names = vec!["Alice", "Bob", "Charlie"];
    let scores = vec![95, 87, 92];
    let pairs: Vec<_> = names.iter().zip(scores.iter()).collect();
    println!("zip: {:?}", pairs);

    // chain: 두 반복자를 연결
    let first = vec![1, 2, 3];
    let second = vec![4, 5, 6];
    let combined: Vec<&i32> = first.iter().chain(second.iter()).collect();
    println!("chain: {:?}", combined);

    // flat_map: 각 요소를 반복자로 변환 후 평탄화
    let sentences = vec!["hello world", "foo bar baz"];
    let words: Vec<&str> = sentences.iter().flat_map(|s| s.split_whitespace()).collect();
    println!("flat_map: {:?}", words);

    // take, skip
    let first_three: Vec<&i32> = numbers.iter().take(3).collect();
    let skip_five: Vec<&i32> = numbers.iter().skip(5).collect();
    println!("take(3): {:?}", first_three);
    println!("skip(5): {:?}", skip_five);
}
```
