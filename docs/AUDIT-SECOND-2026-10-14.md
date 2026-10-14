# İkinci kullanım taraması — 14 Ekim 2026

Bu tur ilk taramadaki transaction ve süre düzeltmelerinin üzerine, mevcut tek kullanıcı yerel mimarisini koruyarak ilerler. Ücretli API veya yeni sunucu eklenmez.

- Eski yedek, aynı ID ile daha güncel kayıtları ezebiliyor: birleştirmede cihazdaki kayıt korunur; yeni/aynı/çatışan kayıt sayıları önizlenir. Tam değiştirme ayrı, açık seçim olarak kalır.
- Profil formu tüm eski alanları yazıyor: yalnız kullanıcı tarafından değiştirilen alanlar güncel state'e uygulanır; diğer sekmenin değişiklikleri korunur.
- Aynı gece birden çok uyku kaydı ekleniyor; varsayılan puanlar gerçek değerlendirme gibi yazılıyor; sesli kayıtta eksik puanlar undefined görünüyor: seçilen gece düzenlenir, puanlar isteğe bağlıdır, uyku ve güncel his alanları ayrılır. Eski kayıtlar silinmez.
- Sabah rutini sabit ve düzenlenemiyor: saat/süre/sıra düzenlemesi, eski yedeklerden varsayılan adımların eklenmesi ve sabah adımı geri alınca görev ilerlemesinin güncellenmesi sağlanır.
- Rutinden ayrılınca seçili adım unutuluyor, gece yarısında gün değişebiliyor: açık rutin günü ve kaldığı adım saklanır; kullanıcı geçmiş/bügünkü rutini seçebilir.
- Günlük plan, saate bakmadan ilk işi öneriyor: yakın zamandaki veya sıradaki tamamlanmamış adımı önerir; kalan/tüm adımlar görünümü eklenir. Pasif çalışma modülü için başlama mesajı gösterilmez.
- Hızlı başlangıç statik 10 dakika diyor ve yalnız öğle egzersizine erişiyor: güncel hedefler ve ayrı akşam hareketi gösterilir.

Veri şeması sürümü korunur; yeni sabah adımları ve rutin tamamlama metadata'sı geriye uyumlu varsayılan/isteğe bağlı alanlardır. Kabul: eski yedek mevcut kaydı değiştirmez; profil alanları sekmelerde korunur; aynı gece güncellenir; düzenlenen sabah saati yenilemede kalır; akşam sıradaki adım çalışma olur; eski ve yeni mobil senaryolar geçer.

Ek düzeltmeler: baba-kız oyununda otomatik 10 dk kayıt yerine kullanıcı gerçek süre girer; kısa oyunlar hedef tamamlanması olarak varsayılmaz. Eski aynı güne ait birden fazla uyku kaydı silinmez; dönem ortalaması her günün son kaydını kullanır. Kaydedilmemiş profil değişiklikleri görünür ve kaydet düğmesi mobilde ulaşılabilir kalır.

Sıradaki adım kuralı deterministiktir: son 90 dakikada planlanmış en yakın tamamlanmamış adım; yoksa sıradaki gelecek adım; hepsi geçmişteyse en son planlanmış kalan adım. Pasif veya bugün tekrarı olmayan alışkanlıklar önerilmez. Bu bir zorunlu aktivite veya tamamlanma iddiası değildir.

## Doğrulama sonucu

52 domain/veri testi ve 33 mobil E2E senaryosu geçti. Eski yedek, çakışan ID, profil sekmeleri, aynı gece güncelleme, sabah saatleri, gece yarısında rutine devam, sıradaki akşam adımı ve gerçek oyun dakikası regresyonları dahil. Üretim derlemesi başarılı. Yeni sabah adımları varsayılanlarla yüklenir; schema sürümü 1 olarak kalır. Hassas başlangıç profili kaynak koda eklenmedi.
