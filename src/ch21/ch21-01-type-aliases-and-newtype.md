# 타입 별칭과 Newtype 패턴

## 21.1 타입 별칭 (Type Aliases)

`type` 키워드를 사용하면 기존 타입에 새로운 이름을 부여할 수 있습니다. 이는 복잡한 타입을 간결하게 표현할 때 유용합니다.

```rust,editable
use std::collections::HashMap;

// 복잡한 타입에 별칭 부여
type UserMap = HashMap<String, Vec<(u32, String)>>;
type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

fn get_users() -> UserMap {
    let mut map = UserMap::new();
    map.insert(
        "admin".to_string(),
        vec![(1, "Alice".to_string()), (2, "Bob".to_string())],
    );
    map
}

fn process() -> Result<()> {
    let users = get_users();
    for (role, members) in &users {
        println!("{}: {:?}", role, members);
    }
    Ok(())
}

fn main() {
    process().unwrap();
}
```

<div class="info-box">
<strong>ℹ️ 타입 별칭 vs Newtype</strong><br>
타입 별칭은 단순한 이름 변경일 뿐, 원래 타입과 완전히 동일하게 취급됩니다. 타입 안전성이 필요하면 Newtype 패턴을 사용하세요.
</div>

### 함수 포인터 타입 별칭

```rust,editable
// 콜백 함수 타입을 별칭으로 정의
type Callback = fn(i32, i32) -> i32;
type AsyncHandler = Box<dyn Fn(String) -> String>;

fn apply(f: Callback, a: i32, b: i32) -> i32 {
    f(a, b)
}

fn main() {
    let add: Callback = |a, b| a + b;
    let mul: Callback = |a, b| a * b;

    println!("add(3, 4) = {}", apply(add, 3, 4));
    println!("mul(3, 4) = {}", apply(mul, 3, 4));

    let handlers: Vec<AsyncHandler> = vec![
        Box::new(|s| format!("[INFO] {}", s)),
        Box::new(|s| format!("[WARN] {}", s)),
    ];

    for handler in &handlers {
        println!("{}", handler("서버 시작됨".to_string()));
    }
}
```

---

## 21.2 Newtype 패턴

튜플 구조체로 기존 타입을 감싸서 새로운 타입을 만드는 패턴입니다. 타입 안전성을 높이고, 외부 타입에 트레이트를 구현할 수 있게 합니다.

```rust,editable
// 단위를 구분하는 Newtype
struct Meters(f64);
struct Kilometers(f64);
struct Seconds(f64);

impl Meters {
    fn to_kilometers(&self) -> Kilometers {
        Kilometers(self.0 / 1000.0)
    }
}

// 속도 계산: 단위 혼동 방지
fn speed(distance: Kilometers, time: Seconds) -> f64 {
    distance.0 / time.0
}

fn main() {
    let d = Meters(4200.0);
    let t = Seconds(3600.0);

    let km = d.to_kilometers();
    println!("거리: {}km", km.0);
    println!("속도: {}km/s", speed(km, t));

    // 아래 코드는 컴파일 에러 - 타입 안전!
    // speed(d, t); // Meters와 Seconds를 직접 전달할 수 없음
}
```

### 외부 타입에 트레이트 구현하기

고아 규칙(orphan rule)으로 인해 외부 크레이트의 타입에 외부 트레이트를 직접 구현할 수 없지만, Newtype으로 감싸면 가능합니다.

```rust,editable
use std::fmt;

// Vec<String>에 Display를 구현하고 싶다면?
struct PrettyList(Vec<String>);

impl fmt::Display for PrettyList {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}

// Deref로 내부 메서드 위임
impl std::ops::Deref for PrettyList {
    type Target = Vec<String>;
    fn deref(&self) -> &Vec<String> {
        &self.0
    }
}

fn main() {
    let list = PrettyList(vec![
        "Rust".to_string(),
        "Go".to_string(),
        "Python".to_string(),
    ]);

    // Display 트레이트 사용
    println!("언어 목록: {}", list);

    // Deref 덕분에 Vec의 메서드도 사용 가능
    println!("개수: {}", list.len());
    println!("첫 번째: {}", list[0]);
}
```

---

## 21.3 Never 타입 (`!`)

Never 타입(`!`)은 절대 반환하지 않는 함수(발산 함수)의 반환 타입입니다.

```rust,editable
// 발산 함수: 절대 반환하지 않음
fn exit_program() -> ! {
    std::process::exit(1);
}

// panic!도 ! 타입을 반환
fn divide(a: f64, b: f64) -> f64 {
    if b == 0.0 {
        panic!("0으로 나눌 수 없습니다!"); // ! 타입
    }
    a / b
}

fn main() {
    // match에서 ! 타입의 활용
    let input = "42";
    let value: i32 = match input.parse() {
        Ok(v) => v,
        Err(_) => panic!("파싱 실패"), // ! 는 어떤 타입으로든 강제 변환됨
    };
    println!("값: {}", value);

    // loop도 ! 타입이 될 수 있음
    // let _never = loop { break 42; }; // 이 경우는 i32
    println!("결과: {}", divide(10.0, 3.0));
}
```

<div class="info-box">
<strong>ℹ️ Never 타입의 특성</strong><br>
<code>!</code> 타입은 모든 타입으로 강제 변환(coerce)될 수 있습니다. 이 때문에 <code>match</code>의 한 가지 arm에서 <code>panic!</code>이나 <code>continue</code>를 사용해도 다른 arm의 타입과 일치시킬 수 있습니다.
</div>
