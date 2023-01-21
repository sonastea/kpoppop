import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaService } from 'src/database/prisma.service';

export const prismaSessionStore = new PrismaSessionStore(new PrismaService(), {
  checkPeriod: 2 * 60 * 1000, //ms
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
  enableConcurrentSetInvocationsForSameSessionID: true,
  enableConcurrentTouchInvocationsForSameSessionID: true,
});
