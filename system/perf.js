import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

export const execAsync = promisify(exec);

export async function showTyping(conn, chat) {
  try {
    await conn.sendPresenceUpdate('composing', chat)
    await new Promise(r => setTimeout(r, 1000))
    await conn.sendPresenceUpdate('paused', chat)
  } catch {}
}

export async function fetchWithTimeout(url, timeout = 20000, options = {}) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(id)
    return res
  } catch (e) {
    clearTimeout(id)
    throw e
  }
}

export async function convertToOggOpus(inputBuffer) {
  const tmpIn  = path.join(tmpdir(), `voice_in_${Date.now()}.mp3`)
  const tmpOut = path.join(tmpdir(), `voice_out_${Date.now()}.ogg`)
  try {
    fs.writeFileSync(tmpIn, inputBuffer)
    await execAsync(
      `ffmpeg -y -i "${tmpIn}" -c:a libopus -b:a 64k -ar 48000 -ac 1 "${tmpOut}"`
    )
    return fs.readFileSync(tmpOut)
  } finally {
    if (fs.existsSync(tmpIn))  fs.unlinkSync(tmpIn)
    if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut)
  }
}
