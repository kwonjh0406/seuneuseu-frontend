export interface User {
  username: string;
}

export async function getUser(cookie: string | null): Promise<User | null> {
  const res = await fetch('http://localhost:8080/api/users/me/username', {
    headers: { cookie: cookie ?? '' },
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const data = await res.json();
  return { username: data.username };
}
