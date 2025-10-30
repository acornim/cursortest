import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 감정 통계 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const teacherId = searchParams.get('teacherId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

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

    if (startDate || endDate) {
      where.loggedAt = {};
      if (startDate) {
        where.loggedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.loggedAt.lte = new Date(endDate);
      }
    }

    // 감정별 통계
    const emotionStats = await prisma.emotionLog.groupBy({
      by: ['emotion'],
      where,
      _count: {
        emotion: true,
      },
      _avg: {
        intensity: true,
      },
      orderBy: {
        _count: {
          emotion: 'desc',
        },
      },
    });

    // 전체 통계
    const totalLogs = await prisma.emotionLog.count({ where });
    const avgIntensity = await prisma.emotionLog.aggregate({
      where,
      _avg: {
        intensity: true,
      },
    });

    // 최근 7일간 추세
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentTrend = await prisma.emotionLog.groupBy({
      by: ['emotion'],
      where: {
        ...where,
        loggedAt: {
          gte: sevenDaysAgo,
        },
      },
      _count: {
        emotion: true,
      },
    });

    // 컨텍스트별 통계
    const contextStats = await prisma.emotionLog.groupBy({
      by: ['context'],
      where: {
        ...where,
        context: {
          not: null,
        },
      },
      _count: {
        context: true,
      },
      orderBy: {
        _count: {
          context: 'desc',
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        emotionStats: emotionStats.map((stat) => ({
          emotion: stat.emotion,
          count: stat._count.emotion,
          averageIntensity: stat._avg.intensity
            ? Math.round(stat._avg.intensity * 10) / 10
            : 0,
        })),
        totalLogs,
        averageIntensity: avgIntensity._avg.intensity
          ? Math.round(avgIntensity._avg.intensity * 10) / 10
          : 0,
        recentTrend: recentTrend.map((trend) => ({
          emotion: trend.emotion,
          count: trend._count.emotion,
        })),
        contextStats: contextStats.map((stat) => ({
          context: stat.context,
          count: stat._count.context,
        })),
      },
    });
  } catch (error) {
    console.error('감정 통계 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '감정 통계를 불러오는데 실패했습니다.',
      },
      { status: 500 }
    );
  }
}
