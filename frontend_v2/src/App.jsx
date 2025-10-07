import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Routes, useLocation } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'

const App = () => {
  const location=useLocation()
  return (
    <div className=''>
      {location.pathname!=='/login' && location.pathname!=='/signup' && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
      {location.pathname!=='/login' && location.pathname!=='/signup' && <Footer/>}
    </div>
  )
}

export default App
