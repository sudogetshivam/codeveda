import {Link} from "react-router"
import {ArrowRightIcon, SparklesIcon} from "lucide-react"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"
function HomePage(){
    return (
        <>
        <div className="bg-gradient-to-br from-base-100 via-base-200 to-base-300">
        <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        <Link to = {"/"} className="flex items-center gap-3 hover:scale-105 transition-transform duration-200">
        <div className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
            <SparklesIcon/>
        </div>
        <div className="flex flex-col">
            <span className="font-black text-xl bg-gradient-to-tr from-primary via-seconday to-accent bg-clip-text text-transparent font-mono tracking-wider">
                <p>Talent IQ</p>
            </span>
            <span>
                <p className="text-xs text-white/40 ">Code Together</p>
            </span>

        </div>
        </Link>
        {/* Auth BTN */}
        <SignedOut>
        <SignInButton mode="modal">
            <button className="text-sm flex items-center bg-gradient-to-tr from-primary via-secondary to-accent p-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2">
                <p className="text-white inline">Get Started</p>
                <p className="inline">
                    <ArrowRightIcon className="size-4 text-white"/>
                </p>
            </button>
        </SignInButton>
        </SignedOut>

        <SignedIn>
            <UserButton fallbackRedirectUrl="/"/>
        </SignedIn>
        </div>
        </nav>
        </div>
        </>
    )
}

export default HomePage