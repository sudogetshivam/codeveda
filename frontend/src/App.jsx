import { useState } from 'react'
import './App.css'
import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1>Welcome to talent IQ</h1>
    <SignedOut>
     <SignInButton mode="modal">
      <button>Get Started</button>
     </SignInButton>
     </SignedOut>
     <SignedIn>
      <SignOutButton/>
      </SignedIn>
      <UserButton></UserButton>
     
    </>
  )
}

export default App
