import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 모든 교사 조회
export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        subject: true,
        phone: true,
        createdAt: true,
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: teachers,
      count: teachers.length,
    });
  } catch (error) {
    console.error('교사 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '교사 정보를 불러오는데 실패했습니다.',
      },
      { status: 500 }
    );
  }
}

// 새 교사 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password, subject, phone } = body;

    // 필수 필드 검증
    if (!email || !name || !password) {
      return NextResponse.json(
        {
          success: false,
          error: '필수 필드가 누락되었습니다.',
        },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existingTeacher = await prisma.teacher.findUnique({
      where: { email },
    });

    if (existingTeacher) {
      return NextResponse.json(
        {
          success: false,
          error: '이미 존재하는 이메일입니다.',
        },
        { status: 409 }
      );
    }

    // 교사 생성
    const teacher = await prisma.teacher.create({
      data: {
        email,
        name,
        password, // 실제 환경에서는 bcrypt로 해시해야 합니다!
        subject,
        phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        subject: true,
        phone: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: teacher,
        message: '교사가 성공적으로 생성되었습니다.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('교사 생성 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '교사 생성에 실패했습니다.',
      },
      { status: 500 }
    );
  }
}
