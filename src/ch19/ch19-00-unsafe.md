# unsafe Rust <span class="badge-advanced">고급</span>

Rust의 안전성 보장은 강력하지만, 때로는 컴파일러가 검증할 수 없는 저수준 작업이 필요합니다. `unsafe`는 프로그래머가 컴파일러 대신 안전성을 보증하겠다고 선언하는 것입니다.

<div class="warning-box">

**`unsafe`는 "위험한 코드"가 아닙니다!** `unsafe`는 "컴파일러가 검증할 수 없으니, 프로그래머가 안전성을 보증합니다"라는 뜻입니다. `unsafe` 코드도 올바르게 작성하면 완전히 안전합니다. 핵심은 `unsafe`의 범위를 **최소화**하고, 안전한 추상화로 감싸는 것입니다.

</div>

이 장에서 다루는 내용:

- [원시 포인터와 unsafe 블록](ch19-01-raw-pointers.md) -- unsafe가 존재하는 이유, unsafe 블록과 함수, 원시 포인터(`*const T`, `*mut T`)
- [FFI, 가변 정적 변수, unsafe 트레이트](ch19-02-ffi-and-unsafe-traits.md) -- C 라이브러리 호출(FFI), `static mut`, `unsafe trait`
- [안전한 추상화와 unsafe 최소화](ch19-03-safe-abstractions.md) -- 안전한 API로 감싸기, `split_at_mut` 구현, 최소화 원칙
