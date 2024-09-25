
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './routes/home'
import AuthPage from './routes/auth'
import Dashboard from './routes/dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App