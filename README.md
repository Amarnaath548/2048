# Merge Mess (விருந்து) 🍱

A free casual merge puzzle where South Indian dishes level up from a single rice grain to the legendary golden feast, and Tamil learners can master classical vowels (அ to ஔ) through merging!

Built in **TypeScript**, **Phaser 3**, and **Vite**, deployable as a responsive web game and as an Android app via **Capacitor**.

---

## ✨ Features (Version 1.0)

1. **Core 4x4 Merge Puzzle**:
   - 11 dish tiers (Rice Grain ➔ Idli ➔ Dosa ➔ Vada ➔ Pongal ➔ Sambar Rice ➔ Biryani ➔ Thali ➔ Banana-leaf Meal ➔ Festival Feast ➔ Golden Feast).
   - 120ms slide animations, 150ms pop merges, dynamic pitch audio.

2. **Customer Orders**:
   - Characters like *Kavitha Akka* & *Chef Selvam* order dishes (e.g., "Make 2 Crispy Dosa").
   - Rewarded with coins 🪙 and bonus score ⭐. Free to skip anytime!

3. **Sambar Boost 🍲**:
   - Power-up to upgrade any chosen tile by 1 tier.
   - Earned via 3-merge combos in a single move, spending coins, or rewarded ads (max 2 per run).

4. **Daily Challenge 📅**:
   - Seeded deterministic board generator keyed by date (`YYYY-MM-DD`). Every player starts with the exact same board and tile sequence worldwide!
   - Daily streak tracking and 1-tap WhatsApp result sharing.

5. **2 Launch Themes / Skins 🎨**:
   - **Classic South Indian Food** (11 tiers from Rice to Golden Feast).
   - **Tamil Letters (தமிழ் உயிர் எழுத்துக்கள்)**: 12 tiers from அ to ஔ with pronunciations and cultural facts.

6. **Web Audio Sound Synthesizer**:
   - 100% offline procedural Web Audio synthesis for swipe whoosh, tier pitch-scaled pops, order chimes, and boost fanfare.

7. **Monetization & Donations**:
   - Non-intrusive optional rewarded ads (Undo move, Revive after game over, Sambar boost).
   - Voluntary UPI donation screen with QR code and instant 1-tap copy/pay.

---

## 🛠️ Tech Stack & Architecture

- **Engine**: Phaser 3 (2D canvas, tweens, particles, input)
- **Core Rules**: Decoupled pure TypeScript in `src/core/` (zero Phaser dependencies, 100% tested with Vitest)
- **Bundler**: Vite
- **Mobile Wrapper**: Capacitor
- **Unit Tests**: Vitest

### Folder Structure

```
merge-mess/
├── src/
│   ├── config/          Game constants & dimensions
│   ├── core/            Pure game logic (board, merge, spawn, score, orders, boosts, daily, rng)
│   ├── scenes/          Phaser GameScene
│   ├── services/        Audio, Storage, Ads, Share
│   ├── themes/          Classic Food & Tamil Letters definitions
│   ├── ui/              OrderUI, Modals (UPI, Themes, Daily, Game Over, Help)
│   ├── main.ts          Application entry point
│   └── style.css        Mobile-first responsive styling
├── tests/               Automated Vitest suite
├── docs/                Privacy policy & store documentation
└── capacitor.config.ts  Android configuration
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build for Production Web
```bash
npm run build
```

---

## 📱 Android Build (Capacitor)

```bash
# 1. Build web assets
npm run build

# 2. Add Android platform (if not already added)
npx cap add android

# 3. Copy dist web build into Android project
npx cap copy

# 4. Open in Android Studio to build signed APK/AAB
npx cap open android
```

