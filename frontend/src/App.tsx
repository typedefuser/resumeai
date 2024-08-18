import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './routes/home'
import ChatComponent from './routes/Chat'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatComponent />} />
      </Routes>
    </Router>
  )
}

export default App