import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useEndSession, useJoinSession, useSessionById } from '../hooks/useSessions';
import { PROBLEMS } from '../data/problem';
import { executeCode } from '../lib/piston';
import Navbar from './Navbar';
import Split from "react-split"
import "./split.css"
import {getDifficultyBadgeClass} from '../lib/utils';
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from 'lucide-react';
import CodeEditor from './CodeEditor';
import OutputPanel from './OutputPanel';
import VideoCallUI from './VideoCallUI';


import useStreamClient from '../hooks/useStreamClient';
import { StreamCall,StreamVideo } from '@stream-io/video-react-sdk';


function SessionPage() {
  const navigate = useNavigate();
  const {id} = useParams();
  const {user} = useUser();
  const [output,setOutput] = useState(null)
  const [isRunning,setIsRunning] = useState(false)

  const {data:sessionData, isLoading:loadingSession, refetch} = useSessionById(id)
 
  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id
  const isParticipant = session?.participant?.clerkId === user?.id

 const {call,channel, chatClient, isInitializingCall, streamClient } = useStreamClient(session, loadingSession, isHost, isParticipant);

  const problemData = session?.problem?Object.values(PROBLEMS).find((p) => p.title === session.problem):null
      const [selectedLanguage,setSelectedLanguage] = useState("javascript");
    const [code,setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "")

//auto-join session if user is not already a participant and not the host
useEffect(()=>{
  if(!session || !user || loadingSession) return
  if(isHost || isParticipant) return

  joinSessionMutation.mutate(id,{onSuccess: refetch})

},[session, user, loadingSession, isHost,isParticipant, id])


//update code when problem loads or chnages
useEffect(() => {
  if(problemData?.starterCode?.[selectedLanguage])
    setCode(problemData.starterCode[selectedLanguage])
},[problemData,selectedLanguage])

    //redirect the participant when session ends
    useEffect(() => {
      if(!session || loadingSession) return

      if(session.status === "completed") navigate("/dashboard")
    },[session,loadingSession,navigate])

    const handleLanguageChange = (e) => {
        const newLang = e.target.value
        setSelectedLanguage(newLang)
        setCode(currentproblem.starterCode[newLang])
        setOutput(null)
    }

        const handleRunCode = async () => {
        setIsRunning(true)
        setOutput(null)
        const result = await executeCode(selectedLanguage, code);
        setOutput(result);
        setIsRunning(false)
        }

        const handleEndSession = () => {
          if(confirm("Are you sure you want to end this session? All participants will be notified")){
            //this will send host to dashboard page
            endSessionMutation.mutate(id, {onSuccess: () => navigate("/dashboard")})
          }
        }

    



  return (
    <>
    <div className='h-screen bg-base-100 flex flex-col'>
      <Navbar/>
      <div className='flex-1 overflow-hidden'>
        <Split
        className = 'split flex h-full'
        sizes = {[50,50]}
        minSize = {200}
        gutterSize={8}
        direction = "horizontal"
        >
          {/* Left panel - code editor and problem detail */}
<div className='bg-base-100 h-full overflow-hidden'>
  <Split
    className='split flex flex-col h-full'
    sizes={[50, 50]}
    minSize={200}
    gutterSize={4}
    direction="vertical"
  >
    {/*IS DIV PAR SCROLL LAGAYE HAI*/}
    <div className='flex flex-col h-full overflow-y-auto min-h-0'> 
      
      {/* Header section */}
      <div className='p-6 bg-base-100 border-b border-base-300 flex-shrink-0'>
        <div className='flex items-start justify-between mb-3'>
          <div>
            <h1 className='text-3xl font-bold text-base-content'>{session?.problem || "Loading..."}</h1>
            {problemData?.category &&(
              <p className='text-base-content/60 mt-1'>{problemData.category}</p>
            )}
            <p className='text-base-content/60 mt-2'>
            Host: {session?.host?.name || "Loading..."} . {" "}
            {session?.participant? 2:1}/2 participants joined
            </p>
          </div>
          <div className='flex items-center gap-3'>
            {session?.difficulty && (
              <span className={`badge badge-lg ${getDifficultyBadgeClass(session.difficulty)}`}>
                {session?.difficulty.slice(0, 1).toUpperCase() + session?.difficulty.slice(1) || "Easy"}   
              </span>
            )}
            {isHost && session?.status === "active" && (
              <button
                onClick={handleEndSession}
                disabled={endSessionMutation.isPending}
                className="btn btn-error btn-sm gap-2"
              >
                {endSessionMutation.isPending ? (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOutIcon className="w-4 h-4" />
                )}
                End Session
              </button>
            )}
            {session?.status === "completed" && (
              <span className="badge badge-ghost badge-lg">Completed</span>
            )}
          </div>
        </div>
      </div>

      {/* Content section (Description + Examples) */}
      <div className='p-6 space-y-6'>
        {/* Problem description */}
        {problemData?.description && (
          <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
            <h2 className="text-xl font-bold mb-4 text-base-content">Description</h2>
            <div className="space-y-3 text-base leading-relaxed">
              <p className="text-base-content/90">{problemData.description.text}</p>
              {problemData.description.notes?.map((note, idx) => (
                <p key={idx} className="text-base-content/90">{note}</p>
              ))}
            </div>
          </div>
        )}

        {/* Example section */}
        {problemData?.examples && problemData.examples.length > 0 && (
          <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
            <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>
            <div className="space-y-4">
              {problemData.examples.map((example, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-sm">{idx + 1}</span>
                    <p className="font-semibold text-base-content">Example {idx + 1}</p>
                  </div>
                  <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                    <div className="flex gap-2">
                      <span className="text-primary font-bold min-w-[70px]">Input:</span>
                      <span>{example.input}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-secondary font-bold min-w-[70px]">Output:</span>
                      <span>{example.output}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* constraint section */}
                            {problemData?.constraints && problemData.constraints.length > 0 && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
                        <ul className="space-y-2 text-base-content/90">
                          {problemData.constraints.map((constraint, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-primary">•</span>
                              <code className="text-sm">{constraint}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
      </div>
    </div>
    {/* Editor */}
   <Split
  className="h-full min-h-0" // Ye zaroori hai CSS target karne ke liye
  sizes={[60, 40]}
  minSize={200}
  gutterSize={4}
  direction="vertical"
>
  <div className='flex flex-col h-full min-h-0 overflow-hidden'>
    <CodeEditor
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(value) => setCode(value)}
                      onRunCode={handleRunCode}
                    />
  </div>
  <div className='bg-base-200 p-4 h-full min-h-0 overflow-auto'>
                    <OutputPanel output={output} />
  </div>
</Split>



    
    
  </Split>
</div>
          {/* right panel - video calling */}
          {/* Parent div ko 'h-full' ya fixed height dena zaroori hai */}
<div className="h-full"> 
  <Split
    className="split-vertical h-full" // 'flex' hatakar dekho vertical mein
    sizes={[100, 0]}
    minSize={100}
    gutterSize={8}
    direction="vertical"
  >
    {/* Upper Panel */}
  <div className="h-full bg-base-200 p-4 overflow-auto">
       {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-lg">Connecting to video call...</p>
                  </div>
                </div> ) :!streamClient || !call ?(
                   <div className="h-full flex items-center justify-center">
                  <div className="card bg-base-100 shadow-xl max-w-md">
                    <div className="card-body items-center text-center">
                      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                        <PhoneOffIcon className="w-12 h-12 text-error" />
                      </div>
                      <h2 className="card-title text-2xl">Connection Failed</h2>
                      <p className="text-base-content/70">Unable to connect to the video call</p>
                    </div>
                  </div>
                </div>
                ):(
                  <div className="h-full">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                </div>
                )}
    </div>
    
    {/* Lower Panel */}
    {/* <div className="bg-base-300 p-4 overflow-auto">
      Lower
    </div> */}
  </Split>
</div>
        </Split>
      </div>
    </div>
    </>
  )
}

export default SessionPage
