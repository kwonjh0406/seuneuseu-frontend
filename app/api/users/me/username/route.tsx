import { getLoggedInUsername } from '@/lib/getLoggedInUsername';

export async function GET() {
  const username = await getLoggedInUsername();
  return new Response(JSON.stringify({ username }));
}
