import type {AppState} from '../domain/types';
export interface Activity {id:string;name:string;category:string;skill:string;materials:string;prepMinutes:number;minutes:number;steps:string[];safety:string;easier:string;harder:string}
export const activities:Activity[]=[
  {
    "id": "play-1-1",
    "name": "Yastık yolu",
    "category": "Kaba motor",
    "skill": "Büyük kas hareketleri ve beden farkındalığı",
    "materials": "Büyük, düz minderler",
    "prepMinutes": 1,
    "minutes": 5,
    "steps": [
      "Minderleri aralıklı, zeminde bir yol yap.",
      "Önce sen yavaşça geç; çocuğun adımlarını izle.",
      "Elini teklif et, sonunda birlikte alkışlayın."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Yerde geniş, kaymayan bir alan kullan. Tırmanma veya yüksekten atlama ekleme.",
    "easier": "İki minderle düz yol yap.",
    "harder": "Yolu hafifçe kıvrımlı yap."
  },
  {
    "id": "play-1-2",
    "name": "Hayvan yürüyüşü",
    "category": "Kaba motor",
    "skill": "Büyük kas hareketleri ve beden farkındalığı",
    "materials": "Malzeme gerekmez",
    "prepMinutes": 2,
    "minutes": 8,
    "steps": [
      "Bir ayı gibi yavaş yürü ve sesini taklit et.",
      "Çocuğundan kendi hayvanını seçmesini iste.",
      "Kedi ve penguen hareketlerini sırayla deneyin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Yerde geniş, kaymayan bir alan kullan. Tırmanma veya yüksekten atlama ekleme.",
    "easier": "Yalnızca bir hayvan seç.",
    "harder": "Hareket ve sesi birlikte değiştir."
  },
  {
    "id": "play-1-3",
    "name": "Balon değil, büyük top",
    "category": "Kaba motor",
    "skill": "Büyük kas hareketleri ve beden farkındalığı",
    "materials": "Yumuşak büyük top",
    "prepMinutes": 1,
    "minutes": 10,
    "steps": [
      "Karşılıklı yere oturun.",
      "Topu çocuğuna yavaşça yuvarla.",
      "Sırayla isim söyleyip birbirinize gönderin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Yerde geniş, kaymayan bir alan kullan. Tırmanma veya yüksekten atlama ekleme.",
    "easier": "Daha yakından yuvarlayın.",
    "harder": "Topu geniş bir hedefe gönderin."
  },
  {
    "id": "play-1-4",
    "name": "Dur ve yürü",
    "category": "Kaba motor",
    "skill": "Büyük kas hareketleri ve beden farkındalığı",
    "materials": "Malzeme gerekmez",
    "prepMinutes": 2,
    "minutes": 7,
    "steps": [
      "Birlikte odada yavaşça yürüyün.",
      "Dur deyip heykel olun.",
      "Yürü deyince devam edin; rolleri değiştirin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Yerde geniş, kaymayan bir alan kullan. Tırmanma veya yüksekten atlama ekleme.",
    "easier": "Komutlarla birlikte hareketi göster.",
    "harder": "Yavaş ve hızlı olmayan farklı adım boyları ekle."
  },
  {
    "id": "play-1-5",
    "name": "Çizgi üzerinde adımlar",
    "category": "Kaba motor",
    "skill": "Büyük kas hareketleri ve beden farkındalığı",
    "materials": "Geniş kağıt bant",
    "prepMinutes": 1,
    "minutes": 12,
    "steps": [
      "Zemine kısa, düz bir bant çizgisi yap.",
      "Çizginin yanından veya üzerinden birlikte yürüyün.",
      "İleri geri giderken sevdiği bir şarkıyı söyleyin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Yerde geniş, kaymayan bir alan kullan. Tırmanma veya yüksekten atlama ekleme.",
    "easier": "Çizginin yanında el ele yürüyün.",
    "harder": "Zemine geniş bir kıvrım ekle."
  },
  {
    "id": "play-1-6",
    "name": "Topu kapıya gönder",
    "category": "Kaba motor",
    "skill": "Büyük kas hareketleri ve beden farkındalığı",
    "materials": "Yumuşak büyük top",
    "prepMinutes": 2,
    "minutes": 10,
    "steps": [
      "İki minder arasında geniş bir kale yap.",
      "Topu ayağınla hafifçe iterek göster.",
      "Çocuğun denesin, sonuçtan çok çabasına eşlik et."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Yerde geniş, kaymayan bir alan kullan. Tırmanma veya yüksekten atlama ekleme.",
    "easier": "Topu elle yuvarlasın.",
    "harder": "Kaleyi biraz daha uzaklaştır."
  },
  {
    "id": "play-2-1",
    "name": "Büyük blok kulesi",
    "category": "İnce motor",
    "skill": "El kontrolü ve iki elin birlikte kullanımı",
    "materials": "Yaşa uygun büyük bloklar",
    "prepMinutes": 1,
    "minutes": 5,
    "steps": [
      "Üç büyük bloğu yan yana koy.",
      "Birini diğerinin üstüne yerleştir.",
      "Sırayla birer blok ekleyip birlikte yıkın."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Küçük boncuk, bozuk para ve yutulabilir parçalar kullanma. Malzemeleri ağıza götürmeye karşı izle.",
    "easier": "İki blokla başla.",
    "harder": "Kule yerine köprü yapın."
  },
  {
    "id": "play-2-2",
    "name": "Kağıt yırtma atölyesi",
    "category": "İnce motor",
    "skill": "El kontrolü ve iki elin birlikte kullanımı",
    "materials": "Büyük kağıt ve geniş kutu",
    "prepMinutes": 2,
    "minutes": 8,
    "steps": [
      "Kağıdı iki elinle tutup yavaşça yırt.",
      "Çocuğuna büyük bir yaprak ver.",
      "Büyük parçaları kutuya koyarak toparlayın."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Küçük boncuk, bozuk para ve yutulabilir parçalar kullanma. Malzemeleri ağıza götürmeye karşı izle.",
    "easier": "Yırtmaya sen küçük bir başlangıç yap.",
    "harder": "Uzun şeritler oluşturmaya çalışın."
  },
  {
    "id": "play-2-3",
    "name": "Bez katlama",
    "category": "İnce motor",
    "skill": "El kontrolü ve iki elin birlikte kullanımı",
    "materials": "Büyük temiz bezler",
    "prepMinutes": 1,
    "minutes": 10,
    "steps": [
      "Bezi düz zemine ser.",
      "İki köşeyi birleştirerek katla.",
      "Çocuğunla birlikte katlayıp açın."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Küçük boncuk, bozuk para ve yutulabilir parçalar kullanma. Malzemeleri ağıza götürmeye karşı izle.",
    "easier": "Bir kenarı sen tut.",
    "harder": "İkinci kez katlayın."
  },
  {
    "id": "play-2-4",
    "name": "Sticker bahçesi",
    "category": "İnce motor",
    "skill": "El kontrolü ve iki elin birlikte kullanımı",
    "materials": "Büyük, yaşa uygun çıkartmalar",
    "prepMinutes": 2,
    "minutes": 7,
    "steps": [
      "Büyük çıkartmanın kenarını hafifçe kaldır.",
      "Çocuğundan kağıda yapıştırmasını iste.",
      "Birlikte bahçedeki şekilleri adlandırın."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Küçük boncuk, bozuk para ve yutulabilir parçalar kullanma. Malzemeleri ağıza götürmeye karşı izle.",
    "easier": "Çıkartmayı önceden tamamen ayır.",
    "harder": "Kağıtta iki geniş alana göre yerleştirsin."
  },
  {
    "id": "play-2-5",
    "name": "Kapak eşleştirme",
    "category": "İnce motor",
    "skill": "El kontrolü ve iki elin birlikte kullanımı",
    "materials": "Geniş plastik kaplar ve büyük kapaklar",
    "prepMinutes": 1,
    "minutes": 12,
    "steps": [
      "İki geniş kabı önüne koy.",
      "Kapakları birlikte deneyerek eşleştirin.",
      "Açma kapama sırasını çocuğuna bırak."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Küçük boncuk, bozuk para ve yutulabilir parçalar kullanma. Malzemeleri ağıza götürmeye karşı izle.",
    "easier": "Tek kapla başla.",
    "harder": "Farklı biçimli üç kap dene."
  },
  {
    "id": "play-2-6",
    "name": "Kalın fırçayla izler",
    "category": "İnce motor",
    "skill": "El kontrolü ve iki elin birlikte kullanımı",
    "materials": "Yıkanabilir boya, kalın fırça ve büyük kağıt",
    "prepMinutes": 2,
    "minutes": 10,
    "steps": [
      "Fırçayı az boya ile hazırla.",
      "Kağıtta uzun çizgiler ve büyük daireler yap.",
      "Çocuğunun izlerini anlatmasına fırsat ver."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Küçük boncuk, bozuk para ve yutulabilir parçalar kullanma. Malzemeleri ağıza götürmeye karşı izle.",
    "easier": "Sadece su ve koyu karton kullan.",
    "harder": "İki renkli geniş alanlar boyayın."
  },
  {
    "id": "play-3-1",
    "name": "Resimde ne var?",
    "category": "Dil ve iletişim",
    "skill": "Sözcük çeşitliliği ve karşılıklı konuşma",
    "materials": "Resimli çocuk kitabı",
    "prepMinutes": 1,
    "minutes": 5,
    "steps": [
      "Bir sayfayı birlikte aç.",
      "Gördüğün bir nesneyi gösterip adını söyle.",
      "Çocuğunun seçtiği nesne üzerine kısa sohbet et."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Doğru cevap baskısı yapma; çocuğun sözünü tamamlamasını bekle.",
    "easier": "İki belirgin resimle başla.",
    "harder": "Nesnenin ne yaptığını birlikte anlatın."
  },
  {
    "id": "play-3-2",
    "name": "Kukla merhaba diyor",
    "category": "Dil ve iletişim",
    "skill": "Sözcük çeşitliliği ve karşılıklı konuşma",
    "materials": "Büyük kumaş el kuklası",
    "prepMinutes": 2,
    "minutes": 8,
    "steps": [
      "Kuklayı çocuğa selam verdir.",
      "Adını ve ne sevdiğini sor.",
      "Kuklayı çocuğa ver, bu kez sen cevapla."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Doğru cevap baskısı yapma; çocuğun sözünü tamamlamasını bekle.",
    "easier": "Kukla yalnızca merhaba desin.",
    "harder": "Kuklalar arasında iki cümlelik konuşma kurun."
  },
  {
    "id": "play-3-3",
    "name": "Günün küçük hikayesi",
    "category": "Dil ve iletişim",
    "skill": "Sözcük çeşitliliği ve karşılıklı konuşma",
    "materials": "Malzeme gerekmez",
    "prepMinutes": 1,
    "minutes": 10,
    "steps": [
      "Bugün birlikte yaptığınız bir şeyi anlat.",
      "Sonra ne oldu diye açık bir soru sor.",
      "Çocuğun eklediği ayrıntıyı tekrarlayıp genişlet."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Doğru cevap baskısı yapma; çocuğun sözünü tamamlamasını bekle.",
    "easier": "Tek olay hakkında konuş.",
    "harder": "Önce ve sonra sözcüklerini ekle."
  },
  {
    "id": "play-3-4",
    "name": "Ses avı",
    "category": "Dil ve iletişim",
    "skill": "Sözcük çeşitliliği ve karşılıklı konuşma",
    "materials": "Evdeki tanıdık sesler",
    "prepMinutes": 2,
    "minutes": 7,
    "steps": [
      "Bir kağıdı hışırdat ve birlikte dinleyin.",
      "Sesin nereden geldiğini konuşun.",
      "Kapı tıklaması ve su sesi gibi güvenli sesleri dene."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Doğru cevap baskısı yapma; çocuğun sözünü tamamlamasını bekle.",
    "easier": "Kaynağı görünür tut.",
    "harder": "Sesi duyduktan sonra iki kaynaktan seçsin."
  },
  {
    "id": "play-3-5",
    "name": "Benim seçimim",
    "category": "Dil ve iletişim",
    "skill": "Sözcük çeşitliliği ve karşılıklı konuşma",
    "materials": "İki resimli kitap veya büyük oyuncak",
    "prepMinutes": 1,
    "minutes": 12,
    "steps": [
      "İki seçeneği göster.",
      "Hangisini istediğini söylemesi veya göstermesi için bekle.",
      "Seçimini cümleyle yansıt ve oyuna devam et."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Doğru cevap baskısı yapma; çocuğun sözünü tamamlamasını bekle.",
    "easier": "Tek sözcüklü yanıtı kabul et.",
    "harder": "Seçimini neden sevdiğini sor."
  },
  {
    "id": "play-3-6",
    "name": "Cümleyi birlikte büyüt",
    "category": "Dil ve iletişim",
    "skill": "Sözcük çeşitliliği ve karşılıklı konuşma",
    "materials": "Büyük oyuncak hayvan",
    "prepMinutes": 2,
    "minutes": 10,
    "steps": [
      "Hayvanın adını söyle.",
      "Çocuğun eklediği sesi veya sözcüğü dinle.",
      "Bir ayrıntı ekleyerek kısa bir cümle kur."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Doğru cevap baskısı yapma; çocuğun sözünü tamamlamasını bekle.",
    "easier": "Hayvanın sesiyle başla.",
    "harder": "Renk ve hareketi aynı cümleye ekle."
  },
  {
    "id": "play-4-1",
    "name": "Oyuncak nerede?",
    "category": "Dikkat ve problem çözme",
    "skill": "Eşleştirme, sıra ve basit çözüm üretme",
    "materials": "Büyük oyuncak ve bez",
    "prepMinutes": 1,
    "minutes": 5,
    "steps": [
      "Oyuncağı görünür biçimde bezle ört.",
      "Nerede olduğunu birlikte arayın.",
      "Çocuğun saklamasına izin ver ve sen bul."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Parçalar yaşa uygun ve büyük olmalı. Zorlandığında ipucu ver; test yapma.",
    "easier": "Oyuncağın bir kısmını açık bırak.",
    "harder": "İki bezden hangisinin altında olduğunu seçsin."
  },
  {
    "id": "play-4-2",
    "name": "Renk evleri",
    "category": "Dikkat ve problem çözme",
    "skill": "Eşleştirme, sıra ve basit çözüm üretme",
    "materials": "İki renk geniş kağıt ve büyük bloklar",
    "prepMinutes": 2,
    "minutes": 8,
    "steps": [
      "Kağıtları iki renk evi olarak yerleştir.",
      "Bir bloğu aynı renk kağıda koy.",
      "Kalan blokları sırayla eşleştirin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Parçalar yaşa uygun ve büyük olmalı. Zorlandığında ipucu ver; test yapma.",
    "easier": "Tek renkle başla.",
    "harder": "Üçüncü bir renk ekle."
  },
  {
    "id": "play-4-3",
    "name": "Basit puzzle zamanı",
    "category": "Dikkat ve problem çözme",
    "skill": "Eşleştirme, sıra ve basit çözüm üretme",
    "materials": "2–4 parçalı büyük çocuk yapbozu",
    "prepMinutes": 1,
    "minutes": 10,
    "steps": [
      "Parçaları resim yüzü yukarı yerleştir.",
      "İlk parçanın yerini birlikte bul.",
      "Çocuğun çözümünü bekle, gerektiğinde bir ipucu ver."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Parçalar yaşa uygun ve büyük olmalı. Zorlandığında ipucu ver; test yapma.",
    "easier": "İki parçayı önceden birleştir.",
    "harder": "Biraz daha fazla büyük parça kullan."
  },
  {
    "id": "play-4-4",
    "name": "Hangisi kayıp?",
    "category": "Dikkat ve problem çözme",
    "skill": "Eşleştirme, sıra ve basit çözüm üretme",
    "materials": "İki büyük oyuncak",
    "prepMinutes": 2,
    "minutes": 7,
    "steps": [
      "Oyuncakları adlandırıp göster.",
      "Birini arkana al.",
      "Kalan oyuncağa bakıp kaybolanı birlikte konuşun."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Parçalar yaşa uygun ve büyük olmalı. Zorlandığında ipucu ver; test yapma.",
    "easier": "Kaybolanı hemen göster.",
    "harder": "Üç oyuncakla deneyin."
  },
  {
    "id": "play-4-5",
    "name": "Büyük küçük sırası",
    "category": "Dikkat ve problem çözme",
    "skill": "Eşleştirme, sıra ve basit çözüm üretme",
    "materials": "Üç büyük, farklı boy kap",
    "prepMinutes": 1,
    "minutes": 12,
    "steps": [
      "Kapları yan yana koy.",
      "En büyük ve en küçüğü birlikte seç.",
      "İç içe koymayı veya yan yana sıralamayı deneyin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Parçalar yaşa uygun ve büyük olmalı. Zorlandığında ipucu ver; test yapma.",
    "easier": "İki kap kullan.",
    "harder": "Ortadaki boyu da yerleştirsin."
  },
  {
    "id": "play-4-6",
    "name": "Oyuncağı kurtar",
    "category": "Dikkat ve problem çözme",
    "skill": "Eşleştirme, sıra ve basit çözüm üretme",
    "materials": "Büyük oyuncak, açık karton kutu",
    "prepMinutes": 2,
    "minutes": 10,
    "steps": [
      "Oyuncağı geniş açık kutuya koy.",
      "Nasıl ulaşabileceğini birlikte düşünün.",
      "Kutuyu çevirme veya uzanma gibi güvenli bir çözüm dene."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Parçalar yaşa uygun ve büyük olmalı. Zorlandığında ipucu ver; test yapma.",
    "easier": "Kutuyu çocuğa yaklaştır.",
    "harder": "Kutunun yönünü değiştir; tırmanma ekleme."
  },
  {
    "id": "play-5-1",
    "name": "Ilık serin dokunuş",
    "category": "Duyusal oyunlar",
    "skill": "Dokunma, duyusal farkındalık ve keşif",
    "materials": "İki temiz bez ve su",
    "prepMinutes": 1,
    "minutes": 5,
    "steps": [
      "Bir bezi ılık, diğerini oda sıcaklığı suyla nemlendir.",
      "Elin üstüne hafifçe dokundur.",
      "Hangisinin nasıl hissettirdiğini konuşun."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Su oyununda sürekli kol mesafesinde yetişkin gözetimi sağla. Küçük kuru taneler veya kimyasal ürünler kullanma.",
    "easier": "Tek bezle başla.",
    "harder": "Gözler açıkken bezleri sırayla seçsin."
  },
  {
    "id": "play-5-2",
    "name": "Dokular kutusu",
    "category": "Duyusal oyunlar",
    "skill": "Dokunma, duyusal farkındalık ve keşif",
    "materials": "Büyük kumaş, sünger ve yumuşak fırça",
    "prepMinutes": 2,
    "minutes": 8,
    "steps": [
      "Malzemeleri geniş kutuya koy.",
      "Her birine sırayla dokunun.",
      "Yumuşak ve pürüzlü gibi sözcüklerle anlatın."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Su oyununda sürekli kol mesafesinde yetişkin gözetimi sağla. Küçük kuru taneler veya kimyasal ürünler kullanma.",
    "easier": "İki malzeme seç.",
    "harder": "Benzer dokuları yan yana koyun."
  },
  {
    "id": "play-5-3",
    "name": "Su taşıma",
    "category": "Duyusal oyunlar",
    "skill": "Dokunma, duyusal farkındalık ve keşif",
    "materials": "Sığ su tepsisi ve büyük plastik bardak",
    "prepMinutes": 1,
    "minutes": 10,
    "steps": [
      "Tepsiye az su koy; yetişkin sürekli yanında olsun.",
      "Bardağı doldurup diğer kaba aktar.",
      "Dökülen suyu birlikte bezle silin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Su oyununda sürekli kol mesafesinde yetişkin gözetimi sağla. Küçük kuru taneler veya kimyasal ürünler kullanma.",
    "easier": "Bardağı birlikte tutun.",
    "harder": "Daha genişten biraz daha dar kaba aktarın."
  },
  {
    "id": "play-5-4",
    "name": "Ev yapımı değil, güvenli hamur",
    "category": "Duyusal oyunlar",
    "skill": "Dokunma, duyusal farkındalık ve keşif",
    "materials": "Yaşa uygun toksik olmayan oyun hamuru",
    "prepMinutes": 2,
    "minutes": 7,
    "steps": [
      "Hamuru büyük bir parça olarak sun.",
      "Bastır, yuvarla ve yassılaştır.",
      "Çocuğun yaptığı şekli birlikte adlandırın."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Su oyununda sürekli kol mesafesinde yetişkin gözetimi sağla. Küçük kuru taneler veya kimyasal ürünler kullanma.",
    "easier": "Önceden yumuşat.",
    "harder": "İki büyük şekli birleştirin."
  },
  {
    "id": "play-5-5",
    "name": "Gölgem benimle",
    "category": "Duyusal oyunlar",
    "skill": "Dokunma, duyusal farkındalık ve keşif",
    "materials": "El feneri ve duvar",
    "prepMinutes": 1,
    "minutes": 12,
    "steps": [
      "Feneri duvara, gözlerden uzağa yönelt.",
      "Elinle büyük gölgeler oluştur.",
      "Çocuğun elini oynatarak gölgeyi değiştirmesini izle."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Su oyununda sürekli kol mesafesinde yetişkin gözetimi sağla. Küçük kuru taneler veya kimyasal ürünler kullanma.",
    "easier": "Sadece el gölgesi kullan.",
    "harder": "Büyük oyuncakların gölgesini deneyin."
  },
  {
    "id": "play-5-6",
    "name": "Koku sohbeti",
    "category": "Duyusal oyunlar",
    "skill": "Dokunma, duyusal farkındalık ve keşif",
    "materials": "Kapalı güvenli kapta limon veya kahve",
    "prepMinutes": 2,
    "minutes": 10,
    "steps": [
      "Malzemeyi yetişkin tutarak kısa mesafeden koklat.",
      "Hoşuna gidip gitmediğini sor.",
      "İki tanıdık kokuyu karşılaştırın; tatma isteme."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Su oyununda sürekli kol mesafesinde yetişkin gözetimi sağla. Küçük kuru taneler veya kimyasal ürünler kullanma.",
    "easier": "Tek, hafif koku seç.",
    "harder": "İki kokuyu isimleriyle eşleştirin."
  },
  {
    "id": "play-6-1",
    "name": "Oyuncak çay saati",
    "category": "Hayal gücü ve sembolik oyun",
    "skill": "Rol alma ve sembolik anlatım",
    "materials": "Büyük oyuncak bardaklar",
    "prepMinutes": 1,
    "minutes": 5,
    "steps": [
      "Oyuncaklara boş bardaklarla çay hazırlar gibi yapın.",
      "Sırayla ikram edin.",
      "Çocuğun çay saatine kendi fikrini eklemesini bekle."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Gerçek sıcak içecek, ilaç ve kesici eşya kullanma. Oyuncaklar iki yaş için uygun olmalı.",
    "easier": "İki bardakla başla.",
    "harder": "Oyuncak misafir ekle."
  },
  {
    "id": "play-6-2",
    "name": "Pelüşe iyi bak",
    "category": "Hayal gücü ve sembolik oyun",
    "skill": "Rol alma ve sembolik anlatım",
    "materials": "Büyük pelüş ve bez",
    "prepMinutes": 2,
    "minutes": 8,
    "steps": [
      "Pelüşün yorulduğunu söyle.",
      "Birlikte örtüp dinlenmesini sağlayın.",
      "Uyandığında nasıl hissettiğini konuşun."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Gerçek sıcak içecek, ilaç ve kesici eşya kullanma. Oyuncaklar iki yaş için uygun olmalı.",
    "easier": "Yalnızca örtme adımı yap.",
    "harder": "Pelüş için kısa bir bakım hikayesi oluştur."
  },
  {
    "id": "play-6-3",
    "name": "Oyuncak hastanesi",
    "category": "Hayal gücü ve sembolik oyun",
    "skill": "Rol alma ve sembolik anlatım",
    "materials": "Pelüş ve oyuncak stetoskop",
    "prepMinutes": 1,
    "minutes": 10,
    "steps": [
      "Pelüşü hastaneye misafir edin.",
      "Oyuncak araçla nazikçe dinleyin.",
      "Korkutmadan rahatlatıcı sözler söyleyin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Gerçek sıcak içecek, ilaç ve kesici eşya kullanma. Oyuncaklar iki yaş için uygun olmalı.",
    "easier": "Sadece sarılıp iyi bakın.",
    "harder": "Muayene ve dinlenme sırası kurun."
  },
  {
    "id": "play-6-4",
    "name": "Karton otobüs",
    "category": "Hayal gücü ve sembolik oyun",
    "skill": "Rol alma ve sembolik anlatım",
    "materials": "Zeminde geniş açık kutu",
    "prepMinutes": 2,
    "minutes": 7,
    "steps": [
      "Kutuyu otobüs olarak hayal edin.",
      "Oyuncakları yolcu yapıp duraklara götürün.",
      "Çocuğun durak adı seçmesini iste."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Gerçek sıcak içecek, ilaç ve kesici eşya kullanma. Oyuncaklar iki yaş için uygun olmalı.",
    "easier": "Kutunun dışında oyuncaklarla oynayın.",
    "harder": "İki farklı durak ekle."
  },
  {
    "id": "play-6-5",
    "name": "Minik market",
    "category": "Hayal gücü ve sembolik oyun",
    "skill": "Rol alma ve sembolik anlatım",
    "materials": "Büyük oyuncak yiyecekler ve sepet",
    "prepMinutes": 1,
    "minutes": 12,
    "steps": [
      "Yiyecekleri tezgah gibi zemine koy.",
      "Sırayla satıcı ve alıcı olun.",
      "Alınanları sepete koyup teşekkür edin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Gerçek sıcak içecek, ilaç ve kesici eşya kullanma. Oyuncaklar iki yaş için uygun olmalı.",
    "easier": "İki ürün sun.",
    "harder": "Alışveriş sırasını çocuğun planlasın."
  },
  {
    "id": "play-6-6",
    "name": "Tamirci rolü",
    "category": "Hayal gücü ve sembolik oyun",
    "skill": "Rol alma ve sembolik anlatım",
    "materials": "Büyük oyuncak aletler",
    "prepMinutes": 2,
    "minutes": 10,
    "steps": [
      "Oyuncak bir arabanın tamir gerektiğini söyle.",
      "Oyuncak aletlerle yardım eder gibi yapın.",
      "Bittiğinde arabayı birlikte deneyin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Gerçek sıcak içecek, ilaç ve kesici eşya kullanma. Oyuncaklar iki yaş için uygun olmalı.",
    "easier": "Tek oyuncak alet kullan.",
    "harder": "Sorunu ve çözümü kısa hikayeyle anlatın."
  },
  {
    "id": "play-7-1",
    "name": "Alkışımı taklit et",
    "category": "Müzik ve ritim",
    "skill": "İşitsel dikkat ve ritim paylaşımı",
    "materials": "Malzeme gerekmez",
    "prepMinutes": 1,
    "minutes": 5,
    "steps": [
      "Bir kez yumuşakça alkışla.",
      "Çocuğunun karşılık vermesini bekle.",
      "Bir ve iki alkışı sırayla deneyin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Sesi düşük tut. Kulak yakınına yüksek ses üretme; gevşek parçalı müzik aletleri kullanma.",
    "easier": "Tek alkışla kal.",
    "harder": "Alkış ve dize dokunmayı sırala."
  },
  {
    "id": "play-7-2",
    "name": "Şarkıyı durdur",
    "category": "Müzik ve ritim",
    "skill": "İşitsel dikkat ve ritim paylaşımı",
    "materials": "Sevilen kısa çocuk şarkısı",
    "prepMinutes": 2,
    "minutes": 8,
    "steps": [
      "Şarkıyı birlikte söyleyin.",
      "Tanıdık bir yerde kısa durakla.",
      "Çocuğun ses veya sözcükle devam etmesine alan aç."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Sesi düşük tut. Kulak yakınına yüksek ses üretme; gevşek parçalı müzik aletleri kullanma.",
    "easier": "Nakaratı kullan.",
    "harder": "Çocuğun duraklama yerini seçmesine izin ver."
  },
  {
    "id": "play-7-3",
    "name": "Yavaş ritim yürüyüşü",
    "category": "Müzik ve ritim",
    "skill": "İşitsel dikkat ve ritim paylaşımı",
    "materials": "Düşük sesli müzik",
    "prepMinutes": 1,
    "minutes": 10,
    "steps": [
      "Müzikle rahat tempoda yürüyün.",
      "Müziği durdurunca bekleyin.",
      "Yeniden başlatıp yürümeye devam edin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Sesi düşük tut. Kulak yakınına yüksek ses üretme; gevşek parçalı müzik aletleri kullanma.",
    "easier": "Sadece dur ve yürü yap.",
    "harder": "Adımlarla yumuşak alkış ekle."
  },
  {
    "id": "play-7-4",
    "name": "Bezlerle dans",
    "category": "Müzik ve ritim",
    "skill": "İşitsel dikkat ve ritim paylaşımı",
    "materials": "Büyük kısa kumaşlar",
    "prepMinutes": 2,
    "minutes": 7,
    "steps": [
      "Bezleri elde, boyna dolamadan tutun.",
      "Müzikle kolları yavaşça hareket ettirin.",
      "Birbirinizin seçtiği hareketi taklit edin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Sesi düşük tut. Kulak yakınına yüksek ses üretme; gevşek parçalı müzik aletleri kullanma.",
    "easier": "Oturarak dans edin.",
    "harder": "Bir aşağı bir yukarı hareket sırası kurun."
  },
  {
    "id": "play-7-5",
    "name": "Dizimde davul",
    "category": "Müzik ve ritim",
    "skill": "İşitsel dikkat ve ritim paylaşımı",
    "materials": "Malzeme gerekmez",
    "prepMinutes": 1,
    "minutes": 12,
    "steps": [
      "Dizlerine hafifçe iki kez dokun.",
      "Çocuğun kendi dizlerinde denesin.",
      "Ritmi sırayla birbirinize gösterin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Sesi düşük tut. Kulak yakınına yüksek ses üretme; gevşek parçalı müzik aletleri kullanma.",
    "easier": "Tek dokunuş kullan.",
    "harder": "İki farklı kısa ritim yapın."
  },
  {
    "id": "play-7-6",
    "name": "Sesimizle orkestra",
    "category": "Müzik ve ritim",
    "skill": "İşitsel dikkat ve ritim paylaşımı",
    "materials": "Malzeme gerekmez",
    "prepMinutes": 2,
    "minutes": 10,
    "steps": [
      "Yumuşak bir la sesi çıkar.",
      "Çocuğun seçtiği sesi taklit et.",
      "Sırayla iki kısa sesten bir şarkı oluşturun."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Sesi düşük tut. Kulak yakınına yüksek ses üretme; gevşek parçalı müzik aletleri kullanma.",
    "easier": "Tek sesi uzatmadan tekrarla.",
    "harder": "Ses ve alkışı birleştir."
  },
  {
    "id": "play-8-1",
    "name": "El ele tek ayak denemesi",
    "category": "Denge ve koordinasyon",
    "skill": "Denge kontrolü ve hareket planlama",
    "materials": "Sağlam destek alanı",
    "prepMinutes": 1,
    "minutes": 5,
    "steps": [
      "Elini destek olarak ver.",
      "Bir ayağını çok kısa kaldırarak göster.",
      "Çocuğun isteğine göre dene; dengesini kaybetmeden yere bas."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Kaymayan zeminde, yetişkin kol mesafesinde kal. Yüksek yüzey veya dönen platform kullanma.",
    "easier": "Ağırlığı bir ayağa kaydırmakla yetin.",
    "harder": "Desteği azaltmadan iki tarafı dene."
  },
  {
    "id": "play-8-2",
    "name": "Geniş adım taşları",
    "category": "Denge ve koordinasyon",
    "skill": "Denge kontrolü ve hareket planlama",
    "materials": "Zemine düz serilmiş büyük kağıtlar",
    "prepMinutes": 2,
    "minutes": 8,
    "steps": [
      "Kağıtları kaymayacak şekilde sabitle.",
      "Bir kağıttan diğerine adım atın.",
      "Sırayla renk seçerek ilerleyin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Kaymayan zeminde, yetişkin kol mesafesinde kal. Yüksek yüzey veya dönen platform kullanma.",
    "easier": "Kağıtları bitişik koy.",
    "harder": "Arayı çok az aç, atlama isteme."
  },
  {
    "id": "play-8-3",
    "name": "Baş üstü değil, el üstü taşı",
    "category": "Denge ve koordinasyon",
    "skill": "Denge kontrolü ve hareket planlama",
    "materials": "Büyük hafif yumuşak oyuncak",
    "prepMinutes": 1,
    "minutes": 10,
    "steps": [
      "Oyuncağı iki elinde tutarak yürü.",
      "Çocuğun yavaşça karşı tarafa taşısın.",
      "Oyuncağı bir sepete bırakıp geri dönsün."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Kaymayan zeminde, yetişkin kol mesafesinde kal. Yüksek yüzey veya dönen platform kullanma.",
    "easier": "Tek adımlık mesafe seç.",
    "harder": "Yolu hafifçe kıvrımlı yap."
  },
  {
    "id": "play-8-4",
    "name": "Tünelden yuvarla",
    "category": "Denge ve koordinasyon",
    "skill": "Denge kontrolü ve hareket planlama",
    "materials": "Geniş karton geçit ve büyük top",
    "prepMinutes": 2,
    "minutes": 7,
    "steps": [
      "Geçidi zemine sabitle.",
      "Topu içinden yuvarlayarak göster.",
      "Sırayla karşı taraftan yakalayın."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Kaymayan zeminde, yetişkin kol mesafesinde kal. Yüksek yüzey veya dönen platform kullanma.",
    "easier": "Geçidi geniş tut.",
    "harder": "Mesafeyi biraz artır."
  },
  {
    "id": "play-8-5",
    "name": "Yan adım oyunu",
    "category": "Denge ve koordinasyon",
    "skill": "Denge kontrolü ve hareket planlama",
    "materials": "Malzeme gerekmez",
    "prepMinutes": 1,
    "minutes": 12,
    "steps": [
      "El ele durun.",
      "Birlikte yana bir küçük adım atın.",
      "Diğer yöne dönüp aynı hareketi deneyin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Kaymayan zeminde, yetişkin kol mesafesinde kal. Yüksek yüzey veya dönen platform kullanma.",
    "easier": "Tek yana adımla başla.",
    "harder": "İki küçük yana adım yapın."
  },
  {
    "id": "play-8-6",
    "name": "Alçak engelin çevresinden",
    "category": "Denge ve koordinasyon",
    "skill": "Denge kontrolü ve hareket planlama",
    "materials": "Zeminde büyük minder",
    "prepMinutes": 2,
    "minutes": 10,
    "steps": [
      "Minderin çevresinde güvenli bir yol göster.",
      "Üzerine çıkmadan etrafında yürüyün.",
      "Yön değiştirip geri dönün."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Kaymayan zeminde, yetişkin kol mesafesinde kal. Yüksek yüzey veya dönen platform kullanma.",
    "easier": "Düz yoldan başlayın.",
    "harder": "İki minder çevresinde sekiz yolu yapın."
  },
  {
    "id": "play-9-1",
    "name": "Duygu yüzleri",
    "category": "Sosyal-duygusal etkileşim",
    "skill": "Duyguları adlandırma ve güvenli ilişki",
    "materials": "Ayna",
    "prepMinutes": 1,
    "minutes": 5,
    "steps": [
      "Aynada mutlu bir yüz yap.",
      "Çocuğun istediği bir yüzü birlikte deneyin.",
      "Yüzlerin nasıl hissettirdiğini kısa konuşun."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Duyguları iyi/kötü diye sınıflama. Çocuğun istemediği sarılma veya rolü zorunlu tutma.",
    "easier": "Tek duygu kullan.",
    "harder": "Bir hikayedeki duyguyla eşleştir."
  },
  {
    "id": "play-9-2",
    "name": "Sıra bende sıra sende",
    "category": "Sosyal-duygusal etkileşim",
    "skill": "Duyguları adlandırma ve güvenli ilişki",
    "materials": "Büyük top veya blok",
    "prepMinutes": 2,
    "minutes": 8,
    "steps": [
      "Oyuncağı kısa süre sen kullan.",
      "Şimdi senin sıran diyerek uzat.",
      "Birkaç değiş tokuştan sonra oyunu birlikte bitirin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Duyguları iyi/kötü diye sınıflama. Çocuğun istemediği sarılma veya rolü zorunlu tutma.",
    "easier": "Sıraları çok kısa tut.",
    "harder": "Sıra sözcüğünü çocuğun söylemesini bekle."
  },
  {
    "id": "play-9-3",
    "name": "Pelüşün duygusu",
    "category": "Sosyal-duygusal etkileşim",
    "skill": "Duyguları adlandırma ve güvenli ilişki",
    "materials": "Büyük pelüş",
    "prepMinutes": 1,
    "minutes": 10,
    "steps": [
      "Pelüşün oyuncağını bulamadığını anlat.",
      "Nasıl hissettiğini birlikte düşünün.",
      "Ona yardım etmek için bir yol seçin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Duyguları iyi/kötü diye sınıflama. Çocuğun istemediği sarılma veya rolü zorunlu tutma.",
    "easier": "Tek duyguya odaklan.",
    "harder": "İki farklı yardım seçeneği sun."
  },
  {
    "id": "play-9-4",
    "name": "Birlikte teşekkür",
    "category": "Sosyal-duygusal etkileşim",
    "skill": "Duyguları adlandırma ve güvenli ilişki",
    "materials": "Malzeme gerekmez",
    "prepMinutes": 2,
    "minutes": 7,
    "steps": [
      "Bugün çocuğunla hoşuna giden bir anı söyle.",
      "Ona teşekkür et.",
      "İsterse kendi sevdiği anı paylaşmasını bekle."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Duyguları iyi/kötü diye sınıflama. Çocuğun istemediği sarılma veya rolü zorunlu tutma.",
    "easier": "Somut bir oyun anı seç.",
    "harder": "İki farklı kişiye teşekkür düşünün."
  },
  {
    "id": "play-9-5",
    "name": "Sarılma mı el çak mı?",
    "category": "Sosyal-duygusal etkileşim",
    "skill": "Duyguları adlandırma ve güvenli ilişki",
    "materials": "Malzeme gerekmez",
    "prepMinutes": 1,
    "minutes": 12,
    "steps": [
      "İki yakınlık seçeneği sun.",
      "Çocuğun seçimine ve hayır yanıtına saygı duy.",
      "Seçtiği selamlaşmayı birlikte yapın."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Duyguları iyi/kötü diye sınıflama. Çocuğun istemediği sarılma veya rolü zorunlu tutma.",
    "easier": "Sadece el sallama sun.",
    "harder": "Yeni bir nazik selamlaşma icat edin."
  },
  {
    "id": "play-9-6",
    "name": "İşbirliğiyle toplama",
    "category": "Sosyal-duygusal etkileşim",
    "skill": "Duyguları adlandırma ve güvenli ilişki",
    "materials": "Büyük oyuncaklar ve kutu",
    "prepMinutes": 2,
    "minutes": 10,
    "steps": [
      "İki oyuncağı birlikte seçin.",
      "Birini sen, birini çocuk kutuya koysun.",
      "Bittiğinde ortak emeğinizi adlandırın."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Duyguları iyi/kötü diye sınıflama. Çocuğun istemediği sarılma veya rolü zorunlu tutma.",
    "easier": "Tek oyuncakla başla.",
    "harder": "Oyuncakları iki tür kutuya ayırın."
  },
  {
    "id": "play-10-1",
    "name": "Bulut sohbeti",
    "category": "Açık hava aktiviteleri",
    "skill": "Doğa merakı, hareket ve gözlem",
    "materials": "Güvenli açık alan",
    "prepMinutes": 1,
    "minutes": 5,
    "steps": [
      "Gölgelik bir yerde gökyüzüne bakın.",
      "Gördüğünüz bulutun biçimini anlatın.",
      "Çocuğun hayalini dinleyip kısa hikaye kurun."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Trafik, su kenarı ve yüksek yerlerden uzak kal. Toplanan nesneleri ağza götürme; güneş/hava koşullarına göre süreyi ayarla.",
    "easier": "Bir buluta odaklan.",
    "harder": "İki bulut arasında fark bulun."
  },
  {
    "id": "play-10-2",
    "name": "Renk yürüyüşü",
    "category": "Açık hava aktiviteleri",
    "skill": "Doğa merakı, hareket ve gözlem",
    "materials": "Güvenli kısa yürüyüş yolu",
    "prepMinutes": 2,
    "minutes": 8,
    "steps": [
      "Bir renk seçin.",
      "Yürürken o renkte büyük nesneleri gösterin.",
      "Çocuğun bulduklarını birlikte adlandırın."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Trafik, su kenarı ve yüksek yerlerden uzak kal. Toplanan nesneleri ağza götürme; güneş/hava koşullarına göre süreyi ayarla.",
    "easier": "Tek belirgin nesne seç.",
    "harder": "İkinci bir renk ekle."
  },
  {
    "id": "play-10-3",
    "name": "Ağaca merhaba",
    "category": "Açık hava aktiviteleri",
    "skill": "Doğa merakı, hareket ve gözlem",
    "materials": "Güvenli park alanı",
    "prepMinutes": 1,
    "minutes": 10,
    "steps": [
      "Bir ağacı uzaktan inceleyin.",
      "Gövde, yaprak ve dalları göster.",
      "Tırmanmadan ağaca merhaba deyip çevresinde yürüyün."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Trafik, su kenarı ve yüksek yerlerden uzak kal. Toplanan nesneleri ağza götürme; güneş/hava koşullarına göre süreyi ayarla.",
    "easier": "Gövdeyi gözlemleyin.",
    "harder": "İki ağacın yapraklarını uzaktan karşılaştırın."
  },
  {
    "id": "play-10-4",
    "name": "Kuşları dinle",
    "category": "Açık hava aktiviteleri",
    "skill": "Doğa merakı, hareket ve gözlem",
    "materials": "Sakin güvenli açık alan",
    "prepMinutes": 2,
    "minutes": 7,
    "steps": [
      "Bir an durup çevreyi dinleyin.",
      "Duyduğunuz kuş sesini göster veya anlat.",
      "Çocuğun sesi taklit etmesine eşlik edin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Trafik, su kenarı ve yüksek yerlerden uzak kal. Toplanan nesneleri ağza götürme; güneş/hava koşullarına göre süreyi ayarla.",
    "easier": "Tek sese odaklan.",
    "harder": "İki farklı çevre sesini ayırt edin."
  },
  {
    "id": "play-10-5",
    "name": "Gölgeyi izle",
    "category": "Açık hava aktiviteleri",
    "skill": "Doğa merakı, hareket ve gözlem",
    "materials": "Güvenli düz açık alan",
    "prepMinutes": 1,
    "minutes": 12,
    "steps": [
      "Gölgenizi zeminde gösterin.",
      "Elinizi oynatıp gölgenin değişmesini izleyin.",
      "Yan yana yürüyerek gölgelerinizi takip edin."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Trafik, su kenarı ve yüksek yerlerden uzak kal. Toplanan nesneleri ağza götürme; güneş/hava koşullarına göre süreyi ayarla.",
    "easier": "Sadece el sallayın.",
    "harder": "İki farklı duruş deneyin."
  },
  {
    "id": "play-10-6",
    "name": "Parkta küçük keşif",
    "category": "Açık hava aktiviteleri",
    "skill": "Doğa merakı, hareket ve gözlem",
    "materials": "Güvenli park ve büyük resim kartı",
    "prepMinutes": 2,
    "minutes": 10,
    "steps": [
      "Bir çiçek, bank veya ağaç seçin.",
      "Dokunmadan veya koparmadan birlikte bulun.",
      "Bulduğunuz şey hakkında bir cümle söyleyip dönün."
    ],
    "safety": "Yetişkin gözetimi sürekli olmalı. Çocuğun ilgisi azalırsa oyunu bitir. Trafik, su kenarı ve yüksek yerlerden uzak kal. Toplanan nesneleri ağza götürme; güneş/hava koşullarına göre süreyi ayarla.",
    "easier": "Tek hedef seç.",
    "harder": "İki hedefi sırayla bulun."
  }
];
export function selectActivity(library:Activity[],state:AppState,date:string):Activity {
 const history=state.events.filter(e=>e.type==='family').sort((a,b)=>b.at.localeCompare(a.at));
 const recent=new Set([...history.slice(0,7).map(e=>String(e.data.activityId)),...state.suggestedActivities.slice(-7)]);
 const categories=new Map<string,number>();
 for(const e of history.slice(0,20)){const a=library.find(a=>a.id===e.data.activityId);if(a)categories.set(a.category,(categories.get(a.category)??0)+1)}
 const hash=Array.from(date).reduce((a,c)=>a*31+c.charCodeAt(0),0)>>>0;
 const candidates=library.filter(a=>!recent.has(a.id));
 return (candidates.length?candidates:library).map((a,i)=>{const past=history.filter(e=>e.data.activityId===a.id);const liked=past.some(e=>e.data.feedback==='again'||e.data.feedback==='loved'),disliked=past.some(e=>e.data.feedback==='uninterested');return {a,score:(categories.get(a.category)??0)*10+(disliked?5:0)-(liked?2:0)+((i+hash)%library.length)/library.length}}).sort((a,b)=>a.score-b.score)[0].a;
}
