import { DiaryState, HabitColumn, MonthData } from '../types/diary';
import { randomSpineColor } from './bookApi';

const STORAGE_KEY = 'handbook-diary-2026-27-v3';
const IDB_NAME = 'handbook-diary-media';
const IDB_STORE = 'media';

export const DEFAULT_HABITS: HabitColumn[] = [
  { id: 'h-learn', name: 'New Learning', scheduleNote: '7:30 AM' },
  { id: 'h-read', name: 'Read 20m', scheduleNote: '9:00 PM' },
  { id: 'h-move', name: 'Workout', scheduleNote: '6:30 AM' },
  { id: 'h-focus', name: 'Deep Work', scheduleNote: '10:00 AM' },
  { id: 'h-water', name: 'Hydrate 3L', scheduleNote: 'All day' },
  { id: 'h-journal', name: 'Journal', scheduleNote: '10:30 PM' },
  { id: 'h-sleep', name: 'Sleep 8h', scheduleNote: '11:00 PM' },
];

export function createDefaultMonth(monthKey: string): MonthData {
  return {
    monthKey,
    motto: 'New learning everyday',
    subtitle: "You are confirming the person you're becoming",
    page1Lines: {},
    page2Lines: {},
    page3Lines: {},
    habits: DEFAULT_HABITS.map((h) => ({ ...h })),
    checks: {},
    startDay: monthKey === '2026-11' ? 23 : 1,
    graphMode: 'day',
    graphStyle: 'columns',
    notesSpreadsCount: 0, // Only added when user clicks "+ Add 2 Pages"
    notesContent: {},
  };
}

export function createInitialState(): DiaryState {
  const defaultMonth = '2026-11';
  return {
    diaryTitle: 'Handbook Diary',
    ownerName: '',
    isBookOpen: false,
    activeSection: 'month',
    activeMonthKey: defaultMonth,
    activeSpreadIndex: 1,
    penColor: '#2c1e16',
    penFont: 'caveat',
    months: {
      [defaultMonth]: createDefaultMonth(defaultMonth),
    },
    pageItems: {},
    highlights: {},
    books: [
      {
        id: 'book-atomic-habits',
        title: 'Atomic Habits',
        author: 'James Clear',
        coverUrl: 'https://covers.openlibrary.org/b/id/12539702-M.jpg',
        spineColor: randomSpineColor('Atomic Habits'),
        shelf: 'finished',
        pinnedPage: 320,
        totalPages: 320,
        note: '1% better every single day.',
        addedAt: '2026-11-10',
      },
      {
        id: 'book-alchemist',
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        coverUrl: 'https://covers.openlibrary.org/b/id/15121520-M.jpg',
        spineColor: randomSpineColor('The Alchemist'),
        shelf: 'finished',
        pinnedPage: 208,
        totalPages: 208,
        note: 'Cozy winter evening read with chai.',
        addedAt: '2026-11-18',
      },
      {
        id: 'book-deep-work',
        title: 'Deep Work',
        author: 'Cal Newport',
        coverUrl: 'https://covers.openlibrary.org/b/id/12625836-M.jpg',
        spineColor: randomSpineColor('Deep Work'),
        shelf: 'partial',
        pinnedPage: 142,
        totalPages: 296,
        note: 'Currently on Rule #2 — Embrace Boredom.',
        addedAt: '2026-11-22',
      },
      {
        id: 'book-war-peace',
        title: 'Infinite Jest',
        author: 'David Foster Wallace',
        coverUrl: 'https://covers.openlibrary.org/b/id/8231996-M.jpg',
        spineColor: randomSpineColor('Infinite Jest'),
        shelf: 'stopped',
        pinnedPage: 118,
        totalPages: 1079,
        note: 'Paused for now — maybe another winter.',
        addedAt: '2026-11-05',
      },
    ],
  };
}

export function createDemoSeedState(): DiaryState {
  const base = createInitialState();
  const nov = createDefaultMonth('2026-11');
  nov.startDay = 23;
  nov.graphStyle = 'columns';
  nov.page1Lines = {
    1: 'Started my 2026-27 wooden handbook diary!',
    5: 'Visited the quiet corner bookstore & picked up two novels',
    12: 'Evening filter coffee at the terrace cafe',
    22: 'Set up my November habits & monthly goals',
    23: 'Day 1 of my daily streak — feeling focused and calm',
  };
  nov.page3Lines = {
    23: 'Learned how small daily habits compound like interest',
    24: 'Built a clean study routine & finished 2 chapters',
    25: 'Tried a new watercolor sketch technique for 25 mins',
    26: 'Practiced deep work without phone distractions',
    27: 'Reviewed weekly progress and celebrated small wins',
  };
  nov.checks = {
    '23-h-learn': true,
    '23-h-read': true,
    '23-h-focus': true,
    '23-h-water': true,
    '24-h-learn': true,
    '24-h-read': true,
    '24-h-move': true,
    '24-h-focus': true,
    '24-h-journal': true,
    '25-h-learn': true,
    '25-h-water': true,
    '25-h-sleep': true,
    '26-h-learn': true,
    '26-h-read': true,
    '26-h-move': true,
    '26-h-focus': true,
    '26-h-water': true,
    '26-h-journal': true,
    '27-h-learn': true,
    '27-h-read': true,
    '27-h-move': true,
    '27-h-focus': true,
    '27-h-water': true,
    '27-h-journal': true,
    '27-h-sleep': true,
  };

  base.isBookOpen = true;
  base.months['2026-11'] = nov;
  base.pageItems = {
    '2026-11-p1': [
      {
        id: 'demo-stk-1',
        type: 'sticker',
        stickerId: 'kulhad-chai',
        x: 78,
        y: 12,
        rotation: 8,
        scale: 1,
      },
      {
        id: 'demo-note-1',
        type: 'sticky',
        text: 'November vibe:\nslow mornings, warm chai & showing up every single day.',
        color: 'butter',
        x: 54,
        y: 38,
        rotation: -3,
      },
    ],
    '2026-11-p2': [
      {
        id: 'demo-link-1',
        type: 'link',
        title: 'Pinterest Aesthetic Inspo',
        url: 'https://in.pinterest.com/pin/372109987982506692/',
        note: 'Diary layout & cozy moodboard',
        color: 'amber',
        x: 8,
        y: 12,
        rotation: -1.5,
      },
      {
        id: 'demo-photo-1',
        type: 'photo',
        mediaKind: 'image',
        imageRef:
          'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=480&q=80',
        category: 'cafe',
        caption: 'Evening Filter Coffee',
        sideNote: 'Warm roasted aroma, quiet rainy jazz, and 40 pages of reading.',
        dateLabel: '12 Nov 2026',
        tapeColor: 'kraft',
        song: {
          title: 'Lo-Fi Chai & Rain',
          kind: 'preset',
          ref: 'lofi-chai',
        },
        x: 8,
        y: 36,
        rotation: -2,
      },
      {
        id: 'demo-ms-1',
        type: 'milestone',
        title: 'First 5-Day Streak!',
        description: 'Completed all 7 habits on Nov 27',
        dateLabel: 'Nov 27, 2026',
        badgeStyle: 'wax-seal',
        x: 52,
        y: 74,
        rotation: 3,
      },
      {
        id: 'demo-stk-2',
        type: 'sticker',
        stickerId: 'sparkles',
        x: 78,
        y: 16,
        rotation: -6,
        scale: 0.95,
      },
    ],
    '2026-11-p3': [
      {
        id: 'demo-stk-3',
        type: 'sticker',
        stickerId: 'open-book',
        x: 80,
        y: 78,
        rotation: 6,
        scale: 0.9,
      },
    ],
  };
  return base;
}

export function loadDiaryState(): DiaryState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<DiaryState>;
    if (!parsed || typeof parsed !== 'object' || !parsed.months) {
      return createInitialState();
    }
    const base = createInitialState();
    return {
      ...base,
      ...parsed,
      diaryTitle: parsed.diaryTitle || base.diaryTitle,
      highlights: parsed.highlights || {},
      pageItems: parsed.pageItems || {},
      books: parsed.books || base.books,
    };
  } catch {
    return createInitialState();
  }
}

export function saveDiaryState(state: DiaryState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save diary state to localStorage:', err);
  }
}

// IndexedDB for uploaded user photos, videos, and audio songs
function openMediaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveImageToIdb(dataUrl: string): Promise<string> {
  const id = `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    const db = await openMediaDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(dataUrl, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    return `idb:${id}`;
  } catch {
    return dataUrl;
  }
}

export async function getImageFromIdb(ref: string): Promise<string> {
  if (!ref.startsWith('idb:')) return ref;
  const id = ref.slice(4);
  try {
    const db = await openMediaDb();
    return await new Promise<string>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(id);
      req.onsuccess = () =>
        resolve(typeof req.result === 'string' ? req.result : '');
      req.onerror = () => resolve('');
    });
  } catch {
    return '';
  }
}
