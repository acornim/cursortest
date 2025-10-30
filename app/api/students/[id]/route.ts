import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 특정 학생 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            subject: true,
          },
        },
        emotionLogs: {
          orderBy: {
            loggedAt: 'desc',
          },
          take: 10, // 최근 10개만
        },
        _count: {
          select: {
            emotionLogs: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: '학생을 찾을 수 없습니다.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student,
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

// 학생 정보 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, grade, className, phone, birthDate } = body;

    const student = await prisma.student.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(grade !== undefined && { grade }),
        ...(className && { className }),
        ...(phone && { phone }),
        ...(birthDate && { birthDate: new Date(birthDate) }),
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

    return NextResponse.json({
      success: true,
      data: student,
      message: '학생 정보가 수정되었습니다.',
    });
  } catch (error) {
    console.error('학생 수정 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '학생 정보 수정에 실패했습니다.',
      },
      { status: 500 }
    );
  }
}

// 학생 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.student.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: '학생이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('학생 삭제 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '학생 삭제에 실패했습니다.',
      },
      { status: 500 }
    );
  }
}
