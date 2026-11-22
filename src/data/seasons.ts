import { SeasonId } from '../types/diary';

export interface IndianSeasonTheme {
  id: SeasonId;
  name: string;
  indianName: string;
  tagline: string;
  woodTone: string;
  deskGradient: string;
  woodGrainColor: string;
  paperTint: string;
  accent: string;
  accentSoft: string;
  inkColor: string;
  ribbonColor: string;
  ambientEmoji: string;
  coverGradient: string;
}

export const INDIAN_SEASONS: Record<SeasonId, IndianSeasonTheme> = {
  winter: {
    id: 'winter',
    name: 'Winter',
    indianName: 'Hemanta & Shishira',
    tagline: 'Cozy dark walnut, misty mornings & warm masala chai',
    woodTone: '#3b2416',
    deskGradient:
      'radial-gradient(circle at 20% 15%, rgba(255, 196, 125, 0.14), transparent 52%), linear-gradient(135deg, #2d1a0f 0%, #442818 45%, #27160c 100%)',
    woodGrainColor: 'rgba(18, 9, 4, 0.35)',
    paperTint: '#faf4e8',
    accent: '#9a4f2b',
    accentSoft: '#f2dfd0',
    inkColor: '#2c1e16',
    ribbonColor: '#8d2d2d',
    ambientEmoji: '☕',
    coverGradient: 'linear-gradient(145deg, #4b2b1a 0%, #2e190e 60%, #1f1008 100%)',
  },
  spring: {
    id: 'spring',
    name: 'Spring',
    indianName: 'Vasanta',
    tagline: 'Honey oak wood, blooming gulmohar & mustard blossoms',
    woodTone: '#7c5130',
    deskGradient:
      'radial-gradient(circle at 80% 20%, rgba(255, 224, 150, 0.22), transparent 50%), linear-gradient(135deg, #694124 0%, #8b5b36 48%, #5b371d 100%)',
    woodGrainColor: 'rgba(54, 29, 12, 0.25)',
    paperTint: '#fcf8ef',
    accent: '#c2546a',
    accentSoft: '#fbe2e7',
    inkColor: '#31211b',
    ribbonColor: '#c2546a',
    ambientEmoji: '🌸',
    coverGradient: 'linear-gradient(145deg, #744429 0%, #522d1a 60%, #3d2011 100%)',
  },
  summer: {
    id: 'summer',
    name: 'Summer',
    indianName: 'Grishma',
    tagline: 'Sunlit mango wood, golden afternoons & sweet mangoes',
    woodTone: '#8f5f34',
    deskGradient:
      'radial-gradient(circle at 30% 10%, rgba(255, 232, 145, 0.26), transparent 55%), linear-gradient(135deg, #7d4f27 0%, #a56f3d 50%, #6d421f 100%)',
    woodGrainColor: 'rgba(66, 36, 12, 0.24)',
    paperTint: '#fdf9ee',
    accent: '#c87a19',
    accentSoft: '#fcecc8',
    inkColor: '#2f2014',
    ribbonColor: '#d27d1c',
    ambientEmoji: '🥭',
    coverGradient: 'linear-gradient(145deg, #865026 0%, #5c3416 60%, #44250e 100%)',
  },
  monsoon: {
    id: 'monsoon',
    name: 'Monsoon',
    indianName: 'Varsha',
    tagline: 'Rain-kissed rosewood, petrichor & lush emerald leaves',
    woodTone: '#3d2520',
    deskGradient:
      'radial-gradient(circle at 75% 15%, rgba(132, 198, 179, 0.16), transparent 52%), linear-gradient(135deg, #271918 0%, #412926 48%, #1e1312 100%)',
    woodGrainColor: 'rgba(15, 8, 8, 0.34)',
    paperTint: '#f7f6ee',
    accent: '#2f6d5c',
    accentSoft: '#d8ece5',
    inkColor: '#1f2824',
    ribbonColor: '#2f6d5c',
    ambientEmoji: '🌧️',
    coverGradient: 'linear-gradient(145deg, #3a2623 0%, #241715 60%, #19100e 100%)',
  },
  autumn: {
    id: 'autumn',
    name: 'Autumn',
    indianName: 'Sharad',
    tagline: 'Warm sheesham wood, marigold garlands & festive diyas',
    woodTone: '#5a331d',
    deskGradient:
      'radial-gradient(circle at 50% 12%, rgba(255, 193, 94, 0.2), transparent 55%), linear-gradient(135deg, #4a2815 0%, #6b3d22 50%, #3b1f0f 100%)',
    woodGrainColor: 'rgba(28, 13, 5, 0.3)',
    paperTint: '#fbf5e6',
    accent: '#c45b1f',
    accentSoft: '#fae2cc',
    inkColor: '#2d1c12',
    ribbonColor: '#c45b1f',
    ambientEmoji: '🪔',
    coverGradient: 'linear-gradient(145deg, #64351c 0%, #422110 60%, #2d1509 100%)',
  },
};

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function getSeasonForMonth(monthIndex0: number): IndianSeasonTheme {
  // India seasons:
  // Nov (10), Dec (11), Jan (0) -> Winter
  // Feb (1), Mar (2) -> Spring (Vasanta)
  // Apr (3), May (4), Jun (5) -> Summer (Grishma)
  // Jul (6), Aug (7), Sep (8) -> Monsoon (Varsha)
  // Oct (9) -> Autumn (Sharad)
  if (monthIndex0 === 10 || monthIndex0 === 11 || monthIndex0 === 0) {
    return INDIAN_SEASONS.winter;
  }
  if (monthIndex0 === 1 || monthIndex0 === 2) {
    return INDIAN_SEASONS.spring;
  }
  if (monthIndex0 >= 3 && monthIndex0 <= 5) {
    return INDIAN_SEASONS.summer;
  }
  if (monthIndex0 >= 6 && monthIndex0 <= 8) {
    return INDIAN_SEASONS.monsoon;
  }
  return INDIAN_SEASONS.autumn;
}

export function parseMonthKey(monthKey: string): {
  year: number;
  monthIndex0: number;
  monthName: string;
  shortName: string;
  daysInMonth: number;
  season: IndianSeasonTheme;
} {
  const [yStr, mStr] = monthKey.split('-');
  const year = Number(yStr) || 2026;
  const monthIndex0 = Math.max(0, Math.min(11, (Number(mStr) || 11) - 1));
  const daysInMonth = new Date(year, monthIndex0 + 1, 0).getDate();
  return {
    year,
    monthIndex0,
    monthName: MONTH_NAMES[monthIndex0],
    shortName: MONTH_SHORT[monthIndex0],
    daysInMonth,
    season: getSeasonForMonth(monthIndex0),
  };
}

// Generate all months from Jan 2026 to Dec 2027 (24 months for 2026–27 diary)
export const ALL_MONTH_KEYS: string[] = (() => {
  const keys: string[] = [];
  for (const year of [2026, 2027]) {
    for (let m = 1; m <= 12; m++) {
      keys.push(`${year}-${String(m).padStart(2, '0')}`);
    }
  }
  return keys;
})();
