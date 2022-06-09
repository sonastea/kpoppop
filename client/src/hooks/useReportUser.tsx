import create from 'zustand';

const useReportUserStore = create((set: any) => ({
  reporting: false,
  reportingUser: () => set((state: { reporting: boolean }) => ({ reporting: !state.reporting })),
}));
export default useReportUserStore;
