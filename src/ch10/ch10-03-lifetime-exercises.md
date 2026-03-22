# 라이프타임 실전 연습

## 연습문제

<div class="exercise-box">

**연습 1**: 아래 코드가 컴파일되지 않는 이유를 설명하고 수정하세요.

```rust,editable
// 수정 전 (컴파일 에러)
/*
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() { x } else { y }
}
*/

// TODO: 라이프타임 어노테이션을 추가하여 수정하세요
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let result;
    let s1 = String::from("hello");
    {
        let s2 = String::from("hi");
        result = longest(s1.as_str(), s2.as_str());
        println!("결과: {}", result); // 이 위치에서만 사용 가능
    }
}
```

</div>

<div class="exercise-box">

**연습 2**: 라이프타임을 포함하는 `Config` 구조체를 완성하세요.

```rust,editable
#[derive(Debug)]
struct Config<'a> {
    name: &'a str,
    values: Vec<&'a str>,
}

impl<'a> Config<'a> {
    fn new(name: &'a str) -> Self {
        Config {
            name,
            values: Vec::new(),
        }
    }

    fn add_value(&mut self, value: &'a str) {
        self.values.push(value);
    }

    // TODO: 가장 긴 값을 반환하는 메서드를 구현하세요
    fn longest_value(&self) -> Option<&&str> {
        self.values.iter().max_by_key(|v| v.len())
    }
}

fn main() {
    let mut config = Config::new("앱 설정");
    config.add_value("짧은");
    config.add_value("중간 길이의 값");
    config.add_value("아주 매우 긴 설정 값입니다");

    println!("{:?}", config);
    println!("가장 긴 값: {:?}", config.longest_value());
}
```

</div>

---

## 퀴즈

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q1**: 라이프타임 어노테이션은 참조의 수명을 변경하나요?

<div class="quiz-answer">

아니요, 라이프타임 어노테이션은 참조의 수명을 **변경하지 않습니다**. 여러 참조 간의 수명 **관계**를 컴파일러에게 알려주어, 유효하지 않은 참조를 방지하는 역할만 합니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q2**: 라이프타임 생략 규칙 3가지를 설명하세요.

<div class="quiz-answer">

1. 각 참조 매개변수에 **고유한 라이프타임**이 부여됩니다.
2. 참조 매개변수가 **하나**뿐이면, 그 라이프타임이 모든 출력 참조에 적용됩니다.
3. 메서드에서 `&self` 또는 `&mut self`가 있으면, **self의 라이프타임**이 출력 참조에 적용됩니다.

</div>
</div>

<div class="quiz-box" onclick="this.classList.toggle('show-answer')">

**Q3**: `'static` 라이프타임은 언제 사용되나요?

<div class="quiz-answer">

`'static`은 프로그램의 **전체 실행 기간** 동안 유효한 참조에 사용됩니다. 문자열 리터럴(`&str`)이 대표적인 예입니다. 바이너리에 직접 포함되어 프로그램이 끝날 때까지 존재합니다. 트레이트 바운드로도 사용할 수 있습니다(`T: 'static`).

</div>
</div>

---

<div class="summary-box">

**요약**

- 라이프타임은 참조가 유효한 **범위**를 나타내며, 댕글링 참조를 방지합니다.
- `'a` 같은 라이프타임 어노테이션은 참조 간의 **관계**를 명시합니다.
- 구조체에 참조 필드가 있으면 반드시 라이프타임을 명시해야 합니다.
- 생략 규칙 3가지로 대부분의 라이프타임을 자동 추론합니다.
- `'static`은 프로그램 전체 기간 동안 유효한 참조입니다.
- 라이프타임은 컴파일 타임에만 검사되며 런타임 비용이 없습니다.

</div>
