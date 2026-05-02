import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import LandingPage from '../pages/auth/LandingPage.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import DashboardPage from '../pages/dashboard/DashboardPage.jsx';
import WordListPage from '../pages/word/WordListPage.jsx';
import WordDetailPage from '../pages/word/WordDetailPage.jsx';
import QuizPage from '../pages/quiz/QuizPage.jsx';
import QuizResultListPage from '../pages/quiz/QuizResultListPage.jsx';
import QuizResultDetailPage from '../pages/quiz/QuizResultDetailPage.jsx';
import BookmarkPage from '../pages/bookmark/BookmarkPage.jsx';
import WrongNotePage from '../pages/wrongnote/WrongNotePage.jsx';
import StatsPage from '../pages/stats/StatsPage.jsx';
import RankingPage from '../pages/ranking/RankingPage.jsx';

/**
 * 라우트 구조:
 *  - 공개 라우트: '/' (Landing), '/login' (회원가입 토글 포함).
 *  - 보호 라우트: ProtectedRoute > AppLayout > 도메인 페이지들.
 *  - 잘못된 경로: '/' 로 리다이렉트.
 *
 * 비인증 사용자가 보호 라우트 접근 → ProtectedRoute 가 /login 으로 이동시키고
 * state.from 으로 원래 경로를 전달한다. 로그인 성공 시 그 경로로 돌려보냄.
 */
export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/words', element: <WordListPage /> },
      { path: '/words/:id', element: <WordDetailPage /> },
      { path: '/quiz', element: <QuizPage /> },
      { path: '/quiz/results', element: <QuizResultListPage /> },
      { path: '/quiz/results/:id', element: <QuizResultDetailPage /> },
      { path: '/bookmarks', element: <BookmarkPage /> },
      { path: '/wrong-notes', element: <WrongNotePage /> },
      { path: '/stats', element: <StatsPage /> },
      { path: '/ranking', element: <RankingPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
