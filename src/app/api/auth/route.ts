export async function POST(request: Request) {
  const res = await request.json();
  console.log(res);
  if (!res) return new Response("Không tìm thấy", { status: 400 });

  return new Response(res, {
    status: 200,
    headers: { "Set-Cookie": `token=${res?.accessToken}; Path=/; HttpOnly ` },
  });
}
