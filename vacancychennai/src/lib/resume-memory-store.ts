import "server-only";

type Entry = {
  buffer: Buffer;
  mime: string;
  filename: string;
};

const store = new Map<string, Entry>();

export function setResumeBuffer(actorKey: string, data: Entry) {
  store.set(actorKey, data);
}

export function getResumeBuffer(actorKey: string) {
  return store.get(actorKey);
}

export function deleteResumeBuffer(actorKey: string) {
  store.delete(actorKey);
}
