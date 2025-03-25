import { type Client } from 'loot-core/types/client';

type LastShareRequestedAtProps = {
  client: Client;
  onInvite: (
    userId: string | undefined,
    coachUserId: string | undefined,
  ) => void;
  inviteButtonStyle: React.CSSProperties;
};

export function LastShareRequestedAt({
  client,
  onInvite,
  inviteButtonStyle,
}: LastShareRequestedAtProps): JSX.Element {
  if (!client.lastShareRequestedAt) {
    return <span>Unshared</span>;
  }
  if (!client.userId) {
    return <span>Unshareable</span>;
  }

  const date = new Date(client.lastShareRequestedAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) {
    return (
      <span>
        Invite sent{' '}
        {diffDays === 0
          ? 'today'
          : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`}
      </span>
    );
  } else {
    return (
      <button
        onClick={() => onInvite(client.userId, client.coachUserId)}
        style={inviteButtonStyle}
      >
        Resend invite to share budget
      </button>
    );
  }
}
