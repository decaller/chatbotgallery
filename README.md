# 🤖 ChatBot Gallery (ArcadeBot)

A modern full-stack web application designed for discovering, playing, creating, editing, and versioning interactive AI chatbots, text RPGs, and automation agents.

---

## 🏗️ Repository Architecture Analysis

```
chatBotGallery/
├── chatbotgallery/            # Core Full-stack Web Application
│   ├── src/
│   │   ├── components/        # React UI components (ChatView, BotGallery, BotCard, Dialogs, etc.)
│   │   ├── lib/               # Server functions, LibSQL client, and image processing utilities
│   │   ├── routes/            # TanStack Start / Router file-based routes
│   │   ├── types/             # TypeScript schemas (Bot, BotVersion, ChatMessage, etc.)
│   │   └── styles.css         # Tailwind CSS v4 styling & animations
│   ├── local.db               # SQLite / LibSQL database storage
│   └── package.json           # React 19, TanStack Start/Router, LibSQL, Tailwind CSS
├── sample-bots/               # Exportable n8n Workflow JSON templates
│   ├── dungeon-rpg-workflow.json
│   ├── cyberpunk-noir-workflow.json
│   ├── island-survival-workflow.json
│   ├── code-mentor-workflow.json
│   └── trivia-duel-workflow.json
├── mockup/                    # Standalone HTML/Tailwind interactive prototype
├── sample_bots.json           # Ready-to-import JSON manifest of sample bots
├── seed_bots.mjs              # Database seed script for local.db
├── mock_bot_server.mjs        # Lightweight mock webhook server for offline testing
└── README.md
```

### 1. Technology Stack
- **Frontend / Framework**: [React 19](https://react.dev/), [TanStack Start](https://tanstack.com/start) & [TanStack Router](https://tanstack.com/router), [Vite](https://vitejs.dev/).
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Radix UI / Base UI, and Lucide React icons.
- **Database**: [LibSQL / SQLite](https://github.com/tursodatabase/libsql-client-ts) with dual-table versioning (`bots` master table + `bot_versions` revision history).
- **Integrations**: Standard HTTP Webhook endpoint (`POST`) supporting Bearer authentication, flexible JSON payloads (`content`, `response`, `output`, `chips`, `quickReplies`), and direct n8n workflow attachment.

### 2. Key Features
- **Interactive Chat & Quick Chips**: Chat view with action suggestion chips that dynamically update based on bot responses.
- **Bot Versioning Timeline**: Every edit creates an immutable revision with author notes, change summary, and individual play metrics.
- **Dual Light/Dark Theme Color Personalization**: Custom theme colors per bot with light and dark mode variants.
- **Client-side Image Optimization**: Canvas-based compression of covers and avatars to compact WebP formats.
- **n8n Workflow Export/Import**: Attach n8n workflow configurations directly to bots for instant viewing and downloading.

---

## 🎮 Sample Bots

We have created 7 sample bots featuring diverse workflow implementation models and complexity tiers:

| Bot Name | Category | Implementation Type | Description |
| :--- | :--- | :--- | :--- |
| **Dungeon & Shadow Quest** | `RPG & Gaming` | **No-Code AI Agent** (Zero Code) | Pure n8n LangChain AI Agent node connected to an OpenAI Chat Model without custom scripts. |
| **Cyberpunk Noir 2088** | `RPG & Gaming` | **Python Engine** (n8n Python) | Uses n8n Code node in Python runtime for regex clue matching and forensic text analysis. |
| **Island 404: Survival** | `Productivity / RPG` | **Low-Code JS** (A bit of JS) | Minimalistic 5-line JavaScript filter classifying survival actions, stamina, and weather threats. |
| **Trivia Duel Master** | `Education` | **Simple No-Code Rule Engine** (Zero Code, Zero AI) | Pure n8n `Switch` (conditional branching) and `Set` (Edit Fields) nodes with zero scripts and no AI model. |
| **Aegis Security Sentinel** | `Utility & Security` | **n8n If Node Engine** (Boolean Logic) | Uses n8n `If` node (True/False conditional branching) to triage critical cyber threats vs routine cloud hardening. |
| **Nexus Tech & Order Concierge** | `E-Commerce & Support` | **n8n Data Table Engine** (Internal Table Query) | Uses n8n `Data Table` node to query internal tabular product inventory and order delivery tracking. |
| **CodeCraft Senior Mentor** | `Coding & Dev` | **JavaScript Engine** (Standard JS) | Full JavaScript logic providing TypeScript/React code reviews, refactoring, and SOLID design advice. |

---

## 🚀 Quick Start Guide

### 1. Seed the Database
Populate `local.db` with the 5 sample bots and their version 1 history:
```bash
node seed_bots.mjs
```

### 2. Start the Mock Webhook Server (Optional for offline testing)
Run the local webhook simulator that responds to all sample bot webhook requests:
```bash
node mock_bot_server.mjs
```
*The mock server will listen on `http://localhost:3001` with endpoints like `/webhook/dungeon-rpg`, `/webhook/cyberpunk-noir`, etc.*

### 3. Start the Web Application
Launch the ChatBotGallery development server:
```bash
cd chatbotgallery
npm run dev
```
Open your browser at [http://localhost:3000](http://localhost:3000) to explore the gallery and chat with the bots!

---

## 🐳 Portainer Stack & Docker Compose Deployment

This repository is preconfigured for 1-click deployment via **Portainer Git Stacks** or standard Docker Compose.

### Portainer Git Stack Setup:
1. In Portainer, navigate to **Stacks** ➡️ **Add stack**.
2. Select **Repository** (Git) as the build method.
3. Configure the Git repository settings:
   - **Repository URL**: `https://github.com/<your-username>/<your-repo-name>`
   - **Repository reference**: `refs/heads/main` (or your active branch)
   - **Compose path**: `docker-compose.yml`
4. (Optional) In **Environment variables**, define any overrides:
   - `APP_PORT=3000`
   - `MOCK_SERVER_PORT=3001`
   - `AUTO_SEED=true` *(Automatically seeds sample bots on first run)*
   - `DATABASE_URL=file:/app/data/local.db` *(Persisted in the `chatbotgallery_data` Docker volume)*
5. Click **Deploy the stack**.

### Manual Docker Compose:
```bash
# Build and run the containers in background
docker compose up -d --build

# View logs
docker compose logs -f

# Stop containers
docker compose down
```
