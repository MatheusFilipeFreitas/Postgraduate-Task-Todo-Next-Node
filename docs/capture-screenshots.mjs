import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = __dirname;
const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
const email = process.env.SEED_EMAIL ?? "john@example.com";
const password = process.env.SEED_PASSWORD ?? "secret123";

async function waitForApp(page) {
  await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
  await page.waitForSelector('input[type="email"]', { timeout: 30_000 });
}

async function login(page) {
  await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
  await page.waitForSelector('input[type="email"]');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), {
    timeout: 15_000,
  });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(750);
}

async function captureScreenshots(page, outputDir) {
  await mkdir(outputDir, { recursive: true });

  async function screenshot(name) {
    const filePath = path.join(outputDir, name);
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`Saved ${filePath}`);
  }

  await waitForApp(page);
  await screenshot("login.png");

  await page.goto(`${baseUrl}/signup`, { waitUntil: "networkidle" });
  await page.waitForSelector('input[type="email"]');
  await screenshot("signup.png");

  await login(page);
  await page.goto(`${baseUrl}/tasks`, { waitUntil: "networkidle" });
  await page.getByRole("tab", { name: "Board" }).click();
  await page.waitForSelector(".kanban-grid", { timeout: 15_000 });
  await page.waitForTimeout(500);
  await screenshot("tasks-board.png");

  await page.getByRole("tab", { name: "List" }).click();
  await page.waitForSelector(".task-card-list", { timeout: 15_000 });
  await page.waitForTimeout(500);
  await screenshot("tasks-list.png");

  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.waitForSelector(".page-shell", { timeout: 15_000 });
  await screenshot("home.png");
}

async function main() {
  const browser = await chromium.launch();

  for (const colorScheme of ["light", "dark"]) {
    const outputDir = colorScheme === "light" ? docsDir : path.join(docsDir, "dark");
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
      colorScheme,
    });
    const page = await context.newPage();

    console.log(`Capturing ${colorScheme} mode...`);
    await captureScreenshots(page, outputDir);
    await context.close();
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
