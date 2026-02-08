import {useNavigate} from 'react-router'
import { useUser } from '@clerk/clerk-react'
import { useState } from 'react';
import { useActiveSessions, useCreateSession, useMyRecentSessions } from '../hooks/useSessions';
import toast from 'react-hot-toast';
import Navbar from './Navbar';
import WelcomeSection from './WelcomeSection';
import ActiveSession from './ActiveSession';
import CreateSessionModal from './CreateSessionModal';
import RecentSessions from './RecentSessions';
import StatsCards from './StatsCards';

function Dashboard(){
    const navigate = useNavigate();
    const {user} = useUser()
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [roomConfig, setRoomConfig] = useState({problem:"",difficulty:""})

    const createSessionMutation = useCreateSession()
    const {data:activeSessionData, isLoading:loadingActiveSessions}  = useActiveSessions()
    const {data:recentSessionsData, isLoading:loadingRecentSessions} = useMyRecentSessions()

    console.log(user)
    console.log("active")
    console.log(activeSessionData)
    console.log("recent")
    console.log(recentSessionsData )

    const handleCreateRoom = ()=>{
        if(!roomConfig.problem ||!roomConfig.difficulty ) toast.error("Both problem and difficulty feilds are required")
        createSessionMutation.mutate({
    problem: roomConfig.problem, difficulty:roomConfig.difficulty},
{
    onSuccess: (data) =>{
        setShowCreateModal(false)
        navigate(`/session/${data.session._id}`)
    }
})
    }

    const activeSessions = activeSessionData?.sessions || []
    const recentSessions = recentSessionsData?.sessions || []

    const isUserInSession = (session) => {
        if(!user.id) return false;

        return session.host?.clerkId === user.id || session.participant?.clerkId === user.id
        //if any of these is true then user is part of the session
    }

    useCreateSession
    return(
        <>
        <div className='min-h-screen bg-base-300'>
        <Navbar/>
        <WelcomeSection onCreateSession = {() => setShowCreateModal(true)} />
            {/* Grid Layout */}
            <div className='container mx-auto px-6 pb-16'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <StatsCards
                    activeSessionsCount = {activeSessions.length}
                    recentSessionsCount = {recentSessions.length}
                        />
                    <ActiveSession
                    sessions = {activeSessions}
                    isLoading = {loadingActiveSessions}
                    isUserInSession = {isUserInSession}
                    />
                </div>
                <RecentSessions
                sessions = {recentSessions}
                isLoading = {loadingRecentSessions}/>
            </div>
        </div>

        <CreateSessionModal
        isOpen = {showCreateModal}
        onClose = {() => setShowCreateModal(false)}
        roomConfig = {roomConfig}
        setRoomConfig = {setRoomConfig}
        onCreateRoom = {handleCreateRoom}
        isCreating = {createSessionMutation.isPending} />
        </>
    )
}

export default Dashboard