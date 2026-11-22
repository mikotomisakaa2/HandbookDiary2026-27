export interface BookSearchResult {
  title: string;
  author: string;
  coverUrl?: string;
  totalPages?: number;
  year?: number;
}

const SPINE_COLORS = [
  '#7c3a2d',
  '#355c52',
  '#485478',
  '#8c5a2b',
  '#6c3d59',
  '#3e5e3e',
  '#944839',
  '#52463a',
];

export function randomSpineColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 997;
  }
  return SPINE_COLORS[Math.abs(hash) % SPINE_COLORS.length];
}

export async function searchBooksWithCovers(
  query: string
): Promise<BookSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // Try Open Library first
  try {
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(trimmed)}&limit=8&fields=title,author_name,cover_i,number_of_pages_median,first_publish_year`
    );
    if (res.ok) {
      const data = await res.json();
      const docs = Array.isArray(data.docs) ? data.docs : [];
      if (docs.length > 0) {
        return docs.map((d: any) => ({
          title: d.title || trimmed,
          author: Array.isArray(d.author_name) ? d.author_name[0] : 'Unknown Author',
          coverUrl: d.cover_i
            ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
            : undefined,
          totalPages:
            typeof d.number_of_pages_median === 'number'
              ? d.number_of_pages_median
              : undefined,
          year: d.first_publish_year,
        }));
      }
    }
  } catch {
    // Fallback to Google Books below
  }

  // Fallback to Google Books API
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(trimmed)}&maxResults=6`
    );
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data.items) ? data.items : [];
      return items.map((item: any) => {
        const info = item.volumeInfo || {};
        const thumb = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail;
        return {
          title: info.title || trimmed,
          author: Array.isArray(info.authors) ? info.authors[0] : 'Unknown Author',
          coverUrl: thumb ? String(thumb).replace('http://', 'https://') : undefined,
          totalPages: typeof info.pageCount === 'number' ? info.pageCount : undefined,
        };
      });
    }
  } catch {
    // Offline fallback
  }

  return [
    {
      title: trimmed,
      author: 'Personal Library',
    },
  ];
}
