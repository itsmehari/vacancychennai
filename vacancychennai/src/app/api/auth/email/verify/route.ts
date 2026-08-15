import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import {
  consumeEmailVerificationToken,
  type EmailVerificationPurpose,
} from "@/lib/email/verification-tokens";
import { hasDatabase } from "@/lib/db";
import { logger } from "@/lib/logger";

function parsePurpose(v: string | null): EmailVerificationPurpose | null {
  if (v === "employer_verify" || v === "candidate_magic") return v;
  return null;
}

function safeNextPath(next: string | null): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return null;
  if (next.includes("://") || next.includes("\\")) return null;
  return next;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const purposeParam = parsePurpose(request.nextUrl.searchParams.get("purpose"));
  const nextPath = safeNextPath(request.nextUrl.searchParams.get("next"));

  if (!token || !purposeParam) {
    return NextResponse.redirect(
      new URL("/candidate/login?error=invalid-token", request.url),
    );
  }

  if (!hasDatabase()) {
    return NextResponse.redirect(
      new URL("/candidate/login?error=invalid-token", request.url),
    );
  }

  try {
    const user = await consumeEmailVerificationToken(token, purposeParam);
    if (!user) {
      const path =
        purposeParam === "employer_verify"
          ? "/employer/login?error=invalid-token"
          : "/candidate/login?error=invalid-token";
      return NextResponse.redirect(new URL(path, request.url));
    }

    if (purposeParam === "employer_verify" && user.role !== "employer") {
      return NextResponse.redirect(
        new URL("/employer/login?error=invalid-token", request.url),
      );
    }
    if (purposeParam === "candidate_magic" && user.role !== "candidate") {
      return NextResponse.redirect(
        new URL("/candidate/login?error=invalid-token", request.url),
      );
    }

    if (user.role === "employer") {
      await createSession({
        role: "employer",
        actorId: user.id,
        displayName: user.full_name,
      });
      return NextResponse.redirect(new URL("/employer/dashboard", request.url));
    }

    await createSession({
      role: "candidate",
      actorId: user.id,
      displayName: user.full_name,
    });
    const dest = nextPath ?? "/candidate/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  } catch (e) {
    logger.warn({ err: e }, "email verify route failed");
    const path =
      purposeParam === "employer_verify"
        ? "/employer/login?error=invalid-token"
        : "/candidate/login?error=invalid-token";
    return NextResponse.redirect(new URL(path, request.url));
  }
}
