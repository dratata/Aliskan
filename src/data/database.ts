import { openDB, type IDBPDatabase } from "idb";
import { stateSchema, type AppState } from "../domain/types";
import { createInitialState } from "../domain/defaults";
import { reconcileTasks, snapshotTaskTargets } from "../domain/tasks";
let connection: Promise<IDBPDatabase> | null = null;
export function getDatabase() {
  if (!connection)
    connection = openDB("aliskan-local", 1, {
      upgrade(database) {
        database.createObjectStore("app");
      },
      blocking() {
        connection?.then((d) => d.close());
        connection = null;
      },
      terminated() {
        connection = null;
      },
    }).catch((error) => {
      connection = null;
      throw error;
    });
  return connection;
}
export async function loadState(): Promise<AppState> {
  const database = await getDatabase();
  const raw = await database.get("app", "state");
  return raw === undefined
    ? createInitialState()
    : snapshotTaskTargets(stateSchema.parse(raw));
}
export async function saveState(state: AppState): Promise<void> {
  await mutateState(() => state);
}
// IndexedDB serializes readwrite transactions across tabs. Read and write in
// the same transaction so a stale UI snapshot can never replace newer records.
export async function mutateState(
  change: (state: AppState) => AppState,
): Promise<AppState> {
  const database = await getDatabase(),
    tx = database.transaction("app", "readwrite");
  try {
    const raw = await tx.store.get("state");
    const current =
      raw === undefined
        ? createInitialState()
        : snapshotTaskTargets(stateSchema.parse(raw));
    const next = stateSchema.parse(reconcileTasks(change(current)));
    await tx.store.put(next, "state");
    await tx.done;
    return next;
  } catch (error) {
    try {
      tx.abort();
    } catch {
      /* transaction already completed */
    }
    await tx.done.catch(() => {});
    throw error;
  }
}
