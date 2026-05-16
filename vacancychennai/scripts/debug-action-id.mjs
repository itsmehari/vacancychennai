const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const path = process.argv[2] ?? "/employer/login";
const res = await fetch(`${BASE}${path}`);
const html = await res.text();
console.log("status", res.status, "len", html.length);
const needles = ["$ACTION", "formAction", "Next-Action", "actionId", "registerEmployer", "loginEmployer"];
for (const n of needles) {
  const i = html.indexOf(n);
  console.log(n, i >= 0 ? html.slice(Math.max(0, i - 30), i + 80).replace(/\n/g, " ") : "—");
}
