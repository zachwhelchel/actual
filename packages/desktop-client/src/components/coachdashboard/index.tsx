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
import { SvgCheveronOutlineRight } from '../../icons/v1';
import { SvgComputerLaptop } from '../../icons/v1';
import { SvgMobileDevices } from '../../icons/v1';
// import { SvgArrowRight } from '../../icons/v2';
import { ClientDetailPage } from './ClientDetailPage';

import { useMetadataPref } from '../../hooks/useMetadataPref';
import { styles, theme } from '../../style';
import { Link } from '../common/Link';
import { Text } from '../common/Text';
import { View } from '../common/View';
import { Button } from '../common/Button2';

import { CRMClientBudget } from './CRMClientBudget';
import { LastShareRequestedAt } from './LastShareRequestedAt';
import { Notification } from './Notification';
import { MotivationDashboard } from './Motivation';

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

  const [showClientDetail, setShowClientDetail] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [clickedClient, setClickedClient] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<{
    key:
      | 'name'
      | 'status'
      | 'joinedAt'
      | 'lastSeenInBudget'
      | 'nextMeeting'
      | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const handleSort = (
    key: 'name' | 'status' | 'joinedAt' | 'lastSeenInBudget' | 'nextMeeting',
  ) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const handleClickOutside = event => {
      // Close popup when clicking outside
      if (!event.target.closest('[data-activity-popup]')) {
        setClickedClient(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getSortedClients = () => {
    if (!sortConfig.key) return clientList;

    return [...clientList].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortConfig.key) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'status':
          aValue = a.status?.toLowerCase() || '';
          bValue = b.status?.toLowerCase() || '';
          break;
        case 'joinedAt':
          aValue = new Date(a.joinedAt || 0).getTime();
          bValue = new Date(b.joinedAt || 0).getTime();
          break;
        case 'lastSeenInBudget':
          aValue = Math.max(
            a.lastVisitedBudgetSmallScreen
              ? new Date(a.lastVisitedBudgetSmallScreen).getTime()
              : 0,
            a.lastVisitedBudgetLargeScreen
              ? new Date(a.lastVisitedBudgetLargeScreen).getTime()
              : 0,
          );
          bValue = Math.max(
            b.lastVisitedBudgetSmallScreen
              ? new Date(b.lastVisitedBudgetSmallScreen).getTime()
              : 0,
            b.lastVisitedBudgetLargeScreen
              ? new Date(b.lastVisitedBudgetLargeScreen).getTime()
              : 0,
          );
          break;
        case 'nextMeeting':
          aValue = new Date(a.nextMeetingDate || 0).getTime();
          bValue = new Date(b.nextMeetingDate || 0).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleClientDetail = (client?: Client) => {
    setSelectedClientId(client?.userId || null);
    setSelectedClient(client || null);
    setShowClientDetail(true);
  };

  const handleBackToList = () => {
    setShowClientDetail(false);
    setSelectedClientId(null);
    setSelectedClient(null);
  };

  const handleClientSaved = () => {
    getClients(); // Refresh the client list
  };

  // Table headers configuration
  const headers = [
    { title: 'Name', width: 150, sortKey: 'name' as const },
    { title: 'Status', width: 180, sortKey: 'status' as const },
    { title: 'Budget', width: 180, sortKey: null },
    { title: 'Joined', width: 130, sortKey: 'joinedAt' as const },
    { title: 'Last Seen', width: 120, sortKey: 'lastSeenInBudget' as const }, // New column
    { title: 'Next Meeting', width: 200, sortKey: 'nextMeeting' as const }, // New column
    { title: '', width: 40, sortKey: null, sticky: true }, // Mark as sticky
  ];

  // Custom styles defined as React CSSProperties objects
  const tableStyles = {
    clientTable: {
      width: 'auto',
      borderCollapse: 'separate' as const,
      borderSpacing: 0,
      borderRadius: 8,
      overflow: 'auto',
      marginLeft: 20,
      marginRight: 20,
      marginTop: 10,
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      overflowX: 'auto',
      position: 'relative',
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
    expiryDate: {},
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
    stickyColumn: {
      position: 'sticky',
      right: 0,
      backgroundColor: 'white',
      zIndex: 2,
    },
    activityPopup: {
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'white',
      border: '1px solid #e5e9f2',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      width: '360px',
      marginTop: '-30px',
    },
    timelineItem: {
      paddingBottom: '0px',
      // Remove position, paddingLeft, and borderLeft
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
    let normalizedStatus = 'free_trial_expired';

    if (status == null || status == undefined) {
    } else {
      normalizedStatus = status.toLowerCase();
    }

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
    let normalizedStatus = 'server_specific';

    if (status == null || status == undefined) {
    } else {
      normalizedStatus = status.toLowerCase();
    }

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
    } else if (normalizedStatus === 'external_client') {
      return 'Non-MBC Client';
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

      console.log('results');
      console.log(results);

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
          budget: matchingBudget,
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

  const getClientActivityData = client => {
    const now = new Date();
    const activities = [
      {
        label: 'Visited budget on a large screen',
        date: client.lastVisitedBudgetLargeScreen
          ? new Date(client.lastVisitedBudgetLargeScreen)
          : null,
        color: '#3b82f6', // Using same blue color for all
      },
      {
        label: 'Visited budget on a small screen',
        date: client.lastVisitedBudgetSmallScreen
          ? new Date(client.lastVisitedBudgetSmallScreen)
          : null,
        color: '#3b82f6', // Using same blue color for all
      },
      {
        label: 'Synced an account from bank',
        date: client.lastSyncedAccount
          ? new Date(client.lastSyncedAccount)
          : null,
        color: '#3b82f6',
      },
      {
        label: 'Edited a transaction',
        date: client.lastEditedTransaction
          ? new Date(client.lastEditedTransaction)
          : null,
        color: '#3b82f6',
      },
      {
        label: 'Changed a budgeted amount',
        date: client.lastChangedBudgetedAmount
          ? new Date(client.lastChangedBudgetedAmount)
          : null,
        color: '#3b82f6',
      },
      {
        label: 'Interacted with avatar',
        date: client.lastInteractedWithAvatar
          ? new Date(client.lastInteractedWithAvatar)
          : null,
        color: '#3b82f6',
      },
      {
        label: 'Added an account',
        date: client.lastAddedAccount
          ? new Date(client.lastAddedAccount)
          : null,
        color: '#3b82f6',
      },
      {
        label: 'Added a category',
        date: client.lastAddedCategory
          ? new Date(client.lastAddedCategory)
          : null,
        color: '#3b82f6',
      },
    ];

    // Sort by most recent first
    //const sortedActivities = activities.sort((a, b) => b.date.getTime() - a.date.getTime());
    const sortedActivities = activities;

    return sortedActivities.map(activity => {
      // Handle missing dates
      if (!activity.date) {
        return {
          ...activity,
          daysAgo: null,
          barPercentage: 0, // 0% for missing dates
        };
      }

      const daysAgo = Math.floor(
        (now.getTime() - activity.date.getTime()) / (1000 * 60 * 60 * 24),
      );
      // Calculate percentage based on 30-day scale, cap at 100%
      const barPercentage = Math.min((daysAgo / 30) * 100, 100);

      return {
        ...activity,
        daysAgo,
        barPercentage,
      };
    });
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

  const [activeSection, setActiveSection] = useState('clients'); // 'clients' or 'revenue'

  // Function to handle section change
  const handleSectionChange = event => {
    setActiveSection(event.target.value);
  };

  return (
    <View style={{ marginTop: 40 }}>
      {showNotification && (
        <Notification message="Invite to share was successful!" />
      )}

      {/* Dropdown selector for sections */}
      <View
        style={{
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 20,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {!showClientDetail && (
          <select
            value={activeSection}
            onChange={handleSectionChange}
            style={{
              padding: '8px 12px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              cursor: 'pointer',
              width: '400px',
            }}
          >
            <option value="clients">🤝 My Clients</option>
            <option value="revenue">🌱 My Revenue Projections (BETA)</option>
          </select>
        )}

        {activeSection === 'clients' && !showClientDetail && (
          <Button variant="primary" onClick={() => handleClientDetail()}>
            + Add Client
          </Button>
        )}
      </View>

      {activeSection === 'clients' && showClientDetail === false && (
        <View style={{ marginTop: 0, width: 'auto' }}>
          <table style={tableStyles.clientTable}>
            <tbody>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    style={{
                      ...tableStyles.tableHeader,
                      width: header.width,
                      cursor: header.sortKey ? 'pointer' : 'default',
                      userSelect: 'none',
                      ...(header.sticky ? tableStyles.stickyColumn : {}),
                    }}
                    onClick={() => header.sortKey && handleSort(header.sortKey)}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      {header.title}
                      {header.sortKey && sortConfig.key === header.sortKey && (
                        <span style={{ fontSize: 12 }}>
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
              {getSortedClients().map((client, index) => (
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
                    ) : client.status === 'external_client' ||
                      client.status === 'lead' ? (
                      <>
                        <span
                          style={{
                            ...getStatusStyle(client.status),
                          }}
                        >
                          {getNormalizedStatusText(client.status)}
                        </span>
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
                    {client.status === 'external_client' ||
                    client.status === 'lead' ? (
                      <div
                        style={{
                          ...tableStyles.expiryDate,
                        }}
                      >
                        –
                      </div>
                    ) : client.budgetShared() ? (
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
                      <></>
                    )}
                  </td>

                  {client.status === 'external_client' ||
                  client.status === 'lead' ? (
                    <>
                      <td
                        style={{
                          ...tableStyles.tableCell,
                          ...tableStyles.expiryDate,
                        }}
                      >
                        –
                      </td>
                    </>
                  ) : (
                    <>
                      <td
                        style={{
                          ...tableStyles.tableCell,
                          ...tableStyles.expiryDate,
                        }}
                      >
                        {formatRelativeDate(client.joinedAt)}
                      </td>
                    </>
                  )}

                  {client.status === 'external_client' ||
                  client.status === 'lead' ? (
                    <>
                      <td
                        style={{
                          ...tableStyles.tableCell,
                          ...tableStyles.expiryDate,
                        }}
                      >
                        –
                      </td>
                    </>
                  ) : (
                    <>
                      <td
                        style={{
                          ...tableStyles.tableCell,
                          ...tableStyles.expiryDate,
                          position: 'relative',
                          cursor: 'pointer',
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          setClickedClient(
                            clickedClient === client.userId
                              ? null
                              : client.userId,
                          );
                        }}
                        data-activity-popup
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center', // Add this to center horizontally
                            gap: 6,
                            backgroundColor: '#f3f4f6',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            padding: '8px 8px',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={e =>
                            (e.target.style.backgroundColor = '#e5e7eb')
                          }
                          onMouseLeave={e =>
                            (e.target.style.backgroundColor = '#f3f4f6')
                          }
                        >
                          {(() => {
                            const smallScreenDate =
                              client.lastVisitedBudgetSmallScreen
                                ? new Date(client.lastVisitedBudgetSmallScreen)
                                : null;
                            const largeScreenDate =
                              client.lastVisitedBudgetLargeScreen
                                ? new Date(client.lastVisitedBudgetLargeScreen)
                                : null;

                            // If neither date exists
                            if (!smallScreenDate && !largeScreenDate) {
                              return (
                                <span
                                  style={{ fontSize: '12px', color: '#6b7280' }}
                                >
                                  N/A
                                </span>
                              );
                            }

                            // If only one date exists
                            if (!smallScreenDate) {
                              return (
                                <>
                                  <SvgComputerLaptop
                                    width={14}
                                    height={14}
                                    style={{ color: '#6b7c93' }}
                                  />
                                  <span style={{ fontSize: '12px' }}>
                                    {formatRelativeDate(
                                      client.lastVisitedBudgetLargeScreen,
                                    )}
                                  </span>
                                </>
                              );
                            }

                            if (!largeScreenDate) {
                              return (
                                <>
                                  <SvgMobileDevices
                                    width={14}
                                    height={14}
                                    style={{ color: '#6b7c93' }}
                                  />
                                  <span style={{ fontSize: '12px' }}>
                                    {formatRelativeDate(
                                      client.lastVisitedBudgetSmallScreen,
                                    )}
                                  </span>
                                </>
                              );
                            }

                            // Both dates exist - show the more recent one
                            const isMobileMoreRecent =
                              smallScreenDate > largeScreenDate;

                            return (
                              <>
                                {isMobileMoreRecent ? (
                                  <SvgMobileDevices
                                    width={14}
                                    height={14}
                                    style={{ color: '#6b7c93' }}
                                  />
                                ) : (
                                  <SvgComputerLaptop
                                    width={14}
                                    height={14}
                                    style={{ color: '#6b7c93' }}
                                  />
                                )}
                                <span style={{ fontSize: '12px' }}>
                                  {formatRelativeDate(
                                    isMobileMoreRecent
                                      ? client.lastVisitedBudgetSmallScreen
                                      : client.lastVisitedBudgetLargeScreen,
                                  )}
                                </span>
                              </>
                            );
                          })()}
                        </div>

                        {clickedClient === client.userId &&
                          clickedClient != null && (
                            <div
                              style={tableStyles.activityPopup}
                              data-activity-popup
                            >
                              {/* Conditional invite message */}
                              {!client.budgetShared() && (
                                <div
                                  style={{
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    marginBottom: '20px',
                                    textAlign: 'center',
                                    fontSize: '13px',
                                    color: '#374151',
                                  }}
                                >
                                  Invite your client to share their budget to
                                  get access to these stats
                                </div>
                              )}

                              <div
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  marginBottom: '20px',
                                  color: '#374151',
                                  opacity: client.budgetShared() ? 1 : 0.4, // Fade when no access
                                }}
                              >
                                Recent Activity
                              </div>
                              <div
                                style={{
                                  opacity: client.budgetShared() ? 1 : 0.4,
                                }}
                              >
                                {' '}
                                {/* Fade entire activity list */}
                                {getClientActivityData(client).map(
                                  (activity, idx) => (
                                    <div
                                      key={idx}
                                      style={{
                                        ...tableStyles.timelineItem,
                                        marginBottom: '16px',
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          marginBottom: '6px',
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: '13px',
                                            color: '#374151',
                                          }}
                                        >
                                          {activity.label}
                                        </span>
                                        {/* Only show days ago if date exists AND client has shared budget */}
                                        {activity.daysAgo !== null &&
                                          client.budgetShared() && (
                                            <span
                                              style={{
                                                fontSize: '12px',
                                                color: '#6b7280',
                                              }}
                                            >
                                              {activity.daysAgo === 0
                                                ? 'Today'
                                                : `${activity.daysAgo} days ago`}
                                            </span>
                                          )}
                                      </div>
                                      <div
                                        style={{
                                          width: '100%',
                                          height: '6px',
                                          backgroundColor: '#f3f4f6',
                                          borderRadius: '3px',
                                          position: 'relative',
                                        }}
                                      >
                                        {/* Only show colored bar if client has shared budget */}
                                        {client.budgetShared() && (
                                          <div
                                            style={{
                                              position: 'absolute',
                                              right: 0,
                                              width: `${activity.barPercentage}%`,
                                              height: '100%',
                                              backgroundColor: activity.color,
                                              borderTopRightRadius: '3px',
                                              borderBottomRightRadius: '3px',
                                              borderTopLeftRadius: '0px',
                                              borderBottomLeftRadius: '0px',
                                              opacity:
                                                activity.daysAgo !== null
                                                  ? 0.7
                                                  : 0.2,
                                            }}
                                          />
                                        )}
                                        {/* Vertical time marker line - only show if date exists, less than 30 days, AND has shared budget */}
                                        {activity.daysAgo !== null &&
                                          activity.daysAgo < 30 &&
                                          client.budgetShared() && (
                                            <div
                                              style={{
                                                position: 'absolute',
                                                right: `${activity.barPercentage}%`,
                                                top: '-6px',
                                                width: '2px',
                                                height: '18px',
                                                backgroundColor: '#000000',
                                              }}
                                            />
                                          )}
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                              <div
                                style={{
                                  marginTop: '20px',
                                  fontSize: '13px',
                                  color: '#374151',
                                  opacity: client.budgetShared() ? 1 : 0.4, // Fade disclaimer text too
                                }}
                              >
                                This chart highlights activity from the last 30
                                days. Note that only activity logged after June
                                5th, 2025 is included.
                              </div>
                            </div>
                          )}
                      </td>
                    </>
                  )}

                  {/* New Next Meeting column */}
                  <td
                    style={{
                      ...tableStyles.tableCell,
                      ...tableStyles.expiryDate,
                    }}
                  >
                    {(() => {
                      if (!client.nextMeetingDate) {
                        return (
                          <span
                            style={{ color: '#9ca3af', fontStyle: 'italic' }}
                          >
                            Not Set
                          </span>
                        );
                      }

                      try {
                        const meetingDate = new Date(client.nextMeetingDate);
                        const now = new Date();
                        const today = new Date(
                          now.getFullYear(),
                          now.getMonth(),
                          now.getDate(),
                        );
                        const tomorrow = new Date(today);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const meetingDay = new Date(
                          meetingDate.getFullYear(),
                          meetingDate.getMonth(),
                          meetingDate.getDate(),
                        );

                        // Check if it's in the past (before start of today)
                        const isPast = meetingDay < today;

                        // Format the time portion
                        const timeStr = meetingDate.toLocaleString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        });

                        // Format the date portion
                        const dateStr = meetingDate.toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        });

                        let displayText;
                        if (meetingDay.getTime() === today.getTime()) {
                          displayText = `${dateStr} (Today) @ ${timeStr}`;
                        } else if (
                          meetingDay.getTime() === tomorrow.getTime()
                        ) {
                          displayText = `${dateStr} (Tomorrow) @ ${timeStr}`;
                        } else {
                          displayText = `${dateStr} @ ${timeStr}`;
                        }

                        return (
                          <span
                            style={{ color: isPast ? '#9ca3af' : 'inherit' }}
                          >
                            {displayText}
                          </span>
                        );
                      } catch (error) {
                        return (
                          <span
                            style={{ color: '#9ca3af', fontStyle: 'italic' }}
                          >
                            Not Set
                          </span>
                        );
                      }
                    })()}
                  </td>

                  <td
                    style={{
                      ...tableStyles.tableCell,
                      ...tableStyles.stickyColumn,
                    }}
                  >
                    <button
                      onClick={() => handleClientDetail(client)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        ':hover': {
                          backgroundColor: '#f3f4f6',
                        },
                      }}
                    >
                      <SvgCheveronOutlineRight width={16} height={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </View>
      )}

      {/* Grow Your Revenue Section */}
      {activeSection === 'revenue' && showClientDetail === false && (
        <View style={{ width: 'auto' }}>
          <MotivationDashboard />
        </View>
      )}

      {showClientDetail === true && (
        <ClientDetailPage
          client={selectedClient}
          onBack={handleBackToList}
          onSave={handleClientSaved}
        />
      )}
    </View>
  );
}
