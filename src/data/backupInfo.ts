import { z } from "zod";
import { getDatabase } from "./database";
const schema = z.object({
  preparedAt: z.iso.datetime().nullable(),
  records: z.number().int().min(0),
  dismissUntil: z.iso.date().nullable(),
});
export type BackupInfo = z.infer<typeof schema>;
const initial = (): BackupInfo => ({
  preparedAt: null,
  records: 0,
  dismissUntil: null,
});
export async function loadBackupInfo() {
  const db = await getDatabase(),
    raw = await db.get("app", "backup-info");
  return raw === undefined ? initial() : schema.parse(raw);
}
export async function writeBackupInfo(patch: Partial<BackupInfo>) {
  const db = await getDatabase(),
    tx = db.transaction("app", "readwrite");
  try {
    const raw = await tx.store.get("backup-info");
    const next = schema.parse({
      ...(raw === undefined ? initial() : schema.parse(raw)),
      ...patch,
    });
    await tx.store.put(next, "backup-info");
    await tx.done;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("aliskan-backup-info"));
      if ("BroadcastChannel" in window) {
        const channel = new BroadcastChannel("aliskan-backup-info");
        channel.postMessage("changed");
        channel.close();
      }
    }
    return next;
  } catch (error) {
    try {
      tx.abort();
    } catch {}
    await tx.done.catch(() => {});
    throw error;
  }
}
export function backupDue(info: BackupInfo, records: number, now = new Date()) {
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return (
    records > 0 &&
    (!info.dismissUntil || info.dismissUntil <= today) &&
    (!info.preparedAt ||
      now.getTime() - Date.parse(info.preparedAt) >= 7 * 86400000)
  );
}
