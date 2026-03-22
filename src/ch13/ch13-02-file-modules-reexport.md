# 파일 기반 모듈과 재내보내기

## 4. 파일 기반 모듈 구조

<div class="info-box">

**두 가지 파일 구조 방식**

**방식 1: `mod.rs` 사용 (구 방식)**
```
src/
├── main.rs
├── network/
│   ├── mod.rs        // mod network 정의
│   ├── client.rs     // mod client
│   └── server.rs     // mod server
```

**방식 2: 파일명 사용 (신 방식, 권장)**
```
src/
├── main.rs
├── network.rs        // mod network 정의
├── network/
│   ├── client.rs     // mod client
│   └── server.rs     // mod server
```

두 방식 모두 동일하게 동작합니다. 최신 Rust에서는 **방식 2**를 권장합니다.

</div>

```rust,editable
// 파일 구조를 인라인 모듈로 시뮬레이션
// 실제로는 별도 파일에 작성합니다.

// src/network.rs에 해당
mod network {
    pub mod client {
        pub fn connect(addr: &str) {
            println!("클라이언트: {}에 연결", addr);
        }
    }

    pub mod server {
        pub fn listen(port: u16) {
            println!("서버: 포트 {}에서 대기", port);
        }
    }
}

fn main() {
    network::client::connect("127.0.0.1:8080");
    network::server::listen(3000);
}
```

---

## 5. 재내보내기 (Re-exporting)

```rust,editable
mod database {
    mod connection {
        pub struct Pool {
            pub size: usize,
        }

        impl Pool {
            pub fn new(size: usize) -> Self {
                Pool { size }
            }

            pub fn connect(&self) {
                println!("연결 풀 (크기: {})", self.size);
            }
        }
    }

    mod query {
        pub fn execute(sql: &str) {
            println!("쿼리 실행: {}", sql);
        }
    }

    // pub use로 내부 구조를 상위 모듈에서 직접 접근 가능하게 만듦
    pub use connection::Pool;
    pub use query::execute;
}

fn main() {
    // 재내보내기 덕분에 깊은 경로 대신 간단하게 접근
    let pool = database::Pool::new(10);
    pool.connect();
    database::execute("SELECT * FROM users");

    // 재내보내기 없이는:
    // database::connection::Pool::new(10); // connection이 비공개이므로 에러!
}
```

<div class="tip-box">

**팁**: `pub use`는 라이브러리의 **공개 API를 설계**할 때 핵심적입니다. 내부 구조를 변경해도 외부 사용자에게 영향을 주지 않도록 안정적인 API를 제공할 수 있습니다.

</div>

---

## 6. use 그룹 가져오기

```rust,editable
// 중첩된 use 문
use std::collections::{HashMap, HashSet, BTreeMap};
use std::io::{self, Read, Write};

// self는 모듈 자체를 가져옴
// 위 코드는 아래와 동일:
// use std::io;
// use std::io::Read;
// use std::io::Write;

// 글롭(glob) 연산자: 모든 공개 항목 가져오기 (비권장)
// use std::collections::*;

fn main() {
    let mut map = HashMap::new();
    map.insert("key", "value");

    let mut set = HashSet::new();
    set.insert(42);

    let mut tree = BTreeMap::new();
    tree.insert(1, "one");

    println!("HashMap: {:?}", map);
    println!("HashSet: {:?}", set);
    println!("BTreeMap: {:?}", tree);
}
```
