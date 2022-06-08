import create from 'zustand';

const useReportUserStore = create((set: any) => ({
  reporting: false,
  isReporting: () => set((state: any) => ({ reporting: !state.reporting })),
}));
export default useReportUserStore;
