import { del, get, put } from "@vercel/blob";

const RESUME_PREFIX = "vacancy-chennai/resumes";

export function getBlobReadWriteToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || undefined;
}

export function isResumeStoredInVercelBlob(urlOrKey: string | null | undefined): boolean {
  if (!urlOrKey) return false;
  return urlOrKey.startsWith("https://") && urlOrKey.includes("blob.vercel-storage.com");
}

export function isResumeMemoryMarker(key: string | null | undefined): boolean {
  return Boolean(key?.startsWith("memory:"));
}

/** True when DB `resume_file_key` means an uploaded file exists (memory MVP or Vercel Blob). */
export function resumeFileKeyIndicatesUpload(key: string | null | undefined): boolean {
  return isResumeMemoryMarker(key) || isResumeStoredInVercelBlob(key);
}

function pathnameForUser(userId: string): string {
  return `${RESUME_PREFIX}/${userId}`;
}

/** Only delete blobs under our resumes prefix and this user's folder. */
export function canDeleteResumeBlobForUser(storedUrl: string, userId: string): boolean {
  if (!isResumeStoredInVercelBlob(storedUrl)) return false;
  const needle = `/resumes/${userId}/`;
  return storedUrl.includes(needle);
}

export function sanitizeResumeFilename(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "resume";
  return base.slice(0, 120);
}

export async function uploadCandidateResumeBlob(params: {
  userId: string;
  buffer: Buffer;
  mime: string;
  filename: string;
  token: string;
}): Promise<{ url: string }> {
  const safe = sanitizeResumeFilename(params.filename);
  const pathname = `${pathnameForUser(params.userId)}/${Date.now()}-${safe}`;
  const useMultipart = params.buffer.length >= 4 * 1024 * 1024;
  const result = await put(pathname, params.buffer, {
    access: "private",
    token: params.token,
    contentType: params.mime,
    multipart: useMultipart,
  });
  return { url: result.url };
}

export async function deleteResumeBlobIfOwned(storedUrl: string, userId: string): Promise<void> {
  const token = getBlobReadWriteToken();
  if (!token || !canDeleteResumeBlobForUser(storedUrl, userId)) return;
  try {
    await del(storedUrl, { token });
  } catch {
    // best-effort; replacement upload should still proceed
  }
}

export async function fetchResumeBlobStream(storedUrl: string): Promise<{
  stream: ReadableStream<Uint8Array>;
  contentType: string;
  filename: string;
} | null> {
  const token = getBlobReadWriteToken();
  if (!token || !isResumeStoredInVercelBlob(storedUrl)) return null;
  const result = await get(storedUrl, { access: "private", token });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  const contentType = result.blob.contentType || "application/octet-stream";
  const fromHeader = result.blob.contentDisposition?.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)/i)?.[1];
  const fromPath = storedUrl.split("/").pop()?.split("?")[0];
  const filename = (fromHeader || fromPath || "resume").replace(/[^\w.\-]+/g, "_") || "resume";
  return { stream: result.stream, contentType, filename };
}
