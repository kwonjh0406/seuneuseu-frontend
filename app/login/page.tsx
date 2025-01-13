'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/google`;
  };

  

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[350px] space-y-8">

        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
              width="200" height="200" viewBox="0 0 500.000000 500.000000">
              <g transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                <path d="M646 3404 c-158 -405 -291 -745 -293 -755 -5 -18 4 -19 225 -19 172 0 232 3 239 13 6 6 70 164 143 350 73 185 136 337 139 337 4 0 96 -156 206 -347 l200 -348 253 -3 c138 -1 252 1 252 4 0 15 -553 994 -561 994 -5 0 -72 -32 -149 -70 -77 -39 -140 -68 -140 -65 0 3 55 141 121 307 67 167 124 311 126 321 5 16 -11 17 -233 17 l-239 0 -289 -736z"/>
                <path d="M3282 3398 c-161 -409 -292 -749 -292 -755 0 -10 53 -13 230 -13 208 0 230 2 239 18 5 9 68 168 141 352 73 184 133 336 135 338 1 1 80 -134 175 -300 96 -167 189 -327 207 -355 l33 -53 244 0 c135 0 247 3 249 8 3 5 -533 974 -550 992 -2 2 -69 -28 -149 -68 -79 -40 -146 -72 -148 -72 -3 0 53 144 125 320 71 176 129 322 129 325 0 3 -107 5 -238 5 l-239 0 -291 -742z"/>
                <path d="M1890 1390 l0 -750 790 0 790 0 -2 178 -3 177 -557 3 -558 2 0 570 0 570 -230 0 -230 0 0 -750z"/>
              </g>
            </svg>
          </div>

          <h1 className="text-5xl font-bold text-gray-900">스느스</h1>
          <p className="text-sm text-gray-600">
            새로운 소통의 시작, 여러분의 생각을 공유하세요
          </p>
        </div>

        <div className="space-y-4">
          <Link href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/google`} passHref>
            <Button className="w-full py-6 text-base bg-[#101010] text-white hover:bg-[#2b2b2b] rounded-xl font-semibold">
              Google 계정으로 계속하기
            </Button>
          </Link>

          <div className="text-center">
            <Link href="/" className="text-sm text-[#737373] hover:text-[#101010] transition-colors">
              로그인하지 않고 둘러보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
