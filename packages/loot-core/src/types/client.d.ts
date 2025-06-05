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
  last_visited_budget_small_screen: string;
  last_visited_budget_large_screen: string;
  last_changed_budgeted_amount: string;
  last_synced_account: string;
  last_interacted_with_avatar: string;
  last_edited_transaction: string;
  last_added_account: string;
  last_added_category: string;
  nextMeetingDate?: string;

  budgetShared(): boolean;
  canInviteToShare(): boolean;
}
