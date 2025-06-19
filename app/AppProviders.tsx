'use client'

import { useEffect } from 'react'
import axios from 'axios'
import { useUserStore } from '@/store/useUserStore'

export function AppProviders({ children }: { children: React.ReactNode }) {
    const setUsername = useUserStore((state) => state.setUsername)

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/username`, {
                    withCredentials: true,
                })

                const username = res.data.username
                setUsername(username)
            } catch (error) {
            }
        }

        fetchUser()
    }, [])

    return <>{children}</>
}
