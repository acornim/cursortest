import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "교사 대시보드 - 학생-교사 플랫폼",
  description: "교사를 위한 학급 관리 대시보드",
};

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-purple-600 dark:bg-purple-800 text-white shadow-lg">
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span className="text-xl font-bold">교사 포털</span>
            </div>
            <div className="flex space-x-4">
              <a
                href="/teacher"
                className="hover:bg-purple-700 dark:hover:bg-purple-900 px-3 py-2 rounded-md transition-colors"
              >
                대시보드
              </a>
              <a
                href="/teacher/classes"
                className="hover:bg-purple-700 dark:hover:bg-purple-900 px-3 py-2 rounded-md transition-colors"
              >
                내 수업
              </a>
              <a
                href="/teacher/students"
                className="hover:bg-purple-700 dark:hover:bg-purple-900 px-3 py-2 rounded-md transition-colors"
              >
                학생 관리
              </a>
              <a
                href="/teacher/assignments"
                className="hover:bg-purple-700 dark:hover:bg-purple-900 px-3 py-2 rounded-md transition-colors"
              >
                과제 관리
              </a>
              <a
                href="/"
                className="hover:bg-purple-700 dark:hover:bg-purple-900 px-3 py-2 rounded-md transition-colors"
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
