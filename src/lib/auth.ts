import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { dbExecute, dbQuery, hasDatabase } from "@/lib/db";
import { UserRole } from "@/types/domain";

const SESSION_KEY = "vc_session";
const SESSION_AGE_SECONDS = 60 * 60 * 24 * 7;
const ROTATION_THRESHOLD_SECONDS = 60 * 60 * 24;

const memorySessions = new Map<
  string,
  SessionData & { expiresAt: number; createdAt: number }
>();

type SessionData = {
  role: UserRole;
  actorId: string;
  displayName: string;
};

function getSessionExpiryDate() {
  return new Date(Date.now() + SESSION_AGE_SECONDS * 1000);
}

export async function createSession(session: SessionData) {
  const token = uuidv4();
  const expiresAt = getSessionExpiryDate();

  if (hasDatabase()) {
    await dbExecute(
      `insert into sessions (user_id, session_token, user_agent, expires_at)
       values ($1, $2, $3, $4)`,
      [session.actorId, token, "web", expiresAt],
    );
  } else {
    memorySessions.set(token, {
      ...session,
      createdAt: Date.now(),
      expiresAt: expiresAt.getTime(),
    });
  }

  const store = await cookies();
  store.set(SESSION_KEY, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_AGE_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_KEY)?.value;
  if (token) {
    if (hasDatabase()) {
      await dbExecute(`delete from sessions where session_token = $1`, [token]);
    } else {
      memorySessions.delete(token);
    }
  }
  store.delete(SESSION_KEY);
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_KEY)?.value;
  if (!token) return null;

  if (hasDatabase()) {
    const rows = await dbQuery<{
      session_token: string;
      expires_at: string;
      user_id: string;
      full_name: string;
      role: UserRole;
    }>(
      `select s.session_token, s.expires_at, s.user_id, u.full_name, u.role
       from sessions s
       join users u on u.id = s.user_id
       where s.session_token = $1
       limit 1`,
      [token],
    );
    if (rows.length === 0) return null;
    const row = rows[0];
    const expiresAt = new Date(row.expires_at).getTime();
    if (expiresAt < Date.now()) {
      await dbExecute(`delete from sessions where session_token = $1`, [token]);
      return null;
    }

    if (expiresAt - Date.now() < ROTATION_THRESHOLD_SECONDS * 1000) {
      await dbExecute(
        `update sessions set expires_at = $2 where session_token = $1`,
        [token, getSessionExpiryDate()],
      );
    }

    return {
      role: row.role,
      actorId: row.user_id,
      displayName: row.full_name,
    };
  }

  const current = memorySessions.get(token);
  if (!current) return null;
  if (current.expiresAt < Date.now()) {
    memorySessions.delete(token);
    return null;
  }
  return {
    role: current.role,
    actorId: current.actorId,
    displayName: current.displayName,
  };
}

export async function requireRole(role: UserRole, to = "/") {
  const session = await getSession();
  if (!session || session.role !== role) {
    redirect(to);
  }
  return session;
}

