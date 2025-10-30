# API 사용 예제

이 문서는 SEL 앱의 REST API 엔드포인트 사용 방법을 설명합니다.

## 기본 URL

```
http://localhost:3000/api
```

---

## 교사 (Teachers) API

### 1. 모든 교사 조회

```http
GET /api/teachers
```

**응답 예제:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxxx",
      "email": "kim.math@school.com",
      "name": "김수학",
      "subject": "수학",
      "phone": "010-1234-5678",
      "createdAt": "2025-10-30T10:00:00.000Z",
      "_count": {
        "students": 28
      }
    }
  ],
  "count": 1
}
```

### 2. 새 교사 생성

```http
POST /api/teachers
Content-Type: application/json

{
  "email": "teacher@school.com",
  "name": "김선생",
  "password": "password123",
  "subject": "수학",
  "phone": "010-1234-5678"
}
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "id": "clxxxx",
    "email": "teacher@school.com",
    "name": "김선생",
    "subject": "수학",
    "phone": "010-1234-5678",
    "createdAt": "2025-10-30T10:00:00.000Z"
  },
  "message": "교사가 성공적으로 생성되었습니다."
}
```

---

## 학생 (Students) API

### 1. 모든 학생 조회

```http
GET /api/students
```

**쿼리 파라미터:**
- `teacherId` (선택): 특정 교사의 학생만 조회

**예제:**
```http
GET /api/students?teacherId=clxxxx
```

**응답 예제:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxxx",
      "email": "student@school.com",
      "name": "김민준",
      "grade": 1,
      "className": "1반",
      "phone": "010-3456-7890",
      "teacher": {
        "id": "clxxxx",
        "name": "김수학",
        "email": "kim.math@school.com",
        "subject": "수학"
      },
      "_count": {
        "emotionLogs": 15
      }
    }
  ],
  "count": 1
}
```

### 2. 특정 학생 조회

```http
GET /api/students/{studentId}
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "id": "clxxxx",
    "email": "student@school.com",
    "name": "김민준",
    "grade": 1,
    "className": "1반",
    "teacher": {
      "id": "clxxxx",
      "name": "김수학",
      "email": "kim.math@school.com"
    },
    "emotionLogs": [
      {
        "id": "clxxxx",
        "emotion": "행복",
        "intensity": 8,
        "reason": "친구와 즐거운 시간을 보냈어요",
        "loggedAt": "2025-10-30T10:00:00.000Z"
      }
    ],
    "_count": {
      "emotionLogs": 15
    }
  }
}
```

### 3. 새 학생 생성

```http
POST /api/students
Content-Type: application/json

{
  "email": "student@school.com",
  "name": "김민준",
  "password": "student123",
  "grade": 1,
  "className": "1반",
  "phone": "010-3456-7890",
  "birthDate": "2008-03-15",
  "teacherId": "clxxxx"
}
```

### 4. 학생 정보 수정

```http
PATCH /api/students/{studentId}
Content-Type: application/json

{
  "name": "김민준",
  "grade": 2,
  "className": "2반"
}
```

### 5. 학생 삭제

```http
DELETE /api/students/{studentId}
```

---

## 감정 기록 (Emotion Logs) API

### 1. 감정 기록 조회

```http
GET /api/emotion-logs
```

**쿼리 파라미터:**
- `studentId` (선택): 특정 학생의 기록만 조회
- `teacherId` (선택): 특정 교사의 학생들 기록 조회
- `emotion` (선택): 특정 감정만 필터링
- `startDate` (선택): 시작 날짜 (ISO 8601 형식)
- `endDate` (선택): 종료 날짜 (ISO 8601 형식)
- `limit` (선택): 최대 결과 수

**예제:**
```http
GET /api/emotion-logs?studentId=clxxxx&limit=10
GET /api/emotion-logs?teacherId=clxxxx&startDate=2025-10-23
GET /api/emotion-logs?emotion=행복&limit=20
```

**응답 예제:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxxx",
      "emotion": "행복",
      "intensity": 8,
      "reason": "친구와 즐거운 시간을 보냈어요",
      "note": "오늘 정말 좋은 하루였어요",
      "context": "쉬는 시간",
      "activity": "친구와 대화",
      "loggedAt": "2025-10-30T10:00:00.000Z",
      "student": {
        "id": "clxxxx",
        "name": "김민준",
        "grade": 1,
        "className": "1반",
        "teacher": {
          "id": "clxxxx",
          "name": "김수학"
        }
      }
    }
  ],
  "count": 1
}
```

### 2. 새 감정 기록 생성

```http
POST /api/emotion-logs
Content-Type: application/json

{
  "emotion": "행복",
  "intensity": 8,
  "reason": "친구와 즐거운 시간을 보냈어요",
  "note": "오늘 정말 좋은 하루였어요",
  "context": "쉬는 시간",
  "activity": "친구와 대화",
  "studentId": "clxxxx"
}
```

**필수 필드:**
- `emotion`: 감정 (문자열)
- `studentId`: 학생 ID

**선택 필드:**
- `intensity`: 감정 강도 (1-10, 기본값: 5)
- `reason`: 감정을 느낀 이유
- `note`: 추가 메모
- `context`: 상황
- `activity`: 활동
- `loggedAt`: 기록 시간 (ISO 8601 형식, 기본값: 현재 시간)

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "id": "clxxxx",
    "emotion": "행복",
    "intensity": 8,
    "reason": "친구와 즐거운 시간을 보냈어요",
    "loggedAt": "2025-10-30T10:00:00.000Z",
    "student": {
      "id": "clxxxx",
      "name": "김민준",
      "grade": 1,
      "className": "1반"
    }
  },
  "message": "감정 기록이 성공적으로 저장되었습니다."
}
```

### 3. 감정 통계 조회

```http
GET /api/emotion-logs/stats
```

**쿼리 파라미터:**
- `studentId` (선택): 특정 학생의 통계
- `teacherId` (선택): 특정 교사의 학생들 통계
- `startDate` (선택): 시작 날짜
- `endDate` (선택): 종료 날짜

**예제:**
```http
GET /api/emotion-logs/stats?studentId=clxxxx
GET /api/emotion-logs/stats?teacherId=clxxxx&startDate=2025-10-01
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "emotionStats": [
      {
        "emotion": "행복",
        "count": 15,
        "averageIntensity": 7.5
      },
      {
        "emotion": "평온",
        "count": 10,
        "averageIntensity": 6.2
      }
    ],
    "totalLogs": 50,
    "averageIntensity": 6.8,
    "recentTrend": [
      {
        "emotion": "행복",
        "count": 5
      }
    ],
    "contextStats": [
      {
        "context": "수업 중",
        "count": 20
      },
      {
        "context": "쉬는 시간",
        "count": 15
      }
    ]
  }
}
```

---

## 클라이언트 사용 예제

### React/Next.js에서 사용

```typescript
// 학생 목록 조회
async function fetchStudents(teacherId?: string) {
  const url = teacherId 
    ? `/api/students?teacherId=${teacherId}`
    : '/api/students';
  
  const response = await fetch(url);
  const result = await response.json();
  
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error);
  }
}

// 감정 기록 생성
async function createEmotionLog(data: {
  emotion: string;
  intensity: number;
  reason?: string;
  studentId: string;
}) {
  const response = await fetch('/api/emotion-logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error);
  }
}

// 감정 통계 조회
async function fetchEmotionStats(studentId: string, days: number = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const url = `/api/emotion-logs/stats?studentId=${studentId}&startDate=${startDate.toISOString()}`;
  
  const response = await fetch(url);
  const result = await response.json();
  
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error);
  }
}
```

### React 컴포넌트 예제

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function EmotionLogForm({ studentId }: { studentId: string }) {
  const [emotion, setEmotion] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/emotion-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emotion,
          intensity,
          reason,
          studentId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('감정 기록이 저장되었습니다!');
        // 폼 리셋
        setEmotion('');
        setIntensity(5);
        setReason('');
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('오류:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>감정</label>
        <select
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
          required
        >
          <option value="">선택하세요</option>
          <option value="행복">행복</option>
          <option value="슬픔">슬픔</option>
          <option value="화남">화남</option>
          <option value="불안">불안</option>
          <option value="평온">평온</option>
        </select>
      </div>

      <div>
        <label>강도: {intensity}</label>
        <input
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
        />
      </div>

      <div>
        <label>이유</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="어떤 이유로 이 감정을 느꼈나요?"
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? '저장 중...' : '저장'}
      </button>
    </form>
  );
}
```

---

## 오류 응답

모든 API는 오류 발생 시 다음 형식으로 응답합니다:

```json
{
  "success": false,
  "error": "오류 메시지"
}
```

**HTTP 상태 코드:**
- `200`: 성공
- `201`: 생성 성공
- `400`: 잘못된 요청
- `404`: 리소스를 찾을 수 없음
- `409`: 충돌 (예: 중복된 이메일)
- `500`: 서버 오류

---

## 보안 고려사항

⚠️ **주의:** 현재 API는 인증/인가가 구현되어 있지 않습니다. 프로덕션 환경에서는 다음을 추가해야 합니다:

1. **인증 (Authentication)**
   - JWT 토큰 또는 세션 기반 인증
   - NextAuth.js 사용 권장

2. **권한 검증 (Authorization)**
   - 학생은 자신의 데이터만 접근
   - 교사는 자신이 담당하는 학생 데이터만 접근
   - 관리자 권한 구분

3. **비밀번호 해싱**
   - bcrypt 또는 argon2 사용
   - 평문 비밀번호 저장 금지

4. **입력 검증**
   - Zod 또는 Yup을 사용한 스키마 검증
   - SQL 인젝션 방지 (Prisma가 기본 제공)

5. **Rate Limiting**
   - API 요청 제한
   - DDoS 공격 방지
