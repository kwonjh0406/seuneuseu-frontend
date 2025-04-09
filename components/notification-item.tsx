import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, UserPlus } from 'lucide-react'

interface NotificationItemProps {
    id: string
    type: string
    username: string
    profileImageUrl: string
    message: string
    timeAgo: string
    postId: number
}

export function NotificationItem({
    id,
    type,
    username,
    profileImageUrl,
    message,
    timeAgo,
    postId,
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

    const getMessageByType = () => {
        switch (type) {
            case 'like':
                return `${username}님이 회원님의 게시글을 좋아합니다.`
            case 'COMMENT':
                return `${username}님이 회원님에게 댓글을 남겼습니다.`
            case 'follow':
                return `${username}님이 회원님을 팔로우하기 시작했습니다.`
            default:
                return `${username}님의 활동`
        }
    }

    return (
        <div className="flex items-start gap-4 p-4">
            <Avatar className="w-10 h-10">
                <AvatarImage src={profileImageUrl} alt={username} />
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    {getIcon()}
                    <span className="text-sm text-muted-foreground">{timeAgo}</span>
                </div>
                <p className="text-sm">{getMessageByType()}</p>
                {message && (
                    <div className="mt-1 px-3 py-2 bg-muted rounded text-sm text-muted-foreground border">
                        “{message}”
                    </div>
                )}
            </div>
        </div>
    )
}
