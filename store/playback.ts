import { TrackQueue } from "@/hooks/types";
import { create } from "zustand";

interface PlayerState {
  queue: TrackQueue[];
  currentIndex: number;
  isPlaying: boolean;

  setQueue: (tracks: TrackQueue[], startIndex: number) => void;
  addToQueue: (track: TrackQueue) => void;
  removeFromQueue: (id: string) => void;
  playNext: () => void;
  playPrev: () => void;
  playNextNow: (track: TrackQueue) => void;
  clearQueue: () => void;

  shuffle: boolean;
  repeat: "off" | "one" | "all";
  toggleShuffle: () => void;
  setRepeat: (mode: "off" | "one" | "all") => void;
  reorderQueue: (tracks: TrackQueue[]) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentIndex: 0,
  isPlaying: false,

  shuffle: false,
  repeat: "off",

  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  setRepeat: (mode) => set({ repeat: mode }),

  setQueue: (tracks, startIndex) => {
    const safeIndex =
      startIndex >= 0 && startIndex < tracks.length ? startIndex : 0;

    set({
      queue: tracks,
      currentIndex: safeIndex,
      isPlaying: tracks.length > 0,
    });
  },

  addToQueue: (track) =>
    set((state) => {
      if (state.queue.find((t) => t.track_id === track.track_id)) return state;

      const newQueue = [...state.queue, track];

      return {
        queue: newQueue,
        currentIndex: state.queue.length === 0 ? 0 : state.currentIndex,
        isPlaying: state.queue.length === 0 ? true : state.isPlaying,
      };
    }),

  removeFromQueue: (id) => {
    const { queue, currentIndex } = get();

    const removedIndex = queue.findIndex((t) => t.track_id === id);
    const newQueue = queue.filter((t) => t.track_id !== id);

    if (newQueue.length === 0) {
      return set({ queue: [], currentIndex: 0, isPlaying: false });
    }

    let newIndex = currentIndex;

    if (removedIndex < currentIndex) {
      newIndex = currentIndex - 1;
    } else if (removedIndex === currentIndex) {
      // if you removed the currently playing song
      if (currentIndex >= newQueue.length) {
        newIndex = newQueue.length - 1;
      }
    }

    set({ queue: newQueue, currentIndex: newIndex });
  },

  playNext: () => {
    const { currentIndex, queue, shuffle, repeat } = get();
    if (!queue.length) return;

    let nextIndex = currentIndex;

    if (shuffle) {
      // pick a random track
      nextIndex = Math.floor(Math.random() * queue.length);
      if (nextIndex === currentIndex)
        nextIndex = (currentIndex + 1) % queue.length;
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeat === "all") nextIndex = 0;
        else return set({ isPlaying: false }); // stop
      }
    }

    set({ currentIndex: nextIndex, isPlaying: true });
  },

  playPrev: () => {
    const { currentIndex, queue, shuffle } = get();
    if (!queue.length) return;

    let prevIndex = currentIndex - 1;

    if (shuffle) {
      prevIndex = Math.floor(Math.random() * queue.length);
      if (prevIndex === currentIndex)
        prevIndex = (prevIndex + 1) % queue.length;
    }

    if (prevIndex < 0) prevIndex = 0;
    set({ currentIndex: prevIndex, isPlaying: true });
  },
  playNextNow: (track) =>
    set((state) => {
      const { queue, currentIndex } = state;

      // If queue empty → just start playing it
      if (queue.length === 0) {
        return {
          queue: [track],
          currentIndex: 0,
          isPlaying: true,
        };
      }

      const existingIndex = queue.findIndex(
        (t) => t.track_id === track.track_id,
      );

      // If user presses Play Next on currently playing track → ignore
      if (existingIndex === currentIndex) {
        return state;
      }

      let newQueue = [...queue];
      let newCurrentIndex = currentIndex;

      // Remove if already exists
      if (existingIndex !== -1) {
        newQueue.splice(existingIndex, 1);

        // Fix index shift if removed before current
        if (existingIndex < currentIndex) {
          newCurrentIndex = currentIndex - 1;
        }
      }

      // Insert right after current
      newQueue.splice(newCurrentIndex + 1, 0, track);

      return {
        queue: newQueue,
        currentIndex: newCurrentIndex,
      };
    }),
  clearQueue: () => set({ queue: [], currentIndex: 0, isPlaying: false }),
  reorderQueue: (newQueue: TrackQueue[]) => {
    const { currentIndex, queue } = get();

    const currentTrack = queue[currentIndex];
    const newIndex = newQueue.findIndex(
      (t) => t.track_id === currentTrack?.track_id,
    );

    set({
      queue: newQueue,
      currentIndex: newIndex === -1 ? 0 : newIndex,
    });
  },
}));
