import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 데이터베이스 시드 시작...');

  // 기존 데이터 삭제 (개발 환경에서만!)
  await prisma.emotionLog.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();

  // 교사 데이터 생성
  const teacher1 = await prisma.teacher.create({
    data: {
      email: 'kim.math@school.com',
      name: '김수학',
      password: 'password123', // 실제로는 해시된 비밀번호를 사용해야 합니다
      subject: '수학',
      phone: '010-1234-5678',
    },
  });

  const teacher2 = await prisma.teacher.create({
    data: {
      email: 'lee.english@school.com',
      name: '이영어',
      password: 'password123',
      subject: '영어',
      phone: '010-2345-6789',
    },
  });

  console.log('✅ 교사 데이터 생성 완료');

  // 학생 데이터 생성
  const student1 = await prisma.student.create({
    data: {
      email: 'minjun.kim@student.com',
      name: '김민준',
      password: 'student123',
      grade: 1,
      className: '1반',
      phone: '010-3456-7890',
      birthDate: new Date('2008-03-15'),
      teacherId: teacher1.id,
    },
  });

  const student2 = await prisma.student.create({
    data: {
      email: 'seoyeon.lee@student.com',
      name: '이서연',
      password: 'student123',
      grade: 1,
      className: '1반',
      phone: '010-4567-8901',
      birthDate: new Date('2008-07-22'),
      teacherId: teacher1.id,
    },
  });

  const student3 = await prisma.student.create({
    data: {
      email: 'jiho.park@student.com',
      name: '박지호',
      password: 'student123',
      grade: 2,
      className: '2반',
      phone: '010-5678-9012',
      birthDate: new Date('2007-11-08'),
      teacherId: teacher2.id,
    },
  });

  console.log('✅ 학생 데이터 생성 완료');

  // 감정 기록 데이터 생성
  const emotions = ['행복', '슬픔', '화남', '불안', '평온', '흥분', '지루함'];
  const contexts = ['수업 중', '쉬는 시간', '점심시간', '방과 후', '집'];
  const activities = ['공부', '친구와 대화', '운동', '게임', '독서', '음악 감상'];

  // 학생별로 여러 감정 기록 생성
  for (const student of [student1, student2, student3]) {
    for (let i = 0; i < 5; i++) {
      const daysAgo = Math.floor(Math.random() * 7); // 최근 7일 이내
      const loggedAt = new Date();
      loggedAt.setDate(loggedAt.getDate() - daysAgo);
      
      await prisma.emotionLog.create({
        data: {
          emotion: emotions[Math.floor(Math.random() * emotions.length)],
          intensity: Math.floor(Math.random() * 10) + 1,
          reason: `테스트 이유 ${i + 1}`,
          note: `추가 메모 ${i + 1}`,
          context: contexts[Math.floor(Math.random() * contexts.length)],
          activity: activities[Math.floor(Math.random() * activities.length)],
          loggedAt: loggedAt,
          studentId: student.id,
        },
      });
    }
  }

  console.log('✅ 감정 기록 데이터 생성 완료');
  console.log('🎉 시드 데이터 생성이 완료되었습니다!');

  // 생성된 데이터 요약
  const teacherCount = await prisma.teacher.count();
  const studentCount = await prisma.student.count();
  const emotionLogCount = await prisma.emotionLog.count();

  console.log(`\n📊 데이터 요약:`);
  console.log(`   교사: ${teacherCount}명`);
  console.log(`   학생: ${studentCount}명`);
  console.log(`   감정 기록: ${emotionLogCount}개`);
}

main()
  .catch((e) => {
    console.error('❌ 시드 중 에러 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
