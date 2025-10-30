import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 모든 학생 조회 또는 특정 교사의 학생 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const teacherId = searchParams.get('teacherId');

    const students = await prisma.student.findMany({
      where: teacherId ? { teacherId } : {},
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            subject: true,
          },
        },
        _count: {
          select: {
            emotionLogs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: students,
      count: students.length,
    });
  } catch (error) {
    console.error('학생 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '학생 정보를 불러오는데 실패했습니다.',
      },
      { status: 500 }
    );
  }
}

// 새 학생 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password, grade, className, phone, birthDate, teacherId } = body;

    // 필수 필드 검증
    if (!email || !name || !password || !teacherId) {
      return NextResponse.json(
        {
          success: false,
          error: '필수 필드가 누락되었습니다.',
        },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });

    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          error: '이미 존재하는 이메일입니다.',
        },
        { status: 409 }
      );
    }

    // 학생 생성
    const student = await prisma.student.create({
      data: {
        email,
        name,
        password, // 실제 환경에서는 bcrypt로 해시해야 합니다!
        grade,
        className,
        phone,
        birthDate: birthDate ? new Date(birthDate) : null,
        teacherId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: student,
        message: '학생이 성공적으로 생성되었습니다.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('학생 생성 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '학생 생성에 실패했습니다.',
      },
      { status: 500 }
    );
  }
}
