# Rust 학습 가이드 - mdBook 프로젝트 플랜

## 목표

한국어 Rust 학습 가이드를 mdBook으로 제작하여 웹에서 배포한다.
코드 실행, 다이어그램, 진행률 추적, 퀴즈 등 인터랙티브 학습 기능을 포함한다.

---

## 1단계: 프로젝트 기본 세팅

- [ ] `mdbook init` 으로 프로젝트 구조 생성
- [ ] `book.toml` 설정 (한국어, 제목, 저자 등)
- [ ] `SUMMARY.md` 작성 (26개 챕터 목차 → 네비게이션으로 자동 변환)
- [ ] 챕터별 마크다운 파일 생성 (`src/ch01/`, `src/ch02/`, ...)

## 2단계: 핵심 플러그인/기능 설치 및 설정

- [ ] **mdbook-mermaid** — Mermaid 다이어그램 지원
  - 소유권 이동 흐름도, 라이프타임 시각화, 모듈 구조도 등
- [ ] **Rust Playground 연동** — mdBook 기본 내장
  - `rust,editable` 코드 블록으로 브라우저에서 코드 편집/실행
- [ ] **mdbook-quiz** — 챕터별 퀴즈 기능
  - 객관식, O/X, 코드 빈칸 채우기 등
- [ ] **검색 기능** — mdBook 기본 내장 (설정 확인)
- [ ] **다크 모드** — mdBook 기본 테마 (설정 확인)

## 3단계: 커스텀 기능 개발

### 3-1. 학습 진행률 추적 (Local Storage)
- [ ] 커스텀 JS 작성 (`theme/custom.js`)
  - 각 챕터에 "학습 완료" 체크박스 추가
  - localStorage에 진행 상태 저장
  - 사이드바에 진행률 바(%) 표시
  - 전체 진행률 대시보드 (첫 페이지 또는 별도 페이지)

### 3-2. 커스텀 CSS
- [ ] 커스텀 스타일 (`theme/custom.css`)
  - 난이도 배지 스타일 (🟢 기초 / 🟡 중급 / 🔴 고급)
  - 연습문제 박스 스타일
  - 팁/주의/경고 박스 (admonition) 스타일
  - 코드 블록 강조 스타일

## 4단계: 콘텐츠 작성 (챕터별)

각 챕터 구성 템플릿:
```
# 챕터 제목
> 난이도: 🟢 기초 | 예상 학습 시간: 30분

## 개념 설명
- 텍스트 + Mermaid 다이어그램 + SVG 그림

## 예제 코드
- `rust,editable` 블록으로 실행 가능한 코드

## 연습 문제
- 직접 풀어보는 코드 문제 (빈칸 or 수정 과제)

## 퀴즈
- mdbook-quiz로 개념 확인

## 핵심 정리
- 요약 박스

[✅ 학습 완료 체크]
```

### 우선 작성할 챕터 (1~6: 기초)
- [ ] Ch1. 시작하기
- [ ] Ch2. 기본 문법
- [ ] Ch3. 소유권
- [ ] Ch4. 구조체
- [ ] Ch5. 열거형과 패턴 매칭
- [ ] Ch6. 컬렉션

### 이후 작성 (7~12: 중급)
- [ ] Ch7~12 (에러 처리, 제네릭, 트레이트, 라이프타임, 클로저, 반복자)

### 이후 작성 (13~26: 중급~고급)
- [ ] Ch13~26 (모듈, Cargo, 스마트 포인터, 동시성, 비동기, 매크로, 실전 등)

## 5단계: 다이어그램 및 그림

- [ ] **Mermaid 다이어그램** (코드로 작성, 별도 도구 불필요)
  - 소유권 이동 흐름도
  - 빌림 규칙 다이어그램
  - 모듈/크레이트 구조도
  - 비동기 실행 흐름
  - 스마트 포인터 관계도
  - 에러 처리 흐름
- [ ] **SVG 그림** (`src/images/`)
  - 스택/힙 메모리 레이아웃
  - String vs &str 내부 구조
  - Vec 메모리 구조
  - 참조 카운팅 다이어그램

## 6단계: GitHub Actions 자동 배포

- [ ] `.github/workflows/deploy.yml` 작성
  - main 브랜치 push 시 자동 빌드
  - `mdbook build` 실행
  - GitHub Pages로 배포
- [ ] GitHub Pages 설정 (Settings → Pages → GitHub Actions)

## 7단계: 마무리

- [ ] 전체 빌드 테스트 (`mdbook build`)
- [ ] 로컬 서버 확인 (`mdbook serve`)
- [ ] 모바일 반응형 확인
- [ ] 코드 실행 테스트 (Playground 연동)
- [ ] 진행률 추적 테스트 (localStorage)
- [ ] 퀴즈 동작 테스트

---

## 기술 스택 요약

| 구분 | 도구 |
|------|------|
| 프레임워크 | mdBook |
| 다이어그램 | Mermaid (mdbook-mermaid) |
| 그림 | SVG, PNG |
| 코드 실행 | Rust Playground (내장) |
| 퀴즈 | mdbook-quiz |
| 진행률 추적 | Custom JS + localStorage |
| 스타일링 | Custom CSS |
| 배포 | GitHub Pages + GitHub Actions |
| CI/CD | GitHub Actions |

---

## 파일 구조 (최종)

```
rust-study/
├── book.toml
├── .github/
│   └── workflows/
│       └── deploy.yml
├── theme/
│   ├── custom.js          # 진행률 추적 JS
│   └── custom.css         # 커스텀 스타일
└── src/
    ├── SUMMARY.md         # 목차 (네비게이션)
    ├── introduction.md    # 소개 + 진행률 대시보드
    ├── images/            # SVG, PNG 그림
    ├── ch01/
    │   ├── ch01-00-getting-started.md
    │   ├── ch01-01-what-is-rust.md
    │   ├── ch01-02-installation.md
    │   └── ...
    ├── ch02/
    │   ├── ch02-00-basic-syntax.md
    │   └── ...
    └── ...
```
