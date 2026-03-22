# Vercel + BigRock DNS (vacancychennai.in)

## Vercel project

- Team: **Harikrishnan Rajan's projects**
- Project: **vacancychennai**
- Domains: **Settings → Domains**  
  `https://vercel.com/harikrishnan-rajans-projects/vacancychennai/settings/domains`

## Records Vercel expects (confirm in UI)

1. **Apex** `vacancychennai.in`  
   - Type: **A**  
   - Name / Host: **`@`** (BigRock may show as `vacancychennai.in`)  
   - Value: **`216.198.79.1`** (copy from Vercel if it ever changes)

2. **`www`**  
   - Type: **CNAME**  
   - Name / Host: **`www`**  
   - Value: **`560e8f9a7fb08584.vercel-dns-017.com.`** (include trailing dot if your panel requires FQDN; copy exact value from Vercel)

## BigRock fixes (if domains show “Invalid Configuration”)

1. Log in: `https://myorders.bigrock.in` → **Orders** → search **vacancychennai.in** → select suggestion → **Manage** → **DNS Records**.

2. **A record**  
   - If you previously set **`76.76.21.21`**, change it to **`216.198.79.1`** (Vercel’s dashboard shows the required IP for this project).

3. **`www` conflicts**  
   - Vercel may report a conflict with **`75.2.103.23`** (parking / wrong **A** on `www`).  
   - Remove any **A** record for **`www`** / **`www.vacancychennai.in`**.  
   - Keep only the **CNAME** for `www` → Vercel target above.

## Production deployment

If the apex domain says **“properly configured”** but **“No production deployment”**:

- Push to **`master`** (this repo’s default branch), or run `vercel --prod` from the project root.

An empty commit was used once to trigger production:

```bash
git commit --allow-empty -m "chore: trigger Vercel production deployment"
git push origin master
```

## Verify

```bash
nslookup -type=A vacancychennai.in dns1.bigrock.in
nslookup www.vacancychennai.in 8.8.8.8
```

Apex should resolve to Vercel’s IP; `www` should CNAME to `*.vercel-dns-017.com`.
