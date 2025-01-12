/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['seuneuseu.s3.ap-northeast-2.amazonaws.com'], // 허용할 외부 이미지 호스트 추가
    },
    eslint: {
      ignoreDuringBuilds: true, // 빌드 중 eslint 검사 무시
    },
  };
  


  export default nextConfig;
  