import { test, expect, type Page } from "@playwright/test";
async function setup(page: Page) {
  await page.goto("/");
  await page
    .getByRole("button", { name: /Küçük bir adımla başlayalım/ })
    .click();
}
async function nav(page: Page, name: string) {
  await page
    .getByRole("navigation", { name: "Ana navigasyon" })
    .getByRole("button", { name, exact: true })
    .click();
}
test("mola ana ekran oturumundan doğru çalışma ekranına döner", async ({
  page,
}) => {
  await setup(page);
  await page
    .getByRole("heading", { name: "Küçük bir çalışma", exact: true })
    .click();
  await page.getByRole("button", { name: "2–5 dakika mola" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Başlat", exact: true })
    .click();
  await page.getByRole("button", { name: "Kapat", exact: true }).click();
  await page.getByRole("button", { name: /Oturum devam ediyor/ }).click();
  await expect(page.getByLabel("Mola süresi")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Çalışmaya dön" }),
  ).toBeVisible();
});
test("çalışma başlayınca sade odak görünümü açılır", async ({ page }) => {
  await setup(page);
  await page
    .getByRole("heading", { name: "Küçük bir çalışma", exact: true })
    .click();
  await page.getByLabel("Bugün hangi konuya bakacaksın?").fill("Nöroloji");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Başlat", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Odak görünümü" }),
  ).toBeVisible();
  await expect(page.getByLabel("Bugün hangi konuya bakacaksın?")).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("button", { name: "Duraklat", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Odak görünümünden çık" }).click();
  await expect(page.getByLabel("Bugün hangi konuya bakacaksın?")).toHaveValue(
    "Nöroloji",
  );
});
test("yarım çalışma hızlı başlangıçtan doğru konuyla devam eder", async ({
  page,
}) => {
  await page.clock.install();
  await setup(page);
  await page
    .getByRole("heading", { name: "Küçük bir çalışma", exact: true })
    .click();
  await page
    .getByLabel("Bugün hangi konuya bakacaksın?")
    .fill("Omuz rehabilitasyonu");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Başlat", exact: true })
    .click();
  await page.clock.fastForward(120000);
  await page.getByRole("button", { name: "Duraklat", exact: true }).click();
  await page.getByRole("button", { name: "Kapat", exact: true }).click();
  await nav(page, "Başlat");
  await page.getByRole("button", { name: /Nefes al/ }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Başlat", exact: true })
    .click();
  await page.getByRole("button", { name: "Kapat", exact: true }).click();
  await nav(page, "Başlat");
  await page
    .getByRole("button", { name: "Devam et: Omuz rehabilitasyonu" })
    .click();
  await expect(page.getByLabel("Bugün hangi konuya bakacaksın?")).toHaveValue(
    "Omuz rehabilitasyonu",
  );
  await expect(page.locator(".timer-digits")).toHaveText("08:00");
});
test("yedek hazırlanma bilgisi yenilemede korunur", async ({ page }) => {
  await setup(page);
  await nav(page, "Profil");
  await expect(page.getByText("Henüz yedek hazırlamadın.")).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "JSON yedek al" }).click();
  await download;
  await expect(page.getByText(/Son yedek hazırlanma:/)).toBeVisible();
  await page.reload();
  await nav(page, "Profil");
  await expect(page.getByText(/Son yedek hazırlanma:/)).toBeVisible();
});
test("konu geçmişi gerçek net süreyi gösterir ve tekrar seçilir", async ({
  page,
}) => {
  await page.clock.install();
  await setup(page);
  await page
    .getByRole("heading", { name: "Küçük bir çalışma", exact: true })
    .click();
  await page
    .getByLabel("Bugün hangi konuya bakacaksın?")
    .fill("Nörolojik rehabilitasyon");
  await page.getByRole("button", { name: "Sadece 2 dakika dene" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Başlat", exact: true })
    .click();
  await page.clock.fastForward(120100);
  await page.getByRole("button", { name: "Tamamladım, kaydet" }).click();
  await page.getByRole("button", { name: "Konularımı aç" }).click();
  const library = page.getByRole("region", { name: "Çalışma konuların" });
  await expect(library).toContainText("2 dk net");
  await library
    .getByRole("button", { name: "Bu konuya çalış: Nörolojik rehabilitasyon" })
    .click();
  await expect(page.getByLabel("Bugün hangi konuya bakacaksın?")).toHaveValue(
    "Nörolojik rehabilitasyon",
  );
  await expect(page.locator(".timer-digits")).toHaveText("08:00");
});
test("gecikmiş bitiş kontrolü başka sekmedeki duraklatmayı ezmez", async ({
  page,
}) => {
  await page.clock.install();
  await setup(page);
  await page
    .getByRole("heading", { name: "Küçük bir çalışma", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Başlat", exact: true })
    .click();
  await page.getByRole("button", { name: "Duraklat", exact: true }).waitFor();
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const r = indexedDB.open("aliskan-local", 1);
      r.onsuccess = () => resolve(r.result);
    });
    const tx = db.transaction("app", "readwrite");
    const state = await new Promise<any>((resolve) => {
      const r = tx.objectStore("app").get("state");
      r.onsuccess = () => resolve(r.result);
    });
    state.timer = {
      ...state.timer,
      running: false,
      deadline: null,
      remaining: 420,
    };
    tx.objectStore("app").put(state, "state");
    await new Promise<void>((resolve) => {
      tx.oncomplete = () => resolve();
    });
    db.close();
  });
  await page.clock.fastForward(600100);
  await expect(page.locator(".timer-digits")).toHaveText("07:00");
  await expect(
    page.getByText("Oturumun tamamlandı. Kaydını tamamlamak için rehberi aç."),
  ).toHaveCount(0);
});
test("yedek hatırlatması ertelenir ve ertesi gün geri gelir", async ({
  page,
}) => {
  await page.clock.install({ time: new Date(2026, 9, 14, 12, 0) });
  await setup(page);
  await page.getByRole("button", { name: /Su ekle/ }).click();
  await page.getByText("250 / 2000 ml").waitFor();
  await page
    .getByRole("button", { name: "Yarın hatırlat", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Küçük adımlarını yedekle." }),
  ).toHaveCount(0);
  await page.reload();
  await expect(page.getByText("250 / 2000 ml")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Küçük adımlarını yedekle." }),
  ).toHaveCount(0);
  await page.clock.fastForward(86400100);
  await expect(
    page.getByRole("heading", { name: "Küçük adımlarını yedekle." }),
  ).toBeVisible();
});
test("desteklenmeyen kalıcı depolama çalışıyor gibi gösterilmez", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "storage", {
      value: {},
      configurable: true,
    }),
  );
  await setup(page);
  await nav(page, "Profil");
  await expect(
    page.getByRole("button", { name: "Kalıcı depolama iste", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByText("Bu tarayıcı kalıcılık istemeyi desteklemiyor."),
  ).toBeVisible();
});
