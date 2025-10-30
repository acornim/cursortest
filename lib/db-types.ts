// 데이터베이스 타입 정의 (Prisma에서 자동 생성되는 타입 외 추가 타입)

export type EmotionType = 
  | '행복' 
  | '슬픔' 
  | '화남' 
  | '불안' 
  | '평온' 
  | '흥분' 
  | '지루함'
  | '두려움'
  | '혼란'
  | '자신감';

export type ContextType = 
  | '수업 중'
  | '쉬는 시간'
  | '점심시간'
  | '방과 후'
  | '집'
  | '통학 중'
  | '친구 집'
  | '기타';

export type ActivityType = 
  | '공부'
  | '친구와 대화'
  | '운동'
  | '게임'
  | '독서'
  | '음악 감상'
  | '영화/TV'
  | '가족 시간'
  | '취미 활동'
  | '휴식'
  | '기타';

// 감정 통계를 위한 인터페이스
export interface EmotionStats {
  emotion: string;
  count: number;
  averageIntensity: number;
}

// 학생 감정 요약 인터페이스
export interface StudentEmotionSummary {
  studentId: string;
  studentName: string;
  totalLogs: number;
  mostFrequentEmotion: string;
  averageIntensity: number;
  recentLogs: number; // 최근 7일간의 로그 수
}

// 감정 기록 생성을 위한 입력 타입
export interface CreateEmotionLogInput {
  emotion: string;
  intensity: number;
  reason?: string;
  note?: string;
  context?: string;
  activity?: string;
  studentId: string;
  loggedAt?: Date;
}

// 감정 기록 필터링을 위한 타입
export interface EmotionLogFilter {
  studentId?: string;
  teacherId?: string;
  emotion?: string;
  startDate?: Date;
  endDate?: Date;
  minIntensity?: number;
  maxIntensity?: number;
}
