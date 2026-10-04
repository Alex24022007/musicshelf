import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { useAuth } from './context/AuthContext.jsx';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="center-msg">Loading…</p>;
  }

  return (
    <>
      <Navbar />

      <main className="container">
        <Routes>

          {/* First page when application opens */}
          <Route
            path="/"
            element={
              user
                ? <Navigate to="/dashboard" />
                : <Navigate to="/register" />
            }
          />

          {/* Register */}
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <Register />}
          />

          {/* Login */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Any unknown URL */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </main>
    </>
  );
}