import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true, channel: "msedge" });
const page = await browser.newPage();
await page.goto("http://127.0.0.1:3000/jobs/250259a6-c304-4fc8-9cbd-dbd6ebc1f76e");
console.log("applicantName count", await page.locator('input[name="applicantName"]').count());
console.log("has Quick apply text", (await page.content()).includes("Quick apply"));
console.log("has direct contact", (await page.content()).includes("direct-employer-contact"));
await browser.close();
