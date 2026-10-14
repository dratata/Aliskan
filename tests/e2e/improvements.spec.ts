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
test("iki sekmedeki kayıtlar birleşir ve ekranlar eşitlenir", async ({
  page,
  context,
}) => {
  await setup(page);
  const second = await context.newPage();
  await second.goto("/");
  await page.getByRole("button", { name: /Su ekle/ }).click();
  await page.getByText("250 / 2000 ml").waitFor();
  await second.getByRole("button", { name: /Su ekle/ }).click();
  await second.getByText("500 / 2000 ml").waitFor();
  await second.reload();
  await expect(second.getByText("500 / 2000 ml")).toBeVisible();
  await expect(page.getByText("500 / 2000 ml")).toBeVisible();
});
test("kısa deneme tam Pomodoro sayılmaz, kalan süre önerilir", async ({
  page,
}) => {
  await page.clock.install();
  await setup(page);
  await page
    .getByRole("heading", { name: "Küçük bir çalışma", exact: true })
    .click();
  await page.getByRole("button", { name: "Sadece 2 dakika dene" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Başlat", exact: true })
    .click();
  await page.clock.fastForward(120100);
  await page.getByRole("button", { name: "Tamamladım, kaydet" }).click();
  await expect(page.locator(".session-plan .completed")).toHaveCount(0);
  await page.getByRole("button", { name: "Yeni oturum", exact: true }).click();
  await expect(page.getByLabel("Oturum (dk)")).toHaveValue("8");
});
test("egzersiz plan süresi otomatik yazılmaz, gerçek süre onaylanır", async ({
  page,
}) => {
  await setup(page);
  await page
    .getByRole("heading", { name: "Öğle hareketi", exact: true })
    .click();
  for (let i = 0; i < 5; i++) {
    await page
      .getByRole("button", { name: "Hareket tamam · Sıradaki" })
      .click();
    await page
      .getByRole("button", { name: "Dinlenmeyi geç", exact: true })
      .click();
  }
  await page.getByRole("button", { name: "Hareketleri bitirdim" }).click();
  const duration = page.getByLabel("Gerçekte yaptığın süre (dk)");
  await expect(duration).toHaveValue("");
  await duration.fill("2");
  await page
    .getByRole("button", { name: "Egzersizi kaydet", exact: true })
    .click();
  await expect(
    page.getByText("2 dakika hareket kaydedildi.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Kapat", exact: true }).click();
  await nav(page, "Bugün");
  await expect(
    page.locator(".task-row.done").filter({ hasText: "Öğle hareketi" }),
  ).toHaveCount(0);
});
test("yanlışlıkla işaretlenen günlük görev yeniden planlanır", async ({
  page,
}) => {
  await setup(page);
  await page
    .getByRole("button", { name: "Küçük bir çalışma seçenekleri" })
    .click();
  await page.getByRole("button", { name: "Tamamladım", exact: true }).click();
  await page
    .getByRole("button", { name: "Küçük bir çalışma seçenekleri" })
    .click();
  await page
    .getByRole("button", { name: "İşareti geri al", exact: true })
    .click();
  await expect(
    page.locator(".task-row.done").filter({ hasText: "Küçük bir çalışma" }),
  ).toHaveCount(0);
});
test("tarayıcı geri eylemi rehberi kapatır ve videolar odak sırasındadır", async ({
  page,
}) => {
  await setup(page);
  await page
    .getByRole("heading", { name: "Öğle hareketi", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("link", { name: "Videoyu kaynakta izle" }).focus();
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(
      () => !!document.activeElement?.closest('[role="dialog"]'),
    ),
  ).toBe(true);
  await page.goBack();
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Bugün, kendin için." }),
  ).toBeVisible();
});
test("100 kayıttan eski geçmişe sayfalama ile ulaşılır", async ({ page }) => {
  await setup(page);
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open("aliskan-local", 1);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    const tx = db.transaction("app", "readwrite");
    const raw = await new Promise<any>((resolve) => {
      const r = tx.objectStore("app").get("state");
      r.onsuccess = () => resolve(r.result);
    });
    const date = new Date().toLocaleDateString("en-CA");
    raw.events = Array.from({ length: 105 }, (_, i) => ({
      id: `history-${i}`,
      type: "study",
      date,
      at: new Date(Date.now() - i * 60000).toISOString(),
      value: 1,
      source: "manual",
      data: { topic: `Konu ${i}` },
    }));
    tx.objectStore("app").put(raw, "state");
    await new Promise<void>((resolve) => {
      tx.oncomplete = () => resolve();
    });
    db.close();
  });
  await page.reload();
  await nav(page, "Profil");
  await page.getByRole("button", { name: "Kayıtlarımı aç" }).click();
  await expect(
    page.getByRole("button", { name: "Daha fazla kayıt göster" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Daha fazla kayıt göster" }).click();
  await page.getByRole("button", { name: "Daha fazla kayıt göster" }).click();
  await expect(
    page.getByRole("button", { name: "Çalışma kaydını düzenle" }),
  ).toHaveCount(105);
});
test("haftalık net hedef gerçek kayıtlardan ilerler", async ({ page }) => {
  await setup(page);
  await page.getByRole("button", { name: /Konuş veya yaz/ }).click();
  await page
    .getByLabel("Konuşma / metin")
    .fill("Bugün 20 dakika ders çalıştım.");
  await page.getByRole("button", { name: "Kaydı önizle" }).click();
  await page.getByRole("button", { name: "Onayla ve kaydet" }).click();
  await page
    .getByText("Onayladığın kayıt eklendi.", { exact: false })
    .waitFor();
  await page.getByRole("button", { name: "Kapat", exact: true }).click();
  await nav(page, "Gelişim");
  await expect(
    page.getByRole("region", { name: "Haftalık çalışma hedefi" }),
  ).toContainText("20 / 70 dk");
});
