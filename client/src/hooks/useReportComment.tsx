import { create } from 'zustand';

interface ReportCommentStore {
  reporting: boolean;
  commentId: number;
  reportingComment: (commentId?: number) => void;
}

const useReportCommentStore = create<ReportCommentStore>((set) => ({
  reporting: false,
  commentId: 0,
  reportingComment: (id?: number) =>
    set((state: { reporting: boolean; commentId: number }) => ({
      reporting: !state.reporting,
      commentId: id,
    })),
}));

export default useReportCommentStore;
