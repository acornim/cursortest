import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 감정 기록 조회 (필터링 지원)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const teacherId = searchParams.get('teacherId');
    const emotion = searchParams.get('emotion');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit');

    // 필터 조건 구성
    const where: any = {};

    if (studentId) {
      where.studentId = studentId;
    }

    if (teacherId) {
      where.student = {
        teacherId: teacherId,
      };
    }

    if (emotion) {
      where.emotion = emotion;
    }

    if (startDate || endDate) {
      where.loggedAt = {};
      if (startDate) {
        where.loggedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.loggedAt.lte = new Date(endDate);
      }
    }

    const emotionLogs = await prisma.emotionLog.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            grade: true,
            className: true,
            teacher: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        loggedAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: emotionLogs,
      count: emotionLogs.length,
    });
  } catch (error) {
    console.error('감정 기록 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '감정 기록을 불러오는데 실패했습니다.',
      },
      { status: 500 }
    );
  }
}

// 새 감정 기록 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      emotion,
      intensity,
      reason,
      note,
      context,
      activity,
      studentId,
      loggedAt,
    } = body;

    // 필수 필드 검증
    if (!emotion || !studentId) {
      return NextResponse.json(
        {
          success: false,
          error: '감정과 학생 ID는 필수 항목입니다.',
        },
        { status: 400 }
      );
    }

    // 강도 검증 (1-10)
    if (intensity !== undefined && (intensity < 1 || intensity > 10)) {
      return NextResponse.json(
        {
          success: false,
          error: '감정 강도는 1에서 10 사이여야 합니다.',
        },
        { status: 400 }
      );
    }

    // 학생 존재 확인
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: '존재하지 않는 학생입니다.',
        },
        { status: 404 }
      );
    }

    // 감정 기록 생성
    const emotionLog = await prisma.emotionLog.create({
      data: {
        emotion,
        intensity: intensity || 5,
        reason,
        note,
        context,
        activity,
        studentId,
        loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            grade: true,
            className: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: emotionLog,
        message: '감정 기록이 성공적으로 저장되었습니다.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('감정 기록 생성 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '감정 기록 저장에 실패했습니다.',
      },
      { status: 500 }
    );
  }
}
