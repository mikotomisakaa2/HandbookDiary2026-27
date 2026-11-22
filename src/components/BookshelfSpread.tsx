import React, { useState } from 'react';
import { BookOpen, Bookmark, Plus, Search, Trash2 } from 'lucide-react';
import { BookEntry, BookShelfCategory } from '../types/diary';
import {
  BookSearchResult,
  randomSpineColor,
  searchBooksWithCovers,
} from '../utils/bookApi';

interface BookshelfSpreadProps {
  books: BookEntry[];
  onAddBook: (book: BookEntry) => void;
  onUpdateBook: (book: BookEntry) => void;
  onDeleteBook: (id: string) => void;
}

const SHELVES: {
  id: BookShelfCategory;
  title: string;
  subtitle: string;
  pinColor: string;
}[] = [
  {
    id: 'finished',
    title: 'Finished Reading',
    subtitle: 'Books completed cover to cover',
    pinColor: '#3e7c59',
  },
  {
    id: 'partial',
    title: 'Partially Finished',
    subtitle: 'Currently reading — pinned at your page',
    pinColor: '#c87a19',
  },
  {
    id: 'stopped',
    title: 'Not Finished (Not Reading Further)',
    subtitle: 'Set aside for now',
    pinColor: '#9c3f3f',
  },
];

export const BookshelfSpread: React.FC<BookshelfSpreadProps> = ({
  books,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
}) => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [selectedShelf, setSelectedShelf] = useState<BookShelfCategory>('finished');
  const [pinnedPage, setPinnedPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<string>('');
  const [note, setNote] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customAuthor, setCustomAuthor] = useState('');
  const [selectedCover, setSelectedCover] = useState<string | undefined>(undefined);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    const found = await searchBooksWithCovers(query);
    setResults(found);
    setSearching(false);
  };

  const pickResult = (r: BookSearchResult) => {
    setCustomTitle(r.title);
    setCustomAuthor(r.author);
    setSelectedCover(r.coverUrl);
    if (r.totalPages) {
      setTotalPages(String(r.totalPages));
      if (selectedShelf === 'finished') {
        setPinnedPage(r.totalPages);
      }
    }
  };

  const handlePlaceOnShelf = (e: React.FormEvent) => {
    e.preventDefault();
    const title = (customTitle || query).trim();
    if (!title) return;
    const total = totalPages ? Number(totalPages) : undefined;
    const entry: BookEntry = {
      id: `book-${Date.now()}`,
      title,
      author: customAuthor.trim() || 'Unknown Author',
      coverUrl: selectedCover,
      spineColor: randomSpineColor(title),
      shelf: selectedShelf,
      pinnedPage: Math.max(0, Number(pinnedPage) || 0),
      totalPages: total && total > 0 ? total : undefined,
      note: note.trim() || undefined,
      addedAt: new Date().toISOString().slice(0, 10),
    };
    onAddBook(entry);
    setQuery('');
    setCustomTitle('');
    setCustomAuthor('');
    setSelectedCover(undefined);
    setPinnedPage(1);
    setTotalPages('');
    setNote('');
    setResults([]);
  };

  return (
    <>
      {/* LEFT PAGE: 3 Wooden Shelves (Hover any book to see title, pinned page & actions!) */}
      <div className="diary-page diary-page-left bookshelf-page">
        <div className="bookshelf-header">
          <div>
            <h2>My Wooden Bookshelf</h2>
            <p>Hover any book to see its pinned page number &amp; details</p>
          </div>
          <span className="bookshelf-count-pill">
            <BookOpen size={14} /> {books.length} books
          </span>
        </div>

        <div className="wooden-shelves-stack">
          {SHELVES.map((shelf) => {
            const shelfBooks = books.filter((b) => b.shelf === shelf.id);
            return (
              <div key={shelf.id} className="wood-shelf-tier">
                <div className="shelf-tier-label">
                  <span
                    className="shelf-dot"
                    style={{ backgroundColor: shelf.pinColor }}
                  />
                  <strong>{shelf.title}</strong>
                  <span className="shelf-tier-count">({shelfBooks.length})</span>
                </div>

                <div className="shelf-books-row">
                  {shelfBooks.length === 0 ? (
                    <div className="shelf-empty-hint">
                      No books on this shelf yet — add one on the right page →
                    </div>
                  ) : (
                    shelfBooks.map((book) => (
                      <div key={book.id} className="shelf-book-slot">
                        {/* Clean visual book cover — nothing written over it unless hovered */}
                        <div
                          className="shelf-book-cover"
                          style={{ backgroundColor: book.spineColor }}
                        >
                          {book.coverUrl ? (
                            <img
                              src={book.coverUrl}
                              alt={book.title}
                              loading="lazy"
                            />
                          ) : (
                            <div className="book-cloth-fallback">
                              <span className="book-cloth-emblem">✦</span>
                            </div>
                          )}

                          {/* Tiny bookmark pin ribbon */}
                          <span
                            className="book-bookmark-pin"
                            style={{ backgroundColor: shelf.pinColor }}
                            aria-hidden="true"
                          />
                        </div>

                        {/* Hover popover card with title, author, pinned page number & quick edits */}
                        <div className="book-hover-popover">
                          <div className="popover-book-title">{book.title}</div>
                          <div className="popover-book-author">by {book.author}</div>

                          <div className="popover-pin-row">
                            <Bookmark size={13} />
                            <span>Pinned page:</span>
                            <input
                              type="number"
                              min={0}
                              className="popover-page-input"
                              value={book.pinnedPage}
                              onChange={(e) =>
                                onUpdateBook({
                                  ...book,
                                  pinnedPage: Math.max(0, Number(e.target.value) || 0),
                                })
                              }
                            />
                            {book.totalPages && (
                              <span className="popover-total-pages">
                                / {book.totalPages}
                              </span>
                            )}
                          </div>

                          {book.note && (
                            <div className="popover-book-note">“{book.note}”</div>
                          )}

                          <div className="popover-actions">
                            <select
                              value={book.shelf}
                              onChange={(e) =>
                                onUpdateBook({
                                  ...book,
                                  shelf: e.target.value as BookShelfCategory,
                                })
                              }
                              aria-label="Move book to shelf"
                            >
                              <option value="finished">Finished</option>
                              <option value="partial">Partially</option>
                              <option value="stopped">Stopped</option>
                            </select>
                            <button
                              type="button"
                              className="popover-del-btn"
                              onClick={() => onDeleteBook(book.id)}
                              title="Remove book"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Realistic wooden plank ledge */}
                <div className="wooden-plank-ledge" />
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PAGE: Search & Fetch Real Book Covers + Pin Page Number */}
      <div className="diary-page diary-page-right bookshelf-add-page">
        <div className="bookshelf-header">
          <div>
            <h2>Add a Book to Your Shelf</h2>
            <p>Search any title to automatically fetch its real book cover</p>
          </div>
        </div>

        <form className="book-search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search book title (e.g. Ikigai, Harry Potter, Dune)..."
          />
          <button type="submit" disabled={searching}>
            <Search size={15} />
            {searching ? 'Fetching...' : 'Find Cover'}
          </button>
        </form>

        {results.length > 0 && (
          <div className="book-search-results">
            {results.map((r, i) => (
              <button
                key={`${r.title}-${i}`}
                type="button"
                className={`book-result-card ${
                  customTitle === r.title && selectedCover === r.coverUrl
                    ? 'is-picked'
                    : ''
                }`}
                onClick={() => pickResult(r)}
              >
                {r.coverUrl ? (
                  <img src={r.coverUrl} alt={r.title} />
                ) : (
                  <div className="book-result-nocover">📖</div>
                )}
                <div className="book-result-meta">
                  <strong>{r.title}</strong>
                  <span>{r.author}</span>
                  {r.totalPages && <small>{r.totalPages} pages</small>}
                </div>
              </button>
            ))}
          </div>
        )}

        <form className="book-details-form" onSubmit={handlePlaceOnShelf}>
          <div className="book-preview-strip">
            <div
              className="book-preview-thumb"
              style={{
                backgroundColor: randomSpineColor(customTitle || query || 'Book'),
              }}
            >
              {selectedCover ? (
                <img src={selectedCover} alt="Selected cover" />
              ) : (
                <span>✦</span>
              )}
            </div>
            <div className="book-preview-fields">
              <label>
                Book Title
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter or pick a book title..."
                  required
                />
              </label>
              <label>
                Author
                <input
                  type="text"
                  value={customAuthor}
                  onChange={(e) => setCustomAuthor(e.target.value)}
                  placeholder="Author name"
                />
              </label>
            </div>
          </div>

          <div className="book-form-grid">
            <label>
              Shelf
              <select
                value={selectedShelf}
                onChange={(e) =>
                  setSelectedShelf(e.target.value as BookShelfCategory)
                }
              >
                <option value="finished">Finished Reading</option>
                <option value="partial">Partially Finished</option>
                <option value="stopped">Not Finished (Stopped)</option>
              </select>
            </label>

            <label>
              Pinned Page #
              <input
                type="number"
                min={0}
                value={pinnedPage}
                onChange={(e) => setPinnedPage(Number(e.target.value))}
              />
            </label>

            <label>
              Total Pages
              <input
                type="number"
                min={1}
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                placeholder="Optional"
              />
            </label>
          </div>

          <label className="book-note-label">
            Hover Note (shown only on hover)
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="A tiny memory or favorite quote..."
            />
          </label>

          <button type="submit" className="place-book-btn">
            <Plus size={16} /> Place Book on Wooden Shelf
          </button>
        </form>
      </div>
    </>
  );
};
