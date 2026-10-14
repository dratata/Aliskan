# Gösteren rehberler — 14 Ekim 2026

## Uygulama katmanı

Her hareket üç görsel aşamayla sunulur. Kullanıcı aşamaları tek tek seçebilir veya altışar saniyelik gösterimi başlatabilir. Bu öğrenme gösterimi çalışma/egzersiz kaydı oluşturmaz. Ayrı oturum zamanlayıcısı ve tamamlamayla gerçek kayıt akışı korunur. İsteğe bağlı Türkçe metin seslendirmesi tarayıcı desteğine bağlıdır.

60 oyunda etkinlik kimliğine özgü malzeme/etkileşim SVG sahnesi, üç uygulama adımı, örnek ebeveyn cümlesi, güvenlik ve varyasyon vardır. Kaba motor/denge/açık hava sahnelerinde ayakta, masa/zemin oyunlarında oturarak etkileşim gösterilir. Çocuğun ilgisini takip etme ve yanıtını bekleme vurgulanır.

Pomodoro hazırlığı, sigara isteğinde erteleme, nefes, beslenme farkındalığı ve gece/sabah rutininin bütün adımları da uygulanış rehberine sahiptir. Motivasyon mevcut kayıtları kullanır; olmayan başarılar üretilmez.

## Üretilen görseller

`public/guides` altında dokuz özgün üç aşamalı illüstrasyon:

- Sandalyeden kalkış, duvar şınavı, topuk yükseltme, baldır esnetme, yerinde yürüyüş, omuz yuvarlama.
- Büyük bloklarla kule, büyük yumuşak topu yuvarlama, resimli kitapta karşılıklı konuşma.

Görseller image_gen ile oluşturuldu. Başlangıç, uygulama ve dönüş pozları görsel olarak incelendi. İlk yürüyüş çiziminde aynı ayağın iki kez kaldırılması düzeltildi; yayınlanan çizimde sağ-sol farklıdır. Esnetmenin son resmi gevşemeyi gösterir; taraf değişimi Türkçe adımda açıklanır. Görseller temsili illüstrasyonlardır, kişisel tıbbi reçete veya gerçek çekim değildir.

Diğer oyunlar ve günlük adımlar özgün SVG sahneleri kullanır. AI görseli yüklenmezse egzersizde harekete özgü basit SVG şema kullanılır. Esnetme taraf süreleri programın ayrılan süresiyle eşleştirilir.

## Kaynak videolar

Exa ile 45 arama sonucu değerlendirildi; seçilen yayımlayıcı sayfaları/erişilebilir transkriptler okundu. Kaynak, başlık, içerik uyumu ve mevcutsa video kimliği kontrol edildi. Tam video izleme/klinik doğrulama yapıldığı iddia edilmez. YouTube oEmbed'e bu çalışma ortamından doğrudan erişim 403 ile engellendi; bu yüzden otomatik embed veya kesintisiz oynatım garantisi sunulmaz. Bağlantı kullanıcının seçimiyle kaynak sayfasında açılır; uygulama üçüncü taraf videoyu arka planda yüklemez, kopyalamaz veya yeniden barındırmaz.

| Rehber | Kaynak | Kontrol kanıtı |
| --- | --- | --- |
| Sandalyeden kalkış | [NHS how-to videos](https://www.nhs.uk/live-well/exercise/strength-and-flex-exercise-plan-how-to-videos/#1763916272001) | HTML'de sit-to-stand başlığı ile data-video-id 1763916272001 eşleşti. |
| Duvar şınavı | [NHS standing press-up](https://www.nhs.uk/live-well/exercise/strength-and-flex-exercise-plan-how-to-videos/#1763919379001) | HTML'de ilgili başlık ve video kimliği eşleşti. |
| Baldır esnetme | [NHS calf stretch](https://www.nhs.uk/live-well/exercise/strength-and-flex-exercise-plan-how-to-videos/#1763467667001) | HTML'de ilgili başlık ve video kimliği eşleşti. |
| Yerinde yürüyüş | [NHS warm-up](https://www.nhs.uk/live-well/exercise/how-to-warm-up-before-exercising/) | March-on-the-spot açıklaması ve Basic warm-up video bölümü. Video daha geniş ısınma örneğidir. |
| Omuz yuvarlama | [Physitrack shoulder rolls](https://uk.physitrack.com/home-exercise-video/shoulder-rolls-standing-1.2b-%28warm-up%29) | Açık egzersiz-video sayfası ve yukarı/geriye/aşağı uygulama açıklaması. |
| Topuk yükseltme | [Oxford University Hospitals](https://www.ouh.nhs.uk/oxparc/information/videos/heel-raises/) | Heel raises başlığı, fizyoterapi açıklaması ve 17 sn video bilgisi. |
| Nefes | [Coventry and Warwickshire NHS Trust](https://www.youtube.com/watch?v=GqfrbGtorBE) | Yayımlayıcı, başlık ve oturuş/nefes al-ver transkripti. |
| Oyun yaklaşımı | [CDC Play Time](https://www.youtube.com/watch?v=ZG3WIwi5y6k) | CDC yayımlayıcısı, 4:43 süre ve baba-kız etkileşim transkripti. Etkinliğin birebir videosu olarak etiketlenmez. |
| Birlikte okuma | [HeadStart.gov Reading Together](https://headstart.gov/video/reading-together) | Resmî sayfa, başlık, video oynatıcı ve MP4 bağlantısı. İlgili okuma örneği olarak etiketlenir. |
| Diş fırçalama | [NHS England brushing animation](https://www.youtube.com/watch?v=BapR9J86ZZw) | Kaynak başlığı ve 45 derece/küçük hareketler/tüm yüzeyler/2 dk transkripti. |

Yaşa uygun oyunların kaynak bağlamı için [UNICEF oyun önerileri](https://www.unicef.org/parenting/stories/indoor-play-ideas-stimulate-young-children-home) incelendi. Uygulamaya küçük parça, boncuk, balon veya sıcak içecek içeren öneriler aktarılmadı.

## Çevrimdışı ve mobil davranış

Uygulama kabuğu, kod ve SVG şemaları ilk kurulumda önbelleğe alınır. Büyük PNG rehberler ilk açılışta topluca indirilmez; görüntülendiklerinde saklanır. Önceden açılmamış bir görsel çevrimdışıyken SVG şemayla devam eder. Harici videolar internet gerektirir. Kaynak bağlantıları sonradan değişebilir; kontrol tarihi arayüzde gösterilir.
