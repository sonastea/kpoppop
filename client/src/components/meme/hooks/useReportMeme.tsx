import { create } from 'zustand';

const useReportMemeStore = create((set: any) => ({
  reporting: false,
  reportingMeme: (memeId?: number) =>
    set((state: { reporting: boolean; memeId: number }) => ({
      reporting: !state.reporting,
      memeId: memeId,
    })),
}));

export default useReportMemeStore;
