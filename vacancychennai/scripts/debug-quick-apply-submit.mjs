import { chromium } from "playwright";
const job = "/jobs/250259a6-c304-4fc8-9cbd-dbd6ebc1f76e";
const browser = await chromium.launch({ headless: true, channel: "msedge" });
const page = await browser.newPage();
await page.goto(`http://127.0.0.1:3000${job}`);
await page.fill('input[name="applicantName"]', "E2E Applicant");
await page.fill('input[name="applicantPhone"]', "9000000098");
await page.getByRole("button", { name: /apply now/i }).click();
try {
  await page.waitForURL(/success=applied|error=/, { timeout: 20000 });
  console.log("URL", page.url());
} catch (e) {
  console.log("timeout URL", page.url());
  console.log("body has error?", (await page.content()).includes("Could not submit"));
}
await browser.close();
