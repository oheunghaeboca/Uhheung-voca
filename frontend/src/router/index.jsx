import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import SignupPage from '../pages/auth/SignupPage.jsx';
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
import FlashcardPage from '../pages/word/FlashcardPage.jsx';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/flashcard', element: <FlashcardPage /> },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
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
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);
