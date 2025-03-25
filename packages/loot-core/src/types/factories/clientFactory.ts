import { Client } from '../client';

export function clientFactory(
  data: Omit<Client, 'budgetShared' | 'canInviteToShare'>,
): Client {
  return {
    ...data,

    budgetShared(): boolean {
      return !!(
        this.userId &&
        this.coachUserId &&
        this.budget
      );
    },

    canInviteToShare(): boolean {
      return !!(this.userId && this.coachUserId && !this.budgetShared());
    },
  };
}
