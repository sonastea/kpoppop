import { create } from 'zustand';

interface ReportMemeStore {
  memeId: number;
  reporting: boolean;
  reportingMeme: (memeId?: number) => void;
};

const useReportMemeStore = create<ReportMemeStore>((set) => ({
  memeId: 0,
  reporting: false,
  reportingMeme: (memeId?: number) =>
    set((state) => ({
      reporting: !state.reporting,
      memeId: memeId,
    })),
}));

export default useReportMemeStore;
