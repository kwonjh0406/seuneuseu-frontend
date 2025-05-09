// lib/getLoggedInUsername.ts
import { cookies } from "next/headers";

export async function getLoggedInUsername(): Promise<string | null> {
  const cookieStore = cookies();
  const jsessionId = cookieStore.get("JSESSIONID")?.value;

  if (!jsessionId) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/username`, {
      headers: {
        Cookie: `JSESSIONID=${jsessionId}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.username;
  } catch (error) {
    console.error("username 가져오기 실패:", error);
    return null;
  }
}
