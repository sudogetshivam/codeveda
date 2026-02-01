import Navbar from "./Navbar"
import { PROBLEMS } from "../data/problem"
import { ChevronRightIcon, Code2Icon } from "lucide-react"
import { Link } from "react-router"
import { getDifficultyBadgeClass } from "../lib/utils"
function ProblemsPage(){
    const problems = Object.values(PROBLEMS)
    const easyProblemCount = problems.filter((p) => p.difficulty === "Easy")
    const mediumProblemCount = problems.filter((p) => p.difficulty === "Medium")
    const hardProblemCount = problems.filter((p) => p.difficulty === "Hard")
    return(
        <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="mb-8">
            <h1 className="text-4xl font-bold mb-1">
            Practice Problems
            </h1>
            <p className="text-base-content/70">
            Sharpen your coding skills with these curated problems
            </p>
        </div>
        {/* Problems list */}
        <div className="space-y-4">
            {problems.map((problem) => (
                <Link key={problem.id} 
                to = {`problem/${problem.id}`}
                className="card bg-white/5 hover:scale-[1.01] transition-transform duration-200 ease-in-out cursor-pointer shadow-sm hover:shadow-md">
                    <div className="card-body">
                    <div className="flex items-center justify-between">
                        {/*LEFT SIDE*/}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Code2Icon className="size-6 text-primary"/>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl font-bold">{`${problem.title}`}</h2>
                                        <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                    <p className="text-sm text-base-content/60 ">{problem.category}</p>
                                </div>
                            </div>
                            <p className="text-base-content/80 mb-3">{`${problem.description.text}`}</p>
                            </div>
                             {/*RIGHT SIDE*/}
                             <div className="flex items-center gap-2 text-primary">
                                <p className="font-medium">Solve</p>
                                <ChevronRightIcon className="size-5"/>
                             </div>
                            
                        </div>

                    </div>
                </Link>
            ))}

        </div>
            <div className="mt-12 card bg-base-200 shadow-lg">
                <div className="card-body">
                    <div className="stats stats-vertical lg:stats-horizontal">
                        <div className="stat">
                        <div className="stat-title">Total Problems</div>
                        <div className="stat-value text-primary">{problems.length}</div>
                        </div>

                        <div className="stat">
                        <div className="stat-title">Easy</div>
                        <div className="stat-value text-secondary">{easyProblemCount.length}</div>
                        </div>

                        <div className="stat">
                        <div className="stat-title">Medium</div>
                        <div className="stat-value text-warning">{mediumProblemCount.length}</div>
                        </div>

                        <div className="stat">
                        <div className="stat-title">Hard</div>
                        <div className="stat-value text-error">{hardProblemCount.length}</div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
        </>
    )
}

export default ProblemsPage