import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

function HomePage(){
    return (
        <>
        <button className='btn btn-primary' onClick={() => {
            return toast.success("This is a Sucesss toast")
        }}>Click me</button>
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

export default HomePage