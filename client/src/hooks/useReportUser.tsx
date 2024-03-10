import { create } from 'zustand';

interface ReportUserStore {
  reporting: boolean;
  reportingUser: () => void;
}

const useReportUserStore = create<ReportUserStore>((set) => ({
  reporting: false,
  reportingUser: () => set((state: { reporting: boolean }) => ({ reporting: !state.reporting })),
}));

export default useReportUserStore;
