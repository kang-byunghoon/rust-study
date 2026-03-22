# 라이프타임 기초

## 1. 라이프타임이란?

모든 참조에는 라이프타임이 있습니다. 대부분의 경우 컴파일러가 자동으로 추론하지만, 모호한 경우 명시적으로 지정해야 합니다.

```rust,editable
fn main() {
    let r;                     // -----+-- 'a
    {                          //      |
        let x = 5;             // -+-- 'b
        r = &x;                //  |   // 에러! x는 여기서 소멸
    }                          // -+
    // println!("{}", r);      // 'b는 끝났지만 r은 'a까지 살아야 함
    // 위 코드는 컴파일 에러! 댕글링 참조 방지

    // 올바른 코드
    let x = 5;                 // -----+-- 'a
    let r = &x;                //      |-- 'a (x와 같은 스코프)
    println!("r = {}", r);     //      |
}
```

---

## 2. 함수에서의 라이프타임 어노테이션

```rust,editable
// 라이프타임 어노테이션: 반환된 참조가 어떤 입력과 같은 수명을 갖는지 명시
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

// 라이프타임이 다른 경우
fn first_word<'a>(s: &'a str) -> &'a str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[..i];
        }
    }
    s
}

fn main() {
    let string1 = String::from("긴 문자열입니다");
    let result;

    {
        let string2 = String::from("짧은");
        result = longest(string1.as_str(), string2.as_str());
        println!("더 긴 문자열: {}", result);
    }
    // 주의: result를 여기서 사용하면 컴파일 에러!
    // string2의 라이프타임이 끝났기 때문

    let word = first_word("hello world");
    println!("첫 단어: {}", word);
}
```

<div class="info-box">

**핵심 규칙**: 라이프타임 어노테이션은 참조의 수명을 변경하지 않습니다. 단지 여러 참조 사이의 **관계**를 컴파일러에게 알려줄 뿐입니다.

`'a`는 "x와 y 중 더 짧은 라이프타임"을 의미합니다.

</div>

---

## 3. 구조체에서의 라이프타임

참조를 포함하는 구조체는 반드시 라이프타임을 명시해야 합니다.

```rust,editable
#[derive(Debug)]
struct Excerpt<'a> {
    text: &'a str,
}

impl<'a> Excerpt<'a> {
    fn level(&self) -> i32 {
        3
    }

    // 반환 타입이 &self의 라이프타임을 따름 (생략 규칙 3)
    fn announce(&self, announcement: &str) -> &str {
        println!("주의: {}", announcement);
        self.text
    }
}

fn main() {
    let novel = String::from("어느 날 아침. 그리고 그 다음 날...");
    let first_sentence;

    {
        let first_dot = novel.find('.').unwrap_or(novel.len());
        first_sentence = Excerpt {
            text: &novel[..first_dot],
        };
        println!("발췌: {:?}", first_sentence);
        println!("레벨: {}", first_sentence.level());
    }
}
```
