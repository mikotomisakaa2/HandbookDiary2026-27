import { HoverSong } from '../types/diary';
import { getImageFromIdb } from './storage';

export interface SongPreset {
  id: string;
  title: string;
  mood: string;
  notes: number[]; // frequencies in Hz
  tempoMs: number;
  wave: OscillatorType;
}

export const SONG_PRESETS: SongPreset[] = [
  {
    id: 'lofi-chai',
    title: 'Lo-Fi Chai & Rain',
    mood: 'Warm winter lo-fi chords',
    notes: [261.63, 329.63, 392.0, 493.88, 392.0, 329.63, 293.66, 349.23],
    tempoMs: 520,
    wave: 'triangle',
  },
  {
    id: 'sunset-piano',
    title: 'Golden Sunset Piano',
    mood: 'Soft dreamy keys',
    notes: [220.0, 261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66],
    tempoMs: 480,
    wave: 'sine',
  },
  {
    id: 'monsoon-flute',
    title: 'Monsoon Bansuri Breeze',
    mood: 'Gentle flute melody',
    notes: [329.63, 369.99, 440.0, 493.88, 554.37, 493.88, 440.0, 369.99],
    tempoMs: 580,
    wave: 'sine',
  },
  {
    id: 'cafe-chimes',
    title: 'Corner Cafe Acoustic',
    mood: 'Cozy coffee-shop chimes',
    notes: [293.66, 369.99, 440.0, 587.33, 493.88, 440.0, 369.99, 329.63],
    tempoMs: 440,
    wave: 'triangle',
  },
];

class HoverSongPlayer {
  private ctx: AudioContext | null = null;
  private timer: number | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private activeKey: string | null = null;

  public async play(song: HoverSong, key: string): Promise<void> {
    if (this.activeKey === key) return;
    this.stop();
    this.activeKey = key;

    if (song.kind === 'audio') {
      try {
        const src = song.ref.startsWith('idb:')
          ? await getImageFromIdb(song.ref)
          : song.ref;
        if (!src || this.activeKey !== key) return;
        const el = new Audio(src);
        el.volume = 0.45;
        el.loop = true;
        this.audioEl = el;
        await el.play().catch(() => {});
      } catch {
        // Browser autoplay policy may wait for user gesture
      }
      return;
    }

    // Play Web Audio API preset melody
    const preset =
      SONG_PRESETS.find((p) => p.id === song.ref) || SONG_PRESETS[0];
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume().catch(() => {});
      }

      let step = 0;
      const playNote = () => {
        if (!this.ctx || this.activeKey !== key) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = preset.wave;
        osc.frequency.setValueAtTime(
          preset.notes[step % preset.notes.length],
          now
        );
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.07, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + preset.tempoMs / 1000);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + preset.tempoMs / 1000 + 0.05);
        step += 1;
      };

      playNote();
      this.timer = window.setInterval(playNote, preset.tempoMs);
    } catch {
      // Ignore if audio context blocked before interaction
    }
  }

  public stop(): void {
    this.activeKey = null;
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
      this.audioEl = null;
    }
  }
}

export const hoverSongPlayer = new HoverSongPlayer();
