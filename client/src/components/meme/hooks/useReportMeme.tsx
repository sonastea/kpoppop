import { create } from 'zustand';

interface ReportMemeStore {
  reporting: boolean;
  memeId: number;
  reportingMeme: (memeId?: number) => void;
}

const useReportMemeStore = create<ReportMemeStore>((set) => ({
  reporting: false,
  memeId: 0,
  reportingMeme: (id?: number) =>
    set((state) => ({
      reporting: !state.reporting,
      memeId: id,
    })),
}));

export default useReportMemeStore;
