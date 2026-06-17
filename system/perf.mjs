import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

export const execAsync = promisify(exec);

// ═══════════════════════════════════════════
//  Central Cache (TTL: 5 minutes)
// ═══════════════════════════════════════════
export const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

export const getCached = async (key, fetchFn) => {
  if (cache.has(key)) {
    const { data, time } = cache.get(key);
    if (Date.now() - time < CACHE_TTL) return data;
  }
  const data = await fetchFn();
  cache.set(key, { data, time: Date.now() });
  return data;
};

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of cache.entries()) {
    if (now - val.time > CACHE_TTL) cache.delete(key);
  }
}, 10 * 60 * 1000);

global.perfCache = cache;

// ═══════════════════════════════════════════
//  Message Filter — skip old / duplicate msgs
// ═══════════════════════════════════════════
const processedMsgs = new Set();

export const shouldProcess = (m) => {
  if (m.key?.fromMe) return false;
  if (m.key?.remoteJid === 'status@broadcast') return false;
  const age = Date.now() - (m.messageTimestamp * 1000);
  if (age > 120000) return false;
  const msgId = m.key?.id;
  if (msgId) {
    if (processedMsgs.has(msgId)) return false;
    processedMsgs.add(msgId);
    if (processedMsgs.size > 1000) {
      processedMsgs.delete(processedMsgs.values().next().value);
    }
  }
  return true;
};

// ═══════════════════════════════════════════
//  /tmp Cleanup every 30 minutes
// ═══════════════════════════════════════════
export const cleanTmp = () => {
  const tmpDir = tmpdir();
  try {
    const files = fs.readdirSync(tmpDir);
    const now = Date.now();
    files.forEach(file => {
      const filePath = path.join(tmpDir, file);
      try {
        const stat = fs.statSync(filePath);
        if (now - stat.mtimeMs > 10 * 60 * 1000) fs.unlinkSync(filePath);
      } catch {}
    });
  } catch {}
};

setInterval(cleanTmp, 30 * 60 * 1000);

// ═══════════════════════════════════════════
//  Typing Indicator
// ═══════════════════════════════════════════
export async function showTyping(conn, chat) {
  try {
    await conn.sendPresenceUpdate('composing', chat);
    await new Promise(r => setTimeout(r, 1000));
    await conn.sendPresenceUpdate('paused', chat);
  } catch {}
}

// ═══════════════════════════════════════════
//  Concurrent Processing (per-user queue)
// ═══════════════════════════════════════════
const userQueues = new Map();
const MAX_CONCURRENT = 5;
let activeCount = 0;

const waitForSlot = () => new Promise(resolve => {
  const check = setInterval(() => {
    if (activeCount < MAX_CONCURRENT) { clearInterval(check); resolve(); }
  }, 500);
});

export const runConcurrent = async (userId, jid, taskFn, conn) => {
  if (userQueues.get(userId)) {
    await conn.sendMessage(jid, { text: '⏳ أمرك السابق لسه شغال — استنى ثواني' });
    return;
  }
  if (activeCount >= MAX_CONCURRENT) {
    await conn.sendMessage(jid, { text: '⚙️ البوت مشغول — هيجيلك ردك في ثواني' });
    await waitForSlot();
  }
  userQueues.set(userId, true);
  activeCount++;
  try {
    await taskFn();
  } finally {
    userQueues.delete(userId);
    activeCount--;
  }
};

// ═══════════════════════════════════════════
//  Worker Pool
// ═══════════════════════════════════════════
export const workerPool = {
  workers: new Map(),
  maxWorkers: 5,
  async run(taskId, taskFn) {
    const promise = taskFn().finally(() => this.workers.delete(taskId));
    this.workers.set(taskId, promise);
    return promise;
  },
  getActive() { return this.workers.size; }
};

// ═══════════════════════════════════════════
//  Timeout Wrapper
// ═══════════════════════════════════════════
export const withTimeout = (fn, ms = 30000) => Promise.race([
  fn(),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('⏰ انتهى وقت التنفيذ')), ms)
  )
]);

// ═══════════════════════════════════════════
//  Rate Limiter (3 seconds per user)
// ═══════════════════════════════════════════
const rateLimits = new Map();
const RATE_LIMIT_MS = 3000;

export const isRateLimited = (userId) => {
  const now = Date.now();
  const last = rateLimits.get(userId) || 0;
  if (now - last < RATE_LIMIT_MS) return true;
  rateLimits.set(userId, now);
  return false;
};

setInterval(() => {
  const now = Date.now();
  for (const [id, time] of rateLimits.entries()) {
    if (now - time > 60000) rateLimits.delete(id);
  }
}, 10 * 60 * 1000);

// ═══════════════════════════════════════════
//  Smart Command Queue (per-command serialization)
// ═══════════════════════════════════════════
const commandQueues = new Map();

export const queueCommand = async (command, userId, taskFn) => {
  if (!commandQueues.has(command)) commandQueues.set(command, Promise.resolve());
  const queue = commandQueues.get(command).then(async () => {
    try { return await taskFn(); }
    catch (e) { console.error(`[QUEUE ERROR] ${command}:`, e.message); }
  });
  commandQueues.set(command, queue);
  return queue;
};

// ═══════════════════════════════════════════
//  Fetch with Timeout
// ═══════════════════════════════════════════
export async function fetchWithTimeout(url, timeout = 20000, options = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

// ═══════════════════════════════════════════
//  Audio Conversion (mp3 → ogg/opus)
// ═══════════════════════════════════════════
export async function convertToOggOpus(inputBuffer) {
  const tmpIn  = path.join(tmpdir(), `voice_in_${Date.now()}.mp3`);
  const tmpOut = path.join(tmpdir(), `voice_out_${Date.now()}.ogg`);
  try {
    fs.writeFileSync(tmpIn, inputBuffer);
    await execAsync(`ffmpeg -y -i "${tmpIn}" -c:a libopus -b:a 64k -ar 48000 -ac 1 "${tmpOut}"`);
    return fs.readFileSync(tmpOut);
  } finally {
    if (fs.existsSync(tmpIn))  fs.unlinkSync(tmpIn);
    if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
  }
}
