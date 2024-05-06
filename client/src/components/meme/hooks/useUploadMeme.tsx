import { create } from 'zustand';

interface UploadMemeStore {
  showUploadMeme: boolean;
  setShowUploadMeme: (show?: boolean) => void;
}

const useUploadMeme = create<UploadMemeStore>((set) => ({
  showUploadMeme: false,
  setShowUploadMeme: (show?: boolean) =>
    set((state) => ({
      showUploadMeme: show ?? !state.showUploadMeme,
    })),
}));

export default useUploadMeme;
