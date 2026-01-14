import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'

function HomePage(){
    return (
        <>
        <button className='btn btn-primary'>Click me</button>
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