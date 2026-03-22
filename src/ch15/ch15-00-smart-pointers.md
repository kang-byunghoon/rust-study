# 스마트 포인터 <span class="badge-advanced">고급</span>

스마트 포인터는 포인터처럼 동작하면서 추가적인 메타데이터와 기능을 제공하는 데이터 구조입니다. Rust에서 가장 기본적인 포인터는 참조(`&`)이지만, 스마트 포인터는 **소유권**을 가지며 데이터를 관리합니다.

<div class="info-box">

**스마트 포인터란?**
스마트 포인터는 일반 참조와 달리 데이터의 **소유권**을 가집니다. `String`과 `Vec<T>`도 사실 스마트 포인터입니다! 스마트 포인터는 보통 `Deref`와 `Drop` 트레이트를 구현합니다.

</div>

## 스마트 포인터 관계도

```mermaid
graph TD
    SP["스마트 포인터"] --> BOX["Box&lt;T&gt;<br/>힙 할당"]
    SP --> RC["Rc&lt;T&gt;<br/>참조 카운팅"]
    SP --> ARC["Arc&lt;T&gt;<br/>스레드 안전 참조 카운팅"]
    SP --> REFCELL["RefCell&lt;T&gt;<br/>내부 가변성"]
    SP --> COW["Cow&lt;T&gt;<br/>Copy on Write"]

    RC --> WEAK["Weak&lt;T&gt;<br/>약한 참조"]
    ARC --> AWEAK["Weak&lt;T&gt;<br/>(Arc용)"]

    RC --> RCREFCELL["Rc&lt;RefCell&lt;T&gt;&gt;<br/>공유 + 가변"]
    ARC --> ARCMUTEX["Arc&lt;Mutex&lt;T&gt;&gt;<br/>스레드 안전 공유 + 가변"]

    style SP fill:#e8f5e9,stroke:#4caf50
    style BOX fill:#e3f2fd,stroke:#2196f3
    style RC fill:#fff3e0,stroke:#ff9800
    style ARC fill:#fce4ec,stroke:#e91e63
    style REFCELL fill:#f3e5f5,stroke:#9c27b0
    style COW fill:#e0f2f1,stroke:#009688
```

이 장에서 다루는 내용:

- [Box, Deref, Drop](ch15-01-box-deref-drop.md) — `Box<T>`로 힙 할당하기, `Deref` 트레이트와 역참조 강제 변환, `Drop` 트레이트
- [Rc와 Arc](ch15-02-rc-arc.md) — `Rc<T>` 참조 카운팅, `Arc<T>` 스레드 안전 참조 카운팅
- [RefCell, Cow, Weak](ch15-03-refcell-cow-weak.md) — `RefCell<T>` 내부 가변성, `Rc<RefCell<T>>` 패턴, `Cow<T>`, `Weak<T>` 순환 참조 방지
