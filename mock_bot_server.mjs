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

  "trivia-duel": (message, history) => {
    const currentMsg = (message || "").trim()
    const historyList = Array.isArray(history) ? history : []

    // 1. Reconstruct all user inputs from conversation history
    const userMessages = historyList
      .filter((h) => h.role === "user")
      .map((h) => (h.content || "").trim())

    const allUserInputs = [...userMessages]
    if (allUserInputs.length === 0 || allUserInputs[allUserInputs.length - 1] !== currentMsg) {
      allUserInputs.push(currentMsg)
    }

    const roundIndex = allUserInputs.length

    // 2. Question bank
    const QUESTIONS = [
      {
        round: 1,
        topic: "Sains & Astronomi",
        question: "Planet manakah di tata surya kita yang berjuluk \"Planet Merah\"?",
        correctKeywords: ["mars", "b.", "b"],
        correctDisplay: "B. Mars",
        explanation: "Warna merah Mars disebabkan oleh tingginya konsentrasi besi oksida (karat) di permukaannya.",
        chips: ["A. Venus", "B. Mars", "C. Jupiter", "D. Merkurius"],
      },
      {
        round: 2,
        topic: "Sejarah & Komputer",
        question: "Siapakah matematikawan yang memecahkan kode mesin enkripsi Enigma pada Perang Dunia II?",
        correctKeywords: ["alan turing", "turing"],
        correctDisplay: "Alan Turing",
        explanation: "Alan Turing memimpin tim di Bletchley Park menggunakan mesin elektromekanis Bombe.",
        chips: ["Alan Turing", "Charles Babbage", "Ada Lovelace", "John von Neumann"],
      },
      {
        round: 3,
        topic: "Geografi Dunia",
        question: "Danau terdalam di dunia yang menampung sekitar 20% air tawar permukaan bumi yang tak beku adalah?",
        correctKeywords: ["baikal", "danau baikal"],
        correctDisplay: "Danau Baikal (Rusia)",
        explanation: "Danau Baikal memiliki kedalaman maksimum mencapai 1.642 meter.",
        chips: ["Danau Baikal", "Danau Toba", "Danau Victoria", "Danau Superior"],
      },
      {
        round: 4,
        topic: "Logika & Sains Modern",
        question: "Berapakah kecepatan cahaya dalam ruang hampa udara (dalam aproksimasi km/detik)?",
        correctKeywords: ["300.000", "300000", "300.000 km/s", "300000 km/s", "299.792"],
        correctDisplay: "300.000 km/detik (299.792.458 m/s)",
        explanation: "Cahaya merambat pada konstanta universal c ≈ 300.000 km/s.",
        chips: ["300.000 km/detik", "150.000 km/detik", "1.000.000 km/detik", "30.000 km/detik"],
      },
    ]

    // 3. Compute score and history
    let score = 0
    let streak = 0
    const roundHistory = []

    for (let i = 0; i < allUserInputs.length; i++) {
      if (i >= QUESTIONS.length) break
      const q = QUESTIONS[i]
      const ans = allUserInputs[i].toLowerCase()
      const isCorrect = q.correctKeywords.some((kw) => ans.includes(kw))

      if (isCorrect) {
        score += 100 + streak * 25
        streak += 1
        roundHistory.push({ round: q.round, correct: true, answerGiven: allUserInputs[i] })
      } else {
        streak = 0
        roundHistory.push({ round: q.round, correct: false, answerGiven: allUserInputs[i] })
      }
    }

    const currentRoundEvaluated = roundHistory[roundHistory.length - 1]
    const prevQ = QUESTIONS[Math.min(roundIndex - 1, QUESTIONS.length - 1)]

    const memorySnippet =
      roundHistory.length > 1
        ? `\n\n🧠 *Memori Riwayat:* Dari ${roundHistory.length} babak yang telah kamu lewati, kamu menjawab benar **${roundHistory.filter((r) => r.correct).length} dari ${roundHistory.length} pertanyaan**.`
        : ""

    if (roundIndex <= QUESTIONS.length) {
      const evalText = currentRoundEvaluated.correct
        ? `🎉 **TEPAT SEKALI! (+100 Poin + Streak Bonus)**\nKamu memilih: *"${currentRoundEvaluated.answerGiven}"*.\nℹ️ *Fakta:* ${prevQ.explanation}`
        : `❌ **KURANG TEPAT!**\nKamu memilih: *"${currentRoundEvaluated.answerGiven}"*. Jawaban yang benar adalah **${prevQ.correctDisplay}**.\nℹ️ *Fakta:* ${prevQ.explanation}`

      if (roundIndex < QUESTIONS.length) {
        const nextQ = QUESTIONS[roundIndex]
        return {
          content: `📊 **[Papan Skor: ${score} Poin | Streak: ${streak} | Babak ${roundIndex + 1}/${QUESTIONS.length}]**\n\n${evalText}${memorySnippet}\n\n---\n\n🔥 **Babak ${nextQ.round} (${nextQ.topic}):**\n*"${nextQ.question}"*`,
          chips: nextQ.chips,
        }
      } else {
        let rankTitle = "Perunggu (Quiz Novice)"
        if (score >= 450) rankTitle = "🏆 Grand Quiz Master (Legenda Trivia)"
        else if (score >= 300) rankTitle = "🥈 Perak (Trivia Sage)"
        else if (score >= 150) rankTitle = "🥉 Perunggu Lanjutan (Smart Challenger)"

        return {
          content: `📊 **[Papan Skor Akhir: ${score} Poin | Rank: ${rankTitle}]**\n\n${evalText}${memorySnippet}\n\n---\n\n🏁 **DUEL SELESAI!**\nKamu telah menyelesaikan seluruh 4 babak tantangan Trivia Duel Master.\n- **Total Skor Akhir:** ${score} Poin\n- **Akurasi Jawaban:** ${Math.round((roundHistory.filter((r) => r.correct).length / QUESTIONS.length) * 100)}%\n- **Gelar Pencapaian:** **${rankTitle}**\n\nIngin mencoba rematch dengan topik berbeda atau mulai dari awal?`,
          chips: ["🔄 Mainkan Ulang (Rematch)", "🧠 Kuis Sains Lanjutan", "📜 Lihat Papan Peringkat"],
        }
      }
    } else {
      return {
        content: `🧠 **Trivia Duel Master siap untuk sesi kuis baru!**\n\nPilih mode permainan yang ingin kamu mainkan:`,
        chips: ["Mulai Kuis Babak 1", "Mode Sulit (Hardcore)", "Mode Campuran Acak"],
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
