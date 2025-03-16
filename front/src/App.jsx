import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/login'
import Exploring from './pages/exploring'
import Attacking from './pages/attacking'
import Home from './pages/home'

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
        <Route path='/home' element={isAuthenticated() ? <Home /> : <Navigate to="/" />}/>
        <Route path="/exploring" element={isAuthenticated() ? <Exploring /> : <Navigate to="/" />}/>
        <Route path="/attacking" element={isAuthenticated() ? <Attacking /> : <Navigate to="/" />}/>
      </Routes>
    </Router>
  )
}

export default App