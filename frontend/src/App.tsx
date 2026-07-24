import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import ArticlesPage from './pages/ArticlesPage';
import LoansPage from './pages/LoansPage';
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/loans" element={<ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN']} />}>
                <Route index element={<LoansPage />} />
              </Route>
              <Route path="/users" element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route index element={<UsersPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
