import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";
import { useUser } from "@/app/context/UserContext";

interface HeaderProps {
  title: string;
  loggedInUsername?: string | null;
}

export const Header = ({ title, loggedInUsername }: HeaderProps) => {
  const { user } = useUser();

  return (
    <header className="max-sm:fixed sm:sticky w-full top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-background/90 backdrop-blur-md">
      <h1 className="text-xl font-semibold">{title}{user?.username}</h1>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        {user?.username ? (
          <a href="https://api.seuneuseu.com/logout">
            <Button>로그아웃</Button>
          </a>
        ) : (
          <Link href="/login" passHref>
            <Button>로그인</Button>
          </Link>
        )}
      </div>
    </header>
  );
};