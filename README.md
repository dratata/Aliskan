# Aliskan

Türkçe, mobil öncelikli kişisel yaşam ve alışkanlık PWA'sı. Küçük hedefler, rehberli oturumlar, yalnız gerçek kayıtlardan hesaplanan ilerleme.

## Çalıştırma

Node.js 22.12+ veya 24 ile:

```sh
npm ci
npm run dev
```

Üretim ve kontroller:

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview
```

Canlı uygulama: https://aliskan-eight.vercel.app

Vercel: `dratata/Aliskan` deposunu içe aktar, framework Vite, build `npm run build`, çıktı `dist`. API anahtarı veya ortam değişkeni gerekmez. Projenin sabit URL'sini kullan; farklı preview URL'leri ayrı yerel veri alanlarıdır.

## İlk kullanım

1. Aktif alışkanlıklarını seç; sabah rutini başlangıçta pasiftir.
2. Profilinden saat, hedef, sağlık notları ve bildirim tercihlerini düzenle.
3. Safari → Paylaş → Ana Ekrana Ekle. Ana ekran uygulamasında kayıt alanı Safari'den farklı olabilir; JSON yedekle aktar.
4. Profil → JSON yedek al. Yedek sağlık, ruh hali ve fotoğrafları içerir; özel tut.

Kaynak kod kişisel profil içermiyor. Veriler yalnız bu cihaz/tarayıcıda IndexedDB'ye yazılır. Tarayıcı verileri silinirse yerel kayıtlar kaybolur; düzenli yedek alın. Şifreli kasa veya bulut senkronizasyonu iddiası yoktur.

## Çalışan alanlar

- Aktif günlük görevler, tamamlama, erteleme ve bugünü atlama; düzenlenebilir saat/hedef/tekrar günleri.
- Konu kaydı, 10 dakika başlangıç, 2 dakika deneme, mola ve kalıcı duraklat/devam destekli Pomodoro.
- Açıklanabilir, kullanıcı onaylı adaptif hedefler. Bir günde en fazla bir artış; egzersiz ağrı/efor değerlendirmesi.
- SVG ve sıralı adımlarla ekipmansız egzersiz, alternatifler, tolerans kaydı.
- Zamanlı/düzenlenebilir sigara kayıtları, tetikleyici ve istek puanı, 5 dakika erteleme ve bırakma desteği.
- 4 saniye al/ver nefes animasyonu; desteklenirse sesli yönlendirme ve titreşim.
- Gece/sabah rutinleri, su, kilo, öğün fotoğraf/metni, açlık/tokluk ve atıştırma notları.
- Uyku saatleri, kalite, enerji ve stres.
- 10 kategoride 60 özgün çocuk etkinliği, adımlar, güvenlik, varyasyonlar ve geri bildirim.
- Türkçe ses/metin ayrıştırma, JSON önizleme, doğrulama ve geri alma.
- Günlük/haftalık/aylık gerçek grafikler; kayıtsız günler bilinmiyor olarak işaretlenir.
- Şema doğrulamalı JSON yedekleme, birleştirme/değiştirme; geçmiş kayıt düzenleme.
- Açık/koyu tema, mobil safe area, reduced motion, çevrimdışı uygulama kabuğu.

## Platform sınırları

Hatırlatmalar **uygulama açıkken** çalışır. Sessiz saatler, modül tercihleri ve günlük sınır vardır. Uygulama kapalıyken/telefon kilitliyken zamanlayıcı sonu veya alarm garanti edilmez. Sunucu web push kurulmadı. iOS web push için ana ekrana kurulum, izin ve sunucu gerekir.

Konuşma tanıma tarayıcıya bağlıdır; destek yoksa metin girişi aynı işlevi sağlar. Tarayıcı sağlayıcısı sesi cihaz dışında işleyebilir. Metin ayrıştırıcı yereldir ve yalnız desteklediği kalıpları yorumlar; belirsiz ifadeler otomatik yazılmaz. Gerçek iPhone mikrofon/bildirim/titreşim davranışı cihazda ayrıca kontrol edilmelidir.

Egzersiz ve beslenme içerikleri genel rehberdir. Profil notları otomatik tıbbi reçete oluşturmaz. Sistem genelinde telefon kullanım süresi ölçülmez. ChatGPT sohbetinden otomatik veri aktarımı veya AI API bağımlılığı yoktur.

## Mimari

`src/domain` saf kurallar ve Zod şeması; `src/data` IndexedDB/yedek; `src/app` ortak durum/navigasyon; `src/features` modüller; `src/content` rehberler; `src/platform` PWA/mikrofon/hatırlatma adaptörleri. Kaydetme başarısı yalnız IndexedDB işlemi tamamlanınca gösterilir. Zamanlayıcı deadline kullanır; başka oturuma geçerken önceki oturum duraklatılıp arşivlenir. PWA build script'i hashed JS/CSS ve lazy grafik chunk'ını önbelleğe alır.

İlerideki güvenli API/bulut tasarımı: [docs/FUTURE-INTEGRATIONS.md](docs/FUTURE-INTEGRATIONS.md).

Aşamalar ve test sonuçları: [docs/PROGRESS.md](docs/PROGRESS.md).

## Gösteren rehberler

Hareketlerde üç aşamalı özgün görseller, seçilebilir/otomatik ilerleyen adımlar ve teknik kontrol noktaları bulunur. 60 oyunda etkinliğe özgü SVG sahnesi ve örnek ebeveyn cümleleri vardır. Öğrenme gösterimi kayıt oluşturmaz; gerçek oturum zamanlayıcısı ayrıdır. İsteğe bağlı Türkçe seslendirme tarayıcı desteğine bağlıdır.

NHS, Oxford University Hospitals, Physitrack, CDC ve HeadStart kaynaklarıyla video örnekleri seçildi. Kaynak sayfası kullanıcı seçimiyle açılır; videolar internet gerektirir. Büyük resimler açıldığında önbelleğe alınır; yüklenmeyen resmin yerine adım şeması gösterilir. [Kaynaklar ve görsel inceleme](docs/GUIDE-SOURCES.md).

## Güvenilirlik ve kullanım iyileştirmeleri

Aynı tarayıcıdaki sekmeler kayıtlarını IndexedDB transaction ile birleştirir ve eşitler. Günlük işaretler geri alınabilir; eski tamamlamalar yeni hedeflerden etkilenmez. Kısa Pomodoro denemeleri gerçek net dakika kadar planı ilerletir. Egzersizde süre kullanıcı tarafından doğrulanır; mola sayacı vardır. Kayıt geçmişi sayfalanır, haftalık hedef gelişimde görünür. Mobil geri hareketi rehberi kapatır. Ayrıntılı tarama: [docs/AUDIT-2026-10-14.md](docs/AUDIT-2026-10-14.md).

İkinci kullanım turu: kalan/tüm plan, saate göre sıradaki adım, güncel hedefli hızlı başlangıç, sabah rutinini düzenleme ve yarım rutine devam; gecelik uyku kaydını güncelleme, gerçek oyun süresi; çakışan yedek önizlemesi ve alan bazlı profil kaydetme. [İkinci tarama raporu](docs/AUDIT-SECOND-2026-10-14.md).
