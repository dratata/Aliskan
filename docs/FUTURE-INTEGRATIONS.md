# Gelecekteki entegrasyon sınırları

Bu sürüm bağımsız yerel uygulamadır. Aşağıdaki servisler kurulu veya çalışıyor olarak sunulmaz.

## Bulut senkronizasyonu

`src/data/database.ts` dışındaki ekranlar aynı tipli AppState/HabitEvent arayüzleriyle çalışır. Gelecekte Supabase Auth + PostgreSQL olay tablosuna kullanıcı_id, olay UUID, şema sürümü, oluşturma/düzenleme zamanı eklenir. Row Level Security her sorgu/yazmada `auth.uid() = user_id` koşulunu uygular; açık anonim yazma ve genel sağlık veri listesi bulunmaz. Senkronizasyon önce yerel, ardından sunucu onayı şeklindedir; silmeler tombstone ile aktarılır. Çakışmada olay UUID + düzenleme sürümü ve kullanıcıya görünür çözüm kullanılır.

## ChatGPT / harici istemci API'si

Öngörülen sunucu sözleşmesi: `POST /api/v1/events`, `GET /api/v1/events?after=...`, `DELETE /api/v1/events/:id`. Bunlar bu sürümde endpoint değildir. OAuth/PKCE veya kullanıcıya ait sınırlı, iptal edilebilir erişim belirteci; istemci/veri sahibine bağlı kapsamlar; TLS; idempotency-key; Zod ile tür/süre/tarih doğrulama; hız sınırı ve hassas veri içermeyen denetim kaydı gerekir. Kullanıcının onayladığı taslak olaylar gönderilir. İstemcide sağlayıcı sırrı veya service-role anahtarı bulunmaz. Yerel ayrıştırıcının `EntryDraft` çıktısı gelecekteki API adaptörüne giriş olabilir.

## Web push

Uygulama kullanıcıdan açık izin alıp VAPID aboneliğini kimliği doğrulanmış kullanıcıya bağlar. Sunucu saat dilimi, sessiz saat, tekrar günleri, erteleme ve gerçek görev durumuna göre gönderir. VAPID private key sunucu ortamındadır. iOS 16.4+ ana ekran web uygulaması ve kullanıcı etkileşiminden izin gerekir. Güvenilir alarm garantisi için native uygulama alternatif olarak değerlendirilir.

## Eski çalışma uygulaması aktarımı

Eski projeye erişildiğinde veriler kopya üzerinde analiz edilir. Yeni bir ImportAdapter eski kayıtları sürümlü AppState olaylarına dönüştürür; UUID tekilleştirme, tarih/süre önizlemesi ve önce mevcut verinin yedeği alınarak içe aktarım uygulanır. Eski uygulama ve kayıtları değiştirilmez.
