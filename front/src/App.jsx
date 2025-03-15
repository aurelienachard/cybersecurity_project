import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/login'
import Tool from './pages/tool'

import './style.css'

const App = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token')
    return token && token.length > 0
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/tool" element={isAuthenticated() ? <Tool /> : <Navigate to="/" />}/>
      </Routes>
    </Router>
  )
}

export default App