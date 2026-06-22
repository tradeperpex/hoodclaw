import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv(file) {
  try {
    readFileSync(file, "utf8")
      .split(/\r?\n/)
      .forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;
        const i = trimmed.indexOf("=");
        if (i === -1) return;
        process.env[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim();
      });
  } catch {
    /* optional */
  }
}

loadEnv(resolve(__dirname, "../.env"));
loadEnv(resolve(__dirname, "../.env.local"));

const secret = process.env.CRON_SECRET;
const base = (process.env.CRON_URL || "http://localhost:3000").replace(/\/$/, "");
const intervalMs = Number(process.env.CRON_INTERVAL_MS || 60_000);

if (!secret) {
  console.error("CRON_SECRET mangler i .env / .env.local");
  process.exit(1);
}

async function tick() {
  const started = new Date().toISOString();
  try {
    const res = await fetch(`${base}/api/cron`, {
      headers: { Authorization: `Bearer ${secret}` },
      signal: AbortSignal.timeout(120_000),
    });
    const body = await res.text();
    console.log(`[${started}] ${res.status} ${body.slice(0, 500)}`);
  } catch (err) {
    console.error(`[${started}] ERROR`, err instanceof Error ? err.message : err);
  }
}

console.log(`AgentClaw cron loop → ${base}/api/cron every ${intervalMs / 1000}s`);
await tick();
setInterval(tick, intervalMs);
