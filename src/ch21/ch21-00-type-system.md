# 타입 시스템 심화 <span class="badge-advanced">고급</span>

Rust의 타입 시스템은 컴파일 타임에 안전성을 보장하는 강력한 도구입니다. 이 장에서는 타입 별칭부터 Typestate 패턴까지, 타입 시스템을 활용한 고급 설계 기법을 다룹니다.

이 장에서 다루는 내용:

- **[타입 별칭과 Newtype](./ch21-01-type-aliases-and-newtype.md)** — 타입 별칭, Newtype 패턴, Never 타입
- **[DST와 변환](./ch21-02-dst-and-conversions.md)** — 동적 크기 타입, Sized 트레이트, Deref 강제 변환, AsRef vs Borrow
- **[고급 타입 패턴](./ch21-03-advanced-type-patterns.md)** — 상태 머신, Typestate 패턴, PhantomData, 종합 예제
