import { useState } from 'react'
import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import {Navigate,Route, Routes } from "react-router"
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProblemsPage from './pages/ProblemsPage'

function App() {
  const [count, setCount] = useState(0)
    const{ isSignedIn } = useUser()

  return (
    <>
    <h1 className='text-red-500 bg-orange-400 p-10 text-3xl'>Welcome to talent IQ</h1>
      <Routes>
      <Route path="/" element = {<HomePage/>}></Route>
      <Route path="/about" element = {<AboutPage/>}/>
      <Route path="/problems" element = { isSignedIn ? <ProblemsPage/> : <Navigate to = {"/"}/>}/>
      </Routes>
     
    </>
  )
}

export default App
