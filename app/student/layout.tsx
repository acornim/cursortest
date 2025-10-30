import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "학생 대시보드 - 학생-교사 플랫폼",
  description: "학생을 위한 학습 관리 대시보드",
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-blue-600 dark:bg-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <svg
                className="w-8 h-8 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="text-xl font-bold">학생 포털</span>
            </div>
            <div className="flex space-x-4">
              <a
                href="/student"
                className="hover:bg-blue-700 dark:hover:bg-blue-900 px-3 py-2 rounded-md transition-colors"
              >
                대시보드
              </a>
              <a
                href="/student/courses"
                className="hover:bg-blue-700 dark:hover:bg-blue-900 px-3 py-2 rounded-md transition-colors"
              >
                내 수업
              </a>
              <a
                href="/student/assignments"
                className="hover:bg-blue-700 dark:hover:bg-blue-900 px-3 py-2 rounded-md transition-colors"
              >
                과제
              </a>
              <a
                href="/"
                className="hover:bg-blue-700 dark:hover:bg-blue-900 px-3 py-2 rounded-md transition-colors"
              >
                로그아웃
              </a>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
