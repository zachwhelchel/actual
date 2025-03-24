import { Budget } from 'loot-core/types/budget';

export interface Client {
  recordId: string;
  userId?: string;
  userIdsSharedWith: Array<string>;
  coachUserId?: string;
  name: string;
  status: string;
  statusExpiresAt: string;
  joinedAt: string;
  lastShareRequestedAt?: string;
  budget?: Budget;

  budgetShared(): boolean;
  canInviteToShare(): boolean;
}
