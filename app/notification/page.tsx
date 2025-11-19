"use client"

import { useEffect, useState, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { NotificationItem } from "@/components/notification-item"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import useLoggedInUsername from "@/hooks/useLoggedInUsername"
import { useAppContext } from "@/lib/AppContext"

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

const PAGE_KEY = 'notification';

export default function NotificationsPage() {
    const loggedInUsername = useLoggedInUsername()
    const { getTabState, setTabState, saveScrollPosition, restoreScrollPosition, savePageScrollPosition } = useAppContext();
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        const savedState = getTabState(PAGE_KEY, 'main');
        return savedState?.data || [];
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const savedState = getTabState(PAGE_KEY, 'main');
                if (savedState?.data && savedState.data.length > 0) {
                    // 저장된 데이터가 있으면 사용
                    setNotifications(savedState.data);
                    setIsLoading(false);
                } else {
                    // 저장된 데이터가 없으면 새로 가져오기
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications`, {
                        withCredentials: true,
                    });
                    const data = response.data.data;
                    setNotifications(data);
                    
                    // 상태 저장
                    setTabState(PAGE_KEY, 'main', {
                        activeTab: 'main',
                        scrollPosition: 0,
                        data: data,
                    });
                }
            } catch (err) {
                console.error("알림을 불러오는 데 실패했습니다.", err)
                setError("알림을 불러오는 데 실패했습니다.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchNotifications()
    }, [getTabState, setTabState])

    // 페이지 마운트 시 스크롤 위치 복원
    useEffect(() => {
        const tabState = getTabState(PAGE_KEY, 'main');
        if (tabState?.scrollPosition) {
            setTimeout(() => {
                restoreScrollPosition(PAGE_KEY, 'main');
            }, 100);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 마운트 시 한 번만 실행

    // 스크롤 위치 저장
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollPos = window.scrollY || document.documentElement.scrollTop;
                    saveScrollPosition(PAGE_KEY, 'main', scrollPos);
                    savePageScrollPosition('/notification', scrollPos);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [saveScrollPosition, savePageScrollPosition]);

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
                <div className="max-w-[640px] mx-auto" ref={scrollContainerRef}>
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
