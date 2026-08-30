import http from "node:http"

const PORT = process.env.PORT || 3001

const BOT_HANDLERS = {
  "dungeon-rpg": (message, history) => {
    const lower = message.toLowerCase()
    if (lower.includes("ungu") || lower.includes("cahaya")) {
      return {
        content:
          "🔮 Kamu melangkah mendekati cahaya ungu. Sebuah **Rune Kuno** di dinding menyala benderang! Sesosok *Peri Roh Pelindung* menampakkan diri:\n\n> *\"Sebutkan tujuanmu, pengembara fana! Apakah kamu mencari ilmu terlarang atau emas?\"*",
        chips: [
          "Jawab: Mencari ilmu terlarang",
          "Jawab: Mencari jalan pulang",
          "Siapkan pedang untuk berjaga",
        ],
      }
    } else if (lower.includes("lumut") || lower.includes("basah") || lower.includes("berlumut")) {
      return {
        content:
          "🛡️ Lantai lorong berlumut terasa licin dan dingin. Di kejauhan terdengar dengkuran monster Orc yang tertidur di samping sebuah **peti harta karun besi berkarat**.",
        chips: [
          "Buka peti secara perlahan",
          "Sembunyi di balik pilar",
          "Nyalakan obor lebih terang",
        ],
      }
    } else if (lower.includes("ransel") || lower.includes("tas") || lower.includes("inventaris")) {
      return {
        content:
          "🎒 **Isi Ransel Petualangmu:**\n- 🗡️ 1x Belati Baja Valdorath\n- 🧪 1x Ramuan Penyembuh *(Heal +50 HP)*\n- 🪢 1x Tali Tambang 10m\n- 💰 15 Keping Emas Kuno\n\nLorong di depanmu masih menunggu keputusanmu!",
        chips: [
          "Masuk ke lorong ungu",
          "Masuk ke lorong berlumut",
          "Teguk ramuan penyembuh",
        ],
      }
    } else {
      return {
        content: `⚔️ Sebagai **Dungeon Master**, tindakanmu dicatat: *"${message}"*.\n\nLangkahmu menggetarkan batu labirin kuno dan membuka sebuah relung tersembunyi di dinding! Apa tindakan selanjutnya?`,
        chips: [
          "Periksa relung rahasia",
          "Maju dengan waspada",
          "Analisis simbol dinding",
        ],
      }
    }
  },

  "cyberpunk-noir": (message, history) => {
    const lower = message.toLowerCase()
    if (lower.includes("pindai") || lower.includes("chip") || lower.includes("scanner") || lower.includes("korban")) {
      return {
        content:
          "🔍 Scanner cybernetic-mu berbunyi nyaring. Chip memori korban sengaja dibakar dengan EMP berdaya rendah sesaat sebelum tewas.\n\nNamun partisi data cadangan memuat kode terenkripsi: **`PROJECT_EVE - SUB-LEVEL 4`**.",
        chips: [
          "Dekripsi data PROJECT_EVE",
          "Tanyakan PROJECT_EVE ke Android K-9",
          "Cari sumber EMP di penthouse",
        ],
      }
    } else if (lower.includes("interogasi") || lower.includes("android") || lower.includes("k-9")) {
      return {
        content:
          "🤖 Android K-9 menatapmu dengan iris optik berkedip kuning:\n\n> *\"Saya tidak melihat sosok penyerang, Detektif Vane. Protokol keamanan penthouse di-override dari jarak jauh via subnet internal pada pukul 23:14.\"*",
        chips: [
          "Lacak jejak subnet internal",
          "Uji apakah AI ini berbohong",
          "Minta log akses 24 jam terakhir",
        ],
      }
    } else {
      return {
        content: `🕵️‍♂️ Detektif Vane menindaklanjuti petunjuk: *"${message}"*.\n\nKamu menemukan puntung rokok ilegal beraroma vanila neon di ventilasi pendingin balkon lantai 80!`,
        chips: [
          "Kirim sampel ke lab forensik",
          "Kejar jejak ke balkon luar",
          "Interogasi security gedung",
        ],
      }
    }
  },

  "island-survival": (message, history) => {
    const lower = message.toLowerCase()
    if (lower.includes("kayu") || lower.includes("shelter") || lower.includes("tenda") || lower.includes("teduh")) {
      return {
        content:
          "🪵 Kamu berhasil mengumpulkan 8 dahan kayu kokoh dan dedaunan palem lebar. Sebuah tenda bivak darurat selesai dibangun di bawah tebing batu!\n\n*(Stamina -15, Proteksi Badai +80%)*",
        chips: [
          "Nyalakan api unggun di depan bivak",
          "Cari sumber makanan darurat",
          "Istirahat sejenak pulihkan stamina",
        ],
      }
    } else if (lower.includes("kelapa") || lower.includes("air") || lower.includes("makan") || lower.includes("minum")) {
      return {
        content:
          "🥥 Kamu memanjat pohon kelapa landai dan memetik 2 buah kelapa muda segar serta menemukan mata air jernih.\n\n*(Stamina +35, Rasa Lapar 0%)* Langit mulai gelap!",
        chips: [
          "Bangun tempat berteduh darurat",
          "Buat sinyal SOS di pasir pantai",
          "Eksplorasi ke dalam hutan",
        ],
      }
    } else {
      return {
        content: `🏝️ Aksi survival: *"${message}"*.\n\nAngin laut berhembus makin kencang membawa aroma hujan badai. Setiap tindakan sangat krusial sebelum malam tiba!`,
        chips: [
          "Cari perlindungan di gua karang",
          "Kumpulkan kayu bakar tambahan",
          "Periksa barang bawaan kapal karam",
        ],
      }
    }
  },

  "code-mentor": (message, history) => {
    const lower = message.toLowerCase()
    if (lower.includes("react") || lower.includes("typescript") || lower.includes("review")) {
      return {
        content:
          "### 💡 Rekomendasi Code Review & Best Practice\n\n1. **Type Safety**: Hindari `any`, gunakan discriminated unions dan strict type narrowing.\n2. **State Management**: Turunkan state sespesifik mungkin untuk mencegah unnecessary re-renders.\n3. **Custom Hooks**: Ekstrak business logic ke dalam domain-specific hooks.\n\nApakah kamu ingin saya meninjau snippet komponen tertentu?",
        chips: [
          "Beri contoh snippet refactoring",
          "Bagaimana optimasi re-render?",
          "Best practice custom hooks",
        ],
      }
    } else {
      return {
        content: `### 💻 Code Mentor Feedback\n\nTopik pembahasan: **${message}**\n\nMari kita bedah solusi terbaik dengan memperhatikan prinsip **SOLID**, **Clean Architecture**, dan **Performance Optimization**. Ada bagian spesifik yang ingin kamu eksplorasi?`,
        chips: [
          "Review kompleksitas Big-O",
          "Tips testing dengan Vitest",
          "Rekomendasi arsitektur database",
        ],
      }
    }
  },

  "trivia-duel": (message) => {
    const lower = (message || "").toLowerCase()
    
    // --- ROUND 1 CHOICES ---
    if (lower.includes("mars") || lower.includes("b.") || lower === "b") {
      return {
        content:
          "🎉 **TEPAT SEKALI! (+100 Poin | Total: 100 Poin)**\nJawabannya adalah **B. Mars** (warna merah berasal dari besi oksida/karat di permukaannya).\n\n---\n\n🔥 **Babak 2 (Sejarah & Komputer):**\n*Siapakah tokoh matematikawan yang memecahkan kode mesin enkripsi Enigma pada Perang Dunia II?*",
        chips: ["Alan Turing", "Charles Babbage", "Ada Lovelace", "John von Neumann"],
      }
    } else if (
      lower.includes("jupiter") ||
      lower.includes("venus") ||
      lower.includes("merkurius") ||
      lower.includes("a.") ||
      lower.includes("c.") ||
      lower.includes("d.") ||
      lower === "a" ||
      lower === "c" ||
      lower === "d"
    ) {
      return {
        content: `❌ **KURANG TEPAT!**\nKamu memilih: *"${message}"*. Jawaban yang benar adalah **B. Mars** (warna merah berasal dari besi oksida).\n\n---\n\n🔥 **Babak 2 (Sejarah & Komputer):**\n*Siapakah tokoh matematikawan yang memecahkan kode mesin enkripsi Enigma pada Perang Dunia II?*`,
        chips: ["Alan Turing", "Charles Babbage", "Ada Lovelace", "John von Neumann"],
      }
    }

    // --- ROUND 2 CHOICES ---
    if (lower.includes("turing") || lower.includes("alan")) {
      return {
        content:
          "🏆 **LUAR BIASA BENAR! (+100 Poin | Total: 200 Poin)**\n**Alan Turing** memimpin pemecahan kode Enigma di Bletchley Park menggunakan mesin elektromekanis Bombe!\n\n---\n\n🔥 **Babak 3 (Geografi Dunia):**\n*Danau terdalam di dunia yang menampung 20% cadangan air tawar permukaan bumi yang tak beku adalah?*",
        chips: ["Danau Baikal", "Danau Toba", "Danau Victoria", "Danau Superior"],
      }
    } else if (
      lower.includes("babbage") ||
      lower.includes("lovelace") ||
      lower.includes("neumann") ||
      lower.includes("charles") ||
      lower.includes("ada") ||
      lower.includes("john")
    ) {
      return {
        content: `❌ **KURANG TEPAT!**\nKamu memilih: *"${message}"*. Jawaban yang benar adalah **Alan Turing** (pemecah sandi Enigma pada Perang Dunia II).\n\n---\n\n🔥 **Babak 3 (Geografi Dunia):**\n*Danau terdalam di dunia yang menampung 20% cadangan air tawar permukaan bumi yang tak beku adalah?*`,
        chips: ["Danau Baikal", "Danau Toba", "Danau Victoria", "Danau Superior"],
      }
    }

    // --- ROUND 3 CHOICES ---
    if (lower.includes("baikal")) {
      return {
        content:
          "👑 **SEMPURNA! (+100 Poin | Total Skor Akhir: 300 Poin)**\n**Danau Baikal** di Siberia, Rusia memiliki kedalaman 1.642 meter.\n\n---\n\n🏁 **DUEL SELESAI!**\nSelamat, kamu berhasil menyelesaikan semua babak tantangan kuis dan meraih gelar **🏆 Grand Quiz Champion**!",
        chips: ["🔄 Main Lagi dari Babak 1", "📜 Lihat Peringkat", "🎮 Coba Bot Lain"],
      }
    } else if (lower.includes("toba") || lower.includes("victoria") || lower.includes("superior")) {
      return {
        content: `❌ **KURANG TEPAT!**\nKamu memilih: *"${message}"*. Danau terdalam di dunia adalah **Danau Baikal** (1.642 meter).\n\n---\n\n🏁 **DUEL SELESAI!**\nTerima kasih telah berpartisipasi dalam Trivia Duel Master!`,
        chips: ["🔄 Main Lagi dari Babak 1", "📜 Lihat Peringkat", "🎮 Coba Bot Lain"],
      }
    }

    // --- FALLBACK ---
    return {
      content: `Jawaban/respons tercatat: *"${message}"*.\n\nSilakan pilih jawaban atau mulai dari Babak 1:\n*Planet manakah di tata surya kita yang memiliki julukan Planet Merah?*`,
      chips: ["A. Venus", "B. Mars", "C. Jupiter", "D. Merkurius"],
    }
  },

  "security-sentinel": (message) => {
    const lower = (message || "").toLowerCase()
    // Simulated n8n IF condition
    const isCritical =
      lower.includes("ransomware") ||
      lower.includes("malware") ||
      lower.includes("kebocoran") ||
      lower.includes("api key") ||
      lower.includes("breach") ||
      lower.includes("darurat") ||
      lower.includes("serangan") ||
      lower.includes("critical")

    if (isCritical) {
      return {
        content: `🚨 **[PROTOKOL TANGGAP DARURAT SIBER TINGKAT 1 (CRITICAL)]**\n\nTerdeteksi indikasi insiden berisiko tinggi: *"${message}"*\n\n### ⚡ Langkah Mitigasi Segera (Containment):\n1. **Isolasi Host/Subnet**: Putuskan koneksi jaringan Ethernet/Wi-Fi mesin terdampak untuk mencegah penyebaran lateral.\n2. **Revoke & Rotate Kredensial**: Cabut seluruh JWT, OAuth tokens, dan API key aktif dari dashboard cloud.\n3. **Amankan Snapshot Memori & Log**: Lakukan dump log firewall dan memory snapshot sebelum mematikan mesin.\n4. **Laporkan ke Tim CSIRT**: Koordinasikan insiden dengan tim tanggap darurat internal.`,
        chips: [
          "🛡️ Langkah Isolasi Server VM",
          "🔑 Cara Rotasi Emergency API Key",
          "📊 Template Laporan Insiden CSIRT",
          "🔄 Verifikasi Ulang Host Terinfeksi",
        ],
      }
    } else {
      return {
        content: `🛡️ **[REKOMENDASI AUDIT & HARDENING SISTEM]**\n\nTopik audit: *"${message}"*\n\n### 📋 Best Practice Pencegahan (Prevention Baseline):\n1. **Prinsip Least Privilege**: Batasi hak akses IAM ke izin minimal yang dibutuhkan untuk operasional.\n2. **Enforce Multi-Factor Authentication (MFA)**: Wajibkan FIDO2/WebAuthn atau Authenticator app untuk semua akses SSH/Cloud.\n3. **Automated Vulnerability Scan**: Jadwalkan scanning berkala terhadap image container dan dependensi npm/pip.\n4. **TLS & Security Headers**: Pastikan sertifikat SSL/TLS valid serta aktifkan header \`HSTS\`, \`CSP\`, dan \`X-Content-Type-Options\`.`,
        chips: [
          "🔒 Checklist Audit Keamanan Cloud",
          "🔑 Rekomendasi Kebijakan Password & 2FA",
          "🚨 Laporkan Insiden Darurat",
          "🌐 Rekomendasi Konfigurasi Firewall/WAF",
        ],
      }
    }
  },

  "inventory-tracker": (message) => {
    const lower = (message || "").toLowerCase()

    // Simulated n8n Data Table query
    const DATA_TABLE_PRODUCTS = [
      {
        keyword: "4090",
        name: "ASUS ROG Strix GeForce RTX 4090 24GB Gaming OC",
        sku: "GPU-NV-4090-ROG",
        price: "Rp 32.499.000",
        stock: 4,
        warranty: "3 Tahun Resmi ASUS Indonesia",
      },
      {
        keyword: "macbook",
        name: "Apple MacBook Pro 16\" (M3 Max, 36GB RAM, 1TB SSD)",
        sku: "LAP-APL-MBP16-M3M",
        price: "58.999.000",
        stock: 7,
        warranty: "1 Tahun Resmi iBox / Apple",
      },
      {
        keyword: "keyboard",
        name: "Keychron Q1 Pro Wireless Custom Mechanical Keyboard",
        sku: "ACC-KCH-Q1PRO-RD",
        price: "Rp 3.150.000",
        stock: 12,
        warranty: "1 Tahun Resmi Keychron Indonesia",
      },
    ]

    const DATA_TABLE_ORDERS = [
      {
        keyword: "88219",
        orderId: "NEX-88219",
        recipient: "Rian Satria",
        destination: "Jakarta Selatan",
        courier: "J&T Express Cargo (No Resi: JT9821731102)",
        status: "🚛 Sedang Dalam Perjalanan ke Hub Transit Kuningan",
        eta: "Hari Ini, Pukul 15:00 - 17:00 WIB",
      },
      {
        keyword: "90432",
        orderId: "NEX-90432",
        recipient: "Jessica Amanda",
        destination: "Surabaya Timur",
        courier: "SiCepat BEST (No Resi: 00412891238)",
        status: "📦 Paket Telah Diterima oleh Yang Bersangkutan",
        eta: "Tiba Kemarin, 14:32 WIB",
      },
    ]

    // 1. Check Product Table
    const matchedProduct = DATA_TABLE_PRODUCTS.find((p) => lower.includes(p.keyword))
    if (matchedProduct) {
      return {
        content: `📦 **[HASIL QUERY N8N DATA TABLE: KATALOG PRODUK]**\n\n- **Nama Produk:** **${matchedProduct.name}**\n- **SKU:** \`${matchedProduct.sku}\`\n- **Harga:** **${matchedProduct.price}**\n- **Ketersediaan:** 🟢 Ready Stock (**${matchedProduct.stock} unit** di Warehouse Pusat Jakarta)\n- **Garansi:** ${matchedProduct.warranty}`,
        chips: [
          "🛒 Buat Link Checkout Instan",
          "🔍 Cek Stok MacBook Pro M3",
          "🚚 Cek Resi Pesanan NEX-88219",
          "📋 Tanya Spesifikasi Komponen",
        ],
      }
    }

    // 2. Check Order Table
    const matchedOrder = DATA_TABLE_ORDERS.find((o) => lower.includes(o.keyword))
    if (matchedOrder) {
      return {
        content: `🚚 **[HASIL QUERY N8N DATA TABLE: RESI PENGIRIMAN]**\n\n- **No. Pesanan:** \`${matchedOrder.orderId}\`\n- **Penerima:** **${matchedOrder.recipient}** (${matchedOrder.destination})\n- **Ekspedisi:** ${matchedOrder.courier}\n- **Status Terkini:** ${matchedOrder.status}\n- **Estimasi Tiba:** ⏱️ **${matchedOrder.eta}**`,
        chips: [
          "📍 Lacak Posisi GPS Kurir",
          "📞 Hubungi Customer Support",
          "🔍 Cek Stok RTX 4090",
          "📦 Cek Resi NEX-90432",
        ],
      }
    }

    // Fallback
    return {
      content: `🔍 **Pencarian Data Table**: *"${message}"*\n\nData tidak ditemukan dalam tabel aktif. Silakan pilih SKU produk atau nomor resi contoh berikut untuk mencoba query n8n Data Table:`,
      chips: [
        '🔎 Cek Stok "RTX 4090 Gaming OC"',
        '🔎 Cek Stok "MacBook Pro M3 Max"',
        '🚚 Cek Resi "NEX-88219"',
        '📦 Cek Resi "NEX-90432"',
      ],
    }
  },

  "quran-tafsir": async (message) => {
    const raw = (message || "").trim()
    const lower = raw.toLowerCase()

    // Surah lookup table (common names to numbers)
    const SURAH_MAP = {
      "al-fatihah": 1, "fatihah": 1, "al fatihah": 1,
      "al-baqarah": 2, "baqarah": 2, "al baqarah": 2,
      "ali 'imran": 3, "ali imran": 3, "imran": 3,
      "an-nisa": 4, "nisa": 4, "an nisa": 4,
      "al-maidah": 5, "maidah": 5, "al maidah": 5,
      "al-an'am": 6, "anam": 6, "al anam": 6,
      "al-a'raf": 7, "araf": 7, "al araf": 7,
      "al-anfal": 8, "anfal": 8,
      "at-taubah": 9, "taubah": 9, "at taubah": 9,
      "yunus": 10,
      "hud": 11,
      "yusuf": 12,
      "ar-ra'd": 13, "rad": 13,
      "ibrahim": 14,
      "al-hijr": 15, "hijr": 15,
      "an-nahl": 16, "nahl": 16,
      "al-isra": 17, "isra": 17, "al isra": 17,
      "al-kahf": 18, "kahfi": 18, "kahf": 18, "al kahfi": 18, "al kahf": 18,
      "maryam": 19,
      "taha": 20, "ta-ha": 20,
      "al-anbiya": 21, "anbiya": 21,
      "al-hajj": 22, "hajj": 22,
      "al-mu'minun": 23, "muminun": 23,
      "an-nur": 24, "nur": 24,
      "al-furqan": 25, "furqan": 25,
      "asy-syu'ara": 26, "syuara": 26,
      "an-naml": 27, "naml": 27,
      "al-qasas": 28, "qasas": 28,
      "al-ankabut": 29, "ankabut": 29,
      "ar-rum": 30, "rum": 30,
      "luqman": 31,
      "as-sajdah": 32, "sajdah": 32,
      "al-ahzab": 33, "ahzab": 33,
      "saba": 34,
      "fatir": 35,
      "ya-sin": 36, "yasin": 36, "ya sin": 36,
      "as-saffat": 37, "saffat": 37,
      "sad": 38,
      "az-zumar": 39, "zumar": 39,
      "gafir": 40, "ghafir": 40,
      "fussilat": 41,
      "asy-syura": 42, "syura": 42,
      "az-zukhruf": 43, "zukhruf": 43,
      "ad-dukhan": 44, "dukhan": 44,
      "al-jasiyah": 45, "jasiyah": 45,
      "al-ahqaf": 46, "ahqaf": 46,
      "muhammad": 47,
      "al-fath": 48, "fath": 48,
      "al-hujurat": 49, "hujurat": 49,
      "qaf": 50,
      "az-zariyat": 51, "zariyat": 51,
      "at-tur": 52, "tur": 52,
      "an-najm": 53, "najm": 53,
      "al-qamar": 54, "qamar": 54,
      "ar-rahman": 55, "rahman": 55, "ar rahman": 55,
      "al-waqi'ah": 56, "waqiah": 56, "al waqiah": 56,
      "al-hadid": 57, "hadid": 57,
      "al-mujadilah": 58, "mujadilah": 58,
      "al-hasyr": 59, "hasyr": 59,
      "al-mumtahanah": 60,
      "as-saff": 61, "saff": 61,
      "al-jumu'ah": 62, "jumatan": 62, "jumuah": 62, "al jumuah": 62,
      "al-munafiqun": 63, "munafiqun": 63,
      "at-tagabun": 64, "taghabun": 64,
      "at-talaq": 65, "talaq": 65,
      "at-tahrim": 66, "tahrim": 66,
      "al-mulk": 67, "mulk": 67, "al mulk": 67, "tabarak": 67,
      "al-qalam": 68, "qalam": 68,
      "al-haqqah": 69, "haqqah": 69,
      "al-ma'arij": 70, "maarij": 70,
      "nuh": 71,
      "al-jinn": 72, "jin": 72, "jinn": 72,
      "al-muzzammil": 73, "muzzammil": 73,
      "al-muddassir": 74, "muddatsir": 74,
      "al-qiyamah": 75, "qiyamah": 75,
      "al-insan": 76, "insan": 76,
      "al-mursalat": 77, "mursalat": 77,
      "an-naba": 78, "naba": 78, "amma": 78,
      "an-nazi'at": 79, "naziat": 79,
      "abasa": 80, "'abasa": 80,
      "at-takwir": 81, "takwir": 81,
      "al-infitar": 82, "infitar": 82,
      "al-mutaffifin": 83, "muthaffifin": 83,
      "al-insyiqaq": 84, "insyiqaq": 84,
      "al-buruj": 85, "buruj": 85,
      "at-tariq": 86, "tariq": 86,
      "al-a'la": 87, "ala": 87, "al ala": 87,
      "al-gasyiyah": 88, "ghasyiyah": 88,
      "al-fajr": 89, "fajr": 89,
      "al-balad": 90, "balad": 90,
      "asy-syams": 91, "syams": 91,
      "al-lail": 92, "lail": 92,
      "ad-duha": 93, "dhuha": 93, "ad dhuha": 93,
      "asy-syarh": 94, "al-insyirah": 94, "insyirah": 94, "alam nasyrah": 94,
      "at-tin": 95, "tin": 95, "at tin": 95,
      "al-'alaq": 96, "alaq": 96, "al alaq": 96, "iqra": 96,
      "al-qadr": 97, "qadr": 97, "lailatul qadr": 97,
      "al-bayyinah": 98, "bayyinah": 98,
      "az-zalzalah": 99, "zalzalah": 99, "zilzal": 99,
      "al-'adiyat": 100, "adiyat": 100,
      "al-qari'ah": 101, "qariah": 101,
      "at-takasur": 102, "takatsur": 102,
      "al-'asr": 103, "asr": 103, "al ashr": 103, "wal ashr": 103,
      "al-humazah": 104, "humazah": 104,
      "al-fil": 105, "fil": 105, "al fiil": 105,
      "quraisy": 106,
      "al-ma'un": 107, "maun": 107,
      "al-kausar": 108, "kautsar": 108, "al kautsar": 108,
      "al-kafirun": 109, "kafirun": 109, "al kafirun": 109,
      "an-nasr": 110, "nasr": 110, "an nashr": 110,
      "al-lahab": 111, "lahab": 111, "al lahab": 111, "al-masad": 111,
      "al-ikhlas": 112, "ikhlas": 112, "al ikhlas": 112, "qulhu": 112,
      "al-falaq": 113, "falaq": 113, "al falaq": 113,
      "an-nas": 114, "nas": 114, "an nas": 114,
    }

    // Check if user specifically requested tafsir
    const isTafsirReq = lower.includes("tafsir")

    // Find surah number from regex (e.g., "surat 36", "surah 18", "nomor 1", or exact number)
    let surahNumber = null
    const numMatch = lower.match(/(?:surat|surah|nomor|no\.?)\s*(\d{1,3})/i) || lower.match(/\b([1-9]|[1-9]\d|10\d|11[0-4])\b/)
    if (numMatch) {
      const parsed = parseInt(numMatch[1], 10)
      if (parsed >= 1 && parsed <= 114) {
        surahNumber = parsed
      }
    }

    // If not found by number, match surah name
    if (!surahNumber) {
      for (const [name, num] of Object.entries(SURAH_MAP)) {
        if (lower.includes(name)) {
          surahNumber = num
          break
        }
      }
    }

    // Default to Al-Fatihah (1) if general greeting or no specific surah identified
    if (!surahNumber) {
      surahNumber = 1
    }

    try {
      if (isTafsirReq) {
        // Fetch Tafsir endpoint
        const res = await fetch(`https://equran.id/api/v2/tafsir/${surahNumber}`)
        const json = await res.json()
        const data = json.data

        const sampleAyatTafsir = (data.tafsir || []).slice(0, 3)
        let tafsirContent = `📜 **Tafsir Kemenag RI: QS. ${data.namaLatin} (${data.nomor}) - ${data.nama}**\n\n`
        tafsirContent += `*Arti:* "${data.arti}" | *Golongan:* Surat ${data.tempatTurun} (${data.jumlahAyat} Ayat)\n\n`
        tafsirContent += `> **Deskripsi Surat:**\n> ${(data.deskripsi || "").replace(/<[^>]+>/g, "")}\n\n---\n\n`
        tafsirContent += `### 📖 Ulasan Tafsir Beberapa Ayat:\n\n`

        for (const t of sampleAyatTafsir) {
          const cleanText = t.teks.length > 280 ? t.teks.substring(0, 280) + "..." : t.teks
          tafsirContent += `**Ayat ke-${t.ayat}:**\n${cleanText}\n\n`
        }

        return {
          content: tafsirContent,
          chips: [
            `📖 Baca Teks & Audio QS. ${data.namaLatin}`,
            "✨ Surat Al-Kahf (18)",
            "🌟 Surat Ya-Sin (36)",
            "👑 Surat Al-Mulk (67)",
            "📜 Tafsir Surat Al-Ikhlas (112)",
          ],
        }
      } else {
        // Fetch Surah endpoint
        const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`)
        const json = await res.json()
        const data = json.data

        const audioUrl = data.audioFull ? Object.values(data.audioFull)[0] : ""
        const cleanDesc = (data.deskripsi || "").replace(/<[^>]+>/g, "")
        
        let surahContent = `📖 **QS. ${data.namaLatin} (${data.nomor}) - ${data.nama}**\n\n`
        surahContent += `*Arti:* **"${data.arti}"** | *Tempat Turun:* **${data.tempatTurun}** | *Jumlah Ayat:* **${data.jumlahAyat} Ayat**\n\n`
        if (cleanDesc) {
          surahContent += `> ${cleanDesc.length > 200 ? cleanDesc.substring(0, 200) + "..." : cleanDesc}\n\n`
        }
        surahContent += `---\n\n### 📜 Cuplikan Ayat:\n\n`

        const displayAyat = (data.ayat || []).slice(0, data.jumlahAyat <= 7 ? data.jumlahAyat : 4)
        for (const a of displayAyat) {
          surahContent += `**[Ayat ${a.nomorAyat}]**\n`
          surahContent += `> ### ${a.teksArab}\n`
          surahContent += `*${a.teksLatin}*\n\n`
          surahContent += `**Artinya:** "${a.teksIndonesia}"\n\n`
        }

        if (data.jumlahAyat > displayAyat.length) {
          surahContent += `*(Menampilkan ${displayAyat.length} dari total ${data.jumlahAyat} ayat QS. ${data.namaLatin})*\n\n`
        }

        if (audioUrl) {
          surahContent += `🔊 **Audio Murottal Full:** [Dengarkan Tilawah Syaikh Abdullah Al-Juhany](${audioUrl})\n`
        }

        const nextSurahNum = surahNumber < 114 ? surahNumber + 1 : 1
        return {
          content: surahContent,
          chips: [
            `📜 Baca Tafsir QS. ${data.namaLatin}`,
            `⏩ Lanjut Surat Berikutnya (${nextSurahNum})`,
            "✨ Baca Surat Al-Kahf (18)",
            "🌟 Baca Surat Ya-Sin (36)",
            "👑 Baca Surat Al-Mulk (67)",
          ],
        }
      }
    } catch (err) {
      return {
        content: `📖 **Nur Al-Quran Explorer**\n\nPencarian surat: *"${message}"*.\n\nSilakan pilih surat pilihan berikut untuk membaca ayat, audio, dan tafsirnya:`,
        chips: [
          "📖 Baca Surat Al-Fatihah (1)",
          "✨ Baca Surat Al-Kahf (18)",
          "🌟 Baca Surat Ya-Sin (36)",
          "👑 Baca Surat Al-Mulk (67)",
          "📜 Tafsir Surat Al-Ikhlas (112)",
        ],
      }
    }
  },

  "doa-dzikir": async (message) => {
    const raw = (message || "").trim()
    const lower = raw.toLowerCase()

    try {
      const res = await fetch("https://equran.id/api/doa")
      const json = await res.json()
      const list = json.data || []

      // Keyword matching
      let matched = []
      if (lower.includes("tidur")) {
        matched = list.filter((d) => d.nama.toLowerCase().includes("tidur") || d.grup.toLowerCase().includes("tidur"))
      } else if (lower.includes("pagi") || lower.includes("petang") || lower.includes("sore")) {
        matched = list.filter((d) => d.nama.toLowerCase().includes("pagi") || d.grup.toLowerCase().includes("pagi") || d.nama.toLowerCase().includes("petang"))
      } else if (lower.includes("kendaraan") || lower.includes("bepergian") || lower.includes("safar") || lower.includes("jalan")) {
        matched = list.filter((d) => d.nama.toLowerCase().includes("kendaraan") || d.nama.toLowerCase().includes("bepergian") || d.grup.toLowerCase().includes("kendaraan"))
      } else if (lower.includes("makan") || lower.includes("minum")) {
        matched = list.filter((d) => d.nama.toLowerCase().includes("makan") || d.grup.toLowerCase().includes("makan"))
      } else if (lower.includes("rumah") || lower.includes("masuk") || lower.includes("keluar")) {
        matched = list.filter((d) => d.nama.toLowerCase().includes("rumah") || d.grup.toLowerCase().includes("rumah"))
      } else if (lower.includes("masjid")) {
        matched = list.filter((d) => d.nama.toLowerCase().includes("masjid") || d.grup.toLowerCase().includes("masjid"))
      } else if (lower.includes("sholat") || lower.includes("shalat") || lower.includes("wudhu")) {
        matched = list.filter((d) => d.nama.toLowerCase().includes("sholat") || d.nama.toLowerCase().includes("wudhu") || d.grup.toLowerCase().includes("sholat"))
      } else if (lower.includes("dunia") || lower.includes("akhirat") || lower.includes("sapu jagad") || lower.includes("kebaikan")) {
        matched = list.filter((d) => d.nama.toLowerCase().includes("kebaikan") || d.nama.toLowerCase().includes("dunia") || d.idn.toLowerCase().includes("dunia"))
      } else if (lower.includes("sakit") || lower.includes("sembuh") || lower.includes("obat")) {
        matched = list.filter((d) => d.nama.toLowerCase().includes("sakit") || d.grup.toLowerCase().includes("sakit") || d.idn.toLowerCase().includes("sembuh"))
      } else if (lower.includes("orang tua") || lower.includes("ibu") || lower.includes("ayah")) {
        matched = list.filter((d) => d.nama.toLowerCase().includes("orang tua") || d.idn.toLowerCase().includes("orang tua"))
      } else {
        // Generic search by matching words in nama, grup, or idn
        matched = list.filter((d) => 
          d.nama.toLowerCase().includes(lower) || 
          d.grup.toLowerCase().includes(lower) ||
          d.idn.toLowerCase().includes(lower)
        )
      }

      if (matched.length === 0) {
        matched = [list[0]] // Fallback to first doa
      }

      const doa = matched[0]
      let content = `🤲 **${doa.nama}**\n`
      content += `📂 *Kategori: ${doa.grup}*\n\n`
      content += `> ### ${doa.ar}\n\n`
      if (doa.tr) {
        content += `*Transliterasi:*\n**"${doa.tr}"**\n\n`
      }
      content += `*Artinya:*\n> "${doa.idn}"\n\n`
      if (doa.tentang) {
        content += `📚 *Keterangan / Faedah:* ${doa.tentang}\n`
      }

      // Generate context-aware chips
      const chips = [
        "🌅 Dzikir Pagi & Petang",
        "🛌 Doa Sebelum & Bangun Tidur",
        "🚗 Doa Naik Kendaraan & Safar",
        "🤲 Doa Kebaikan Dunia Akhirat",
        "🏠 Doa Masuk & Keluar Rumah",
      ]

      return {
        content,
        chips,
      }
    } catch (err) {
      return {
        content: `🤲 **Al-Ma'tsurat & Doa Harian**\n\nPencarian doa: *"${message}"*.\n\nSilakan pilih salah satu kategori doa pilihan:`,
        chips: [
          "🌅 Dzikir Pagi & Petang",
          "🛌 Doa Sebelum & Bangun Tidur",
          "🚗 Doa Naik Kendaraan",
          "🤲 Doa Sapu Jagad Dunia Akhirat",
        ],
      }
    }
  },

  "jadwal-shalat": async (message) => {
    const raw = (message || "").trim()
    const lower = raw.toLowerCase()

    // Supported major cities mapping
    const CITY_MAP = [
      { city: "Kota Jakarta", prov: "DKI Jakarta", keywords: ["jakarta", "dki", "jaksel", "jakbar", "jakpus", "jaktim", "jakut"] },
      { city: "Kota Bandung", prov: "Jawa Barat", keywords: ["bandung", "jabar"] },
      { city: "Kota Bogor", prov: "Jawa Barat", keywords: ["bogor"] },
      { city: "Kota Bekasi", prov: "Jawa Barat", keywords: ["bekasi"] },
      { city: "Kota Depok", prov: "Jawa Barat", keywords: ["depok"] },
      { city: "Kota Tangerang", prov: "Banten", keywords: ["tangerang", "tangsel", "banten"] },
      { city: "Kota Surabaya", prov: "Jawa Timur", keywords: ["surabaya", "jatim"] },
      { city: "Kota Malang", prov: "Jawa Timur", keywords: ["malang"] },
      { city: "Kota Semarang", prov: "Jawa Tengah", keywords: ["semarang", "jateng"] },
      { city: "Kota Surakarta", prov: "Jawa Tengah", keywords: ["solo", "surakarta"] },
      { city: "Kota Yogyakarta", prov: "DI Yogyakarta", keywords: ["jogja", "yogyakarta", "yogya", "diy"] },
      { city: "Kota Medan", prov: "Sumatera Utara", keywords: ["medan", "sumut"] },
      { city: "Kota Padang", prov: "Sumatera Barat", keywords: ["padang", "sumbar"] },
      { city: "Kota Palembang", prov: "Sumatera Selatan", keywords: ["palembang", "sumsel"] },
      { city: "Kota Pekanbaru", prov: "Riau", keywords: ["pekanbaru", "riau"] },
      { city: "Kota Bandar Lampung", prov: "Lampung", keywords: ["lampung"] },
      { city: "Kota Denpasar", prov: "Bali", keywords: ["bali", "denpasar"] },
      { city: "Kota Makassar", prov: "Sulawesi Selatan", keywords: ["makassar", "sulsel", "ujung pandang"] },
      { city: "Kota Manado", prov: "Sulawesi Utara", keywords: ["manado", "sulut"] },
      { city: "Kota Banjarmasin", prov: "Kalimantan Selatan", keywords: ["banjarmasin", "kalsel"] },
      { city: "Kota Balikpapan", prov: "Kalimantan Timur", keywords: ["balikpapan", "kaltim", "samarinda"] },
      { city: "Kota Pontianak", prov: "Kalimantan Barat", keywords: ["pontianak", "kalbar"] },
      { city: "Kota Banda Aceh", prov: "Aceh", keywords: ["aceh", "banda aceh"] },
      { city: "Kota Mataram", prov: "Nusa Tenggara Barat", keywords: ["lombok", "mataram", "ntb"] },
      { city: "Kota Jayapura", prov: "Papua", keywords: ["jayapura", "papua"] },
    ]

    let selected = CITY_MAP.find((entry) =>
      entry.keywords.some((kw) => lower.includes(kw))
    )

    if (!selected) {
      selected = CITY_MAP[0] // Default to Kota Jakarta
    }

    const today = new Date()
    const currentMonth = today.getMonth() + 1
    const currentYear = today.getFullYear()
    const currentDate = today.getDate()

    try {
      const res = await fetch("https://equran.id/api/v2/shalat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provinsi: selected.prov,
          kabkota: selected.city,
          bulan: currentMonth,
          tahun: currentYear,
        }),
      })

      const json = await res.json()
      const data = json.data || {}
      const jadwalList = data.jadwal || []

      // Find today's schedule
      const todayJadwal = jadwalList.find((j) => j.tanggal === currentDate) || jadwalList[0] || {}

      let content = `🕌 **Jadwal Shalat Hari Ini - ${selected.city}**\n`
      content += `📍 *Provinsi: ${selected.prov}* | 📅 *${todayJadwal.hari || "Hari Ini"}, ${todayJadwal.tanggal_lengkap || `${currentYear}-${currentMonth}-${currentDate}`}*\n\n`
      content += `| Waktu Shalat | Jam (Waktu Lokal) |\n`
      content += `| :--- | :--- |\n`
      content += `| 🌌 **Imsak** | \`${todayJadwal.imsak || "04:35"}\` |\n`
      content += `| 🌅 **Subuh** | \`${todayJadwal.subuh || "04:45"}\` |\n`
      content += `| ☀️ **Terbit (Syuruq)** | \`${todayJadwal.terbit || "06:00"}\` |\n`
      content += `| 🌤️ **Dhuha** | \`${todayJadwal.dhuha || "06:29"}\` |\n`
      content += `| ☀️ **Dzuhur** | \`${todayJadwal.dzuhur || "12:03"}\` |\n`
      content += `| ⛅ **Ashar** | \`${todayJadwal.ashar || "15:24"}\` |\n`
      content += `| 🌇 **Maghrib** | \`${todayJadwal.maghrib || "17:58"}\` |\n`
      content += `| 🌃 **Isya** | \`${todayJadwal.isya || "19:09"}\` |\n\n`
      content += `> 💡 *Sumber: Kementerian Agama RI via EQuran.id Shalat API (Akurasi Tinggi 2026)*\n`

      return {
        content,
        chips: [
          "📍 Jadwal Shalat Kota Bandung",
          "📍 Jadwal Shalat Kota Surabaya",
          "📍 Jadwal Shalat Kota Yogyakarta",
          "📍 Jadwal Shalat Kota Medan",
          "📍 Jadwal Shalat Kota Makassar",
        ],
      }
    } catch (err) {
      return {
        content: `🕌 **Muazzin Digital**\n\nJadwal shalat untuk lokasi *"${selected.city}"*:\n\n- Subuh: 04:45\n- Dzuhur: 12:03\n- Ashar: 15:24\n- Maghrib: 17:58\n- Isya: 19:09`,
        chips: [
          "📍 Jadwal Shalat Kota Jakarta",
          "📍 Jadwal Shalat Kota Bandung",
          "📍 Jadwal Shalat Kota Surabaya",
        ],
      }
    }
  },

  "skywatch-weather": async (message) => {
    const raw = (message || "").trim()
    let query = raw.replace(/^(cuaca di|cuaca|prakiraan cuaca|weather in|weather|info cuaca)\s*/i, "").trim()
    if (!query) query = "Jakarta"

    try {
      // 1. Geocode city name
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
      const geoRes = await fetch(geoUrl)
      const geoData = await geoRes.json()

      if (!geoData.results || geoData.results.length === 0) {
        return {
          content: `🌤️ **SkyWatch Weather Forecaster**\n\nLokasi *"${query}"* tidak ditemukan dalam database geocoding global. Silakan coba cari kota lain atau pilih opsi di bawah:`,
          chips: [
            "📍 Cuaca di Jakarta",
            "📍 Cuaca di Tokyo",
            "📍 Cuaca di London",
            "📍 Cuaca di New York",
            "📍 Cuaca di Mekkah",
          ],
        }
      }

      const loc = geoData.results[0]
      const lat = loc.latitude
      const lon = loc.longitude
      const cityName = loc.name
      const country = loc.country || loc.country_code || ""

      // 2. Fetch current weather and 3-day forecast
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      const weatherRes = await fetch(weatherUrl)
      const weather = await weatherRes.json()

      const cur = weather.current || {}
      const daily = weather.daily || {}

      // WMO Weather code mapper
      const WMO_MAP = {
        0: "☀️ Cerah Benderang (Clear Sky)",
        1: "🌤️ Cerah Berawan (Mainly Clear)",
        2: "⛅ Sebagian Berawan (Partly Cloudy)",
        3: "☁️ Mendung Berawan (Overcast)",
        45: "🌫️ Berkabut (Foggy)",
        48: "🌫️ Kabut Tebal (Depositing Rime Fog)",
        51: "🌦️ Gerimis Ringan (Light Drizzle)",
        53: "🌦️ Gerimis Sedang (Moderate Drizzle)",
        55: "🌧️ Gerimis Lebat (Dense Drizzle)",
        61: "🌧️ Hujan Ringan (Slight Rain)",
        63: "🌧️ Hujan Sedang (Moderate Rain)",
        65: "🌧️ Hujan Lebat (Heavy Rain)",
        71: "❄️ Salju Ringan (Slight Snow)",
        73: "❄️ Salju Sedang (Moderate Snow)",
        75: "❄️ Salju Lebat (Heavy Snow)",
        80: "🌦️ Hujan Rintik Singkat (Rain Showers)",
        81: "🌧️ Hujan Deras (Heavy Showers)",
        82: "⛈️ Hujan Badai Sangat Deras (Violent Showers)",
        95: "⛈️ Badai Petir (Thunderstorm)",
        96: "⛈️ Badai Petir & Hujan Es Ringan",
        99: "⛈️ Badai Petir & Hujan Es Lebat",
      }

      const condition = WMO_MAP[cur.weather_code] || "🌤️ Berawan Normal"

      let content = `🌤️ **[LAPORAN CUACA REAL-TIME: ${cityName}, ${country}]**\n\n`
      content += `📍 **Koordinat:** \`${lat.toFixed(2)}°, ${lon.toFixed(2)}°\` | ⏱️ **Zona Waktu:** *${weather.timezone || "Lokal"}*\n\n`
      content += `### 🌡️ Kondisi Saat Ini:\n`
      content += `- **Status Cuaca:** **${condition}**\n`
      content += `- **Suhu Udara:** 🌡️ **${cur.temperature_2m}°C** *(Terasa seperti: ${cur.apparent_temperature}°C)*\n`
      content += `- **Kelembapan Udara:** 💧 **${cur.relative_humidity_2m}%**\n`
      content += `- **Kecepatan Angin:** 💨 **${cur.wind_speed_10m} km/h**\n`
      content += `- **Curah Hujan Terkini:** 🌧️ **${cur.precipitation} mm**\n\n`

      if (daily.time && daily.time.length >= 3) {
        content += `---\n\n### 📅 Prakiraan 3 Hari Kedepan:\n\n`
        content += `| Tanggal | Kondisi | Suhu Min / Max |\n`
        content += `| :--- | :--- | :--- |\n`
        for (let i = 0; i < 3; i++) {
          const dDate = daily.time[i]
          const dCond = WMO_MAP[daily.weather_code[i]] || "Cerah/Berawan"
          const dMin = daily.temperature_2m_min[i]
          const dMax = daily.temperature_2m_max[i]
          content += `| **${dDate}** | ${dCond.split("(")[0].trim()} | **${dMin}°C** - **${dMax}°C** |\n`
        }
      }

      content += `\n> 🌐 *Data realtime bersumber dari Open-Meteo High-Resolution Global Weather Models.*`

      return {
        content,
        chips: [
          `📍 Cek Cuaca Tokyo`,
          `📍 Cek Cuaca London`,
          `📍 Cek Cuaca New York`,
          `📍 Cek Cuaca Mekkah`,
          `📍 Cek Cuaca Paris`,
        ],
      }
    } catch (err) {
      return {
        content: `🌤️ **SkyWatch Weather Forecaster**\n\nTerjadi kendala saat menghubungi Open-Meteo API. Silakan coba lokasi lain:`,
        chips: [
          "📍 Cuaca di Jakarta",
          "📍 Cuaca di Tokyo",
          "📍 Cuaca di London",
        ],
      }
    }
  },

  "alexandria-books": async (message) => {
    const raw = (message || "").trim()
    let query = raw.replace(/^(cari buku|buku|karya|novel|author|search|find book)\s*/i, "").replace(/^["']|["']$/g, "").trim()
    if (!query) query = "Dune"

    try {
      const searchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=4`
      const res = await fetch(searchUrl)
      const data = await res.json()
      const docs = data.docs || []

      if (docs.length === 0) {
        return {
          content: `📚 **Alexandria Library**\n\nTidak ditemukan buku yang cocok dengan kata kunci *"${query}"*. Silakan coba judul atau nama pengarang lain:`,
          chips: [
            '🔍 Cari Buku "Harry Potter"',
            '🔍 Cari Buku "Dune"',
            '🔍 Cari Buku "The Lord of the Rings"',
            '✍️ Karya "Agatha Christie"',
          ],
        }
      }

      const primary = docs[0]
      const authors = primary.author_name ? primary.author_name.join(", ") : "Penulis Tidak Diketahui"
      const year = primary.first_publish_year || "N/A"
      const editions = primary.edition_count || 1
      const isbn = primary.isbn ? primary.isbn[0] : "N/A"
      const subjects = primary.subject ? primary.subject.slice(0, 4).join(", ") : "Fiksi, Sastra"

      let content = `📚 **[KATALOG OPEN LIBRARY: HASIL PENCARIAN]**\n\n`
      content += `### 📖 **${primary.title}**\n`
      content += `- **Penulis / Pengarang:** ✍️ **${authors}**\n`
      content += `- **Tahun Terbit Perdana:** 🗓️ **${year}**\n`
      content += `- **Total Edisi Terdaftar:** 📑 **${editions} edisi cetak**\n`
      content += `- **Contoh ISBN:** \`${isbn}\`\n`
      content += `- **Genre & Subjek:** 🏷️ *${subjects}*\n\n`

      if (primary.cover_i) {
        const coverImg = `https://covers.openlibrary.org/b/id/${primary.cover_i}-M.jpg`
        content += `🖼️ **Cover Buku:** [Lihat Sampul Open Library Covers CDN](${coverImg})\n\n`
      }

      if (docs.length > 1) {
        content += `---\n\n### 🔎 Rekomendasi Terkait Lainnya:\n`
        for (let i = 1; i < docs.length; i++) {
          const item = docs[i]
          const itemAuthor = item.author_name ? item.author_name[0] : "Unknown"
          content += `- **${item.title}** (${item.first_publish_year || "N/A"}) - *${itemAuthor}*\n`
        }
      }

      content += `\n> 🏛️ *Data katalog terhubung langsung ke Open Library Database (Internet Archive).*`

      return {
        content,
        chips: [
          `🔍 Cari Buku "Harry Potter"`,
          `🔍 Cari Buku "The Hobbit"`,
          `🔍 Cari Buku "1984 George Orwell"`,
          `✍️ Telusuri Karya "${authors.split(",")[0]}"`,
          `📖 Buku Tema "Science Fiction"`,
        ],
      }
    } catch (err) {
      return {
        content: `📚 **Alexandria Library**\n\nPencarian buku: *"${message}"*.\n\nSilakan pilih salah satu rekomendasi literatur berikut:`,
        chips: [
          '🔍 Cari Buku "Harry Potter"',
          '🔍 Cari Buku "Dune"',
          '🔍 Cari Buku "The Lord of the Rings"',
        ],
      }
    }
  },

  "professor-pokedex": async (message) => {
    const raw = (message || "").trim().toLowerCase()
    let query = raw.replace(/^(analisa|cek|pokemon|pokédex|pokedex|stats|info)\s*/i, "").replace(/^["']|["']$/g, "").replace(/#\d+/g, "").trim()
    if (!query) query = "pikachu"

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`)
      if (!res.ok) {
        return {
          content: `🔴⚪ **Prof. Oak Pokédex Scanner**\n\nPokémon *"${query}"* tidak ditemukan dalam database National Pokédex. Pastikan ejaan nama bahasa Inggris atau nomor Pokédex (1-1025) tepat!\n\nCoba salah satu Pokémon populer ini:`,
          chips: [
            '⚡ Analisa "Pikachu" (#25)',
            '🔥 Analisa "Charizard" (#6)',
            '💧 Analisa "Greninja" (#658)',
            '🔮 Analisa "Mewtwo" (#150)',
            '🌿 Analisa "Bulbasaur" (#1)',
          ],
        }
      }

      const p = await res.json()
      const name = p.name.toUpperCase()
      const id = p.id
      const heightMeters = (p.height / 10).toFixed(1)
      const weightKg = (p.weight / 10).toFixed(1)
      
      const TYPE_ICONS = {
        fire: "🔥 Fire", water: "💧 Water", grass: "🌿 Grass", electric: "⚡ Electric",
        ice: "❄️ Ice", fighting: "🥊 Fighting", poison: "🧪 Poison", ground: "🏜️ Ground",
        flying: "🦅 Flying", psychic: "🔮 Psychic", bug: "🐛 Bug", rock: "🪨 Rock",
        ghost: "👻 Ghost", dragon: "🐉 Dragon", steel: "⚙️ Steel", fairy: "✨ Fairy",
        dark: "🌑 Dark", normal: "⚪ Normal",
      }

      const typesFormatted = p.types.map(t => TYPE_ICONS[t.type.name] || t.type.name).join(" / ")
      const abilities = p.abilities.map(a => `${a.ability.name}${a.is_hidden ? " *(Hidden)*" : ""}`).join(", ")

      // Stats mapping
      const statMap = {}
      p.stats.forEach(s => {
        statMap[s.stat.name] = s.base_stat
      })

      const hp = statMap["hp"] || 0
      const atk = statMap["attack"] || 0
      const def = statMap["defense"] || 0
      const spAtk = statMap["special-attack"] || 0
      const spDef = statMap["special-defense"] || 0
      const spd = statMap["speed"] || 0
      const totalStats = hp + atk + def + spAtk + spDef + spd

      const spriteUrl = p.sprites.other?.["official-artwork"]?.front_default || p.sprites.front_default

      let content = `🔴⚪ **[NATIONAL POKÉDEX ENTRY: #${id} ${name}]**\n\n`
      content += `- **Tipe Elemen:** **${typesFormatted}**\n`
      content += `- **Tinggi / Berat:** 📏 **${heightMeters} m** / ⚖️ **${weightKg} kg**\n`
      content += `- **Abilities:** 🧬 **${abilities}**\n`
      content += `- **Base Experience:** 🎖️ **${p.base_experience} XP**\n\n`

      content += `### ⚔️ Base Battle Stats (Total BST: **${totalStats}**):\n`
      content += `| Stat | Value | Bar Visual |\n`
      content += `| :--- | :---: | :--- |\n`
      content += `| ❤️ **HP** | **${hp}** | \`${"█".repeat(Math.min(15, Math.round(hp / 15)))}\` |\n`
      content += `| ⚔️ **Attack** | **${atk}** | \`${"█".repeat(Math.min(15, Math.round(atk / 15)))}\` |\n`
      content += `| 🛡️ **Defense** | **${def}** | \`${"█".repeat(Math.min(15, Math.round(def / 15)))}\` |\n`
      content += `| 🔮 **Sp. Atk** | **${spAtk}** | \`${"█".repeat(Math.min(15, Math.round(spAtk / 15)))}\` |\n`
      content += `| 🔰 **Sp. Def** | **${spDef}** | \`${"█".repeat(Math.min(15, Math.round(spDef / 15)))}\` |\n`
      content += `| ⚡ **Speed** | **${spd}** | \`${"█".repeat(Math.min(15, Math.round(spd / 15)))}\` |\n\n`

      if (spriteUrl) {
        content += `🖼️ **Official Artwork:** [Buka Sprite Resmi Pokémon Company](${spriteUrl})\n\n`
      }

      content += `> 💡 *Diverifikasi oleh Prof. Oak via PokéAPI Database REST v2.*`

      return {
        content,
        chips: [
          `⚡ Analisa "Pikachu" (#25)`,
          `🔥 Analisa "Charizard" (#6)`,
          `💧 Analisa "Greninja" (#658)`,
          `🔮 Analisa "Mewtwo" (#150)`,
          `👻 Analisa "Gengar" (#94)`,
        ],
      }
    } catch (err) {
      return {
        content: `🔴⚪ **Pokédex Scanner**\n\nTerjadi kendala saat memeriksa PokéAPI: *"${message}"*.\n\nCoba pilih Pokémon berikut:`,
        chips: [
          '⚡ Analisa "Pikachu"',
          '🔥 Analisa "Charizard"',
          '💧 Analisa "Blastoise"',
        ],
      }
    }
  },

  "globetrekker-countries": async (message) => {
    const raw = (message || "").trim().toLowerCase()
    let query = raw.replace(/^(profil negara|negara|country|profil|info)\s*/i, "").replace(/^["']|["']$/g, "").trim()
    if (!query) query = "japan"

    try {
      const res = await fetch("https://raw.githubusercontent.com/mledoze/countries/master/countries.json")
      const countries = await res.json()

      const matched = countries.find(c => 
        c.name.common.toLowerCase() === query ||
        c.name.official.toLowerCase() === query ||
        c.cca2.toLowerCase() === query ||
        c.cca3.toLowerCase() === query ||
        (c.capital && c.capital.some(cap => cap.toLowerCase() === query)) ||
        c.name.common.toLowerCase().includes(query)
      ) || countries.find(c => c.name.common.toLowerCase() === "japan")

      const commonName = matched.name.common
      const officialName = matched.name.official
      const capital = matched.capital ? matched.capital.join(", ") : "Tidak Memiliki Ibukota"
      const region = `${matched.region} (${matched.subregion || ""})`
      const area = matched.area ? `${matched.area.toLocaleString()} km²` : "N/A"
      const languages = matched.languages ? Object.values(matched.languages).join(", ") : "N/A"
      const currencies = matched.currencies ? Object.values(matched.currencies).map(c => `${c.name} (${c.symbol || "-"})`).join(", ") : "N/A"
      const borders = matched.borders && matched.borders.length > 0 ? matched.borders.join(", ") : "Negara Kepulauan / Tidak ada perbatasan darat"
      const tld = matched.tld ? matched.tld.join(", ") : ""
      const unStatus = matched.unMember ? "🟢 Anggota PBB (UN Member)" : "⚪ Non-UN Member"

      let content = `🌍 **[PROFIL GEOGRAFIS NEGARA: ${matched.flag || "🏳️"} ${commonName.toUpperCase()}]**\n\n`
      content += `🏛️ **Nama Resmi:** *${officialName}*\n\n`
      content += `- **Ibukota:** 📍 **${capital}**\n`
      content += `- **Benua & Kawasan:** 🗺️ **${region}**\n`
      content += `- **Luas Wilayah:** 📐 **${area}**\n`
      content += `- **Bahasa Resmi:** 🗣️ **${languages}**\n`
      content += `- **Mata Uang:** 💵 **${currencies}**\n`
      content += `- **Status Keanggotaan:** ${unStatus}\n`
      content += `- **Domain Internet (ccTLD):** \`${tld}\`\n`
      content += `- **Negara Perbatasan Darat (Borders):** 🧭 *${borders}*\n\n`

      content += `> 🌐 *Data geografi terverifikasi bersumber dari REST Countries Open Geospatial Intelligence Dataset.*`

      return {
        content,
        chips: [
          '🇯🇵 Profil Negara "Japan"',
          '🇮🇩 Profil Negara "Indonesia"',
          '🇩🇪 Profil Negara "Germany"',
          '🇧🇷 Profil Negara "Brazil"',
          '🇪🇬 Profil Negara "Egypt"',
        ],
      }
    } catch (err) {
      return {
        content: `🌍 **GlobeTrekker Country Explorer**\n\nProfil negara: *"${message}"*.\n\nSilakan pilih salah satu negara berikut:`,
        chips: [
          '🇯🇵 Profil Negara "Japan"',
          '🇮🇩 Profil Negara "Indonesia"',
          '🇩🇪 Profil Negara "Germany"',
        ],
      }
    }
  },
}

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

  if (req.method === "OPTIONS") {
    res.writeHead(204)
    res.end()
    return
  }

  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname

  if (req.method === "GET" && pathname === "/") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(
      JSON.stringify({
        status: "online",
        name: "ChatBotGallery Mock Webhook Server",
        endpoints: Object.keys(BOT_HANDLERS).map((key) => `/webhook/${key}`),
      })
    )
    return
  }

  if (req.method === "POST") {
    let body = ""
    req.on("data", (chunk) => {
      body += chunk
    })

    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}")
        const botKey = pathname.replace(/^\/webhook\/?/, "").replace(/^\//, "")
        const handler = BOT_HANDLERS[botKey] || BOT_HANDLERS["dungeon-rpg"]

        const response = await handler(
          payload.message || "",
          payload.chatHistory || []
        )

        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(response))
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  res.writeHead(404, { "Content-Type": "application/json" })
  res.end(JSON.stringify({ error: "Not Found" }))
})

const HOST = process.env.HOST || "0.0.0.0"

server.listen(PORT, HOST, () => {
  console.log(`🚀 Mock Bot Webhook Server running at http://${HOST}:${PORT}`)
  console.log(`Available Webhook Endpoints:`)
  for (const key of Object.keys(BOT_HANDLERS)) {
    console.log(` - POST http://${HOST}:${PORT}/webhook/${key}`)
  }
})
