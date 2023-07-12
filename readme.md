# Express에서 Worker Thread 사용 예시

## 0-client
테스트에 사용한 클라이언트 애플리케이션
- load.js: 동시 요청
- interval.js: 일정 간격으로 요청
- average.js: 하나씩 보내서 평균 응답속도 측정

## 1-basic
기본적인 worker thread 구현

## 2-queue
worker thread를 하나로 제한하고 작업큐로 관리

## 3-pool
worker pool을 구현하여 최소/최대 가동 가능한 worker thread를 제한
