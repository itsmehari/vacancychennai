import type { LocalJobRequest } from "@/types/domain";

const requestsByUserId = new Map<string, LocalJobRequest>();
const requestsById = new Map<string, LocalJobRequest>();

export function mockListLocalJobRequestsByArea(areaSlug: string): LocalJobRequest[] {
  return [...requestsById.values()]
    .filter((r) => r.areaSlug === areaSlug)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function mockGetLocalJobRequestByUserId(userId: string): LocalJobRequest | null {
  return requestsByUserId.get(userId) ?? null;
}

export function mockUpsertLocalJobRequest(
  input: Omit<LocalJobRequest, "id" | "createdAt" | "updatedAt"> & { id?: string },
): LocalJobRequest {
  const now = new Date().toISOString();
  const existing = requestsByUserId.get(input.userId);
  const row: LocalJobRequest = {
    id: existing?.id ?? input.id ?? `ljr-mock-${input.userId}`,
    userId: input.userId,
    areaSlug: input.areaSlug,
    fullName: input.fullName,
    dateOfBirth: input.dateOfBirth,
    education: input.education,
    locationText: input.locationText,
    experienceLevel: input.experienceLevel,
    jobNeeds: input.jobNeeds,
    contactPhone: input.contactPhone,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  if (existing) requestsById.delete(existing.id);
  requestsByUserId.set(input.userId, row);
  requestsById.set(row.id, row);
  return row;
}
