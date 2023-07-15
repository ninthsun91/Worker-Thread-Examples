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


## 타입스크립트에서 worker 사용에 관해

워커를 별도의 파일로 생성한 경우 CommonJS로만 읽을 수 있기 때문에, ts로 생성한 워커를 (`src/worker.ts`) 빌드 없이 `ts-node`와 같은 방식으로 타입스크립트 파일을 직접 실행하면 에러가 발생합니다. 이럴 때 `src/worker.js`와 같은 파일을 만들고, 워커 경로를 지정할때 `.ts`파일이 아니라 `.js`를 지정해주면 됩니다.

Nest.js에서는 파일들이 빌드가 먼저 되기 때문에 해당 문제를 신경쓰지 않고, 파일 확장자만 `.js`로 두고 사용하시면 됩니다.


## AsyncResource

AsyncResource를 이용하면 다수의 콜백들이 Promise화 되어있지 않은 비동기 프로세스를 보다 효과적으로 컨트롤 가능.

만약 사용하지 않았다면, "2-queue" 예시에서 했던 것처럼 어떻게든 작업의 결과를 API의 컨트롤러단까지 가지고 올라와야하는데, 이 작업 때로는 코드를 상당히 지저분하게 만들 수 있음.