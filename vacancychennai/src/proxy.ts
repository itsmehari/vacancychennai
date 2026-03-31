import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getCityContextFromHost } from "@/lib/city-routing";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const cityContext = getCityContextFromHost(host);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", request.headers.get("x-request-id") ?? uuidv4());
  requestHeaders.set("x-city-key", cityContext.cityKey);
  if (cityContext.zoneHint) {
    requestHeaders.set("x-zone-hint", cityContext.zoneHint);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
