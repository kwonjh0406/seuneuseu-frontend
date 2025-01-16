import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, UserPlus } from 'lucide-react'

interface NotificationItemProps {
    id: string
    type: 'like' | 'comment' | 'follow'
    username: string
    avatar: string
    content: string
    timeAgo: string
}

export function NotificationItem({
    id,
    type,
    username,
    avatar,
    content,
    timeAgo,
}: NotificationItemProps) {
    const getIcon = () => {
        switch (type) {
            case 'like':
                return <Heart className="w-4 h-4 text-red-500" />
            case 'comment':
                return <MessageCircle className="w-4 h-4 text-blue-500" />
            case 'follow':
                return <UserPlus className="w-4 h-4 text-green-500" />
        }
    }

    return (
        <div
            className="flex items-start gap-4 p-4"
        >
            <Avatar className="w-10 h-10">
                <AvatarImage src={avatar} alt={username} />
                <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{username}</span>
                    {getIcon()}
                    <span className="text-sm text-muted-foreground">{timeAgo}</span>
                </div>
                <p className="text-sm">{content}</p>
            </div>
        </div>
    )
}

