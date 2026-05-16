const BASE = "http://127.0.0.1:3000";
const path = process.argv[2] ?? "/employer/login";

const page = await fetch(`${BASE}${path}`);
const html = await page.text();
const m = html.match(/name="\$ACTION_ID_([a-f0-9]+)"/);
if (!m) {
  console.error("no action id");
  process.exit(1);
}
const actionId = m[1];
const hiddenName = `$ACTION_ID_${actionId}`;

const fields =
  path.includes("employer/login")
    ? { email: "employer@vacancychennai.in", password: "demo123" }
    : { email: "", password: "" };

async function trySubmit(label, init) {
  const res = await fetch(`${BASE}${path}`, init);
  console.log(
    label,
    "status",
    res.status,
    "location",
    res.headers.get("location") ?? res.headers.get("x-action-redirect"),
  );
}

const urlBody = new URLSearchParams({ ...fields, [hiddenName]: "" });
await trySubmit("urlencoded+Next-Action", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Next-Action": actionId,
    Accept: "text/x-component",
  },
  body: urlBody.toString(),
  redirect: "manual",
});

const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
const mp = [
  `--${boundary}`,
  `Content-Disposition: form-data; name="${hiddenName}"`,
  "",
  "",
  ...Object.entries(fields).flatMap(([k, v]) => [
    `--${boundary}`,
    `Content-Disposition: form-data; name="${k}"`,
    "",
    v,
  ]),
  `--${boundary}--`,
  "",
].join("\r\n");

await trySubmit("multipart+Next-Action", {
  method: "POST",
  headers: {
    "Content-Type": `multipart/form-data; boundary=${boundary}`,
    "Next-Action": actionId,
    Accept: "text/x-component",
  },
  body: mp,
  redirect: "manual",
});

await trySubmit("urlencoded only (no Next-Action)", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: urlBody.toString(),
  redirect: "manual",
});
