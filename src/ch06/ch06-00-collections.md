# 컬렉션 <span class="badge-beginner">기초</span>

Rust의 표준 라이브러리에는 여러 데이터를 저장하는 **컬렉션** 타입이 있습니다. 배열이나 튜플과 달리, 컬렉션의 데이터는 **힙에 저장**되므로 컴파일 타임에 크기를 알 필요가 없고 프로그램 실행 중에 크기가 변할 수 있습니다.

## 이 장에서 배울 내용

```mermaid
mindmap
  root((컬렉션))
    벡터 Vec\<T\>
      생성과 수정
      접근과 반복
      소유권과 빌림
      다양한 타입 저장
    문자열 String
      String vs &str
      생성과 결합
      UTF-8 인코딩
      슬라이싱 주의점
    해시맵 HashMap
      생성과 접근
      entry API
      소유권 규칙
      활용 예제
```

## 학습 로드맵

| 순서 | 주제 | 핵심 개념 | 난이도 |
|------|------|-----------|--------|
| 6.1 | [벡터](./ch06-01-vectors.md) | `Vec<T>`, `vec![]`, 인덱싱, 반복 | ⭐⭐ |
| 6.2 | [문자열](./ch06-02-strings.md) | `String`, `&str`, UTF-8, 슬라이싱 | ⭐⭐⭐ |
| 6.3 | [해시맵](./ch06-03-hashmaps.md) | `HashMap`, `entry`, 소유권 | ⭐⭐ |

<div class="info-box">

**왜 컬렉션이 중요한가요?**

실제 프로그래밍에서 데이터는 대부분 여러 개입니다:

- **사용자 목록** → 벡터(`Vec<T>`)
- **텍스트 처리** → 문자열(`String`)
- **설정값, 캐시** → 해시맵(`HashMap<K, V>`)

이 세 가지 컬렉션은 Rust에서 가장 자주 사용되며, 소유권 시스템과 밀접하게 연관되어 있어 Rust의 핵심 개념을 실전에서 적용하는 좋은 연습이 됩니다.

</div>

## 컬렉션 비교

```mermaid
graph LR
    subgraph "Vec<T>"
        V1["순서 있는 목록"]
        V2["인덱스로 접근"]
        V3["동적 크기"]
    end
    subgraph "String"
        S1["UTF-8 텍스트"]
        S2["바이트 시퀀스"]
        S3["인덱싱 불가"]
    end
    subgraph "HashMap<K,V>"
        H1["키-값 쌍"]
        H2["해시로 빠른 검색"]
        H3["순서 없음"]
    end

    style V1 fill:#e3f2fd,stroke:#333
    style V2 fill:#e3f2fd,stroke:#333
    style V3 fill:#e3f2fd,stroke:#333
    style S1 fill:#e8f5e9,stroke:#333
    style S2 fill:#e8f5e9,stroke:#333
    style S3 fill:#e8f5e9,stroke:#333
    style H1 fill:#fff3e0,stroke:#333
    style H2 fill:#fff3e0,stroke:#333
    style H3 fill:#fff3e0,stroke:#333
```

<div class="tip-box">

**학습 팁**: 컬렉션을 사용할 때 소유권과 빌림 규칙이 어떻게 적용되는지 주의 깊게 살펴보세요. 특히 벡터에서 요소를 빌린 상태에서 벡터를 수정하려 할 때 발생하는 문제는 Rust 초보자가 가장 많이 만나는 컴파일 에러 중 하나입니다.

</div>
