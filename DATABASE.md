# 데이터베이스 스키마 문서

## 개요

이 프로젝트는 PostgreSQL 데이터베이스와 Prisma ORM을 사용하여 SEL(사회정서학습) 애플리케이션의 데이터를 관리합니다.

## 테이블 구조

### 1. Teachers (교사)

교사 정보를 저장하는 테이블입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | String | PRIMARY KEY | 고유 식별자 (CUID) |
| email | String | UNIQUE, NOT NULL | 이메일 주소 |
| name | String | NOT NULL | 교사 이름 |
| password | String | NOT NULL | 비밀번호 (해시됨) |
| subject | String | NULLABLE | 담당 과목 |
| phone | String | NULLABLE | 전화번호 |
| createdAt | DateTime | DEFAULT now() | 생성 시간 |
| updatedAt | DateTime | AUTO UPDATE | 수정 시간 |

**관계:**
- `students`: 한 명의 교사는 여러 학생을 담당할 수 있습니다 (1:N)

---

### 2. Students (학생)

학생 정보를 저장하는 테이블입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | String | PRIMARY KEY | 고유 식별자 (CUID) |
| email | String | UNIQUE, NOT NULL | 이메일 주소 |
| name | String | NOT NULL | 학생 이름 |
| password | String | NOT NULL | 비밀번호 (해시됨) |
| grade | Int | NULLABLE | 학년 |
| className | String | NULLABLE | 반 이름 |
| phone | String | NULLABLE | 전화번호 |
| birthDate | DateTime | NULLABLE | 생년월일 |
| teacherId | String | FOREIGN KEY, NOT NULL | 담당 교사 ID |
| createdAt | DateTime | DEFAULT now() | 생성 시간 |
| updatedAt | DateTime | AUTO UPDATE | 수정 시간 |

**관계:**
- `teacher`: 각 학생은 한 명의 교사에게 속합니다 (N:1)
- `emotionLogs`: 한 명의 학생은 여러 감정 기록을 가질 수 있습니다 (1:N)

**인덱스:**
- `teacherId`: 교사별 학생 조회 성능 향상

---

### 3. EmotionLogs (감정 기록)

학생들의 감정 기록을 저장하는 테이블입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | String | PRIMARY KEY | 고유 식별자 (CUID) |
| emotion | String | NOT NULL | 감정 유형 (행복, 슬픔, 화남 등) |
| intensity | Int | DEFAULT 5 | 감정 강도 (1-10) |
| reason | String | NULLABLE | 감정을 느낀 이유 |
| note | String | NULLABLE | 추가 메모 |
| context | String | NULLABLE | 상황 (수업 중, 집 등) |
| activity | String | NULLABLE | 활동 (공부, 운동 등) |
| loggedAt | DateTime | DEFAULT now() | 감정 기록 시간 |
| studentId | String | FOREIGN KEY, NOT NULL | 학생 ID |
| createdAt | DateTime | DEFAULT now() | 생성 시간 |
| updatedAt | DateTime | AUTO UPDATE | 수정 시간 |

**관계:**
- `student`: 각 감정 기록은 한 명의 학생에게 속합니다 (N:1)

**인덱스:**
- `studentId`: 학생별 감정 기록 조회 성능 향상
- `loggedAt`: 시간별 감정 기록 조회 성능 향상
- `emotion`: 감정 유형별 통계 조회 성능 향상

---

## ERD (Entity Relationship Diagram)

```
┌─────────────┐
│  Teachers   │
│─────────────│
│ id (PK)     │
│ email       │
│ name        │
│ password    │
│ subject     │
│ phone       │
│ createdAt   │
│ updatedAt   │
└──────┬──────┘
       │ 1
       │
       │ has many
       │
       │ N
┌──────┴──────┐
│  Students   │
│─────────────│
│ id (PK)     │
│ email       │
│ name        │
│ password    │
│ grade       │
│ className   │
│ phone       │
│ birthDate   │
│ teacherId(FK)│
│ createdAt   │
│ updatedAt   │
└──────┬──────┘
       │ 1
       │
       │ has many
       │
       │ N
┌──────┴───────┐
│ EmotionLogs  │
│──────────────│
│ id (PK)      │
│ emotion      │
│ intensity    │
│ reason       │
│ note         │
│ context      │
│ activity     │
│ loggedAt     │
│ studentId(FK)│
│ createdAt    │
│ updatedAt    │
└──────────────┘
```

---

## 데이터베이스 설정

### 1. PostgreSQL 설치 및 설정

#### 로컬 개발 환경:

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

**Windows:**
- PostgreSQL 공식 웹사이트에서 설치 프로그램 다운로드
- https://www.postgresql.org/download/windows/

#### 데이터베이스 생성:
```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE sel_app;

# 사용자 생성 (선택사항)
CREATE USER sel_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sel_app TO sel_user;
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 데이터베이스 연결 정보를 입력하세요:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/sel_app?schema=public"
```

**형식:**
```
postgresql://[사용자명]:[비밀번호]@[호스트]:[포트]/[데이터베이스명]?schema=public
```

### 3. Prisma 마이그레이션 실행

```bash
# Prisma Client 생성
npm run prisma:generate

# 데이터베이스 마이그레이션 실행
npm run prisma:migrate

# 마이그레이션 이름 입력 프롬프트가 나타나면:
# 예: "init" 또는 "initial_schema"
```

### 4. 시드 데이터 추가 (선택사항)

테스트 데이터를 데이터베이스에 추가합니다:

```bash
npm run db:seed
```

### 5. Prisma Studio로 데이터 확인

Prisma Studio를 사용하여 브라우저에서 데이터를 확인하고 관리할 수 있습니다:

```bash
npm run prisma:studio
```

브라우저에서 http://localhost:5555 로 접속합니다.

---

## Prisma 스크립트

`package.json`에 정의된 스크립트:

```json
{
  "prisma:generate": "prisma generate",     // Prisma Client 생성
  "prisma:migrate": "prisma migrate dev",   // 마이그레이션 실행
  "prisma:studio": "prisma studio",         // Prisma Studio 실행
  "db:seed": "tsx prisma/seed.ts"           // 시드 데이터 추가
}
```

---

## 데이터베이스 사용 예제

### Prisma Client 임포트

```typescript
import { prisma } from '@/lib/prisma';
```

### 교사 생성

```typescript
const teacher = await prisma.teacher.create({
  data: {
    email: 'teacher@school.com',
    name: '김선생',
    password: 'hashed_password',
    subject: '수학',
  },
});
```

### 학생 생성 (교사와 연결)

```typescript
const student = await prisma.student.create({
  data: {
    email: 'student@school.com',
    name: '이학생',
    password: 'hashed_password',
    grade: 1,
    className: '1반',
    teacherId: teacher.id,
  },
});
```

### 감정 기록 생성

```typescript
const emotionLog = await prisma.emotionLog.create({
  data: {
    emotion: '행복',
    intensity: 8,
    reason: '친구와 즐거운 시간을 보냈어요',
    context: '쉬는 시간',
    activity: '친구와 대화',
    studentId: student.id,
  },
});
```

### 학생의 모든 감정 기록 조회

```typescript
const logs = await prisma.emotionLog.findMany({
  where: {
    studentId: student.id,
  },
  orderBy: {
    loggedAt: 'desc',
  },
  include: {
    student: {
      select: {
        name: true,
        grade: true,
        className: true,
      },
    },
  },
});
```

### 교사가 담당하는 모든 학생의 최근 감정 기록

```typescript
const recentLogs = await prisma.emotionLog.findMany({
  where: {
    student: {
      teacherId: teacher.id,
    },
    loggedAt: {
      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 최근 7일
    },
  },
  include: {
    student: {
      select: {
        name: true,
        grade: true,
        className: true,
      },
    },
  },
  orderBy: {
    loggedAt: 'desc',
  },
});
```

### 감정별 통계

```typescript
const emotionStats = await prisma.emotionLog.groupBy({
  by: ['emotion'],
  where: {
    studentId: student.id,
  },
  _count: {
    emotion: true,
  },
  _avg: {
    intensity: true,
  },
});
```

---

## 보안 고려사항

### 1. 비밀번호 해싱

현재 스키마는 비밀번호를 평문으로 저장하고 있습니다. **실제 프로덕션 환경에서는 반드시 해싱을 사용해야 합니다.**

추천 라이브러리: `bcrypt` 또는 `argon2`

```bash
npm install bcrypt
npm install -D @types/bcrypt
```

사용 예제:
```typescript
import bcrypt from 'bcrypt';

// 비밀번호 해싱
const hashedPassword = await bcrypt.hash(password, 10);

// 비밀번호 확인
const isValid = await bcrypt.compare(password, hashedPassword);
```

### 2. 데이터 접근 제어

- 학생은 자신의 감정 기록만 조회/수정할 수 있어야 합니다
- 교사는 자신이 담당하는 학생의 정보만 조회할 수 있어야 합니다
- API 라우트에서 권한 확인을 구현해야 합니다

### 3. 환경 변수 보호

- `.env` 파일을 `.gitignore`에 추가하여 버전 관리에서 제외
- 프로덕션 환경에서는 안전한 방법으로 환경 변수 관리

---

## 클라우드 데이터베이스 옵션

개발 및 프로덕션 환경을 위한 클라우드 데이터베이스 서비스:

1. **Neon** (https://neon.tech)
   - 서버리스 PostgreSQL
   - 무료 티어 제공
   - 자동 스케일링

2. **Supabase** (https://supabase.com)
   - PostgreSQL + 인증 + 스토리지
   - 무료 티어 제공
   - 실시간 기능

3. **Railway** (https://railway.app)
   - PostgreSQL 호스팅
   - 무료 티어 제공
   - 간단한 배포

4. **Vercel Postgres** (https://vercel.com/storage/postgres)
   - Vercel과 통합
   - 서버리스
   - Next.js와 최적화

---

## 문제 해결

### 마이그레이션 오류

```bash
# 마이그레이션 초기화
npx prisma migrate reset

# 다시 마이그레이션 실행
npm run prisma:migrate
```

### Prisma Client 오류

```bash
# Prisma Client 재생성
npm run prisma:generate
```

### 데이터베이스 연결 오류

1. PostgreSQL이 실행 중인지 확인
2. `.env` 파일의 `DATABASE_URL`이 올바른지 확인
3. 데이터베이스가 생성되었는지 확인

---

## 추가 리소스

- [Prisma 공식 문서](https://www.prisma.io/docs)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [Next.js와 Prisma 통합 가이드](https://www.prisma.io/nextjs)
