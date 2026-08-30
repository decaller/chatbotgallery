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

    req.on("end", () => {
      try {
        const payload = JSON.parse(body || "{}")
        const botKey = pathname.replace(/^\/webhook\/?/, "").replace(/^\//, "")
        const handler = BOT_HANDLERS[botKey] || BOT_HANDLERS["dungeon-rpg"]

        const response = handler(
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
