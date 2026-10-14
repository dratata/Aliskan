import { Download, ShieldCheck } from "lucide-react";
import { useStore } from "../app/Store";
import { useBackupInfo } from "../platform/backup";
import { Card, Button } from "../components/UI";
export function BackupReminder() {
  const { state } = useStore(),
    backup = useBackupInfo();
  if (!backup.due(state.events.length)) return null;
  return (
    <Card className="backup-reminder">
      <ShieldCheck size={22} />
      <div>
        <h3>Küçük adımlarını yedekle.</h3>
        <p>
          {backup.info.preparedAt
            ? "Son yedek hazırlanmasının üzerinden en az bir hafta geçti."
            : "İlk kayıtların oluştu; bir JSON yedeği hazırlayabilirsin."}
        </p>
        <div className="button-row">
          <Button
            variant="secondary"
            disabled={backup.busy}
            onClick={() => void backup.prepare(state)}
          >
            <Download size={16} /> Yedek hazırla
          </Button>
          <Button variant="ghost" onClick={() => void backup.dismiss()}>
            Yarın hatırlat
          </Button>
        </div>
        {backup.error && <p role="alert">{backup.error}</p>}
      </div>
    </Card>
  );
}
