# Üçüncü tarama — başlama, devam etme ve kayıt güvenliği

Kullanıcının günlük kullanımında en değerli adımlar: ders çalışmayı başlatmak, kesintiden sonra konuyu/süreyi korumak ve yerel kayıtları yedeklemek. Ücretli API veya yeni backend gerekmez.

## Bulgular ve değişiklikler

- Çalışma molasının ana ekrandaki devam düğmesi gece rutinini açıyordu. Zamanlayıcı sahibini belirleyen ortak yönlendirme eklendi; çalışma molası doğru modda açılır.
- Aynı çalışan sayacı eşzamanlı başlatmak deadline'ı ileri taşıyabiliyordu. Zamanlayıcı geçişi aynı çalışan kimliğin yeniden başlatılmasını reddeder; başlatma sırasında düğme kilitlenir. Kalan süre deadline'dan alınır.
- Çalışma ekranı oturum sırasında rehber, alanlar ve kayıtlarla doluydu. Başlat/devam eyleminde sade odak görünümü açılır; kullanıcı ayrıntılara dönebilir. Konu aktif oturumda değiştirilemez.
- Konu geçmişi yalnız son konuyla sınırlıydı. Gerçek kayıtlardan Türkçe adları normalleştirerek konu toplamları, arama, yeniden seçme ve ad düzenleme eklendi. Ad değişikliği kayıt kimliğini, tarihini ve dakikasını değiştirmez.
- Yarım çalışma, mola, nefes ve sigara erteleme oturumları Başlat ekranında görünür. Desteklenmeyen eski/egzersiz/rutin bağlamları bu listeye sahte devam düğmesiyle eklenmez; egzersiz ve rutin rehberlerinin kendi devam akışı korunur.
- Yedek son hazırlama durumu yoktu. Ayrı IndexedDB metadata anahtarında hazırlama zamanı/kayıt sayısı tutulur; alışkanlık şeması değişmez. İlk gerçek kayıttan sonra ve bir hafta geçince nazik hatırlatma, yarına erteleme eklenir.
- Tarayıcı kalıcı depolama desteği varsa kullanıcı isteyebilir. İzin sonucu gerçek API yanıtıdır; bulut yedeği veya cihaz sıfırlamasına karşı garanti değildir.
- Bir ve iki dakikalık egzersiz hedefleri altı hareketin tekrarlarını çok dar sürelere sıkıştırıyordu. Bir dakikada rahat yürüyüş, iki dakikada yürüyüş ve omuz mobilizasyonu, üç dakikada sınırlı hareket seçimi kullanılır. 5–45 dk planları korunur.

## Kayıt ve platform sınırları

“Yedek hazırlandı” dosyanın tarayıcı indirmesi için oluşturulduğu anlamına gelir. Gerçek dosya İndirilenler'de kullanıcı tarafından kontrol edilir; dosyanın diske kesin yazıldığını uygulama doğrulayamaz. Bulut senkronizasyonu ve kapalı uygulama sunucu push bu turda kurulmaz. Gerçek iPhone/Safari testi ayrıca gerekir.

## Doğrulama

59 birim/veri testi ve 41 Playwright senaryosu geçti; TypeScript ve üretim derlemesi başarılı. Gecikmiş bitiş kontrolünün başka sekmede duraklatılan sayacı ezmesi de taze transaction durumu kontrol edilerek giderildi. 320, 390, 430 (koyu tema) ve 1280 pikselde odak/devam ekranları incelendi; yatay taşma veya JavaScript hatası bulunmadı. Fiziksel iPhone testi yerine Chromium ekran benzetimi kullanıldı.
