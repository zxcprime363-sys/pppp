import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const instances = [
    "https://tidal-api.binimum.org",
    "hifi-two.spotisaver.net",
    "https://triton.squid.wtf",
    "https://wolf.qqdl.site",
    "https://arran.monochrome.tf",
    "https://hund.qqdl.site",
    "https://katze.qqdl.site",
    "https://vogel.qqdl.site",
    "https://maus.qqdl.site",
  ];

  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "No ID found" }, { status: 400 });
  }

  let lastError: unknown;

  for (const base of instances) {
    const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;

    const url = `${cleanBase}/track/?id=${id}&quality=HI_RES_LOSSLESS`;

    try {
      const res = await axios.get(url, {
        timeout: 7000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json, text/plain, */*",
          Referer: cleanBase,
          "Accept-Language": "en-US,en;q=0.9",
          Origin: cleanBase,
        },
      });
      if (res.data?.data?.assetPresentation === "PREVIEW") {
        console.warn(`${cleanBase} returned PREVIEW, skipping`);
        continue;
      }

      // Success → return immediately
      return NextResponse.json(res.data);
    } catch (error) {
      console.warn(`Instance failed: ${cleanBase}`);
      lastError = error;
    }
  }

  // If ALL instances fail
  console.error("All instances failed");
  return NextResponse.json(
    {
      error:
        lastError instanceof Error ? lastError.message : "All instances failed",
    },
    { status: 500 },
  );
}
