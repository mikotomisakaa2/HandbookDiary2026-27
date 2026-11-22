# Handbook Diary 2026–27

**Live Diary Link:** [https://mikotomisakaa2.github.io/HandbookDiary2026-27/](https://mikotomisakaa2.github.io/HandbookDiary2026-27/)

An interactive, realistic wooden **Pinterest-style Handbook Diary (2026–27)** built 100% in **TypeScript + React + Three.js** for tracking daily progress, habits, reading shelves, cafe/movie/video memories, and milestones.

---

## Saving Your Work & Privacy

- **Automatic Local Saving:** Every line, habit `×` check, schedule note, highlighter stroke, sticker, sticky note, link, milestone, bookshelf entry, photo, video, and hover song is saved automatically inside **your own browser** (`localStorage` + `IndexedDB`). When you close the tab and come back on the same browser/device, all your work is still right there.
- **Private Per Person:** If someone else opens the live link on their laptop or phone, they get their **own fresh, private diary** saved only on *their* device — they cannot see your diary, and you cannot see theirs.
- **Backup & Move Devices:** Use the **Download (JSON)** and **Upload (JSON)** buttons in the top-right wooden toolbar anytime to save a personal backup file or restore your diary on another device.

---

## Features

### 1. Realistic Book Experience & 3D Indian Seasons (Three.js)
- **Closed Wooden & Leather Cover** with editable owner name, brass corners, ribbon bookmark, and smooth book-opening transition.
- **Three.js 3D Seasonal Atmosphere** tailored to **Indian seasons** for every month of 2026–2027:
  - **Winter (*Hemanta & Shishira* — Nov, Dec, Jan):** Dark walnut desk + drifting 3D frost flakes & warm candlelight motes.
  - **Spring (*Vasanta* — Feb, Mar):** Honey oak desk + tumbling 3D gulmohar blossom petals.
  - **Summer (*Grishma* — Apr, May, Jun):** Sunlit mango wood desk + rising golden sunlit pollen motes.
  - **Monsoon (*Varsha* — Jul, Aug, Sep):** Rain-kissed rosewood desk + falling 3D monsoon rain streaks.
  - **Autumn (*Sharad* — Oct):** Warm sheesham desk + glowing 3D festive diya embers & marigold petals.

### 2. Monthly Page Architecture
- **Pages 1–2:** Numbered ruled pages (`1` to `28 / 29 / 30 / 31` matching the exact calendar length of each month) for highlights, stickers, sticky notes, links, photos/videos, and milestones.
- **Pages 3–4 (Habit & Schedule Spread):**
  - **Page 3 (Left):** Month header, editable monthly motto (`New learning everyday`), subtitle badge (`You are confirming the person you're becoming`), and numbered daily learning lines (`1..28/29/30/31`).
  - **Page 4 (Right):**
    - **Schedule Table:** Customizable number of schedule columns (`Cols: 2–10` or `+` inline), **1 extra top row for schedule notes/times**, plus date rows (`1..28/29/30/31`) with handwritten **`×`** check marks.
    - **Dynamic Graph (`Graph of successful Days I worked`):** Toggle between **Column Graph** and **Hand-drawn `×` Line Graph**, and switch between **Per Day** and **Per Week**. Set your **Start Date** (e.g., `23 Nov`) so days before your start date remain flat at `0` and progress builds from your start date onward.
- **Optional Extra Notes Pages (`+ Add 2 Pages`):** No compulsory blank 5–6 or 7–8 pages — add a fresh 2-page blank spread only whenever you want extra room.

### 3. Stationery, Highlighter & Pinterest Scrapbook Tools
- **Pen Ink Color & Handwritten Font Switcher:** Switch between 6 fountain/gel ink colors (`Espresso`, `Fountain Blue`, `Burgundy`, `Forest Green`, `Terracotta`, `Plum`) and 4 handwritten fonts (`Caveat`, `Patrick Hand`, `Indie Flower`, `Shadows Into Light`).
- **Realistic Highlighter:** Toggle Highlighter mode to draw semi-transparent multiply-blend marker strokes directly across any page in 5 pastel highlighter colors.
- **Cute Seasonal Stickers, Realistic Sticky Notes & Link Bookmarks:** Drag, tilt/rotate, edit, and place anywhere on any page.
- **Photos & Videos + Hover Songs:** Upload photos or videos (stored locally in IndexedDB) or paste URLs, write a handwritten **Side Note** right beside each card, and attach a **Hover Song** (built-in ambient melodies or your own uploaded MP3/audio URL) that gently plays when you hover over the card.
- **Milestones Earned:** Stamp Wax Seals, Festive Ribbons, Gold Star Stamps, or Trophy Badges on any page and view them in the dedicated **Wins** gallery.

### 4. Wooden 3-Tier Bookshelf (Hover-Only Details)
- Three wooden shelves: **Finished Reading**, **Partially Finished**, and **Not Finished (Not Reading Further)**.
- **Automatic Real Book Cover Fetching** via Open Library API (with Google Books fallback).
- Clean visual bookshelf with bookmark pins — **hovering** over any book reveals its title, author, editable **pinned page number**, notes, and shelf switcher.

---

## Tech Stack
- **TypeScript** (strict mode across all source files)
- **React 19 + Vite**
- **Three.js** (`three` + `@types/three`) for 3D seasonal particle & lighting atmospheres
- **Web Audio API + IndexedDB + LocalStorage** for offline-friendly persistence, media uploads, hover melodies, and JSON backup/restore

---

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```
