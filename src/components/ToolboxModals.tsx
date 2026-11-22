import React, { useState } from 'react';
import { Music, Upload, X } from 'lucide-react';
import {
  HoverSong,
  LinkItem,
  MilestoneBadgeStyle,
  MilestoneItem,
  PageItem,
  PhotoCategory,
  PhotoItem,
  SeasonId,
  StickerItem,
  StickyNoteItem,
} from '../types/diary';
import { STICKERS } from '../data/stickers';
import { saveImageToIdb } from '../utils/storage';
import { SONG_PRESETS } from '../utils/ambientAudio';

export type ModalKind =
  | null
  | 'sticker'
  | 'sticky'
  | 'link'
  | 'photo'
  | 'milestone';

interface ToolboxModalsProps {
  activeModal: ModalKind;
  currentSeason: SeasonId;
  targetPageLabel: string;
  onClose: () => void;
  onAddItem: (item: PageItem) => void;
}

export const ToolboxModals: React.FC<ToolboxModalsProps> = ({
  activeModal,
  currentSeason,
  targetPageLabel,
  onClose,
  onAddItem,
}) => {
  const [stickerFilter, setStickerFilter] = useState<'season' | 'cozy' | 'all'>('season');

  // Sticky state
  const [stickyText, setStickyText] = useState('');
  const [stickyColor, setStickyColor] = useState<StickyNoteItem['color']>('butter');

  // Link state
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkNote, setLinkNote] = useState('');
  const [linkColor, setLinkColor] = useState<LinkItem['color']>('amber');

  // Photo / Video + Hover Song state
  const [mediaKind, setMediaKind] = useState<'image' | 'video'>('image');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoCategory, setPhotoCategory] = useState<PhotoCategory>('cafe');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoSideNote, setPhotoSideNote] = useState('');
  const [photoDate, setPhotoDate] = useState(
    new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  );
  const [tapeColor, setTapeColor] = useState<PhotoItem['tapeColor']>('kraft');
  const [songMode, setSongMode] = useState<'none' | 'preset' | 'custom'>('preset');
  const [songPresetId, setSongPresetId] = useState<string>('lofi-chai');
  const [customSongTitle, setCustomSongTitle] = useState('');
  const [customSongRef, setCustomSongRef] = useState('');

  // Milestone state
  const [msTitle, setMsTitle] = useState('');
  const [msDesc, setMsDesc] = useState('');
  const [msDate, setMsDate] = useState(
    new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  );
  const [msStyle, setMsStyle] = useState<MilestoneBadgeStyle>('wax-seal');

  if (!activeModal) return null;

  const randPos = () => ({
    x: 16 + Math.round(Math.random() * 44),
    y: 16 + Math.round(Math.random() * 44),
    rotation: Math.round(Math.random() * 10 - 5),
  });

  const handleAddSticker = (stickerId: string) => {
    const item: StickerItem = {
      id: `stk-${Date.now()}`,
      type: 'sticker',
      stickerId,
      scale: 1,
      ...randPos(),
    };
    onAddItem(item);
    onClose();
  };

  const handleAddSticky = (e: React.FormEvent) => {
    e.preventDefault();
    const item: StickyNoteItem = {
      id: `note-${Date.now()}`,
      type: 'sticky',
      text: stickyText.trim() || 'Remember this moment...',
      color: stickyColor,
      ...randPos(),
    };
    onAddItem(item);
    setStickyText('');
    onClose();
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    const item: LinkItem = {
      id: `lnk-${Date.now()}`,
      type: 'link',
      title: linkTitle.trim() || linkUrl.trim(),
      url: linkUrl.trim(),
      note: linkNote.trim() || undefined,
      color: linkColor,
      ...randPos(),
    };
    onAddItem(item);
    setLinkTitle('');
    setLinkUrl('');
    setLinkNote('');
    onClose();
  };

  const handleMediaFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith('video/')) {
      setMediaKind('video');
    } else {
      setMediaKind('image');
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoPreview(reader.result);
        setPhotoUrl('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCustomSongTitle(file.name.replace(/\.[^.]+$/, ''));
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomSongRef(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = photoPreview || photoUrl.trim();
    if (!raw) return;
    const imageRef = raw.startsWith('data:') ? await saveImageToIdb(raw) : raw;

    let song: HoverSong | undefined;
    if (songMode === 'preset') {
      const preset = SONG_PRESETS.find((p) => p.id === songPresetId);
      if (preset) {
        song = { title: preset.title, kind: 'preset', ref: preset.id };
      }
    } else if (songMode === 'custom' && customSongRef.trim()) {
      const savedSongRef = customSongRef.startsWith('data:')
        ? await saveImageToIdb(customSongRef)
        : customSongRef.trim();
      song = {
        title: customSongTitle.trim() || 'My Hover Song',
        kind: 'audio',
        ref: savedSongRef,
      };
    }

    const item: PhotoItem = {
      id: `pho-${Date.now()}`,
      type: 'photo',
      mediaKind,
      imageRef,
      category: photoCategory,
      caption: photoCaption.trim() || 'Sweet memory',
      sideNote: photoSideNote.trim(),
      dateLabel: photoDate,
      tapeColor,
      song,
      x: 10,
      y: 18,
      rotation: Math.round(Math.random() * 6 - 3),
    };
    onAddItem(item);
    setPhotoPreview('');
    setPhotoUrl('');
    setPhotoCaption('');
    setPhotoSideNote('');
    setCustomSongRef('');
    setCustomSongTitle('');
    onClose();
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msTitle.trim()) return;
    const item: MilestoneItem = {
      id: `ms-${Date.now()}`,
      type: 'milestone',
      title: msTitle.trim(),
      description: msDesc.trim(),
      dateLabel: msDate,
      badgeStyle: msStyle,
      ...randPos(),
    };
    onAddItem(item);
    setMsTitle('');
    setMsDesc('');
    onClose();
  };

  const filteredStickers = STICKERS.filter((s) => {
    if (stickerFilter === 'all') return true;
    if (stickerFilter === 'cozy') return s.category === 'cozy';
    return s.category === currentSeason || s.category === 'cozy';
  });

  return (
    <div className="diary-modal-backdrop" onClick={onClose}>
      <div className="diary-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="diary-modal-header">
          <div>
            <h3>
              {activeModal === 'sticker' && 'Cute Seasonal Stickers'}
              {activeModal === 'sticky' && 'Add a Realistic Sticky Note'}
              {activeModal === 'link' && 'Pin a Link Bookmark'}
              {activeModal === 'photo' && 'Tape a Photo / Video + Hover Song'}
              {activeModal === 'milestone' && 'Stamp a Milestone Earned'}
            </h3>
            <small>Placing on: {targetPageLabel}</small>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {activeModal === 'sticker' && (
          <div className="modal-body">
            <div className="sticker-filter-tabs">
              <button
                type="button"
                className={stickerFilter === 'season' ? 'active' : ''}
                onClick={() => setStickerFilter('season')}
              >
                This Season + Cozy
              </button>
              <button
                type="button"
                className={stickerFilter === 'cozy' ? 'active' : ''}
                onClick={() => setStickerFilter('cozy')}
              >
                Everyday Cozy
              </button>
              <button
                type="button"
                className={stickerFilter === 'all' ? 'active' : ''}
                onClick={() => setStickerFilter('all')}
              >
                All Stickers
              </button>
            </div>

            <div className="sticker-picker-grid">
              {filteredStickers.map((stk) => (
                <button
                  key={stk.id}
                  type="button"
                  className="sticker-choice-btn"
                  onClick={() => handleAddSticker(stk.id)}
                >
                  <div
                    className="sticker-choice-svg"
                    dangerouslySetInnerHTML={{ __html: stk.svg }}
                  />
                  <span>{stk.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeModal === 'sticky' && (
          <form className="modal-body modal-form" onSubmit={handleAddSticky}>
            <label>
              Note Text
              <textarea
                rows={4}
                value={stickyText}
                onChange={(e) => setStickyText(e.target.value)}
                placeholder="Write a reminder, quote, or little note..."
                autoFocus
              />
            </label>
            <div className="color-swatches-row">
              {(
                ['butter', 'blush', 'sage', 'sky', 'kraft', 'lavender'] as const
              ).map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`swatch swatch-${c} ${stickyColor === c ? 'active' : ''}`}
                  onClick={() => setStickyColor(c)}
                  title={c}
                />
              ))}
            </div>
            <button type="submit" className="modal-submit-btn">
              Stick onto Page
            </button>
          </form>
        )}

        {activeModal === 'link' && (
          <form className="modal-body modal-form" onSubmit={handleAddLink}>
            <label>
              Link Title
              <input
                type="text"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                placeholder="e.g. Pinterest Moodboard / Playlist / Article"
                required
              />
            </label>
            <label>
              URL
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </label>
            <label>
              Short Note (optional)
              <input
                type="text"
                value={linkNote}
                onChange={(e) => setLinkNote(e.target.value)}
                placeholder="Why I saved this link..."
              />
            </label>
            <div className="pill-choice-row">
              {(['amber', 'rose', 'teal', 'indigo'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  className={linkColor === c ? 'active' : ''}
                  onClick={() => setLinkColor(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <button type="submit" className="modal-submit-btn">
              Pin Link on Page
            </button>
          </form>
        )}

        {activeModal === 'photo' && (
          <form className="modal-body modal-form" onSubmit={handleAddPhoto}>
            <div className="pill-choice-row">
              <button
                type="button"
                className={mediaKind === 'image' ? 'active' : ''}
                onClick={() => setMediaKind('image')}
              >
                📷 Photo
              </button>
              <button
                type="button"
                className={mediaKind === 'video' ? 'active' : ''}
                onClick={() => setMediaKind('video')}
              >
                🎞️ Video
              </button>
            </div>

            <div className="photo-upload-row">
              <label className="upload-file-box">
                <Upload size={16} />
                <span>Upload {mediaKind === 'video' ? 'Video' : 'Photo'}</span>
                <input
                  type="file"
                  accept={mediaKind === 'video' ? 'video/*' : 'image/*'}
                  onChange={handleMediaFile}
                  hidden
                />
              </label>
              <span className="or-divider">or</span>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => {
                  setPhotoUrl(e.target.value);
                  setPhotoPreview('');
                }}
                placeholder={
                  mediaKind === 'video'
                    ? 'Paste MP4 / video URL...'
                    : 'Paste photo URL...'
                }
              />
            </div>

            {(photoPreview || photoUrl) && (
              <div className="photo-modal-preview">
                {mediaKind === 'video' ? (
                  <video src={photoPreview || photoUrl} controls muted />
                ) : (
                  <img src={photoPreview || photoUrl} alt="Preview" />
                )}
              </div>
            )}

            <div className="modal-two-col">
              <label>
                Category
                <select
                  value={photoCategory}
                  onChange={(e) =>
                    setPhotoCategory(e.target.value as PhotoCategory)
                  }
                >
                  <option value="cafe">☕ Cafe</option>
                  <option value="movie">🎬 Movie</option>
                  <option value="click">📷 My Click</option>
                  <option value="travel">🧭 Travel</option>
                  <option value="moment">✨ Moment</option>
                </select>
              </label>
              <label>
                Washi Tape Color
                <select
                  value={tapeColor}
                  onChange={(e) =>
                    setTapeColor(e.target.value as PhotoItem['tapeColor'])
                  }
                >
                  <option value="kraft">Kraft Paper</option>
                  <option value="sage">Sage Green</option>
                  <option value="blush">Blush Pink</option>
                  <option value="mustard">Mustard</option>
                  <option value="sky">Sky Blue</option>
                </select>
              </label>
            </div>

            <div className="modal-two-col">
              <label>
                Caption
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="e.g. Third Wave Coffee, Bandra"
                />
              </label>
              <label>
                Date
                <input
                  type="text"
                  value={photoDate}
                  onChange={(e) => setPhotoDate(e.target.value)}
                />
              </label>
            </div>

            <label>
              Write Beside the {mediaKind === 'video' ? 'Video' : 'Photo'} (Side Note)
              <textarea
                rows={2}
                value={photoSideNote}
                onChange={(e) => setPhotoSideNote(e.target.value)}
                placeholder="Write what made this cafe, movie, video, or click special..."
              />
            </label>

            {/* Hover Song section */}
            <div className="hover-song-config">
              <div className="hover-song-title">
                <Music size={14} /> Song on Hover (plays gently when hovering this card!)
              </div>
              <div className="pill-choice-row">
                <button
                  type="button"
                  className={songMode === 'preset' ? 'active' : ''}
                  onClick={() => setSongMode('preset')}
                >
                  Built-in Melody
                </button>
                <button
                  type="button"
                  className={songMode === 'custom' ? 'active' : ''}
                  onClick={() => setSongMode('custom')}
                >
                  Upload MP3 / URL
                </button>
                <button
                  type="button"
                  className={songMode === 'none' ? 'active' : ''}
                  onClick={() => setSongMode('none')}
                >
                  No Song
                </button>
              </div>

              {songMode === 'preset' && (
                <select
                  value={songPresetId}
                  onChange={(e) => setSongPresetId(e.target.value)}
                >
                  {SONG_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      🎵 {p.title} — {p.mood}
                    </option>
                  ))}
                </select>
              )}

              {songMode === 'custom' && (
                <div className="custom-song-inputs">
                  <input
                    type="text"
                    value={customSongTitle}
                    onChange={(e) => setCustomSongTitle(e.target.value)}
                    placeholder="Song name..."
                  />
                  <div className="photo-upload-row">
                    <label className="upload-file-box">
                      <Upload size={14} />
                      <span>Upload Audio</span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioFile}
                        hidden
                      />
                    </label>
                    <input
                      type="text"
                      value={customSongRef.startsWith('data:') ? 'Uploaded audio ready ✓' : customSongRef}
                      onChange={(e) => setCustomSongRef(e.target.value)}
                      placeholder="or paste MP3 URL..."
                    />
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="modal-submit-btn">
              Tape onto Page
            </button>
          </form>
        )}

        {activeModal === 'milestone' && (
          <form className="modal-body modal-form" onSubmit={handleAddMilestone}>
            <label>
              Milestone Title
              <input
                type="text"
                value={msTitle}
                onChange={(e) => setMsTitle(e.target.value)}
                placeholder="e.g. Completed 30-Day Learning Streak!"
                required
              />
            </label>
            <label>
              Details (optional)
              <input
                type="text"
                value={msDesc}
                onChange={(e) => setMsDesc(e.target.value)}
                placeholder="How it felt or what you achieved..."
              />
            </label>
            <div className="modal-two-col">
              <label>
                Date Earned
                <input
                  type="text"
                  value={msDate}
                  onChange={(e) => setMsDate(e.target.value)}
                />
              </label>
              <label>
                Stamp Style
                <select
                  value={msStyle}
                  onChange={(e) =>
                    setMsStyle(e.target.value as MilestoneBadgeStyle)
                  }
                >
                  <option value="wax-seal">Wax Seal</option>
                  <option value="ribbon">Festive Ribbon</option>
                  <option value="star-stamp">Gold Star Stamp</option>
                  <option value="trophy">Trophy Badge</option>
                </select>
              </label>
            </div>
            <button type="submit" className="modal-submit-btn">
              Stamp Milestone
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
