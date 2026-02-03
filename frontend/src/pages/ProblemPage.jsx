import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import { PROBLEMS } from "../data/problem";
import Navbar from "./Navbar";
import ProblemDescription from "./ProblemDescription";
import CodeEditor from "./CodeEditor";
import OutputPanel from "./OutputPanel";
import Split from "react-split";
import { executeCode } from "../lib/piston";
import "./split.css"; //resizable was not working so we used this one
import toast from "react-hot-toast"

function ProblemPage(){
    const {id} = useParams();
    const navigate = useNavigate()

    const [currentproblemId, setCurrentProblemId] = useState("two-sum");
    const [selectedLanguage,setSelectedLanguage] = useState("javascript");
    const [code,setCode] = useState(PROBLEMS[currentproblemId]?.starterCode?.javascript || "")
    const [output,setOutput] = useState(null)
    const [isRunning, setisRunning] = useState(false)

    const currentproblem = PROBLEMS[currentproblemId];
    
    useEffect(()=>{
        if(id && PROBLEMS[id]){
            setCurrentProblemId(id)
            setCode(PROBLEMS[id].starterCode[selectedLanguage])
            setOutput(null)
        }
    },[id,selectedLanguage])

    const handleLanguageChange = (e) => {
        const newLang = e.target.value
        setSelectedLanguage(newLang)
        setCode(currentproblem.starterCode[newLang])
        setOutput(null)


    }
    const handleProblemChange = (problemChange) => {return navigate(`/problems/problem/${problemChange}`)}

const normalizeOutput = (output) => {
  // Agar output string nahi hai (jaise null/undefined), toh khali string return karo
  if (!output) return "";

  return output
    .toString()
    .trim() // Shuruat aur aakhri ki extra spaces/enters hatao
    .split("\n") // Har line ko alag karo
    .map((line) =>
      line
        .trim() // Line ke aage-piche ki space saaf karo
        // Brackets ke andar ki shuruat wali spaces hatao
        .replace(/\[\s+/g, "[") 
        // Brackets ke khatam hone se pehle wali spaces hatao
        .replace(/\s+\]/g, "]") 
        // Comma ke aage-piche ki saari faltu spaces hatao
        .replace(/\s*,\s*/g, ",") 
    )
    .filter((line) => line.length > 0) // Khali lines ko nikaal do
    .join("\n"); // Wapas sabko ek string mein jod do
};

    const checkIfTestPassed = (actualOutput , expectedOutput) => {
        const normalizeActual = normalizeOutput(actualOutput)
        const normalizedExpected = normalizeOutput(expectedOutput)
        return normalizeActual === normalizedExpected

    }
    const handleRunCode = async() => {
        try {
        console.log("Running...")
        setisRunning(true)
        setOutput(null)
        const result = await executeCode(selectedLanguage,code)
        setOutput(result)
        setisRunning(false)

        if(result.success){
            const expectedOutput = currentproblem.expectedOutput[selectedLanguage]
            const testsPassed = checkIfTestPassed(result.output, expectedOutput)

            if(testsPassed){
                toast.success("All tests passed! Great Job!")
                console.log("Passed")
            } else {
                toast.error("Tests failed. Check your output")
            }
        }
            
        } catch (error) {
            toast.error("Something went wrong")
            console.log(error)
            
        }
    }

    return(
        <>
        <div className="h-screen w-screen bg-base-100 flex flex-col">
            <Navbar/>
            <div className="flex-1 overflow-hidden">
                <Split 
                    className="split flex h-full"
                    sizes={[40, 60]}
                    minSize={300}
                    gutterSize={8}
                    direction="horizontal"
                >
                    {/* Left panel - Problem Description */}
                    <div className="overflow-auto h-full">
                        <ProblemDescription
                        problem = {currentproblem}
                        problemid = {currentproblemId}
                        onProblemChange = {handleProblemChange}
                        allProblems = {Object.values(PROBLEMS)}/>
                    </div>

                    {/* Right side - Code Editor + Output Panel stacked vertically */}
                    <div className="h-full">
                        <Split
                            className="split flex flex-col h-full"
                            sizes={[70, 30]}
                            minSize={100}
                            gutterSize={8}
                            direction="vertical"
                        >
                            <div className="overflow-auto">
                                <CodeEditor
                                selectedLanguage = {selectedLanguage}
                                code = {code}
                                isRunning = {isRunning}
                                onLanguageChange = {handleLanguageChange}
                                onCodeChange = {setCode}
                                onRunCode = {handleRunCode}/>
                                
                            </div>
                            <div className="overflow-auto"> {/* by overflow-auto we can scroll that specific part not whole website will get scrolled */}
                                <OutputPanel output = {output}/>
                            </div>
                        </Split>
                    </div>
                </Split>
            </div>
        </div>
        </>
    )
}

export default ProblemPage