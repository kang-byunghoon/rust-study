# 직렬화와 역직렬화 <span class="badge-advanced">고급</span>

Rust에서 데이터를 JSON, TOML, YAML, CSV 등 다양한 형식으로 변환하려면 **serde** 생태계를 사용합니다. serde는 "**Ser**ialize / **De**serialize"의 약자로, Rust에서 가장 널리 사용되는 직렬화 프레임워크입니다.

이 장에서 다루는 내용:

- **[serde 기본](./ch22-01-serde-basics.md)** — Serialize/Deserialize 기본, serde_json 심화, TOML/YAML/CSV 지원
- **[serde 심화](./ch22-02-serde-advanced.md)** — serde 어트리뷰트, 커스텀 직렬화, 실전 설정 파일 파싱
