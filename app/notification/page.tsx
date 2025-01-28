"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { NotificationItem } from "@/components/notification-item"
import axios from "axios"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Mock data for demonstration
const mockNotifications = [
    {
        id: "1",
        type: 'like' as const,
        username: "johndoe",
        avatar: "/placeholder.svg",
        content: "liked your thread",
        timeAgo: "2h",
        isRead: false,
    },
    {
        id: "2",
        type: 'comment' as const,
        username: "janedoe",
        avatar: "/placeholder.svg",
        content: "commented on your thread: Great post!",
        timeAgo: "4h",
        isRead: true,
    },
    {
        id: "3",
        type: 'follow' as const,
        username: "bobsmith",
        avatar: "/placeholder.svg",
        content: "started following you",
        timeAgo: "1d",
        isRead: false,
    },
]

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(mockNotifications)

    const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
    const router = useRouter()
    // 로그인 된 사용자의 세션을 조회, 존재한다면 사용자의 username(아이디)을 받아옴

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/username`, {
                    withCredentials: true,
                });
                if (response.data.username == null) {
                    router.push("/login");
                }
                else {
                    setLoggedInUsername(response.data.username);
                }
            } catch (error) { }
        };
        checkSession();
    }, []);

    const handleReadNotification = (id: string) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification =>
                notification.id === id ? { ...notification, isRead: true } : notification
            )
        )
    }

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar username={loggedInUsername} />
            <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-16 md:mb-0">
                <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <h1 className="text-xl font-semibold">알림</h1>
                    {loggedInUsername ? (
                        <Link href="/logout" prefetch={false} passHref>
                            <Button>로그아웃</Button>
                        </Link>
                    ) : (
                        <Link href="/login" passHref>
                            <Button>로그인</Button>
                        </Link>
                    )}
                </header>

                {/* <div className="max-w-[640px] mx-auto">
                    {notifications.length > 0 ? (
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
                            <h2 className="text-2xl font-semibold mb-2">No notifications yet</h2>
                            <p className="text-muted-foreground">
                                When you have notifications, they'll show up here.
                            </p>
                        </div>
                    )}
                </div> */}
            </main>
        </div>
    )
}

