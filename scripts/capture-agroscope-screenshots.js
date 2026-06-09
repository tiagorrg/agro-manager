const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const WAIT_FAST = 700;
const OUT_ROOT = path.join(__dirname, "..", "docs", "presentation", "screenshots");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function safeWait(page, ms) {
  try {
    await page.waitForTimeout(ms);
  } catch {
    // ignore
  }
}

async function capture(page, roleFolder, fileName, route, action) {
  await page.goto(`${APP_URL}${route}`, { waitUntil: "networkidle" });
  await safeWait(page, WAIT_FAST);

  if (action) {
    await action(page);
    await safeWait(page, WAIT_FAST);
  }

  const output = path.join(roleFolder, `${fileName}.png`);
  await page.screenshot({ path: output, fullPage: true });
}

async function loginAsGuest(page) {
  await page.goto(`${APP_URL}/login`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Войти под гостем" }).click();
  await page.waitForURL(`${APP_URL}/dashboard`);
  await safeWait(page, WAIT_FAST);
}

async function loginAsAgronomist(page) {
  await page.goto(`${APP_URL}/login`, { waitUntil: "networkidle" });
  await page.fill("#login", "agronomist");
  await page.fill("#password", "agronomist");
  await page.locator('form button[type="submit"]').click();
  await page.waitForURL(`${APP_URL}/dashboard`);
  await safeWait(page, WAIT_FAST);
}

async function captureForGuest(browser) {
  const context = await browser.newContext({ viewport: { width: 1600, height: 960 } });
  const page = await context.newPage();
  const roleFolder = path.join(OUT_ROOT, "guest");
  ensureDir(roleFolder);

  await capture(page, roleFolder, "01-login", "/login");
  await loginAsGuest(page);
  await capture(page, roleFolder, "02-dashboard-guest", "/dashboard");
  await capture(page, roleFolder, "03-dashboard-metrics", "/dashboard");
  await capture(page, roleFolder, "04-map-guest", "/map");
  await capture(page, roleFolder, "05-fields", "/fields");
  await capture(page, roleFolder, "06-field-detail", "/fields/field1");

  await page.close();
  await context.close();
}

async function captureForAgronomist(browser) {
  const context = await browser.newContext({ viewport: { width: 1600, height: 960 } });
  const page = await context.newPage();
  const roleFolder = path.join(OUT_ROOT, "agronomist");
  ensureDir(roleFolder);

  await loginAsAgronomist(page);
  await capture(page, roleFolder, "07-calendar", "/calendar");

  await capture(page, roleFolder, "08-calendar-admin-new-task", "/calendar", async (innerPage) => {
    await innerPage.getByRole("button", { name: /Новая задача/ }).click();
  });

  await capture(page, roleFolder, "09-operations", "/operations");

  await capture(page, roleFolder, "10-reports", "/reports");
  await capture(page, roleFolder, "11-documents-empty", "/documents");

  await capture(page, roleFolder, "12-field-edit", "/fields/field1", async (innerPage) => {
    await innerPage.getByRole("button", { name: "Редактировать" }).click();
  });

  await page.close();
  await context.close();
}

async function main() {
  ensureDir(OUT_ROOT);
  const browser = await chromium.launch({ headless: true });

  try {
    await captureForGuest(browser);
    await captureForAgronomist(browser);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error("capture failed:", error);
  process.exit(1);
});
