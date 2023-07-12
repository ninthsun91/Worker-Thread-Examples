## 설치 및 사용

### 그냥 로컬로 돌릴 경우
```
$ npm install
$ npm start
```

### docker로 리소스 사용을 보면서 돌릴 경우
```
// 이미지 빌드
$ docker build -t worker-pool .

// 컨테이너 실행
$ docker run -dp 3000:3000 -m 1g --name worker-pool worker-pool

// 도커 모니터링
$ docker stats
```

## API

### /workers/primes/:max

1부터 max까지 소수를 워커 스레드에서 계산


## AsyncResource

AsyncResource를 이용하면 다수의 콜백들이 Promise화 되어있지 않은 비동기 프로세스를 보다 효과적으로 컨트롤 가능.

만약 사용하지 않았다면, "2-queue" 예시에서 했던 것처럼 어떻게든 작업의 결과를 API의 컨트롤러단까지 가지고 올라와야하는데, 이 작업 때로는 코드를 상당히 지저분하게 만들 수 있음.