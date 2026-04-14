import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import ToastViewport from './components/ToastViewport';
import { getCurrentUser } from './lib/api';
import { clearStoredToken, getStoredToken, storeToken } from './lib/auth';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    async function restoreSession() {
      const token = getStoredToken();

      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch {
        clearStoredToken();
        setUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    restoreSession();
  }, []);

  function handleAuthSuccess(data) {
    storeToken(data.token);
    setUser(data.user);
  }

  function showToast(toast) {
    const id = crypto.randomUUID();
    const nextToast = { id, type: 'info', ...toast };

    setToasts((current) => [...current, nextToast]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3200);
  }

  function handleLogout() {
    clearStoredToken();
    setUser(null);
    showToast({
      title: 'Signed out',
      message: 'Your session has been cleared on this device.',
      type: 'info',
    });
  }

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300">
          Checking your session...
        </div>
      </main>
    );
  }

  return (
    <>
      <ToastViewport toasts={toasts} />
      <Routes>
        <Route
          element={
            user ? (
              <Navigate replace to="/dashboard" />
            ) : (
              <LoginPage onAuthSuccess={handleAuthSuccess} onNotify={showToast} />
            )
          }
          path="/login"
        />
        <Route
          element={
            user ? (
              <Navigate replace to="/dashboard" />
            ) : (
              <RegisterPage onAuthSuccess={handleAuthSuccess} onNotify={showToast} />
            )
          }
          path="/register"
        />
        <Route element={<ProtectedRoute isAuthenticated={Boolean(user)} />}>
          <Route
            element={<DashboardPage onLogout={handleLogout} onNotify={showToast} user={user} />}
            path="/dashboard"
          />
        </Route>
        <Route
          element={<Navigate replace to={user ? '/dashboard' : '/login'} />}
          path="*"
        />
      </Routes>
    </>
  );
}

export default App;
