# Aliskan geliştirme kaydı

## Başlangıç incelemesi

Çalışma dizininde eski ders uygulaması bulunmadı. Aliskan deposu boştu. Tasarım ve uygulama planı kullanıcı tarafından onaylandı. Yeni bağımsız yerel PWA geliştirildi; eski veriler veya başka projeler değiştirilmedi.

## Aşama 1 — Temel

Tamamlandı: React/TypeScript/Vite/Tailwind, beş sekme, kısa kurulum, modül etkinleştirme, günlük görev seçenekleri, profil ve saat/hedef ayarları, IndexedDB kalıcılığı, JSON yedek/geri yükleme ve kayıt geçmişi. Core testleri ve yenileme/yedek mobil senaryoları geçti.

## Aşama 2 — Temel alışkanlıklar

Tamamlandı: konu kayıtlı Pomodoro, 2 dakika deneme, 2–5 dakika mola, deadline zamanlayıcı ve oturum arşivi; SVG hareket rehberi, tolerans/ağrı kaydı; sigara saat/tetikleyici/istek kayıtları ve erteleme; nefes animasyonu; adım adım gece rutini. Adaptasyon, tekrar kayıt ve oturum devamı kontrolleri geçti.

## Aşama 3 — Yaşam modülleri

Tamamlandı: su/kilo/öğün fotoğraf ve metni, açlık/tokluk, atıştırma farkındalığı, uyku/enerji/stres, pasif sabah rutini, 10 kategoride 60 farklı etkinlik ve geri bildirim. Etkinlik içerik bütünlüğü ve tekrar engelleme testleri geçti.

## Aşama 4 — Akıllı katman

Tamamlandı: destek kontrollü mikrofon/metin; yerel Türkçe kalıp ayrıştırma, JSON önizleme/onay/geri alma; gerçek grafikler, kişisel ilerleme mesajları; kullanıcı onaylı hedef önerileri. Açık uygulamada 5 dakika öncesi, başlangıç ve 15 dakika sonrası nazik hatırlatma; modül/tekrar günleri/sessiz saat ve günlük sınır. NLP ve gerçek dönem hesabı testleri geçti.

## Aşama 5 — Doğrulama

35 domain/veri testi ve 16 mobil Playwright senaryosu geçti. Üretim derlemesi başarılı; PWA çevrimdışı açılışı, kayıt kalıcılığı, JSON birleştirme, tarih değişimi ve hatalı IndexedDB yazısında başarı göstermeme doğrulandı. Üretim bağımlılığı denetimi: 0 bilinen güvenlik açığı. Görseller 390 px mobil genişlikte incelendi. Grafik kodu ayrı lazy chunk'tır. Kaynak kodda sır veya kişisel başlangıç profili yoktur.

Bağımsız inceleme bulundu ve düzeltildi: tamamlanmış zamanlayıcıdan yeni oturum; modül/mola geçişinde oturum koruma; egzersiz adımı/sahibi kalıcılığı; eksik/geçersiz yedek reddi; yedek fotoğraf boyutu uyumu; günlük tek hedef artışı; uyku saatinden yeniden süre hesabı; başarısız geri almada doğru durum; çift tamamlamada tek kayıt; egzersiz süre sınırları; gece yarısında günlük plan yenileme.

Küçük inceleme bulguları da karşılandı: geçmiş kayıt düzenleme, son önerileri tekrar önleme, türetilmiş görevlerin geri almada güncellenmesi, önceki dönem karşılaştırmasında çalışma verisi varlığı.

## Açık sınırlar / sonraki geliştirme

Gerçek iPhone mikrofon, tarayıcı bildirim izni ve titreşim kontrolü cihazda yapılmalı. WebKit'e özel davranışlar Chromium mobil emülasyonuyla tam doğrulanamaz. Uygulama kapalıyken push/alarm, bulut senkronizasyonu ve ChatGPT API entegrasyonu kurulu değildir. Bir sonraki ürün adımı gerçek cihaz kullanım geri bildirimi; ardından istenirse kimlik doğrulamalı bulut/push.

Kişisel başlangıç bilgileri ayrı, yerel JSON yedeğinde hazırlanmıştır; GitHub'a gönderilmez. Profil → Yedek yükle → önce mevcut yedeği indir → değiştirme onayıyla yüklenebilir. Birleştirme kişisel profil ayarlarını değiştirmez.

## Yayın

Kaynak kod dratata/Aliskan main dalına gönderildi ve dosya içeriği GitHub üzerinden doğrulandı. Vercel hesabının görünen kapsamında API isteği 403 forbidden döndürdü. CLI geri dönüşünde kayıtlı oturum bulunmadı; cihaz yetkilendirmesi istendi. Canlı yayın bağlantısı henüz doğrulanmadı. Başarılı olmayan yayın canlı olarak raporlanmaz.

1440 px masaüstü kontrolünde yatay taşma ve JavaScript sayfa hatası yok. WebKit indirildi fakat çalıştırma için gereken sistem kitaplıkları ortamda eksik; bu motor için başarılı test iddiası yok. Gerçek iPhone doğrulaması sonraki kontroldür.

Son ek doğrulama: Pomodoro tamamlama sonrası 10 net dakika kaydı ve ertesi gün 20 dakika önerisi; rehber kapalıyken uygulama içi oturum bitiş bildirimi. Sesli uyku kayıtlarına belirtilmeyen kalite/enerji puanları eklenmez.

## 14 Ekim — Gösteren rehberler

Kullanıcının yeni yönlendirmesiyle rehberler genişletildi: dokuz özgün üç aşamalı illüstrasyon; 60 oyuna özgü üç adımlı SVG sahneleri ve ebeveyn örnek cümleleri; bütün hareketlerde teknik kontrol noktaları; odak/nefes/sigara erteleme/beslenme ve bütün gece-sabah adımlarında nasıl yapılır rehberi. Gösterim kullanıcı kontrolünde ilerler; isteğe bağlı Türkçe seslendirme destek kontrolüyle açılır. Öğrenme gösterimi gerçek oturum veya görev kaydı oluşturmaz.

10 video kaynağı kayıt altına alındı. Kurumsal kaynak sayfaları, başlıklar, ilgili metin/transkript ve mevcutsa video kimlikleri incelendi. Videolar kaynak sayfasında kullanıcı seçimiyle açılır; yabancı dil açıkça belirtilir. İlgili genel örnekler birebir etkinlik videosu olarak etiketlenmez. Kaynak ve sınırlamalar: GUIDE-SOURCES.md.

Yeni veri/rehber testleriyle toplam 41 test geçti. Mobil senaryolar 19'a çıktı; adım değişimi, örnek konuşma, kaynak bağlantısı, gösterimin kayıt yaratmaması ve çevrimdışı şema senaryoları geçti. Üretim derlemesi başarılı. Büyük rehber PNG'leri ilk açılışta topluca indirilmez; açıldığında önbelleğe alınır. İnternet yoksa hareket/oyun SVG şemaları kullanılır. Kod React ve doğrulama chunk'larına ayrılarak ilk uygulama chunk'ı yaklaşık 204 kB'ye indirildi.

Mevcut kullanıcı veri şeması ve kayıtlar korunur. Canlı Vercel yayını önceki hesap yetkilendirmesi engeline bağlıdır; bu çalışma canlı yayın yapılmış gibi raporlanmaz.

## 14 Ekim — Canlı yayın ve iyileştirme taraması

Vercel cihaz yetkilendirmesi tamamlandı. Aliskan GitHub deposuna bağlıdır; üretim adresi https://aliskan-eight.vercel.app. Önceki yetkilendirme engeli çözüldü.

Tarama ve gerekçeler: AUDIT-2026-10-14.md. Aynı IndexedDB transaction içinde okuma/değiştirme/yazma, sekmeler arasında eşitleme, eski tamamlamalarda hedef koruma, net süreye göre Pomodoro planı, egzersizde onaylı gerçek süre ve mola rehberi, işareti geri alma, mobil geri hareketi/odak yönetimi, geçmiş sayfalama, haftalık hedef ve dönem kapsamlı sigara arası, daha güvenli Türkçe giriş eklendi. PWA görünür olduğunda ve saatte bir güncelleme arar; uygulama seçimi kullanıcıdadır.

Dokuz rehberin WebP kopyaları yaklaşık 1,2 MB; PNG özgünler korunur (yaklaşık 19 MB). Uygulama WebP kullanır; çevrimdışı SVG alternatifi sürer.

Doğrulama: 48 domain/veri testi ve 26 mobil Playwright senaryosu başarılı. Üretim derlemesi başarılı. İki sekme kayıt koruma, kısa deneme, egzersiz süresi, geri hareketi, 105 kayıt sayfalama ve haftalık hedef için yeni regresyonlar eklendi. Genel dil anlayışı, kapalı uygulama push ve bulut senkronizasyonu bu taramanın kapsamı dışındadır; fiziksel iPhone kontrolü açık kalır.

## 14 Ekim — İkinci tarama ve günlük kullanım iyileştirmeleri

Kalan/tüm günlük adımlar ve saate göre sıradaki küçük adım, güncel hedefli hızlı başlangıç ve ayrı akşam egzersizi eklendi. Yedek birleştirmede cihazdaki aynı ID'li kayıt korunur; yeni/aynı/çatışan kayıt sayıları önizlenir. Profil yalnız değiştirilen alanları kaydeder; diğer sekmenin tercihlerini ezmez. Mobil kaydet düğmesi değişiklik varken görünür kalır.

Uyku ekranı seçilen geceyi günceller; uyku kalitesi/sabah enerjisi isteğe bağlı, şimdiki his ayrı alanlardır. Eski mükerrer kayıtlar silinmeden günlük son kayıt ortalamaya alınır. Baba-kız etkinliğinde varsayılan dakika kaydı kaldırıldı; gerçek süre girilir.

Sabah rutini saat/süre/sıra bakımından düzenlenebilir. Gece ve sabah rutinleri kaldığı adımı ve başlangıç gününü saklar. Gece yarısında rutin iki güne bölünmez. Rutin gününü kullanıcı değiştirebilir. Alışkanlıktan rutin başlangıç saati değiştirildiğinde adımlar birlikte kayar. Sabah adımı silindiğinde otomatik görev ilerlemesi güncellenir.

52 domain/veri testi, 33 mobil E2E senaryosu ve üretim derlemesi başarılı. Eksikler: kapalı uygulama sunucu push, bulut eşitleme ve gerçek iPhone/Safari cihaz testi; kapsam bu turda yerel veri ve mevcut günlük akışların iyileştirilmesidir. Ayrıntılar: AUDIT-SECOND-2026-10-14.md.
