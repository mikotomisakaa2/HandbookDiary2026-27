export type SeasonId = 'winter' | 'spring' | 'summer' | 'monsoon' | 'autumn';

export type PhotoCategory = 'cafe' | 'movie' | 'click' | 'travel' | 'moment';

export type MilestoneBadgeStyle = 'wax-seal' | 'ribbon' | 'star-stamp' | 'trophy';

export type BookShelfCategory = 'finished' | 'partial' | 'stopped';

export type PenFontId = 'caveat' | 'patrick' | 'indie' | 'shadows';

export interface HighlightPoint {
  x: number; // percentage 0..100
  y: number; // percentage 0..100
}

export interface HighlightStroke {
  id: string;
  color: string;
  width: number;
  points: HighlightPoint[];
}

export interface BasePageItem {
  id: string;
  x: number; // percentage 0..100 within page
  y: number; // percentage 0..100 within page
  rotation: number; // degrees
}

export interface StickerItem extends BasePageItem {
  type: 'sticker';
  stickerId: string;
  scale: number;
}

export interface StickyNoteItem extends BasePageItem {
  type: 'sticky';
  text: string;
  color: 'butter' | 'blush' | 'sage' | 'sky' | 'kraft' | 'lavender';
}

export interface LinkItem extends BasePageItem {
  type: 'link';
  title: string;
  url: string;
  note?: string;
  color: 'amber' | 'rose' | 'teal' | 'indigo';
}

export interface HoverSong {
  title: string;
  kind: 'preset' | 'audio';
  ref: string; // preset id or audio url / idb:<id>
}

export interface PhotoItem extends BasePageItem {
  type: 'photo';
  mediaKind: 'image' | 'video';
  imageRef: string; // idb:<id> or https://... or data:...
  category: PhotoCategory;
  caption: string;
  sideNote: string;
  dateLabel: string;
  tapeColor: 'kraft' | 'sage' | 'blush' | 'mustard' | 'sky';
  song?: HoverSong;
}

export interface MilestoneItem extends BasePageItem {
  type: 'milestone';
  title: string;
  description: string;
  dateLabel: string;
  badgeStyle: MilestoneBadgeStyle;
}

export type PageItem =
  | StickerItem
  | StickyNoteItem
  | LinkItem
  | PhotoItem
  | MilestoneItem;

export interface HabitColumn {
  id: string;
  name: string;
  scheduleNote: string; // Extra row for schedule write (e.g. "7:00 AM", "30 mins")
}

export interface MonthData {
  monthKey: string; // YYYY-MM
  motto: string;
  subtitle: string;
  page1Lines: Record<number, string>;
  page2Lines: Record<number, string>;
  page3Lines: Record<number, string>;
  habits: HabitColumn[];
  checks: Record<string, boolean>; // `${day}-${habitId}`
  startDay: number; // 1..daysInMonth
  graphMode: 'day' | 'week';
  graphStyle: 'columns' | 'x-line';
  notesSpreadsCount: number; // default 2 (= 4 pages). +Add 2 Pages increments by 1
  notesContent: Record<number, string>; // 0-based note page index -> text
}

export interface BookEntry {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  spineColor: string;
  shelf: BookShelfCategory;
  pinnedPage: number;
  totalPages?: number;
  note?: string;
  addedAt: string;
}

export type ActiveSection = 'month' | 'bookshelf' | 'memories' | 'milestones';

export interface DiaryState {
  diaryTitle: string;
  ownerName: string;
  isBookOpen: boolean;
  activeSection: ActiveSection;
  activeMonthKey: string;
  activeSpreadIndex: number; // 0 = Pages 1-2, 1 = Pages 3-4 (Habit+Graph), 2+ = Notes
  penColor: string;
  penFont: PenFontId;
  months: Record<string, MonthData>;
  pageItems: Record<string, PageItem[]>; // keyed by pageId
  highlights: Record<string, HighlightStroke[]>; // keyed by pageId
  books: BookEntry[];
}
