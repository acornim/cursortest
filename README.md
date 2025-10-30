# SEL 학생-교사 웹 애플리케이션

Next.js, TypeScript, Tailwind CSS, PostgreSQL을 사용한 사회정서학습(SEL) 애플리케이션입니다.

## 주요 기능

- 👨‍🏫 **교사 포털**: 학생 관리, 감정 기록 모니터링, 통계 분석
- 👨‍🎓 **학생 포털**: 감정 기록, 수업 관리, 과제 확인
- 📊 **감정 추적**: 학생들의 감정 상태를 시간별로 기록하고 분석
- 🔗 **관계 관리**: 교사와 학생 간의 연결 관리

## 시작하기

### 1. 종속성 설치

```bash
npm install
```

### 2. 데이터베이스 설정

#### PostgreSQL 설치 (아직 설치하지 않은 경우)

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### 데이터베이스 생성

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE sel_app;

# 종료
\q
```

### 3. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 데이터베이스 연결 정보를 수정하세요:

```bash
cp .env.example .env
```

`.env` 파일을 열어 데이터베이스 URL을 수정:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/sel_app?schema=public"
```

### 4. 데이터베이스 마이그레이션

```bash
# Prisma Client 생성
npm run prisma:generate

# 데이터베이스 마이그레이션 실행
npm run prisma:migrate
# 프롬프트가 나타나면 마이그레이션 이름 입력 (예: "init")
```

### 5. 시드 데이터 추가 (선택사항)

테스트 데이터를 추가하려면:

```bash
npm run db:seed
```

이 명령어는 다음을 생성합니다:
- 2명의 교사
- 3명의 학생
- 15개의 감정 기록

### 6. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## 프로젝트 구조

```
/workspace
├── app/
│   ├── api/                    # REST API 라우트
│   │   ├── teachers/          # 교사 API
│   │   ├── students/          # 학생 API
│   │   └── emotion-logs/      # 감정 기록 API
│   ├── student/               # 학생 포털 페이지
│   ├── teacher/               # 교사 포털 페이지
│   ├── layout.tsx             # 루트 레이아웃
│   ├── page.tsx               # 홈페이지 (역할 선택)
│   └── globals.css            # 전역 스타일
├── prisma/
│   ├── schema.prisma          # 데이터베이스 스키마
│   └── seed.ts                # 시드 데이터
├── lib/
│   ├── prisma.ts              # Prisma 클라이언트
│   └── db-types.ts            # 데이터베이스 타입 정의
├── DATABASE.md                # 데이터베이스 문서
├── API_EXAMPLES.md            # API 사용 예제
└── README.md                  # 이 파일
```

## 데이터베이스 스키마

### Teachers (교사)
- 교사 기본 정보 (이름, 이메일, 과목 등)
- 담당 학생들과의 관계

### Students (학생)
- 학생 기본 정보 (이름, 학년, 반 등)
- 담당 교사와의 관계
- 감정 기록들과의 관계

### EmotionLogs (감정 기록)
- 감정 유형 (행복, 슬픔, 화남, 불안 등)
- 감정 강도 (1-10)
- 감정을 느낀 이유 및 메모
- 상황 및 활동 정보
- 기록 시간

자세한 스키마 정보는 [DATABASE.md](./DATABASE.md)를 참조하세요.

## API 엔드포인트

### 교사 API
- `GET /api/teachers` - 모든 교사 조회
- `POST /api/teachers` - 새 교사 생성

### 학생 API
- `GET /api/students` - 모든 학생 조회
- `GET /api/students?teacherId={id}` - 특정 교사의 학생 조회
- `GET /api/students/{id}` - 특정 학생 조회
- `POST /api/students` - 새 학생 생성
- `PATCH /api/students/{id}` - 학생 정보 수정
- `DELETE /api/students/{id}` - 학생 삭제

### 감정 기록 API
- `GET /api/emotion-logs` - 감정 기록 조회 (필터링 지원)
- `POST /api/emotion-logs` - 새 감정 기록 생성
- `GET /api/emotion-logs/stats` - 감정 통계 조회

자세한 API 사용 방법은 [API_EXAMPLES.md](./API_EXAMPLES.md)를 참조하세요.

## 유용한 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint

# Prisma Client 생성
npm run prisma:generate

# 데이터베이스 마이그레이션
npm run prisma:migrate

# Prisma Studio 실행 (데이터베이스 GUI)
npm run prisma:studio

# 시드 데이터 추가
npm run db:seed
```

## Prisma Studio

Prisma Studio를 사용하면 브라우저에서 데이터베이스를 시각적으로 관리할 수 있습니다:

```bash
npm run prisma:studio
```

그런 다음 http://localhost:5555 로 접속하세요.

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Package Manager**: npm

## 환경 변수

필수 환경 변수:

```env
DATABASE_URL="postgresql://..."     # PostgreSQL 연결 URL
NEXT_PUBLIC_APP_URL="http://..."   # 앱 URL
```

## 보안 고려사항

⚠️ **중요**: 이 프로젝트는 기본 구조를 제공합니다. 프로덕션 환경에서는 다음을 추가해야 합니다:

1. **인증/인가**: NextAuth.js 또는 다른 인증 솔루션
2. **비밀번호 해싱**: bcrypt 또는 argon2 사용
3. **입력 검증**: Zod 또는 Yup을 사용한 스키마 검증
4. **Rate Limiting**: API 요청 제한
5. **HTTPS**: 프로덕션에서는 HTTPS 사용

## 배포

### Vercel (권장)

1. GitHub 레포지토리에 푸시
2. Vercel에서 프로젝트 임포트
3. 환경 변수 설정
4. 배포

### 데이터베이스 호스팅

클라우드 PostgreSQL 옵션:
- [Neon](https://neon.tech) - 서버리스 PostgreSQL
- [Supabase](https://supabase.com) - PostgreSQL + 인증
- [Railway](https://railway.app) - 간단한 호스팅
- [Vercel Postgres](https://vercel.com/storage/postgres) - Vercel 통합

## 문제 해결

### 마이그레이션 오류

```bash
# 마이그레이션 초기화
npx prisma migrate reset

# 다시 마이그레이션
npm run prisma:migrate
```

### Prisma Client 오류

```bash
# Client 재생성
npm run prisma:generate
```

### 데이터베이스 연결 오류

1. PostgreSQL이 실행 중인지 확인
2. `.env` 파일의 `DATABASE_URL` 확인
3. 데이터베이스가 생성되었는지 확인

## 라이선스

MIT

## 기여

이슈와 풀 리퀘스트를 환영합니다!
