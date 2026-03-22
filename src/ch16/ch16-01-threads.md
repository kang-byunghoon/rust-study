# 스레드와 move 클로저

## 1. 스레드 생성 — `std::thread::spawn`

### 기본 스레드 생성

```rust,editable
use std::thread;
use std::time::Duration;

fn main() {
    // 새 스레드 생성
    let handle = thread::spawn(|| {
        for i in 1..=5 {
            println!("스레드에서: {}", i);
            thread::sleep(Duration::from_millis(100));
        }
    });

    // 메인 스레드 작업
    for i in 1..=3 {
        println!("메인에서: {}", i);
        thread::sleep(Duration::from_millis(150));
    }

    // 스레드 완료 대기
    handle.join().unwrap();
    println!("모든 스레드 완료!");
}
```

### JoinHandle과 반환값

```rust,editable
use std::thread;

fn main() {
    // 스레드에서 값 반환
    let handle = thread::spawn(|| {
        let mut sum = 0;
        for i in 1..=100 {
            sum += i;
        }
        sum  // 반환값
    });

    // join()은 Result를 반환 — 스레드의 반환값을 꺼낼 수 있음
    let result = handle.join().unwrap();
    println!("1부터 100까지의 합: {}", result);
}
```

---

## 2. `move` 클로저와 스레드

스레드에서 외부 데이터를 사용하려면 `move` 클로저로 소유권을 이전해야 합니다.

```rust,editable
use std::thread;

fn main() {
    let message = String::from("안녕하세요!");

    // move: message의 소유권을 스레드로 이전
    let handle = thread::spawn(move || {
        println!("스레드에서 메시지: {}", message);
    });

    // 여기서 message를 사용하면 컴파일 에러!
    // println!("{}", message);  // ❌ 소유권이 이미 이전됨

    handle.join().unwrap();
}
```

<div class="warning-box">

**왜 `move`가 필요한가요?** 스레드는 생성한 스코프보다 오래 살 수 있습니다. 메인 스레드의 지역 변수가 이미 해제된 후에도 생성된 스레드가 실행될 수 있으므로, 참조가 아닌 **소유권 이전**이 필요합니다.

</div>

### 여러 스레드에서 데이터 공유

```rust,editable
use std::sync::Arc;
use std::thread;

fn main() {
    let data = Arc::new(vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    let mut handles = vec![];

    // 데이터를 4개의 스레드에서 병렬로 처리
    let chunk_size = (data.len() + 3) / 4;

    for i in 0..4 {
        let data = Arc::clone(&data);
        let handle = thread::spawn(move || {
            let start = i * chunk_size;
            let end = (start + chunk_size).min(data.len());
            if start < data.len() {
                let chunk_sum: i32 = data[start..end].iter().sum();
                println!("스레드 {}: [{}-{}) 합계 = {}", i, start, end, chunk_sum);
                chunk_sum
            } else {
                0
            }
        });
        handles.push(handle);
    }

    let total: i32 = handles
        .into_iter()
        .map(|h| h.join().unwrap())
        .sum();

    println!("전체 합계: {}", total);
}
```
