// app/api/proxy-image/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) return new Response("Missing url", { status: 400 });

  const res = await fetch(url);
  const buffer = await res.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "image/jpeg",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
