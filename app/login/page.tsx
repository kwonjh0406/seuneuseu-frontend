"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleLogin = () => {
        setIsLoading(true)
        // 실제 구현에서는 여기에 구글 OAuth 로직이 들어갑니다
        window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/google`;
        // setTimeout(() => {
        //     setIsLoading(false)
        // }, 1500)
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-black max-sm:-mt-28">
            <div className="w-full max-w-[400px] px-8">
                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">로그인</h1>
                </div>

                <div className="space-y-6">
                    <Button
                        className="w-full h-12 bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90 rounded-full flex items-center justify-center gap-3 transition-all"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent dark:border-black dark:border-t-transparent rounded-full animate-spin"></div>
                                <span>로그인 중...</span>
                            </div>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                    <path d="M1 1h22v22H1z" fill="none" />
                                </svg>
                                <span>Google로 계속하기</span>
                            </>
                        )}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-black px-2 text-gray-500 dark:text-gray-400">또는</span>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="flex h-12 w-full items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                        둘러보기
                    </Link>
                </div>

                <div className="mt-12 text-center text-xs text-gray-500 dark:text-gray-400">
                    <p>
                        계속 진행하면 스느스의{" "}
                        <Link href="#" className="underline hover:text-gray-900 dark:hover:text-gray-300">
                            서비스 약관
                        </Link>
                        {" "}및{" "}
                        <Link href="#" className="underline hover:text-gray-900 dark:hover:text-gray-300">
                            개인정보 보호정책
                        </Link>
                        에 동의하는 것으로 간주됩니다.
                    </p>
                    <p className="mt-6">© 2025 seuneuseu. 모든 권리 보유.</p>
                </div>
            </div>
        </div>
    )
}

