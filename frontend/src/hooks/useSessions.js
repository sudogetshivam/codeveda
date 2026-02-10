import { useMutation, useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useAuth } from "@clerk/clerk-react"
import { getAuthToken } from "../lib/authToken"
import { sessionApi } from "../api/sessions"

export const useCreateSession = () => {
    const { getToken } = useAuth()
    const result = useMutation({
        mutationKey: ["createSession"],
        mutationFn: async (data) => {
            const token = (await getToken?.()) ?? (await getAuthToken())
            if (!token) throw new Error("Not signed in. Please refresh and try again.")
            return sessionApi.createSession(data, token)
        },
        onSuccess: () => toast.success("Session created sucessfully"),
        onError: (error) => toast.error(error.response?.data?.message || "Failed to create Session"),
    })
    return result
}

export const useActiveSessions = () => {
    const result = useQuery({
        queryKey:["activeSessions"],
        queryFn: sessionApi.getActiveSessions
    })
    return result
}

export const useMyRecentSessions = () => {
    const result = useQuery({
        queryKey:["myRecentSessions"],
        queryFn:sessionApi.getMyRecentSessions
    })

    return result
}

export const useSessionById = (id) => {
    const result = useQuery({
        queryKey:["session",id],
        queryFn:() => sessionApi.getSessionById(id),
        enabled: !!id,//also called bang bang operator, converts to boolean expression
        refetchInterval:5000, // refetch every 5 seconds 
    })

    return result
}

export const useJoinSession = () =>{
    return useMutation({
        mutationKey: ["joinSession"],
        mutationFn:sessionApi.joinSession,
        onSuccess: () =>toast.success("User Joined Successfully"),
        onError: (error) =>toast.error(error.response?.data?.message || "User Failed to join Session"),
    })
}

export const useEndSession = () =>{
    const result = useMutation({
        mutationKey: ["endSession"],
        mutationFn:sessionApi.endSession,
        onSuccess: () =>toast.success("Session ended Successfully"),
        onError: (error) =>toast.error(error.response?.data?.message || "Failed to end Session"),
    })
    return result
}



