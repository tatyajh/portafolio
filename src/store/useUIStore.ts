import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Chapter {
  id: string;
  title: string;
  progress: number;
}

interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrack: string | null;
}

interface UIState {
  // Chapter navigation
  currentChapter: string;
  chapters: Chapter[];
  scrollProgress: number;
  
  // Audio state
  audio: AudioState;
  
  // UI state
  menuOpen: boolean;
  reducedMotion: boolean;
  
  // Actions
  setCurrentChapter: (chapterId: string) => void;
  setScrollProgress: (progress: number) => void;
  setAudioPlaying: (playing: boolean) => void;
  setAudioMuted: (muted: boolean) => void;
  setAudioVolume: (volume: number) => void;
  setCurrentTrack: (track: string | null) => void;
  toggleMenu: () => void;
  setReducedMotion: (reduced: boolean) => void;
  updateChapterProgress: (chapterId: string, progress: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentChapter: 'intro',
      chapters: [
        { id: 'home', title: 'Inicio', progress: 0 },
        { id: 'origen', title: '1. Origen', progress: 0 },
        { id: 'herencia', title: '2. Herencia', progress: 0 },
        { id: 'arte', title: '3. Arte', progress: 0 },
        { id: 'sonido', title: '4. Sonido', progress: 0 },
        { id: 'estructura', title: '5. Estructura', progress: 0 },
        { id: 'cuerpo', title: '6. Cuerpo', progress: 0 },
        { id: 'quiebre', title: '7. Quiebre', progress: 0 },
        { id: 'construccion', title: '8. Construcción', progress: 0 },
        { id: 'identidad', title: '9. Identidad', progress: 0 },
      ],
      scrollProgress: 0,
      
      audio: {
        isPlaying: false,
        isMuted: true,
        volume: 0.7,
        currentTrack: null,
      },
      
      menuOpen: false,
      reducedMotion: false,
      
      // Actions
      setCurrentChapter: (chapterId: string) => {
        set({ currentChapter: chapterId });
      },
      
      setScrollProgress: (progress: number) => {
        set({ scrollProgress: Math.max(0, Math.min(100, progress)) });
      },
      
      setAudioPlaying: (playing: boolean) => {
        set((state) => ({
          audio: { ...state.audio, isPlaying: playing }
        }));
      },
      
      setAudioMuted: (muted: boolean) => {
        set((state) => ({
          audio: { ...state.audio, isMuted: muted }
        }));
      },
      
      setAudioVolume: (volume: number) => {
        set((state) => ({
          audio: { ...state.audio, volume: Math.max(0, Math.min(1, volume)) }
        }));
      },
      
      setCurrentTrack: (track: string | null) => {
        set((state) => ({
          audio: { ...state.audio, currentTrack: track }
        }));
      },
      
      toggleMenu: () => {
        set((state) => ({ menuOpen: !state.menuOpen }));
      },
      
      setReducedMotion: (reduced: boolean) => {
        set({ reducedMotion: reduced });
      },
      
      updateChapterProgress: (chapterId: string, progress: number) => {
        set((state) => ({
          chapters: state.chapters.map(chapter =>
            chapter.id === chapterId
              ? { ...chapter, progress: Math.max(0, Math.min(100, progress)) }
              : chapter
          )
        }));
      },
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        audio: state.audio,
        reducedMotion: state.reducedMotion,
      }),
    }
  )
);
