export async function GET() {
  return Response.json(
    { apiUrl: process.env.NEXT_PUBLIC_API_URL },
    { status: 202 },
  );
}
