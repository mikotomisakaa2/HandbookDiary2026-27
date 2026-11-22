import { SeasonId } from '../types/diary';

export interface StickerDef {
  id: string;
  label: string;
  category: SeasonId | 'cozy';
  svg: string;
}

export const STICKERS: StickerDef[] = [
  // Winter (Hemanta & Shishira)
  {
    id: 'kulhad-chai',
    label: 'Kulhad Chai',
    category: 'winter',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 30 L56 30 L50 66 C49 70 31 70 30 66 Z" fill="#C97343" stroke="#4A2715" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="40" cy="30" rx="16" ry="5" fill="#7D4322" stroke="#4A2715" stroke-width="2.2"/>
      <path d="M32 22 C30 16 36 14 34 8" stroke="#8C6B53" stroke-width="2.3" stroke-linecap="round"/>
      <path d="M41 20 C39 14 45 12 43 6" stroke="#8C6B53" stroke-width="2.3" stroke-linecap="round"/>
      <path d="M49 22 C47 17 52 15 50 10" stroke="#8C6B53" stroke-width="2.3" stroke-linecap="round"/>
      <path d="M27 42 Q40 47 53 42" stroke="#F4D8B8" stroke-width="2" stroke-dasharray="3 3"/>
      <circle cx="35" cy="52" r="2" fill="#4A2715"/>
      <circle cx="45" cy="52" r="2" fill="#4A2715"/>
      <path d="M37 56 Q40 59 43 56" stroke="#4A2715" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'cozy-scarf',
    label: 'Winter Muffler',
    category: 'winter',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="24" width="44" height="16" rx="8" fill="#B94B4B" stroke="#4A1E1E" stroke-width="2.4"/>
      <rect x="44" y="34" width="14" height="28" rx="4" fill="#D46658" stroke="#4A1E1E" stroke-width="2.4"/>
      <path d="M26 24 V40 M36 24 V40 M46 24 V40" stroke="#F7DFC4" stroke-width="2.2"/>
      <path d="M46 62 V68 M51 62 V69 M56 62 V68" stroke="#4A1E1E" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'snowflake',
    label: 'Frost Flake',
    category: 'winter',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#5C85A8" stroke-width="3" stroke-linecap="round">
        <line x1="40" y1="12" x2="40" y2="68"/>
        <line x1="12" y1="40" x2="68" y2="40"/>
        <line x1="20" y1="20" x2="60" y2="60"/>
        <line x1="60" y1="20" x2="20" y2="60"/>
      </g>
      <circle cx="40" cy="40" r="7" fill="#DCEEFB" stroke="#5C85A8" stroke-width="2.5"/>
    </svg>`,
  },

  // Spring (Vasanta)
  {
    id: 'gulmohar',
    label: 'Spring Blossom',
    category: 'spring',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="24" r="11" fill="#F28CA2" stroke="#6E2E3D" stroke-width="2.2"/>
      <circle cx="55" cy="36" r="11" fill="#F6A2B5" stroke="#6E2E3D" stroke-width="2.2"/>
      <circle cx="49" cy="54" r="11" fill="#F28CA2" stroke="#6E2E3D" stroke-width="2.2"/>
      <circle cx="31" cy="54" r="11" fill="#F6A2B5" stroke="#6E2E3D" stroke-width="2.2"/>
      <circle cx="25" cy="36" r="11" fill="#F28CA2" stroke="#6E2E3D" stroke-width="2.2"/>
      <circle cx="40" cy="41" r="9" fill="#F7CE65" stroke="#6E2E3D" stroke-width="2.2"/>
      <circle cx="37" cy="40" r="1.4" fill="#6E2E3D"/>
      <circle cx="43" cy="40" r="1.4" fill="#6E2E3D"/>
      <path d="M38 44 Q40 46 42 44" stroke="#6E2E3D" stroke-width="1.6" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'butterfly',
    label: 'Garden Butterfly',
    category: 'spring',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="26" cy="34" rx="14" ry="11" transform="rotate(-20 26 34)" fill="#F9B572" stroke="#4D2C16" stroke-width="2.3"/>
      <ellipse cx="54" cy="34" rx="14" ry="11" transform="rotate(20 54 34)" fill="#F9B572" stroke="#4D2C16" stroke-width="2.3"/>
      <ellipse cx="28" cy="50" rx="10" ry="9" transform="rotate(20 28 50)" fill="#F28B82" stroke="#4D2C16" stroke-width="2.3"/>
      <ellipse cx="52" cy="50" rx="10" ry="9" transform="rotate(-20 52 50)" fill="#F28B82" stroke="#4D2C16" stroke-width="2.3"/>
      <rect x="37" y="25" width="6" height="32" rx="3" fill="#4D2C16"/>
      <path d="M39 26 Q33 16 28 18 M41 26 Q47 16 52 18" stroke="#4D2C16" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },

  // Summer (Grishma)
  {
    id: 'alphonso-mango',
    label: 'Sweet Mango',
    category: 'summer',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M44 18 C59 20 63 39 54 55 C46 68 27 69 22 57 C17 44 26 17 44 18 Z" fill="#F9B833" stroke="#5A3410" stroke-width="2.5"/>
      <path d="M44 18 C48 11 56 11 59 15 C53 19 48 19 44 18 Z" fill="#5D9C59" stroke="#2D4F2B" stroke-width="2"/>
      <circle cx="35" cy="44" r="2.2" fill="#5A3410"/>
      <circle cx="46" cy="44" r="2.2" fill="#5A3410"/>
      <path d="M38 49 Q40.5 52 43 49" stroke="#5A3410" stroke-width="2" stroke-linecap="round"/>
      <circle cx="31" cy="48" r="3" fill="#F2796B" opacity="0.5"/>
      <circle cx="50" cy="48" r="3" fill="#F2796B" opacity="0.5"/>
    </svg>`,
  },
  {
    id: 'sunshine',
    label: 'Golden Sun',
    category: 'summer',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="16" fill="#FFD15C" stroke="#7A4B12" stroke-width="2.5"/>
      <g stroke="#E38B29" stroke-width="3" stroke-linecap="round">
        <line x1="40" y1="10" x2="40" y2="18"/>
        <line x1="40" y1="62" x2="40" y2="70"/>
        <line x1="10" y1="40" x2="18" y2="40"/>
        <line x1="62" y1="40" x2="70" y2="40"/>
        <line x1="19" y1="19" x2="25" y2="25"/>
        <line x1="55" y1="55" x2="61" y2="61"/>
        <line x1="61" y1="19" x2="55" y2="25"/>
        <line x1="25" y1="55" x2="19" y2="61"/>
      </g>
      <circle cx="35" cy="39" r="2" fill="#7A4B12"/>
      <circle cx="45" cy="39" r="2" fill="#7A4B12"/>
      <path d="M36 44 Q40 48 44 44" stroke="#7A4B12" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },

  // Monsoon (Varsha)
  {
    id: 'monsoon-umbrella',
    label: 'Rainy Umbrella',
    category: 'monsoon',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 42 C16 22 64 22 66 42 Q56 36 48 42 Q40 36 32 42 Q24 36 14 42 Z" fill="#4E9484" stroke="#1E4038" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M40 20 V60 C40 66 48 66 48 60" stroke="#4D2E1B" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="22" cy="18" r="2.2" fill="#6BB6D6"/>
      <circle cx="58" cy="16" r="2.2" fill="#6BB6D6"/>
      <circle cx="64" cy="27" r="2" fill="#6BB6D6"/>
    </svg>`,
  },
  {
    id: 'rain-cloud',
    label: 'Cute Cloud',
    category: 'monsoon',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 48 H57 C64 48 68 43 67 37 C66 31 60 28 55 29 C53 21 44 17 36 20 C29 22 25 28 25 33 C18 33 14 38 15 43 C16 46 19 48 22 48 Z" fill="#D4E8F2" stroke="#3B5B6E" stroke-width="2.4"/>
      <circle cx="34" cy="37" r="2" fill="#3B5B6E"/>
      <circle cx="46" cy="37" r="2" fill="#3B5B6E"/>
      <path d="M38 41 Q40 43 42 41" stroke="#3B5B6E" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M28 55 L25 63 M40 55 L37 64 M52 55 L49 63" stroke="#5398BE" stroke-width="2.8" stroke-linecap="round"/>
    </svg>`,
  },

  // Autumn (Sharad)
  {
    id: 'festive-diya',
    label: 'Festive Diya',
    category: 'autumn',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 14 C46 24 47 32 40 37 C33 32 34 24 40 14 Z" fill="#FFB830" stroke="#A34A12" stroke-width="2"/>
      <path d="M40 22 C43 27 43 32 40 35 C37 32 37 27 40 22 Z" fill="#FFF3B0"/>
      <path d="M16 44 C20 62 60 62 64 44 Q40 51 16 44 Z" fill="#C45B2C" stroke="#4D1E0B" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M23 51 Q40 58 57 51" stroke="#FFD166" stroke-width="2.4" stroke-dasharray="4 3"/>
    </svg>`,
  },
  {
    id: 'marigold',
    label: 'Marigold',
    category: 'autumn',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="22" fill="#F28C28" stroke="#7A360A" stroke-width="2.4" stroke-dasharray="6 3"/>
      <circle cx="40" cy="40" r="15" fill="#FFA933" stroke="#7A360A" stroke-width="2"/>
      <circle cx="40" cy="40" r="8" fill="#FFD166" stroke="#7A360A" stroke-width="1.8"/>
    </svg>`,
  },

  // Cozy / Pinterest Everyday Stickers
  {
    id: 'sparkles',
    label: 'Gold Sparkles',
    category: 'cozy',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 14 L40 30 L56 34 L40 38 L36 54 L32 38 L16 34 L32 30 Z" fill="#F7C957" stroke="#6E4A11" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M58 44 L60 51 L67 53 L60 55 L58 62 L56 55 L49 53 L56 51 Z" fill="#F5A67E" stroke="#6E4A11" stroke-width="1.8" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    id: 'open-book',
    label: 'Tiny Book',
    category: 'cozy',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 26 Q28 20 40 28 Q52 20 66 26 V58 Q52 52 40 60 Q28 52 14 58 Z" fill="#FFF8EB" stroke="#4D3321" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="40" y1="28" x2="40" y2="60" stroke="#4D3321" stroke-width="2.2"/>
      <path d="M20 35 H33 M20 42 H33 M47 35 H60 M47 42 H60" stroke="#A68B72" stroke-width="2" stroke-linecap="round"/>
      <path d="M47 26 V40 L51 37 L55 40 V26" fill="#C94B4B"/>
    </svg>`,
  },
  {
    id: 'cafe-latte',
    label: 'Cafe Latte',
    category: 'cozy',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 32 H54 L50 60 C49 65 25 65 24 60 Z" fill="#F3E5D0" stroke="#4A2F1D" stroke-width="2.5"/>
      <path d="M53 38 C63 38 63 52 52 52" stroke="#4A2F1D" stroke-width="2.5" fill="none"/>
      <ellipse cx="37" cy="32" rx="17" ry="5" fill="#9A623C" stroke="#4A2F1D" stroke-width="2.2"/>
      <path d="M37 35 C33 32 32 29 35 28 C36.5 27.5 37 29 37 29 C37 29 37.5 27.5 39 28 C42 29 41 32 37 35 Z" fill="#FFF6EA"/>
    </svg>`,
  },
  {
    id: 'film-clapper',
    label: 'Movie Night',
    category: 'cozy',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="34" width="48" height="32" rx="4" fill="#3B3430" stroke="#1E1916" stroke-width="2.4"/>
      <rect x="16" y="22" width="48" height="12" rx="2" transform="rotate(-7 16 22)" fill="#E9DFCE" stroke="#1E1916" stroke-width="2.4"/>
      <path d="M26 21 L31 32 M40 19 L45 30 M54 18 L59 29" stroke="#1E1916" stroke-width="3"/>
      <path d="M26 48 H54 M26 56 H42" stroke="#E9DFCE" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'vintage-camera',
    label: 'My Clicks',
    category: 'cozy',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="26" width="52" height="36" rx="7" fill="#D9B99B" stroke="#452F1E" stroke-width="2.5"/>
      <rect x="26" y="19" width="16" height="8" rx="3" fill="#8C6245" stroke="#452F1E" stroke-width="2.2"/>
      <circle cx="40" cy="44" r="11" fill="#452F1E" stroke="#F8EFE2" stroke-width="3"/>
      <circle cx="43" cy="41" r="3" fill="#A5C9CA"/>
      <circle cx="56" cy="34" r="2.8" fill="#C94B4B"/>
    </svg>`,
  },
  {
    id: 'potted-plant',
    label: 'Desk Plant',
    category: 'cozy',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M26 46 H54 L50 66 H30 Z" fill="#C46B48" stroke="#4D2616" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M40 46 C40 34 26 30 22 20 C33 20 40 28 40 36 Z" fill="#639A67" stroke="#244226" stroke-width="2.2"/>
      <path d="M40 46 C40 32 54 28 58 18 C47 18 40 26 40 36 Z" fill="#7EB57A" stroke="#244226" stroke-width="2.2"/>
      <path d="M40 46 C36 30 40 16 40 14 C44 22 44 34 40 46 Z" fill="#4D8252" stroke="#244226" stroke-width="2"/>
    </svg>`,
  },
  {
    id: 'heart-doodle',
    label: 'Cute Heart',
    category: 'cozy',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 62 C20 48 16 32 25 23 C31 17 38 22 40 27 C42 22 49 17 55 23 C64 32 60 48 40 62 Z" fill="#E97777" stroke="#6B2424" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M28 29 Q31 25 35 27" stroke="#FFE3E3" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'sleepy-cat',
    label: 'Cozy Cat',
    category: 'cozy',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 36 L26 18 L36 28 H44 L54 18 L58 36 C62 48 54 62 40 62 C26 62 18 48 22 36 Z" fill="#F2D7B6" stroke="#4D3321" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M30 43 Q33 46 36 43 M44 43 Q47 46 50 43" stroke="#4D3321" stroke-width="2.2" stroke-linecap="round"/>
      <polygon points="38,47 42,47 40,50" fill="#D97A7A"/>
      <path d="M16 45 H25 M17 50 H25 M55 45 H64 M55 50 H63" stroke="#4D3321" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'crescent-moon',
    label: 'Dreamy Moon',
    category: 'cozy',
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M48 18 C32 20 22 34 25 49 C28 62 43 68 56 61 C44 61 36 51 37 39 C38 29 42 22 48 18 Z" fill="#F6D57E" stroke="#6E4E18" stroke-width="2.4" stroke-linejoin="round"/>
      <circle cx="55" cy="28" r="3" fill="#F6D57E" stroke="#6E4E18" stroke-width="1.6"/>
      <circle cx="62" cy="42" r="2" fill="#F6D57E" stroke="#6E4E18" stroke-width="1.4"/>
    </svg>`,
  },
];

export function getStickerById(id: string): StickerDef {
  return STICKERS.find((s) => s.id === id) || STICKERS[0];
}
