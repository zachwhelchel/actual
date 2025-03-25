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
  // The logic in the view currently prevents this component
  //  from rendering for external clients.
  if (!client.userId) {
    return <span>External Client</span>;
  }

  if (client.lastShareRequestedAt) {
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
          <div>Resend invite to share budget</div>
          <small>{`( Last sent ${diffDays} days ago )`}</small>
        </button>
      );
    }
  }

  return (
    <button
      onClick={() => onInvite(client.userId, client.coachUserId)}
      style={inviteButtonStyle}
    >
      Invite to share budget
    </button>
  );
}
