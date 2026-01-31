import {Link, useLocation} from "react-router"
import {ArrowRightIcon, BookOpenIcon, CheckIcon, Code2, CodeIcon, LayoutDashboardIcon, SparklesIcon, UsersIcon, VideoIcon, ZapIcon} from "lucide-react"
import { UserButton } from "@clerk/clerk-react"



function Navbar() {
    const location = useLocation()

    const isActive = (path) =>{
        if(location.pathname===path)
            return true
        return false
    }

    return (
        <>
        <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
            <Link
            
            to = "/"
            className = "group flex items-center gap-3 hover:scale-105 transition-transform duration-200"
            >
                <div className="size-10 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
                <div>
                    <SparklesIcon className="size-6 text-white"></SparklesIcon>
                </div>
                </div>
                <div className="flex flex-col">
                 <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
                <p>Talent IQ</p>
            </span>
            <span>
                <p className="text-xs text-white/40 ">Code Together</p>
            </span>
                </div>
            </Link>
            <div className="flex items-center gap-1">
            <Link
            to = "/problems"
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive("/problems")?"bg-primary text-primary-content":"hover:bg-base-200 text-base-content/70 hover:text-base-content"}`}>
                <div className="flex items-center gap-x-2.5">
                    <BookOpenIcon className="size-4"/>
                    <span className="font-medium hidden sm:inline">Problems</span>

                </div>
            
            </Link>
            <Link
            to = "/dashboard"
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive("/dashboard")?"bg-primary text-primary-content":"hover:bg-base-200 text-base-content/70 hover:text-base-content"}`}>
                <div className="flex items-center gap-x-2.5">
                    <LayoutDashboardIcon className="size-4"/>
                    <span className="font-medium hidden sm:inline">Dashboard</span>

                </div>
            
            </Link>
            <div className="ml-4">
            <UserButton/>
            </div>
            </div>
        </div>

        </nav>
        </>
    )
}

export default Navbar