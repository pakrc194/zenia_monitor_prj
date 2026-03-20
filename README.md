# 🖥️ Vision MES Monitoring System

산업 설비 모니터링을 위한 MES 기반 웹 애플리케이션입니다.  
실시간 장비 상태, 검사 데이터, 알람 관리 기능을 제공합니다.

---

## 📁 프로젝트 구조

```
zenia_monitor_prj/
├── backend/
│   └── src/main/
│       ├── java/com/example/monitor/
│       │   ├── controller/    # REST API 엔드포인트
│       │   ├── cors/          # Spring Security / JWT 설정
│       │   ├── dto/           # 데이터 전송 객체
│       │   ├── mapper/        # MyBatis 인터페이스
│       │   └── service/       # 비즈니스 로직
│       └── resources/
│           ├── application.yml
│           └── mapper/        # MyBatis XML 쿼리
│
└── frontend/
    └── src/
        ├── assets/            # 이미지 등 정적 파일
        ├── components/        # 공통 컴포넌트
        ├── data/              # axios 설정
        ├── pages/             # 페이지 컴포넌트
        └── utils/             # 유틸 함수
```

---

## ⚙️ Backend

### 기술 스택

| 항목 | 버전 |
|------|------|
| Spring Boot | 4.0.3 |
| Java | 21 |
| IDE | STS 4.29.1 |
| Build | Maven |
| ORM | MyBatis |
| DB | MariaDB |
| 인증 | JWT (jjwt 0.12.3) |
| API 문서 | Swagger |
| 아키텍처 | MVC 패턴 |

### 주요 기능

- JWT 기반 로그인 / 로그아웃
- Access Token + Refresh Token 발급 및 갱신
- Refresh Token MariaDB 저장 관리
- Role 기반 권한 처리 (ROLE_ADMIN, ROLE_USER)
- Swagger UI를 통한 API 문서 자동화

### 실행 방법

```bash
# 1. .env 파일 생성 (프로젝트 루트)
DB_URL=jdbc:mariadb://localhost:3306/yourdb
DB_USER=your_db_user
DB_PW=your_db_password
JWT_SECRET=your_jwt_secret_key

# 2. Maven 빌드 및 실행
mvn spring-boot:run
```

### Swagger UI

서버 실행 후 아래 주소에서 API 문서를 확인할 수 있습니다.

```
http://localhost:8080/swagger-ui/index.html
```

### API 주요 엔드포인트

| Method | URL | 설명 | 인증 |
|--------|-----|------|------|
| POST | `/auth/login` | 로그인 및 토큰 발급 | 불필요 |
| POST | `/auth/refresh` | Access Token 재발급 | 불필요 |
| POST | `/auth/logout` | 로그아웃 | 필요 |
| GET | `/device/list` | 장비 목록 조회 | 필요 |
| GET | `/device/detail/{id}` | 장비 상세 조회 | 필요 |
| GET | `/inspection/status/{id}` | 검사 현황 조회 | 필요 |
| GET | `/users/list` | 사용자 목록 조회 | 필요 |

---

## 🎨 Frontend

### 기술 스택

| 항목 | 버전 |
|------|------|
| React | 18+ |
| IDE | VS Code |
| 번들러 | Vite |
| 라우팅 | react-router-dom |
| HTTP 클라이언트 | axios |
| 차트 | recharts |

### 주요 기능

- JWT 기반 인증 처리 (axios 인터셉터)
- Access Token 만료 시 자동 갱신
- 토큰 유효성 검사 후 자동 로그인 유지
- 장비 현황 대시보드
- 검사 결과 차트 시각화 (recharts)
- 알람 관리

### 실행 방법

```bash
# 1. 패키지 설치
npm install

# 2. .env 파일 생성
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=5000

# 3. 개발 서버 실행
npm run dev
```

### 페이지 구성

| URL | 페이지 |
|-----|--------|
| `/login` | 로그인 |
| `/dashboard` | 대시보드 |
| `/devices` | 장비 목록 |
| `/devices/:id` | 장비 상세 |
| `/inspection` | 검사 현황 |
| `/inspection/:id` | 검사 상세 |
| `/alarms` | 알람 목록 |
| `/users` | 사용자 관리 |

---

## 🔐 인증 흐름

```
로그인 요청 (POST /auth/login)
    ↓
Access Token + Refresh Token 발급
    ↓
Access Token → 요청 헤더 (Authorization: Bearer)
Refresh Token → MariaDB 저장
    ↓
Access Token 만료 시 → 자동으로 /auth/refresh 호출
    ↓
Refresh Token도 만료 → 로그인 페이지 이동
```

---

## 🗄️ 환경 변수

### Backend (.env)

```properties
DB_URL=jdbc:mariadb://localhost:3306/yourdb
DB_USER=your_db_user
DB_PW=your_db_password
JWT_SECRET=your_jwt_secret_key
```

### Frontend (.env)

```properties
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=5000
```

> ⚠️ `.env` 파일은 `.gitignore`에 반드시 추가해주세요.

---

## 📋 실행 환경

- Java 21
- MariaDB 10.6+
- Maven 3.8+
