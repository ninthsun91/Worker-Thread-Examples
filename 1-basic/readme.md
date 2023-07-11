## 설치 및 사용

### 그냥 로컬로 돌릴 경우
```
$ npm install
$ npm start
```

### docker로 리소스 사용을 보면서 돌릴 경우
```
// 이미지 빌드
$ docker build -t worker-basic .

// 컨테이너 실행
$ docker run -dp 3000:3000 -m 1g --name worker-basic worker-basic

// 도커 모니터링
$ docker stats
```

## API

### /primes/:max

1부터 max까지 소수를 api 서버 메인 스레드에서 계산

### /workers/wait

아무 동작하지 않는 워커 실행 후, 30초 후에 종료.

### /workers/primes/:max

1부터 max까지 소수를 워커 스레드에서 계산