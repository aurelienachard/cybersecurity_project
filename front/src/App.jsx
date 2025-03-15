import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/login'
import Tool from './pages/tool'

import './style.css'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/tool" element={<Tool />}/>
      </Routes>
    </Router>
  )
}

export default App