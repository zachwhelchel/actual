import { Budget } from 'loot-core/types/budget';

export interface Client {
  recordId: string;
  userId?: string;
  coachUserId?: string;
  name: string;
  status: string;
  statusExpiresAt: string;
  joinedAt: string;
  budget?: Budget;
}
