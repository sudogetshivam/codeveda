import { useState } from 'react'
import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import {Navigate,Route, Routes } from "react-router"
import HomePage from './pages/HomePage'
import ProblemsPage from './pages/ProblemsPage'
import ProblemPage from './pages/ProblemPage'
import Dashboard from './pages/Dashboard'
import { Toaster } from 'react-hot-toast'

function App() {
  const [count, setCount] = useState(0)
    const{ isSignedIn,isLoaded } = useUser()

    //this will get rid of flickering effect
    if(!isLoaded) return null

    //? -> kaam ki baat
    /* Agar tum useEffect use karte ho, toh jab bhi tum ek page se dusre page par jaoge 
    aur wapas aaoge, wo phir se loading dikhayega aur data fetch karega. 
    
    matlab ki agar tumhare code main const func = async() => {
    
      const getBooks = await fetch("/api/books")
      ye waali chiiiz ko baar baar fetch karega jab bhi page revisit hoga, useEffect ke case main
      }*/

      /* 
      Socho tumne ek tab mein app kholi aur dusre tab mein kuch aur karne lage. 
      Jab tum 10 minute baad wapas apni app wale tab par aaoge, toh useEffect 
      wala data purana (stale) ho chuka hoga.

      toh ab page refresh karna padegaa
      */

      //!Tanstack wiriting style
      //?promise type code:
      // queryFn: () => fetch("/api/books").then(res => res.json())

      //?await async code 
      /* queryFn: async() => {
        const res = await fetch("/api/books")
        const ans = await res.json()
        return ans
        } */

  return (
    <>
      <Routes>
      <Route path="/" element = {!isSignedIn ? <HomePage/> : <Navigate to = {"/dashboard"}/>}></Route>
      <Route path = "/dashboard" element = {isSignedIn ? <Dashboard/> : <Navigate to = {"/"}/>}/>
      <Route path="/problems" element = { isSignedIn ? <ProblemsPage/> : <Navigate to = {"/"}/>}/>
      <Route path="/problems/problem/:id" element = { isSignedIn ? <ProblemPage/> : <Navigate to = {"/"}/>}/>
      </Routes>
     <Toaster position='top-right'/>
    </>
  )
}

export default App


