import React, { useEffect, useState } from 'react';
import { Award, Camera, Plus, Star, Trash2, Trophy, Sparkles } from 'lucide-react';
import { MilestoneItem, PageItem, PhotoItem } from '../types/diary';
import { getImageFromIdb } from '../utils/storage';

interface MemoriesMilestonesSpreadProps {
  mode: 'memories' | 'milestones';
  pageItems: Record<string, PageItem[]>;
  onOpenAddPhoto: () => void;
  onOpenAddMilestone: () => void;
  onDeleteItem: (pageId: string, itemId: string) => void;
  onUpdateItem: (pageId: string, item: PageItem) => void;
}

const ResolvedPhotoThumb: React.FC<{
  photo: PhotoItem;
  pageId: string;
  onDelete: () => void;
  onUpdateSideNote: (val: string) => void;
}> = ({ photo, onDelete, onUpdateSideNote }) => {
  const [src, setSrc] = useState(
    photo.imageRef.startsWith('idb:') ? '' : photo.imageRef
  );

  useEffect(() => {
    let active = true;
    if (photo.imageRef.startsWith('idb:')) {
      getImageFromIdb(photo.imageRef).then((url) => {
        if (active) setSrc(url);
      });
    } else {
      setSrc(photo.imageRef);
    }
    return () => {
      active = false;
    };
  }, [photo.imageRef]);

  const catIcons: Record<PhotoItem['category'], string> = {
    cafe: '☕ Cafe',
    movie: '🎬 Movie',
    click: '📷 My Click',
    travel: '🧭 Travel',
    moment: '✨ Moment',
  };

  return (
    <div className="gallery-polaroid-row">
      <div className="gallery-polaroid-card">
        <div className="gallery-polaroid-img">
          {src ? <img src={src} alt={photo.caption} /> : <span>Loading...</span>}
          <span className="polaroid-cat-badge">{catIcons[photo.category]}</span>
        </div>
        <div className="gallery-polaroid-cap">{photo.caption || 'Untitled Moment'}</div>
        <div className="gallery-polaroid-date">{photo.dateLabel}</div>
      </div>

      <div className="gallery-sidenote">
        <div className="gallery-sidenote-top">
          <span>Written beside photo</span>
          <button type="button" onClick={onDelete} title="Remove memory">
            <Trash2 size={13} />
          </button>
        </div>
        <textarea
          value={photo.sideNote}
          onChange={(e) => onUpdateSideNote(e.target.value)}
          placeholder="Write your thoughts about this cafe, movie, or photo..."
        />
      </div>
    </div>
  );
};

export const MemoriesMilestonesSpread: React.FC<MemoriesMilestonesSpreadProps> = ({
  mode,
  pageItems,
  onOpenAddPhoto,
  onOpenAddMilestone,
  onDeleteItem,
  onUpdateItem,
}) => {
  const [filterCat, setFilterCat] = useState<'all' | PhotoItem['category']>('all');

  const allPhotos: { pageId: string; item: PhotoItem }[] = [];
  const allMilestones: { pageId: string; item: MilestoneItem }[] = [];

  for (const [pageId, list] of Object.entries(pageItems)) {
    for (const item of list) {
      if (item.type === 'photo') allPhotos.push({ pageId, item });
      if (item.type === 'milestone') allMilestones.push({ pageId, item });
    }
  }

  if (mode === 'memories') {
    const filtered =
      filterCat === 'all'
        ? allPhotos
        : allPhotos.filter((p) => p.item.category === filterCat);

    const mid = Math.ceil(filtered.length / 2);
    const leftPhotos = filtered.slice(0, mid);
    const rightPhotos = filtered.slice(mid);

    return (
      <>
        <div className="diary-page diary-page-left gallery-page">
          <div className="bookshelf-header">
            <div>
              <h2>Cafes, Movies &amp; My Clicks</h2>
              <p>Every taped photo &amp; side-note across your diary</p>
            </div>
            <button type="button" className="place-book-btn compact" onClick={onOpenAddPhoto}>
              <Camera size={14} /> Add Photo
            </button>
          </div>

          <div className="gallery-filter-pills">
            {(['all', 'cafe', 'movie', 'click', 'travel', 'moment'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  className={filterCat === cat ? 'active' : ''}
                  onClick={() => setFilterCat(cat)}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              )
            )}
          </div>

          <div className="gallery-list">
            {leftPhotos.length === 0 ? (
              <div className="gallery-empty">
                No photos yet! Click <strong>Add Photo</strong> to stick a cafe,
                movie, or favorite click with a handwritten side note.
              </div>
            ) : (
              leftPhotos.map(({ pageId, item }) => (
                <ResolvedPhotoThumb
                  key={item.id}
                  photo={item}
                  pageId={pageId}
                  onDelete={() => onDeleteItem(pageId, item.id)}
                  onUpdateSideNote={(val) =>
                    onUpdateItem(pageId, { ...item, sideNote: val })
                  }
                />
              ))
            )}
          </div>
        </div>

        <div className="diary-page diary-page-right gallery-page">
          <div className="bookshelf-header">
            <div>
              <h2>Scrapbook Wall</h2>
              <p>Photos added on monthly pages also appear here automatically</p>
            </div>
          </div>

          <div className="gallery-list">
            {rightPhotos.length === 0 ? (
              <div className="gallery-empty">
                Your next cafe visit, movie ticket, or sunset click belongs right here ✨
              </div>
            ) : (
              rightPhotos.map(({ pageId, item }) => (
                <ResolvedPhotoThumb
                  key={item.id}
                  photo={item}
                  pageId={pageId}
                  onDelete={() => onDeleteItem(pageId, item.id)}
                  onUpdateSideNote={(val) =>
                    onUpdateItem(pageId, { ...item, sideNote: val })
                  }
                />
              ))
            )}
          </div>
        </div>
      </>
    );
  }

  // Milestones spread
  const mid = Math.ceil(allMilestones.length / 2);
  const leftMs = allMilestones.slice(0, mid);
  const rightMs = allMilestones.slice(mid);

  const renderMsCard = (pageId: string, item: MilestoneItem) => (
    <div key={item.id} className={`milestone-gallery-card milestone-${item.badgeStyle}`}>
      <div className="milestone-icon">
        {item.badgeStyle === 'wax-seal' && <Award size={20} />}
        {item.badgeStyle === 'ribbon' && <Sparkles size={20} />}
        {item.badgeStyle === 'star-stamp' && <Star size={20} />}
        {item.badgeStyle === 'trophy' && <Trophy size={20} />}
      </div>
      <div className="milestone-text">
        <div className="milestone-title">{item.title}</div>
        {item.description && <div className="milestone-desc">{item.description}</div>}
        <div className="milestone-date">{item.dateLabel}</div>
      </div>
      <button
        type="button"
        className="ms-del-btn"
        onClick={() => onDeleteItem(pageId, item.id)}
        title="Remove milestone"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );

  return (
    <>
      <div className="diary-page diary-page-left gallery-page">
        <div className="bookshelf-header">
          <div>
            <h2>Milestones Earned</h2>
            <p>Celebrate every win, habit streak, &amp; personal breakthrough</p>
          </div>
          <button
            type="button"
            className="place-book-btn compact"
            onClick={onOpenAddMilestone}
          >
            <Plus size={14} /> Add Milestone
          </button>
        </div>

        <div className="milestones-grid">
          {leftMs.length === 0 ? (
            <div className="gallery-empty">
              No milestones stamped yet. Earn your first wax seal or star stamp!
            </div>
          ) : (
            leftMs.map(({ pageId, item }) => renderMsCard(pageId, item))
          )}
        </div>
      </div>

      <div className="diary-page diary-page-right gallery-page">
        <div className="bookshelf-header">
          <div>
            <h2>Hall of Pride · 2026–27</h2>
            <p>Every milestone you stamp on any month shines here too</p>
          </div>
        </div>

        <div className="milestones-grid">
          {rightMs.length === 0 ? (
            <div className="gallery-empty">
              More achievements waiting to be stamped here 🏆
            </div>
          ) : (
            rightMs.map(({ pageId, item }) => renderMsCard(pageId, item))
          )}
        </div>
      </div>
    </>
  );
};
