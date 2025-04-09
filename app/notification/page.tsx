"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { NotificationItem } from "@/components/notification-item"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import useLoggedInUsername from "@/hooks/useLoggedInUsername"

interface Notification {
    id: string
    type: string
    username: string
    profileImageUrl: string
    message: string
    timeAgo: string
    postId: number
    isRead: boolean
}

export default function NotificationsPage() {
    const loggedInUsername = useLoggedInUsername()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications`, {
                    withCredentials: true,
                });
                setNotifications(response.data.data)
            } catch (err) {
                console.error("알림을 불러오는 데 실패했습니다.", err)
                setError("알림을 불러오는 데 실패했습니다.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchNotifications()
    }, [])

    const handleReadNotification = (id: string) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification =>
                notification.id === id ? { ...notification, isRead: true } : notification
            )
        )
    }

    return (
        <div className="flex min-h-screen bg-background max-sm:pt-14">
            <Sidebar username={loggedInUsername} />
            <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-16 md:mb-0">
                <Header title="알림" loggedInUsername={loggedInUsername} />
                <div className="max-w-[640px] mx-auto">
                    {isLoading ? (
                        <p className="text-center py-10">로딩 중...</p>
                    ) : error ? (
                        <p className="text-center text-red-500 py-10">{error}</p>
                    ) : notifications.length > 0 ? (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    {...notification}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)] text-center px-4">
                            <h2 className="text-2xl font-semibold mb-2">알림이 없습니다</h2>
                            <p className="text-muted-foreground">
                                새로운 활동이 있을 때 여기에 표시됩니다.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
