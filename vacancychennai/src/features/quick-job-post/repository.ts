import { randomUUID } from "node:crypto";
import { dbQuery, hasDatabase } from "@/lib/db";
import {
  type QuickJobStatus,
  isQuickJobStatus,
} from "@/lib/quick-job-post";

export type QuickJobPost = {
  id: string;
  phone: string;
  email: string;
  description: string;
  status: QuickJobStatus;
  createdAt: string;
};

type Row = {
  id: string;
  phone: string;
  email: string;
  description: string;
  status: string;
  created_at: string;
};

type MemoryPost = QuickJobPost & { contentHash: string; ipHash: string };

const memoryPosts: MemoryPost[] = [];

function mapRow(row: Row): QuickJobPost {
  return {
    id: row.id,
    phone: row.phone,
    email: row.email,
    description: row.description,
    status: isQuickJobStatus(row.status) ? row.status : "new",
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function countRecentQuickPosts(input: {
  phone: string;
  ipHash: string;
}): Promise<{ byPhone: number; byIp: number }> {
  if (!hasDatabase()) {
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const hourAgo = Date.now() - 60 * 60 * 1000;
    return {
      byPhone: memoryPosts.filter(
        (post) => post.phone === input.phone && Date.parse(post.createdAt) > dayAgo,
      ).length,
      byIp: memoryPosts.filter(
        (post) =>
          post.ipHash === input.ipHash && Date.parse(post.createdAt) > hourAgo,
      ).length,
    };
  }

  const rows = await dbQuery<{ by_phone: number; by_ip: number }>(
    `select
       (select count(*)::int from quick_job_posts
         where phone = $1 and created_at > now() - interval '24 hours') as by_phone,
       (select count(*)::int from quick_job_posts
         where ip_hash = $2 and created_at > now() - interval '1 hour') as by_ip`,
    [input.phone, input.ipHash],
  );
  return {
    byPhone: rows[0]?.by_phone ?? 0,
    byIp: rows[0]?.by_ip ?? 0,
  };
}

export async function hasRecentDuplicate(phone: string, contentHash: string): Promise<boolean> {
  if (!hasDatabase()) {
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return memoryPosts.some(
      (post) =>
        post.phone === phone &&
        post.contentHash === contentHash &&
        Date.parse(post.createdAt) > dayAgo,
    );
  }
  const rows = await dbQuery<{ id: string }>(
    `select id from quick_job_posts
     where phone = $1 and content_hash = $2 and created_at > now() - interval '24 hours'
     limit 1`,
    [phone, contentHash],
  );
  return rows.length > 0;
}

export async function insertQuickJobPost(input: {
  phone: string;
  email: string;
  description: string;
  contentHash: string;
  ipHash: string;
  status: QuickJobStatus;
}): Promise<void> {
  if (!hasDatabase()) {
    memoryPosts.unshift({
      id: randomUUID(),
      phone: input.phone,
      email: input.email,
      description: input.description,
      status: input.status,
      createdAt: new Date().toISOString(),
      contentHash: input.contentHash,
      ipHash: input.ipHash,
    });
    if (memoryPosts.length > 200) memoryPosts.length = 200;
    return;
  }

  await dbQuery(
    `insert into quick_job_posts (phone, email, description, content_hash, ip_hash, status)
     values ($1, $2, $3, $4, $5, $6)`,
    [
      input.phone,
      input.email,
      input.description,
      input.contentHash,
      input.ipHash,
      input.status,
    ],
  );
}

export async function listQuickJobPosts(status: QuickJobStatus | "all"): Promise<QuickJobPost[]> {
  if (!hasDatabase()) {
    return memoryPosts
      .filter((post) => status === "all" || post.status === status)
      .slice(0, 200)
      .map((post) => ({
        id: post.id,
        phone: post.phone,
        email: post.email,
        description: post.description,
        status: post.status,
        createdAt: post.createdAt,
      }));
  }

  const rows = await dbQuery<Row>(
    `select id, phone, email, description, status, created_at
     from quick_job_posts
     where ($1::text = 'all' or status = $1)
     order by created_at desc
     limit 200`,
    [status],
  );
  return rows.map(mapRow);
}

export async function updateQuickJobPostStatus(id: string, status: QuickJobStatus): Promise<void> {
  if (!hasDatabase()) {
    const post = memoryPosts.find((item) => item.id === id);
    if (post) post.status = status;
    return;
  }
  await dbQuery(`update quick_job_posts set status = $2 where id = $1`, [id, status]);
}
