import React, { type CSSProperties, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  closeAndDownloadBudget,
  closeAndLoadBudget,
  inviteToShare,
  replaceModal,
} from 'loot-core/client/actions';
import { send } from 'loot-core/platform/client/fetch';
import { type Client } from 'loot-core/src/types/client';
import { clientFactory } from 'loot-core/src/types/factories/clientFactory';
import type { Budget } from 'loot-core/types/budget';
import type { RemoteFile, SyncedLocalFile } from 'loot-core/types/file';

import { useMetadataPref } from '../../hooks/useMetadataPref';
import { styles, theme } from '../../style';
import { Link } from '../common/Link';
import { Text } from '../common/Text';
import { View } from '../common/View';

import { CRMClientBudget } from './CRMClientBudget';
import { LastShareRequestedAt } from './LastShareRequestedAt';
import { Notification } from './Notification';

export function CoachDashboard() {
  const dispatch = useDispatch();
  const inviteToShareStatus = useSelector(state => state.budgets.inviteToShare);
  const [clientList, setClientList] = useState<Client[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [cloudFileId] = useMetadataPref('cloudFileId');
  const allFiles = useSelector(state => state.budgets.allFiles || []);
  // const remoteFiles = allFiles.filter(
  //   f => f.state === 'remote' || f.state === 'synced' || f.state === 'detached',
  // ) as (SyncedLocalFile | RemoteFile)[];
  // const currentFile = remoteFiles.find(f => f.cloudFileId === cloudFileId);

  // Table headers configuration
  const headers = [
    { title: 'Name', width: 200 },
    { title: 'Status', width: 200 },
    { title: 'Budget', width: 250 },
    { title: 'Joined', width: 150 },
  ];

  // Custom styles defined as React CSSProperties objects
  const tableStyles = {
    clientTable: {
      width: 'auto',
      borderCollapse: 'separate' as const,
      borderSpacing: 0,
      borderRadius: 8,
      overflow: 'auto',
      margin: 20,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      background: 'white',
    },
    tableHeader: {
      width: 'auto',
      color: '#5a6474',
      fontWeight: 600,
      fontSize: 14,
      textAlign: 'left' as const,
      padding: '14px 18px',
      borderBottom: '1px solid #e5e9f2',
    },
    tableRow: {
      width: 'auto',
      borderBottom: '1px solid #e5e9f2',
      ':hover': {
        backgroundColor: '#f9fafc',
      },
    },
    tableCell: {
      padding: '14px 18px',
      fontSize: 14,
      color: '#3c4257',
    },
    clientName: {
      fontWeight: 500,
    },
    expiryDate: {
      color: '#6b7c93',
    },
    statusPill: {
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 500,
      textAlign: 'center' as const,
      textTransform: 'capitalize' as const,
    },
    inviteButton: {
      padding: '6px 12px',
      backgroundColor: theme.buttonPrimaryBackground,
      color: theme.buttonPrimaryText,
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  // Status-specific styles
  const statusStyles: Record<string, CSSProperties> = {
    active: {
      backgroundColor: '#e3fcef',
      color: '#0c6b58',
    },
    pending: {
      backgroundColor: '#fff7e6',
      color: '#975a16',
    },
    inactive: {
      backgroundColor: '#f3f4f6',
      color: '#6b7280',
    },
    expired: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
    },
    trial: {
      backgroundColor: '#e0e7ff',
      color: '#3730a3',
    },
    // Add more status styles as needed
  };

  // Helper function to get status style based on client status
  const getStatusStyle = (status: string): CSSProperties => {
    let normalizedStatus = status.toLowerCase();

    if (normalizedStatus === 'free_trial') {
      normalizedStatus = 'trial';
    } else if (normalizedStatus === 'free_trial_expired') {
      normalizedStatus = 'inactive';
    } else if (normalizedStatus === 'paid') {
      normalizedStatus = 'active';
    } else if (normalizedStatus === 'paid_expired') {
      normalizedStatus = 'inactive';
    } else if (normalizedStatus === 'sponsored') {
      normalizedStatus = 'active';
    } else if (normalizedStatus === 'sponsored_expired') {
      normalizedStatus = 'inactive';
    } else if (normalizedStatus === 'coach_account') {
      normalizedStatus = 'active';
    } else if (normalizedStatus === 'coach_account_expired') {
      normalizedStatus = 'inactive';
    } else if (normalizedStatus === 'server_specific') {
      normalizedStatus = 'active';
    }

    return {
      ...tableStyles.statusPill,
      ...(statusStyles[normalizedStatus] || statusStyles.inactive), // Fallback to inactive if status not found
    };
  };

  // Helper function to normalize status text for display
  const getNormalizedStatusText = (status: string): string => {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === 'free_trial') {
      return 'Free Trial';
    } else if (normalizedStatus === 'free_trial_expired') {
      return 'Trial Expired';
    } else if (normalizedStatus === 'paid') {
      return 'Paid User';
    } else if (normalizedStatus === 'paid_expired') {
      return 'Expired Paid';
    } else if (normalizedStatus === 'sponsored') {
      return 'Sponsored';
    } else if (normalizedStatus === 'sponsored_expired') {
      return 'Expired Sponsored';
    } else if (normalizedStatus === 'coach_account') {
      return 'Coach';
    } else if (normalizedStatus === 'coach_account_expired') {
      return 'Expired Coach';
    } else if (normalizedStatus === 'server_specific') {
      return 'Unknown';
    }

    // Default case - return capitalized version of original status
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const getClients = async () => {
    try {
      // TODO Check someInfo to see what kind of data it has
      const results = await send('airtable-clients');
      if (results.error_code) {
        throw new Error(results.reason);
      }

      // Filter out the coach from their client list
      const filteredClients = (results.clients || []).filter(
        (client: { userId: string | null; coachUserId: string }) =>
          client.userId !== client.coachUserId,
      );

      // Sort clients by joinedAt date in descending order (newest first)
      const sortedClients = filteredClients.sort((a, b) => {
        // If joinedAt is missing for either client, treat as oldest
        if (!a.joinedAt) return 1;
        if (!b.joinedAt) return -1;

        // Convert to date objects and compare (newer dates first)
        const dateA = new Date(a.joinedAt);
        const dateB = new Date(b.joinedAt);

        return dateB.getTime() - dateA.getTime();
      });

      // Create a map of owner to budget for quick lookup
      const ownerToBudgetMap = new Map(
        allFiles.map(file => [file.owner, file]),
      );

      const clientsWithBudgets = sortedClients.map((client: Client) => {
        const matchingBudget = ownerToBudgetMap.get(client.userId);
        const factoriedClient: Client = clientFactory({
          ...client,
          budget:
            matchingBudget,
        });
        console.log(
          `getClients - client user_id: ${factoriedClient.userId}`,
          factoriedClient,
          'budgetShared:',
          factoriedClient.budgetShared(),
          'canInviteToShare',
          factoriedClient.canInviteToShare(),
        );
        return factoriedClient;
      });

      setClientList(clientsWithBudgets);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  // Helper function to format dates in a friendly way
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) return dateString;

      // Format as "Month Day, Year" (e.g., "March 31, 2025")
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Helper function to format dates as relative time
  const formatRelativeDate = (dateString: string): string => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) return dateString;

      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Future dates
      if (date > now) {
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays < 7) return `In ${diffDays} days`;
        if (diffDays < 30) return `In ${Math.floor(diffDays / 7)} weeks`;
        if (diffDays < 365) return `In ${Math.floor(diffDays / 30)} months`;
        return `In ${Math.floor(diffDays / 365)} years`;
      }

      // Past dates
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch (error) {
      console.error('Error formatting relative date:', error);
      return dateString;
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  useEffect(() => {
    if (inviteToShareStatus) {
      console.log('Show notification for invite to share');
      setShowNotification(true);
      // Optionally, you can set a timer to hide the notification after a few seconds
      setTimeout(() => setShowNotification(false), 5000);
      console.log('Hide notification for invite to share & Reset');

      // Trigger a re-fetch of clients to update the UI
      const result = getClients();
      console.log('Re-fetching clients after invite to share', result);

      // Reset the success flag
      dispatch({ type: 'INVITE_TO_SHARE_RESET' });
    }
  }, [inviteToShareStatus, dispatch]);

  const handleInvite = (
    clientUserId: string | undefined | null,
    coachUserId: string | undefined | null,
  ) => {
    if (!clientUserId || !coachUserId) {
      console.error('Invalid clientUserId or coachUserId for invite');
      return;
    }
    console.log(
      `Inviting client w/ userId ${clientUserId} to share their budget with ${coachUserId}`,
    );
    dispatch(inviteToShare(clientUserId, coachUserId))
      .then(() => {
        console.log(
          `Invited client w/ userId ${clientUserId} to share their budget with ${coachUserId}`,
        );
      })
      .catch(error => {
        console.log(
          `Error inviting client w/ userId ${clientUserId} to share their budget with ${coachUserId}`,
          error,
        );
      });
  };

  const onSponsorClient = (client: Client) => {
    dispatch(
      replaceModal('sponsor-user', {
        client,
        onSave: async () => {
          console.log('onsaveeee');
          getClients();
        },
      }),
    );
  };

  const handleBudgetSelect = (client: Client, index: number) => {
    const budget = client.budget as Budget;
    if (budget.id) {
      dispatch(closeAndLoadBudget(budget.id))
        .then(() => {
          console.log(
            `Local Budget(${index}) ${budget.id} onSelect: completed`,
          );
        })
        .catch(error => {
          console.error(
            `Error loading local budget(${index}) ${budget.id}:`,
            error,
          );
        });
    } else if (budget.cloudFileId) {
      dispatch(closeAndDownloadBudget(budget.cloudFileId))
        .then(() => {
          console.log(
            `Remote Budget(${index}) ${budget.cloudFileId} onSelect: completed`,
          );
        })
        .catch(error => {
          console.error(
            `Error downloading remote budget(${index}) ${budget.cloudFileId}:`,
            error,
          );
        });
    } else {
      console.error(`Unable to load budget for client ${index}`);
    }
  };

  return (
    <View style={{ marginTop: 40 }}>
      {showNotification && (
        <Notification message="Invite to share was successful!" />
      )}
      <div style={{ marginLeft: 20 }}>
        <Text style={styles.mediumText}>My Clients</Text>

        <div
          key="underConstruction"
          style={{
            width: '80%',
            backgroundColor: theme.pillBackground,
            color: theme.pillText,
            padding: '10px',
            textAlign: 'center',
            marginTop: 20,
            marginRight: 10,
          }}
        >
          Currently showing users on the new MyBudgetCoach only.
        </div>
      </div>
      <View style={{ marginTop: 0, width: 'auto' }}>
        <table style={tableStyles.clientTable}>
          <tbody>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  style={{ ...tableStyles.tableHeader, width: header.width }}
                >
                  {header.title}
                </th>
              ))}
            </tr>
            {clientList.map((client, index) => (
              <tr key={index} style={tableStyles.tableRow}>
                <td
                  style={{
                    ...tableStyles.tableCell,
                    ...tableStyles.clientName,
                  }}
                >
                  {client.name}
                </td>
                <td style={tableStyles.tableCell}>
                  {client.status === 'free_trial' ||
                  client.status === 'free_trial_expired' ? (
                    <>
                      <span
                        style={{
                          ...getStatusStyle(client.status),
                        }}
                      >
                        {getNormalizedStatusText(client.status)}
                      </span>
                      <span
                        style={{
                          display: 'block',
                          flexShrink: 0,
                          marginTop: 8, // Add some spacing
                        }}
                      >
                        Expires: {formatDate(client.statusExpiresAt)}
                      </span>
                      <Link
                        variant="text"
                        onClick={() => onSponsorClient(client)}
                        style={{
                          display: 'block',
                          flexShrink: 0,
                          marginTop: 8, // Add some spacing
                        }}
                      >
                        Sponsor this client
                      </Link>
                    </>
                  ) : (
                    <>
                      <span
                        style={{
                          ...getStatusStyle(client.status),
                        }}
                      >
                        {getNormalizedStatusText(client.status)}
                      </span>
                      <span
                        style={{
                          display: 'block',
                          flexShrink: 0,
                          marginTop: 8, // Add some spacing
                        }}
                      >
                        Expires: {formatDate(client.statusExpiresAt)}
                      </span>
                    </>
                  )}
                </td>
                <td style={tableStyles.tableCell}>
                  {client.budgetShared() ? (
                    <CRMClientBudget
                      key={`budget-${index}`}
                      file={client.budget as SyncedLocalFile | RemoteFile}
                      currentUserId={
                        client.coachUserId ? client.coachUserId : ''
                      }
                      onSelect={() => handleBudgetSelect(client, index)}
                    />
                  ) : client.canInviteToShare() ? (
                    <LastShareRequestedAt
                      key={`budget-invite-${index}`}
                      client={client}
                      onInvite={handleInvite}
                      inviteButtonStyle={tableStyles.inviteButton}
                    />
                  ) : (
                    <button disabled style={tableStyles.inviteButton}>
                      External Client
                    </button>
                  )}
                </td>
                <td
                  style={{
                    ...tableStyles.tableCell,
                    ...tableStyles.expiryDate,
                  }}
                >
                  {formatRelativeDate(client.joinedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </View>
    </View>
  );
}
