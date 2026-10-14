import { useEffect, useState } from "react";
import { Button } from "../components/UI";
export function StorageSafety() {
  const [persisted, setPersisted] = useState<boolean | null>(null),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const supported = !!navigator.storage?.persist;
  useEffect(() => {
    let cancelled = false;
    void navigator.storage
      ?.persisted?.()
      .then((result) => {
        if (!cancelled) setPersisted(result);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <div className="storage-safety">
      <p className="help">
        {persisted === true
          ? "Tarayıcı kalıcı depolama izni verdi. Yine de cihaz verileri silinirse yedek gerekir."
          : persisted === false
            ? "Tarayıcı depolaması temizlenebilir; JSON yedeğin önemlidir."
            : "Bu tarayıcı için kalıcı depolama durumu bilinmiyor."}
      </p>
      <Button
        variant="secondary"
        disabled={!supported || busy || persisted === true}
        onClick={async () => {
          setBusy(true);
          try {
            const result = await navigator.storage.persist();
            setPersisted(result);
            setMessage(
              result
                ? "Kalıcı depolama izni verildi."
                : "Tarayıcı kalıcı depolama izni vermedi; JSON yedeğini sakla.",
            );
          } catch {
            setMessage(
              "Kalıcılık isteği tamamlanamadı. JSON yedekleme kullanılabilir.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        Kalıcı depolama iste
      </Button>
      {!supported && (
        <p className="help">Bu tarayıcı kalıcılık istemeyi desteklemiyor.</p>
      )}
      {message && (
        <p role="status" className="help">
          {message}
        </p>
      )}
    </div>
  );
}
