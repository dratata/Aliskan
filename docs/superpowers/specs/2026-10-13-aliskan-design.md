# Aliskan — Ürün ve mimari tasarımı

## Amaç
Türkçe, mobil öncelikli, tek kullanıcılı bir yaşam ve alışkanlık uygulaması. Küçük hedeflerle başlatır; gerçek kayıtlarla ilerlemeyi gösterir. Kaçırılan günler geçmiş başarıları silmez. iPhone Safari ve ana ekrana eklenen PWA hedeflenir.

## İnceleme ve seçenekler
Çalışma dizininde eski ders uygulaması veya proje kodu bulunmadı. GitHub dratata/Aliskan boş ve herkese açık. Eski uygulamanın dosyaları değiştirilmez; ileride sürümlü içe aktarma adaptörü eklenebilir.

Önerilen yaklaşım: React, TypeScript, Vite, Tailwind, IndexedDB, PWA ve Vercel. Hesap veya ücretli API gerektirmeden kullanılabilir. Alternatif Supabase tabanlı başlangıç cihazlar arası eşitleme sağlar fakat kimlik doğrulama ve erişim kuralları gerektirir. Native Expo yaklaşımı sistem entegrasyonlarını artırır fakat iOS dağıtım sürecini uzatır. İlk sürüm yerel PWA olacaktır.

## Ekranlar ve veri akışı
Alt menü: Bugün, Alışkanlıklar, Başlat, Gelişim, Profil. İlk kurulum kısa ve isteğe bağlı sorular içerir. Sabah rutini pasif; diğer önerilen modüller kullanıcı tarafından seçilir. Günlük listede yalnız aktif görevler görünür; başlatma rehberi açar. Tamamlama, erteleme ve yapamama ayrı olaylardır. Saatler ve hedefler değiştirilebilir.

UI -> modül servisi -> doğrulama -> IndexedDB işlemi -> ortak uygulama durumu akışı uygulanır. Kaydetme hatası kullanıcıya gösterilir; saklama başarısı gerçekleşmeden kayıt başarılı sayılmaz. Zaman damgası UTC, günlük gruplama kullanıcının yerel saat dilimiyle yapılır. Geçmiş gün kayıtları düzenlenebilir.

## Veri modeli
Sürümlü profil, alışkanlık ayarları, günlük görev durumları, çalışma oturumları, egzersiz oturumları, sigara olayları, öğün ve su kayıtları, kilo ölçümleri, uyku aralıkları, rutin adımları, nefes oturumları, çocuk etkinlikleri ve geri bildirimleri, enerji/stres puanları, hatırlatıcı tercihleri saklanır. Olaylarda UUID, tarih, kaynak ve oluşturma/düzenleme zamanları bulunur.

Kişisel sağlık profili kaynak kod veya GitHub dosyalarında bulunmaz. Kullanıcı verdiği başlangıç bilgilerini ilk kurulumda doldurur; isteğe bağlı profil yedeği cihazdan aktarılabilir. Yerel veri cihaz/tarayıcı güvenliğine dayanır; uygulama özel şifreli kasa iddiasında bulunmaz. JSON dışa aktarma hassas veri içerdiği bilgisiyle sunulur. İçe aktarma şema doğrulaması, önizleme, açık birleştirme/değiştirme seçimi ve önceki verinin yedeğiyle yapılır.

## Modüller
Çalışma: 10 dakikayla başlar; 2 dakika dene, konu kaydı, 2–5 dakika mola, duraklat/devam, önceki oturuma devam bulunur. Zamanlayıcı kalan süreyi son tarihten hesaplar; arka planda interval doğruluğuna dayanmaz. Net çalışma ve molalar ayrıdır. Aynı oturum iki kere kaydedilemez.

Egzersiz: öğle ve akşam başlangıç hedefleri 5 dakika, sınırlar 15/45 dakika. İsteğe bağlı geçmiş, ağrı, sakatlık, kardiyovasküler kısıt ve ekipman değerlendirmesi alınır. Hareketler SVG rehber, başlangıç pozisyonu, adımlar, tekrar/set, süre, dinlenme ve alternatif içerir. Ağrı veya yüksek zorlanma artışı engeller.

Sigara: zamanlı tek dokunuş kayıt, düzenleme, tetikleyici ve istek puanı, gerçek tüketim grafiği ve 5 dakika erteleme. Nefes, su ve yürüyüş alternatifleri; nihai hedef bırakma ve kanıta dayalı destek bilgisi.

Nefes: 4 saniye al/4 saniye ver, süre seçimi, animasyon, duraklatma, isteğe bağlı ses ve desteklenen cihazda titreşim; önce/sonra stres puanı.

Beslenme: metin/fotoğraf öğün kaydı, porsiyonlu ara öğün önerileri, açlık/tokluk, kilo ve su. Kesin diyet veya kişisel kalori reçetesi üretilmez. Fotoğraflar yerel saklanır.

Uyku/rutin: gece adımları ve zaman/sıra düzenleme, manuel yatış/uykuya dalış/uyanış ve kalite/enerji. Sabah modülü oluşturulur ama pasiftir. Sistem genelinde ekran süresi ölçülmez.

Baba-kız: 10 kategoride en az 60 farklı etkinlik; malzeme, hazırlık/uygulama süresi, adımlar, SVG, güvenlik, kolaylaştırma/zorlaştırma içerir. Küçük parça ve düşme riskleri gözetilir. Doğrulanmamış video eklenmez. Yakın zamanda önerilenleri dışlayan, kategori çeşitliliği ve geri bildirimi dikkate alan deterministik seçim kullanılır. Uyanıklık saatleri ayarlanabilir.

Ses/metin: destek kontrolüyle Türkçe konuşma tanıma; her zaman metin alternatifi. İlk sürüm yerel kurallı ayrıştırıcı; yalnız desteklediği ifadeleri yapılandırır. Belirsiz tarih/saat onayla çözülür, önizlemesiz kayıt yapılmaz. Geri alma desteklenir. İleri API katmanı kimlik doğrulama ve sunucu sırları gerektirir; doğrudan ChatGPT aktarımı çalışıyor gibi sunulmaz.

## Adaptif motor
Saf, deterministik fonksiyonlar geçmiş tamamlanma, hedef, zorlanma/ağrı ve toplam günlük yükü değerlendirir. Çalışmada önce oturum sayısı sonra süre artar; üst sınır 120 net dakika. Tamamlanmayan hedef artırılmaz; tekrarlanan başarısızlıkta küçültme önerilir. Tek kaçırılan gün seriyi tümden sıfırlamaz. Fiziksel yük toleransa göre artırılır. Aynı gün en fazla bir alışkanlık artış önerisi gösterilir. Öneri açıklaması ve kabul/ret saklanır; kullanıcı kabul etmeden hedef değişmez.

## Analiz ve koç
Grafikler ve haftalık karşılaştırmalar yalnız gerçek kayıtlara dayanır. Kayıtsız günler bilinmiyor olarak gösterilir. Uyku gece yarısını aşabilir. Koç mesajları gerçek tamamlamaları ve zorlanmaları temel alan yerel şablonlardan seçilir; yapay zekâ API'si şart değildir.

## Hatırlatıcılar ve PWA
Saat, tekrar günleri, sessiz saat, kapatma ve erteleme ayarları modül bazındadır. İlk sürüm açık uygulamada hatırlatma ve izin verilirse desteklenen tarayıcı bildirimi sağlar. Uygulama kapalıyken alarm garantisi yoktur. iOS web push için ana ekrana kurulum, izin ve sunucu altyapısı gerekir; kurulmadıkça aktif gösterilmez. Service worker uygulama kabuğunu çevrimdışı açar; güncelleme kullanıcıya bildirilir. iOS safe area, büyük dokunma hedefleri, reduced-motion, açık/koyu tema desteklenir.

## Geliştirme sırası ve doğrulama
1. Temel: proje, navigasyon, IndexedDB, modeller, kurulum, görevler, tercih ve yedekleme.
2. Rehberli temel modüller: çalışma, egzersiz, sigara, nefes, gece rutini.
3. Yaşam modülleri: beslenme, su, kilo, uyku, sabah, 60 çocuk etkinliği.
4. Akıllı katman: onaylı ses/metin girişi, adaptasyon, gerçek istatistikler, koç ve hatırlatma.
5. Kalite: tip kontrolü, üretim derlemesi, motor/ayrıştırıcı/tarih/yedek testleri, mobil kullanıcı senaryoları, yenileme ve çevrimdışı kalıcılık, PWA, GitHub ve Vercel yayını.

Her aşamada tamamlanan iş, çalıştırılan kontroller, eksikler ve sonraki adım raporlanır. Kabul ölçütü kullanıcının verdiği 16 senaryodur. Arka plan bildirimi, mikrofon ve titreşim gerçek cihazda ayrıca doğrulanır; desteklenmeyen özelliklerde açık alternatif bulunur.

## Varsayımlar
İlk sürüm tek kişi/tek tarayıcı; bulut senkronizasyonu yok. Arayüz kişisel isim kullanmadan çalışır. Mevcut kullanıcı kayıtları yok varsayımı yalnız boş yeni proje içindir. Profil verileri yerel kalır. Harici AI, ses veya sağlık API'si kullanılmaz. Yayın hedefi yeni Aliskan projesidir; mevcut Vercel projeleri değiştirilmez.
