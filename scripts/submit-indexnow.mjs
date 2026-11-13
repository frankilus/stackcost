#!/usr/bin/env node
/**
 * Submit every sitemap URL to IndexNow (Bing, Yandex, and other participating engines).
 * Usage: node scripts/submit-indexnow.mjs
 * The key file must already be live at https://<host>/<key>.txt
 */
import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "stackcost-pink.vercel.app";
const SITE = `https://${HOST}`;

async function loadKey() {
  const dir = join(ROOT, "public");
  const files = await readdir(dir);
  const keyFile = files.find((f) => /^[a-f0-9]{8,128}\.txt$/i.test(f));
  if (!keyFile) throw new Error("No IndexNow key file found in /public");
  const key = (await readFile(join(dir, keyFile), "utf8")).trim();
  if (key !== keyFile.replace(/\.txt$/i, "")) {
    throw new Error(`Key file ${keyFile} content does not match the filename`);
  }
  return { key, keyLocation: `${SITE}/${key}.txt` };
}

async function sitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((m) => m[1].trim());
  if (!urls.length) throw new Error("Sitemap contained no URLs");
  return urls;
}

async function main() {
  const { key, keyLocation } = await loadKey();
  const urlList = await sitemapUrls();
  const body = { host: HOST, key, keyLocation, urlList };
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log(JSON.stringify({ status: res.status, statusText: res.statusText, body: text, submitted: urlList.length, keyLocation }, null, 2));
  if (res.status !== 200 && res.status !== 202) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
