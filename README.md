# GeetaDrishti

GeetaDrishti is a mobile-first, offline Bhagavad Gita reader built with React, Vite, Tailwind CSS, and Capacitor. It makes no network requests at runtime. Bookmarks and personal study notes are stored on-device in `localStorage`.

## Included capabilities

- Responsive reader with a chapter grid, Sanskrit (Devanagari), English, and Telugu text.
- One-tap `EN | TE` interface and translation switch.
- Instant local search over chapter numbers, verse numbers, Sanskrit, translations, and keywords.
- Shankara, Ramanuja, and Prabhupada commentary tabs.
- Local bookmark toggle plus a slide-out study workbench for creating, reading, editing, and deleting notes.
- A Capacitor configuration ready to generate an Android Studio project.

## Run the web app

Install Node.js 20+ first, then from this directory run:

```powershell
npm install
npm run dev
```

Open the local Vite URL shown in the terminal. Use `npm run build` to create the production bundle in `dist/`.

## Local scripture data

All bundled reading content is in [src/data/gita.json](src/data/gita.json). It currently includes a carefully structured representative verse for each of the 18 chapters, so the complete reading, search, commentary, and offline workflows work immediately without an API.

To ship the complete 700-verse corpus, append further verse objects to each chapter's `verses` array using the exact existing schema:

```json
{
  "id": "2.48",
  "number": "2.48",
  "sanskrit": "…",
  "english": "…",
  "telugu": "…",
  "keywords": ["equanimity", "యోగం"],
  "commentaries": {
    "shankara": { "en": "…", "te": "…" },
    "ramanuja": { "en": "…", "te": "…" },
    "prabhupada": { "en": "…", "te": "…" }
  }
}
```

The UI derives its chapter selector, search index, note selector, and bookmarks from this file automatically—no component changes are needed when the full corpus is added. Ensure any commentary or translation source is licensed for offline redistribution.

## Capacitor: build an Android APK

### 1. Create a Vite + React + Tailwind project (reference workflow)

If starting from scratch rather than using this prepared project:

```powershell
npm create vite@latest geeta-drishti -- --template react
cd geeta-drishti
npm install
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

Configure Tailwind's `content` paths and add the three `@tailwind` directives to your CSS. This repository has those files already configured.

### 2. Install Capacitor packages

In this project directory:

```powershell
npm install
```

`package.json` already declares `@capacitor/core`, `@capacitor/android`, and `@capacitor/cli`. The supplied `capacitor.config.json` sets the Android application ID to `com.geetadrishti.app` and tells Capacitor to serve Vite's `dist` folder.

### 3. Add the Android platform

```powershell
npx cap add android
```

This creates the native Android Studio project in `android/`. Do this once; commit the generated folder if it is part of the product source.

### 4. Build the web bundle and sync it

Run these commands after every web-app change:

```powershell
npm run build
npx cap sync android
```

`sync` copies the offline static bundle into the native Android project and updates installed Capacitor plugins.

### 5. Open Android Studio and build the APK

```powershell
npx cap open android
```

In Android Studio, wait for Gradle sync to finish, then choose **Build → Build Bundle(s) / APK(s) → Build APK(s)**. The debug APK will be created at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

For a release APK, create a signing key in Android Studio and use **Build → Generate Signed Bundle / APK**. Do not commit keystores or signing passwords.

## Project map

```text
src/
  components/
    Navbar.jsx              # Header, search, language segment
    ChapterSelector.jsx     # Chapters 1–18 grid
    VerseCard.jsx           # Reader card and bookmark action
    CommentarySection.jsx   # Three instant commentary tabs
    NotesDrawer.jsx         # localStorage CRUD workbench
    NavigationDrawer.jsx    # Slide-out chapter navigation
  data/
    gita.json               # Offline scripture content
    gitaData.js             # Data index and search helpers
  hooks/
    useLocalStorage.js      # JSON persistence hook
  App.jsx                   # Reader state and feature integration
```
