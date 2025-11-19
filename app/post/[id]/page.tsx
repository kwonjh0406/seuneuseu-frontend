"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Post } from "@/components/post"
import { Comment } from "@/components/comment"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import Link from "next/link"
import useLoggedInUsername from "@/hooks/useLoggedInUsername"
import { usePageScrollRestore } from "@/hooks/usePageScrollRestore"

interface CommentType {
  id: string
  parentId: string | null
  username: string
  profileImageUrl: string
  timeAgo: string
  content: string
  likes: number
  string: string
  name: string
  replies?: CommentType[]
}

const emptyPost: PostResponse = {
  postId: 0,
  content: "",
  imageUrls: [],
  likes: 0,
  replies: 0,
  timeAgo: "",
  username: "",
  name: "",
  profileImageUrl: "",
}

interface PostResponse {
  postId: number;
  content: string;
  imageUrls: string[];
  likes: number;
  replies: number;
  timeAgo: string;
  username: string;
  name: string;
  profileImageUrl: string;
}

export default function PostPage() {
  const loggedInUsername = useLoggedInUsername();
  // usePageScrollRestore(); // 임시 비활성화


  
  const params = useParams()
  const postId = params.id as string
  const [commentContent, setCommentContent] = useState("")
  const [comments, setComments] = useState<CommentType[]>([])
  const [post, setPost] = useState<PostResponse>(emptyPost)

  const [replyToId, setReplyToId] = useState<string | null>(null);



  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const [postResponse, commentsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/comments`)
        ]);

        setPost(postResponse.data.data);

        // 서버 응답 데이터를 CommentType 형식에 맞게 변환
        const transformedComments = commentsResponse.data.data.map((comment: any) => ({
          ...comment,
          parentId: comment.parentId || null, // parentId가 없는 경우 null로 설정
          replies: [] // 초기 replies 배열 설정
        }));

        setComments(transformedComments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPostAndComments();
  }, [postId]);

  const getCommentHierarchy = (comments: CommentType[]) => {
    try {
      // parentId가 null인 최상위 댓글만 필터링
      const topLevelComments = comments.filter(comment => !comment.parentId);

      // 각 최상위 댓글에 대한 답글 찾기
      return topLevelComments.map(comment => ({
        ...comment,
        replies: comments.filter(reply => reply.parentId === comment.id) || []
      }));
    } catch (error) {
      console.error("Error in getCommentHierarchy:", error);
      return []; // 에러 발생 시 빈 배열 반환
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/comments`,
        {
          content: commentContent,
          parentId: replyToId,
        },
        { withCredentials: true }
      );
      
      // 댓글 목록 새로고침
      const commentsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/comments`);
      const transformedComments = commentsResponse.data.data.map((comment: any) => ({
        ...comment,
        parentId: comment.parentId || null,
        replies: []
      }));
      setComments(transformedComments);
      setCommentContent("");
      setReplyToId(null);
      
      // 게시물 정보 업데이트 (댓글 수)
      const postResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}`);
      setPost(postResponse.data.data);

    } catch (error) {
      console.error("Error submitting comment:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message || "댓글 작성에 실패했습니다.");
      }
    }
  }


  const handleReply = async (commentId: string, content: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/comments`,
        {
          content: content,
          parentId: commentId
        },
        { withCredentials: true }
      );
      
      // 댓글 목록 새로고침
      const commentsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/comments`);
      const transformedComments = commentsResponse.data.data.map((comment: any) => ({
        ...comment,
        parentId: comment.parentId || null,
        replies: []
      }));
      setComments(transformedComments);
      
      // 게시물 정보 업데이트 (댓글 수)
      const postResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}`);
      setPost(postResponse.data.data);
    } catch (error) {
      console.error("Failed to submit reply:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message || "답글 작성에 실패했습니다.");
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/comments/${commentId}`, {
        withCredentials: true,
      })
      
      // 댓글 목록 새로고침
      const commentsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}/comments`);
      const transformedComments = commentsResponse.data.data.map((comment: any) => ({
        ...comment,
        parentId: comment.parentId || null,
        replies: []
      }));
      setComments(transformedComments);
      
      // 게시물 정보 업데이트 (댓글 수)
      const postResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}`);
      setPost(postResponse.data.data);
    } catch (error) {
      console.error("Failed to delete comment:", error)
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message || "댓글 삭제에 실패했습니다.");
      }
    }
  }

  const commentHierarchy = getCommentHierarchy(comments);

  return (
    <div className="flex min-h-screen bg-background max-sm:pt-14">
      <Sidebar username={loggedInUsername} />
      <main className="flex-1 md:ml-[72px] lg:ml-[245px] mb-16 md:mb-0">
        <header className="max-sm:fixed sm:sticky w-full top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h1 className="text-xl font-semibold">게시물</h1>
          
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

        <div className="max-w-[640px] mx-auto bg-background/80 backdrop-blur-sm pb-32">
          <Post
            {...post}
            loggedInUsername={loggedInUsername}
            isLast={true}
          />

          <div className="border-t border-border" />

          <div className="mt-3 mb-12 px-4">
          <h2 className="text-lg font-semibold mb-4">댓글</h2>
            {loggedInUsername && (
              <form onSubmit={handleSubmitComment} className="mb-4">
                <div className="flex gap-3">
                  <div className="flex-1 min-w-0">
                    <Textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="댓글 작성하기..."
                      className="min-h-[40px] max-h-[120px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0 text-[15px]"
                    />
                    <div className="flex justify-end items-center mt-2 border-t pt-2">
                      <Button
                        type="submit"
                        // variant="ghost"
                        // size="sm"
                        // className={`font-semibold ${!commentContent.trim() ? "text-primary/50" : "text-primary"}`}
                        disabled={!commentContent.trim()}
                      >
                        게시
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            )}


            <div className="space-y-4">
              {commentHierarchy.map((comment, index) => (
                <Comment
                  key={comment.id}
                  {...comment}
                  replies={comment.replies || []}
                  onReply={handleReply}
                  onDelete={handleDeleteComment}
                  isLast={index === commentHierarchy.length - 1}
                  loggedInUsername={loggedInUsername}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}