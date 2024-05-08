import { create } from 'zustand';

interface RemoveMemeState {
  confirming: boolean;
  memeId: number;
  remove: boolean;
  confirmingOpen: (memeId: number) => void;
  confirmingCloseNo: () => void;
  confirmingCloseYes: () => void;
  resetMeme: () => void;
}

const useRemoveMemeStore = create<RemoveMemeState>()((set) => ({
  confirming: false,
  memeId: 0,
  remove: false,
  confirmingOpen: (memeId: number) => set(() => ({ confirming: true, memeId: memeId })),
  confirmingCloseNo: () => set(() => ({ confirming: false, remove: false, memeId: 0 })),
  confirmingCloseYes: () => set(() => ({ confirming: false, remove: true })),
  resetMeme: () => set(() => ({ remove: false, memeId: 0 })),
}));

export default useRemoveMemeStore;
