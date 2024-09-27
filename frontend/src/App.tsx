import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Home from './routes/home'
import AuthPage from './routes/auth'
import Dashboard from './routes/dashboard'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="home" element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
          } />
      </Routes>
    </Router>
  )
}

export default App