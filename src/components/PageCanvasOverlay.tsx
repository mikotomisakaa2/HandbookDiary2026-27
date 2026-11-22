import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  ExternalLink,
  Music,
  RotateCw,
  Sparkles,
  Star,
  Trash2,
  Trophy,
} from 'lucide-react';
import { PageItem, PhotoItem, StickyNoteItem } from '../types/diary';
import { getStickerById } from '../data/stickers';
import { getImageFromIdb } from '../utils/storage';
import { hoverSongPlayer } from '../utils/ambientAudio';

interface PageCanvasOverlayProps {
  pageId: string;
  items: PageItem[];
  onUpdateItem: (pageId: string, item: PageItem) => void;
  onDeleteItem: (pageId: string, itemId: string) => void;
}

const STICKY_COLORS: Record<StickyNoteItem['color'], string> = {
  butter: '#fff4b8',
  blush: '#fddde6',
  sage: '#d8edd9',
  sky: '#d7eefc',
  kraft: '#e7d2b5',
  lavender: '#e8dff9',
};

const TAPE_COLORS: Record<PhotoItem['tapeColor'], string> = {
  kraft: 'rgba(212, 180, 131, 0.84)',
  sage: 'rgba(164, 195, 162, 0.84)',
  blush: 'rgba(235, 179, 187, 0.84)',
  mustard: 'rgba(235, 200, 114, 0.84)',
  sky: 'rgba(168, 205, 224, 0.84)',
};

const PhotoCardInner: React.FC<{
  item: PhotoItem;
  onChangeSideNote: (val: string) => void;
  onChangeCaption: (val: string) => void;
}> = ({ item, onChangeSideNote, onChangeCaption }) => {
  const [resolvedSrc, setResolvedSrc] = useState<string>(
    item.imageRef.startsWith('idb:') ? '' : item.imageRef
  );
  const [isHoverPlaying, setIsHoverPlaying] = useState(false);

  useEffect(() => {
    let active = true;
    if (item.imageRef.startsWith('idb:')) {
      getImageFromIdb(item.imageRef).then((url) => {
        if (active) setResolvedSrc(url);
      });
    } else {
      setResolvedSrc(item.imageRef);
    }
    return () => {
      active = false;
    };
  }, [item.imageRef]);

  useEffect(() => {
    return () => {
      hoverSongPlayer.stop();
    };
  }, []);

  const categoryLabels: Record<PhotoItem['category'], string> = {
    cafe: '☕ Cafe',
    movie: '🎬 Movie',
    click: '📷 My Click',
    travel: '🧭 Travel',
    moment: '✨ Moment',
  };

  const handleMouseEnter = () => {
    if (item.song) {
      setIsHoverPlaying(true);
      void hoverSongPlayer.play(item.song, item.id);
    }
  };

  const handleMouseLeave = () => {
    if (item.song) {
      setIsHoverPlaying(false);
      hoverSongPlayer.stop();
    }
  };

  return (
    <div
      className={`polaroid-with-sidenote ${isHoverPlaying ? 'is-song-playing' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="washi-tape"
        style={{ backgroundColor: TAPE_COLORS[item.tapeColor] }}
      />
      <div className="polaroid-frame">
        <div className="polaroid-img-wrap">
          {resolvedSrc ? (
            item.mediaKind === 'video' ? (
              <video
                src={resolvedSrc}
                muted={!isHoverPlaying}
                loop
                playsInline
                controls
                className="polaroid-video-el"
                onPointerDown={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={resolvedSrc}
                alt={item.caption || 'Memory'}
                draggable={false}
              />
            )
          ) : (
            <div className="polaroid-placeholder">Loading media...</div>
          )}
          <span className="polaroid-cat-badge">
            {item.mediaKind === 'video' ? '🎞️ Video · ' : ''}
            {categoryLabels[item.category]}
          </span>
        </div>

        <input
          type="text"
          className="polaroid-caption-input"
          value={item.caption}
          onChange={(e) => onChangeCaption(e.target.value)}
          placeholder="Caption..."
          onPointerDown={(e) => e.stopPropagation()}
        />

        <div className="polaroid-footer-row">
          <span className="polaroid-date">{item.dateLabel}</span>
          {item.song && (
            <span
              className={`hover-song-badge ${isHoverPlaying ? 'playing' : ''}`}
              title={`Hover to play: ${item.song.title}`}
            >
              <Music size={10} /> {item.song.title}
            </span>
          )}
        </div>
      </div>

      {/* Handwritten side note right beside the photo/video */}
      <div
        className="polaroid-sidenote-box"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="sidenote-heading">Side Note</div>
        <textarea
          className="sidenote-textarea"
          value={item.sideNote}
          onChange={(e) => onChangeSideNote(e.target.value)}
          placeholder="Write about this cafe, movie, video, or moment..."
          rows={4}
        />
      </div>
    </div>
  );
};

export const PageCanvasOverlay: React.FC<PageCanvasOverlayProps> = ({
  pageId,
  items,
  onUpdateItem,
  onDeleteItem,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffset = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  const handlePointerDown = (e: React.PointerEvent, item: PageItem) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'A' ||
      target.tagName === 'VIDEO' ||
      target.closest('button')
    ) {
      return;
    }
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const itemPxX = (item.x / 100) * rect.width;
    const itemPxY = (item.y / 100) * rect.height;
    dragOffset.current = {
      dx: e.clientX - rect.left - itemPxX,
      dy: e.clientY - rect.top - itemPxY,
    };
    setDraggingId(item.id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent, item: PageItem) => {
    if (draggingId !== item.id) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nextX =
      ((e.clientX - rect.left - dragOffset.current.dx) / rect.width) * 100;
    const nextY =
      ((e.clientY - rect.top - dragOffset.current.dy) / rect.height) * 100;
    onUpdateItem(pageId, {
      ...item,
      x: Math.max(1, Math.min(84, nextX)),
      y: Math.max(1, Math.min(86, nextY)),
    });
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  const rotateItem = (item: PageItem) => {
    onUpdateItem(pageId, {
      ...item,
      rotation: ((item.rotation + 6 + 18) % 36) - 18,
    });
  };

  return (
    <div ref={containerRef} className="page-overlay-layer">
      {items.map((item) => (
        <div
          key={item.id}
          className={`canvas-item canvas-item-${item.type} ${
            draggingId === item.id ? 'is-dragging' : ''
          }`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `rotate(${item.rotation}deg)`,
          }}
          onPointerDown={(e) => handlePointerDown(e, item)}
          onPointerMove={(e) => handlePointerMove(e, item)}
          onPointerUp={handlePointerUp}
        >
          <div
            className="canvas-item-controls"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              title="Tilt / Rotate"
              onClick={() => rotateItem(item)}
            >
              <RotateCw size={12} />
            </button>
            <button
              type="button"
              title="Remove"
              className="danger"
              onClick={() => onDeleteItem(pageId, item.id)}
            >
              <Trash2 size={12} />
            </button>
          </div>

          {item.type === 'sticker' && (
            <div
              className="sticker-render"
              style={{
                width: `${66 * item.scale}px`,
                height: `${66 * item.scale}px`,
              }}
              dangerouslySetInnerHTML={{
                __html: getStickerById(item.stickerId).svg,
              }}
            />
          )}

          {item.type === 'sticky' && (
            <div
              className="sticky-note-card"
              style={{ backgroundColor: STICKY_COLORS[item.color] }}
            >
              <div className="sticky-pin" />
              <div className="sticky-curl-shadow" />
              <textarea
                className="sticky-textarea"
                value={item.text}
                onChange={(e) =>
                  onUpdateItem(pageId, { ...item, text: e.target.value })
                }
                placeholder="Write a sticky note..."
                onPointerDown={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {item.type === 'link' && (
            <div className={`link-bookmark-card link-${item.color}`}>
              <div className="link-bookmark-header">
                <span className="link-pin-dot" />
                <a
                  href={
                    item.url.startsWith('http')
                      ? item.url
                      : `https://${item.url}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="link-bookmark-title"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {item.title || item.url}
                  <ExternalLink size={12} />
                </a>
              </div>
              {item.note && <div className="link-bookmark-note">{item.note}</div>}
            </div>
          )}

          {item.type === 'photo' && (
            <PhotoCardInner
              item={item}
              onChangeSideNote={(val) =>
                onUpdateItem(pageId, { ...item, sideNote: val })
              }
              onChangeCaption={(val) =>
                onUpdateItem(pageId, { ...item, caption: val })
              }
            />
          )}

          {item.type === 'milestone' && (
            <div className={`milestone-stamp milestone-${item.badgeStyle}`}>
              <div className="milestone-icon">
                {item.badgeStyle === 'wax-seal' && <Award size={18} />}
                {item.badgeStyle === 'ribbon' && <Sparkles size={18} />}
                {item.badgeStyle === 'star-stamp' && <Star size={18} />}
                {item.badgeStyle === 'trophy' && <Trophy size={18} />}
              </div>
              <div className="milestone-text">
                <div className="milestone-title">{item.title}</div>
                {item.description && (
                  <div className="milestone-desc">{item.description}</div>
                )}
                <div className="milestone-date">{item.dateLabel}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
