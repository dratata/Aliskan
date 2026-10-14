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
test("profil yalnız düzenlenen alanları kaydeder", async ({
  page,
  context,
}) => {
  await setup(page);
  await nav(page, "Profil");
  await page.getByLabel("İsim", { exact: true }).fill("Deneme");
  const second = await context.newPage();
  await second.goto("/");
  await nav(second, "Profil");
  await second.getByLabel("Günlük su hedefi (ml)").fill("3000");
  await second
    .getByRole("button", { name: "Profil ve tercihleri kaydet" })
    .click();
  await second.getByText("Profil ve tercihlerin kaydedildi.").waitFor();
  await page
    .getByRole("button", { name: "Profil ve tercihleri kaydet" })
    .click();
  await page.getByText("Profil ve tercihlerin kaydedildi.").waitFor();
  await second.reload();
  await nav(second, "Profil");
  await expect(second.getByLabel("Günlük su hedefi (ml)")).toHaveValue("3000");
  await expect(second.getByLabel("İsim", { exact: true })).toHaveValue(
    "Deneme",
  );
});
test("uyku aynı güne güncellenir, varsayılan puan eklenmez", async ({
  page,
}) => {
  await setup(page);
  await page.getByRole("button", { name: /Sesli veya metinle kayıt/ }).click();
  await page
    .getByLabel("Konuşma / metin")
    .fill("Dün gece birde yattım, sabah sekizde kalktım.");
  await page.getByRole("button", { name: "Kaydı önizle" }).click();
  await page.getByRole("button", { name: "Onayla ve kaydet" }).click();
  await page
    .getByText("Onayladığın kayıt eklendi.", { exact: false })
    .waitFor();
  await page.getByRole("button", { name: "Kapat", exact: true }).click();
  await nav(page, "Başlat");
  await page.getByRole("button", { name: /Günü kapat/ }).click();
  await page.getByRole("button", { name: "Uyku kaydı ekle" }).click();
  await expect(page.getByLabel("Tahmini uykuya dalış")).toHaveValue("01:00");
  await page.getByLabel("Uyanma saati").fill("09:00");
  await page.getByRole("button", { name: "Uyku kaydını güncelle" }).click();
  await expect(page.getByText("Uyku kaydın güncellendi.")).toBeVisible();
  await expect(page.locator(".record-row")).toHaveCount(1);
  await expect(page.getByText(/undefined/)).toHaveCount(0);
});
test("sabah rutini saatleri düzenlenir ve kalıcıdır", async ({ page }) => {
  await setup(page);
  await nav(page, "Başlat");
  await page.getByRole("button", { name: /Güne başla/ }).click();
  await page
    .getByRole("button", { name: "Saatleri ve sırayı düzenle" })
    .click();
  await page.getByLabel("Yavaşça uyan").fill("09:00");
  await page.getByRole("button", { name: "Rutin ayarlarını kaydet" }).click();
  await page.getByText("Rutin ayarların kaydedildi.").waitFor();
  await page.getByRole("button", { name: "Kapat", exact: true }).click();
  await page.reload();
  await nav(page, "Başlat");
  await page.getByRole("button", { name: /Güne başla/ }).click();
  await expect(
    page.getByRole("button", { name: /09:00 Yavaşça uyan/ }),
  ).toBeVisible();
});
test("akşam uygun sıradaki adım çalışma rehberini açar", async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 9, 14, 21, 10) });
  await setup(page);
  await page
    .getByRole("button", { name: "Küçük bir adımla başla", exact: true })
    .click();
  await expect(page.getByLabel("Bugün hangi konuya bakacaksın?")).toBeVisible();
});
test("hızlı başlangıç güncel hedef ve akşam egzersizini gösterir", async ({
  page,
}) => {
  await setup(page);
  await nav(page, "Alışkanlıklar");
  const card = page
    .locator(".card")
    .filter({
      has: page.getByRole("heading", {
        name: "Küçük bir çalışma",
        exact: true,
      }),
    });
  await card.getByRole("button", { name: "Hedef ve saatleri düzenle" }).click();
  await page.getByLabel("Güncel hedef (dk)").fill("20");
  await page.getByRole("button", { name: "Değişiklikleri kaydet" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await nav(page, "Başlat");
  await expect(page.getByRole("button", { name: /Odaklan/ })).toContainText(
    "20 DK",
  );
  await expect(
    page.getByRole("button", { name: /Akşam hareketi/ }),
  ).toBeVisible();
});
test("rutin kaldığı adıma ve başladığı güne devam eder", async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 9, 14, 23, 55) });
  await setup(page);
  await nav(page, "Başlat");
  await page.getByRole("button", { name: /Günü kapat/ }).click();
  await page.getByRole("button", { name: /23:15 Telefonu bırak/ }).click();
  await page.getByRole("button", { name: "Bu adımı tamamladım" }).click();
  await expect(
    page.getByRole("heading", { name: "Dişlerini fırçala", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Kapat", exact: true }).click();
  await page.clock.fastForward(600001);
  await page.reload();
  await nav(page, "Başlat");
  await page.getByRole("button", { name: /Günü kapat/ }).click();
  await expect(
    page.getByRole("heading", { name: "Dişlerini fırçala", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("RUTİN GÜNÜ · 2026-10-14")).toBeVisible();
  await page.getByRole("button", { name: "Bu adımı tamamladım" }).click();
  const dates = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const r = indexedDB.open("aliskan-local", 1);
      r.onsuccess = () => resolve(r.result);
    });
    return await new Promise<string[]>((resolve) => {
      const r = db.transaction("app").objectStore("app").get("state");
      r.onsuccess = () => {
        db.close();
        resolve(
          r.result.events
            .filter((e: any) => e.type === "routine")
            .map((e: any) => e.date),
        );
      };
    });
  });
  expect(dates).toEqual(["2026-10-14", "2026-10-14"]);
});
test("oyun süresi varsayılmaz, kısa oyun gerçek dakikayla kaydedilir", async ({
  page,
}) => {
  await setup(page);
  await nav(page, "Başlat");
  await page.getByRole("button", { name: /Birlikte oyna/ }).click();
  await expect(page.getByLabel("Birlikte geçirdiğiniz süre (dk)")).toHaveValue(
    "",
  );
  await expect(
    page.getByRole("button", { name: "Çok sevdi", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("Birlikte geçirdiğiniz süre (dk)").fill("2");
  await page.getByRole("button", { name: "Çok sevdi", exact: true }).click();
  await page.getByText("Bu güzel an kaydedildi.", { exact: false }).waitFor();
  await page.getByRole("button", { name: "Kapat", exact: true }).click();
  await nav(page, "Gelişim");
  await expect(page.locator(".stat-grid").getByText("2 dk")).toBeVisible();
});
