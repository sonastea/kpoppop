import { create } from 'zustand';

const useReportCommentStore = create((set: any) => ({
  reporting: false,
  commentId: 0,
  reportingComment: (commentId?: number) =>
    set((state: { reporting: boolean; commentId: number }) => ({
      reporting: !state.reporting,
      commentId: commentId,
    })),
}));

export default useReportCommentStore;
