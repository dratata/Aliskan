import { useEffect, useState, useRef } from "react";
import {
  loadBackupInfo,
  writeBackupInfo,
  backupDue,
  type BackupInfo,
} from "../data/backupInfo";
import { downloadBackup } from "../data/backup";
import { localDate, shiftDate } from "../domain/dates";
import type { AppState } from "../domain/types";
export function useBackupInfo() {
  const preparing = useRef(false);
  const [info, setInfo] = useState<BackupInfo>({
      preparedAt: null,
      records: 0,
      dismissUntil: null,
    }),
    [ready, setReady] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let disposed = false;
    const refresh = () => {
      loadBackupInfo()
        .then((i) => {
          if (!disposed) {
            setInfo(i);
            setReady(true);
          }
        })
        .catch(() => {
          if (!disposed) {
            setReady(true);
            setError(
              "Yedek hazırlanma bilgisi okunamadı. Alışkanlık kayıtların değiştirilmedi.",
            );
          }
        });
    };
    refresh();
    window.addEventListener("aliskan-backup-info", refresh);
    window.addEventListener("focus", refresh);
    const channel =
      "BroadcastChannel" in window
        ? new BroadcastChannel("aliskan-backup-info")
        : null;
    if (channel) channel.onmessage = refresh;
    return () => {
      disposed = true;
      channel?.close();
      window.removeEventListener("aliskan-backup-info", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  return {
    info,
    ready,
    error,
    busy,
    due: (records: number) => ready && !error && backupDue(info, records),
    prepare: async (state: AppState) => {
      if (preparing.current) return false;
      preparing.current = true;
      setBusy(true);
      setError("");
      try {
        downloadBackup(state);
        setInfo(
          await writeBackupInfo({
            preparedAt: new Date().toISOString(),
            records: state.events.length,
            dismissUntil: null,
          }),
        );
        return true;
      } catch {
        setError(
          "Yedek işlemi tamamlanamadı. Dosya hazırlanmış olabilir; İndirilenler’i kontrol et.",
        );
        return false;
      } finally {
        preparing.current = false;
        setBusy(false);
      }
    },
    dismiss: async () => {
      try {
        setInfo(
          await writeBackupInfo({ dismissUntil: shiftDate(localDate(), 1) }),
        );
      } catch {
        setError("Hatırlatma tercihi kaydedilemedi.");
      }
    },
  };
}
