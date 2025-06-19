export interface User {
    username: string;
}

export async function getUser(cookie: string | null): Promise<User | null> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/username`,
            {
                headers: { cookie: cookie ?? '' },
                cache: 'no-store',
            }
        );

        if (!res.ok) return null;

        const data = await res.json();
        return { username: data.username };
    } catch (error) {
        return null;
    }
}
