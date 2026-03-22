# 클로저 기본 문법과 캡처 모드

## 1. 클로저 기본 문법

```rust,editable
fn main() {
    // 기본 클로저
    let add = |a, b| a + b;
    println!("3 + 5 = {}", add(3, 5));

    // 타입 명시
    let multiply = |a: i32, b: i32| -> i32 { a * b };
    println!("4 * 6 = {}", multiply(4, 6));

    // 여러 줄 클로저
    let classify = |n: i32| {
        if n > 0 {
            "양수"
        } else if n < 0 {
            "음수"
        } else {
            "영"
        }
    };
    println!("7은 {}", classify(7));
    println!("-3은 {}", classify(-3));
    println!("0은 {}", classify(0));

    // 매개변수 없는 클로저
    let greet = || println!("안녕하세요!");
    greet();
}
```

---

## 2. 캡처 모드

클로저는 환경 변수를 세 가지 방식으로 캡처합니다.

```rust,editable
fn main() {
    // 1. 불변 참조로 캡처 (Fn)
    let name = String::from("Rust");
    let greet = || println!("안녕, {}!", name);
    greet();
    greet(); // 여러 번 호출 가능
    println!("원본 사용 가능: {}", name); // 원본도 사용 가능

    // 2. 가변 참조로 캡처 (FnMut)
    let mut count = 0;
    let mut increment = || {
        count += 1;
        println!("카운트: {}", count);
    };
    increment();
    increment();
    // println!("{}", count); // increment가 살아있는 동안 접근 불가
    drop(increment); // 클로저 해제
    println!("최종 카운트: {}", count);

    // 3. 소유권 이동 (FnOnce)
    let data = vec![1, 2, 3];
    let consume = || {
        println!("데이터 소비: {:?}", data);
        drop(data); // 소유권 가져옴 -> 소비
    };
    consume();
    // consume(); // 에러! 이미 소비됨
    // println!("{:?}", data); // 에러! 소유권 이동됨
}
```

### move 키워드

```rust,editable
use std::thread;

fn main() {
    let message = String::from("안녕하세요");

    // move: 캡처된 변수의 소유권을 클로저로 강제 이동
    let handle = thread::spawn(move || {
        println!("스레드에서: {}", message);
    });

    // println!("{}", message); // 에러! 소유권 이동됨
    handle.join().unwrap();

    // move로 Copy 타입 캡처 시 복사됨
    let x = 42;
    let closure = move || println!("x = {}", x);
    closure();
    println!("원본 x = {}", x); // Copy 타입이므로 여전히 사용 가능
}
```

<div class="info-box">

**캡처 모드 결정 기준**: 컴파일러가 클로저 본문을 분석하여 **가장 제한적이지 않은** 캡처 모드를 자동 선택합니다.

- 읽기만 하면 → 불변 참조 (`Fn`)
- 수정하면 → 가변 참조 (`FnMut`)
- 소유권이 필요하면 → 이동 (`FnOnce`)

</div>
