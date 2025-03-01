import React, { useEffect, useState } from 'react';
import { DialogTrigger } from 'react-aria-components';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { pushModal, unlinkAccount } from 'loot-core/client/actions';
import { send } from 'loot-core/src/platform/client/fetch';

import { useAuth } from '../../auth/AuthProvider';
import { Permissions } from '../../auth/types';
import { authorizeBank } from '../../gocardless';
import { useGoCardlessStatus } from '../../hooks/useGoCardlessStatus';
import { useSimpleFinStatus } from '../../hooks/useSimpleFinStatus';
import { useSyncServerStatus } from '../../hooks/useSyncServerStatus';
import { SvgDotsHorizontalTriple } from '../../icons/v1';
import { theme } from '../../style';
import { Warning } from '../alerts';
import { Button, ButtonWithLoading } from '../common/Button2';
import { InitialFocus } from '../common/InitialFocus';
import { Link } from '../common/Link';
import { Menu } from '../common/Menu';
import { Modal, ModalCloseButton, ModalHeader } from '../common/Modal';
import { Paragraph } from '../common/Paragraph';
import { Popover } from '../common/Popover';
import { Text } from '../common/Text';
import { View } from '../common/View';
import { useMultiuserEnabled } from '../ServerContext';
import { usePlaidLink } from 'react-plaid-link';
import { useLocation } from 'react-router-dom';
import { useMetadataPref } from '../../hooks/useMetadataPref';

type CreateAccountProps = {
  upgradingAccountId?: string;
};

export function CreateAccountModal({ upgradingAccountId }: CreateAccountProps) {
  const { t } = useTranslation();

  const [linkToken, setLinkToken] = useState(null);
  const location = useLocation();


const [accounts, setAccounts] = useState([]);
const [accountsLoading, setAccountsLoading] = useState(true);
const [accountsError, setAccountsError] = useState(null);



  const syncServerStatus = useSyncServerStatus();
  const dispatch = useDispatch();
  const [isGoCardlessSetupComplete, setIsGoCardlessSetupComplete] = useState<
    boolean | null
  >(null);
  const [isSimpleFinSetupComplete, setIsSimpleFinSetupComplete] = useState<
    boolean | null
  >(null);
  const { hasPermission } = useAuth();
  const multiuserEnabled = useMultiuserEnabled();

  const onConnectGoCardless = () => {
    if (!isGoCardlessSetupComplete) {
      onGoCardlessInit();
      return;
    }

    if (upgradingAccountId == null) {
      authorizeBank(dispatch);
    } else {
      authorizeBank(dispatch, {
        upgradingAccountId,
      });
    }
  };

  const onConnectSimpleFin = async () => {
    if (!isSimpleFinSetupComplete) {
      onSimpleFinInit();
      return;
    }

    if (loadingSimpleFinAccounts) {
      return;
    }

    setLoadingSimpleFinAccounts(true);

    try {
      const results = await send('simplefin-accounts');
      if (results.error_code) {
        throw new Error(results.reason);
      }

      const newAccounts = [];

      type NormalizedAccount = {
        account_id: string;
        name: string;
        institution: string;
        orgDomain: string;
        orgId: string;
        balance: number;
      };

      for (const oldAccount of results.accounts) {
        const newAccount: NormalizedAccount = {
          account_id: oldAccount.id,
          name: oldAccount.name,
          institution: oldAccount.org.name,
          orgDomain: oldAccount.org.domain,
          orgId: oldAccount.org.id,
          balance: oldAccount.balance,
        };

        newAccounts.push(newAccount);
      }

      dispatch(
        pushModal('select-linked-accounts', {
          accounts: newAccounts,
          syncSource: 'simpleFin',
        }),
      );
    } catch (err) {
      console.error(err);
      dispatch(
        pushModal('simplefin-init', {
          onSuccess: () => setIsSimpleFinSetupComplete(true),
        }),
      );
    }

    setLoadingSimpleFinAccounts(false);
  };

  const onGoCardlessInit = () => {
    dispatch(
      pushModal('gocardless-init', {
        onSuccess: () => setIsGoCardlessSetupComplete(true),
      }),
    );
  };

  const onSimpleFinInit = () => {
    dispatch(
      pushModal('simplefin-init', {
        onSuccess: () => setIsSimpleFinSetupComplete(true),
      }),
    );
  };

  const onGoCardlessReset = () => {
    send('secret-set', {
      name: 'gocardless_secretId',
      value: null,
    }).then(() => {
      send('secret-set', {
        name: 'gocardless_secretKey',
        value: null,
      }).then(() => {
        setIsGoCardlessSetupComplete(false);
      });
    });
  };

  const onSimpleFinReset = () => {
    send('secret-set', {
      name: 'simplefin_token',
      value: null,
    }).then(() => {
      send('secret-set', {
        name: 'simplefin_accessKey',
        value: null,
      }).then(() => {
        setIsSimpleFinSetupComplete(false);
      });
    });
  };

  const onCreateLocalAccount = () => {
    dispatch(pushModal('add-local-account'));
  };

  const getPlaidLink = async (itemId) => {
    let url = String(window.location.href);
    const results = await send('plaid-create-link-token', {url: url, itemId: itemId});
    console.log('plaidresults')
    console.log(results.link_token)
    setLinkToken(results.link_token)

    localStorage.setItem('plaidLinkToken', results.link_token);


    let currentUrl = window.location.origin + window.location.pathname;


    url = url + "/accounts";

    window.location.href = `https://cdn.plaid.com/link/v2/stable/link.html?token=${results.link_token}&redirect_uri=${encodeURIComponent(url)}`;
  };

  const getPlaidAccounts = async () => {
    const results = await send('plaid-accounts');
    if (results.error_code) {
      throw new Error(results.reason);
    }

    const newAccounts = [];

    type NormalizedAccount = {
      account_id: string;
      name: string;
      institution: string;
      orgDomain: string;
      orgId: string;
      balance: number;
    };

    for (const oldAccount of results.accounts) {
      const newAccount: NormalizedAccount = {
        account_id: oldAccount.id,
        name: oldAccount.name,
        institution: oldAccount.org.name,
        orgDomain: oldAccount.org.domain,
        orgId: oldAccount.org.id,
        balance: oldAccount.balance,
      };

      newAccounts.push(newAccount);
    }

    dispatch(
      pushModal('select-linked-accounts', {
        accounts: newAccounts,
        syncSource: 'plaid',
      }),
    );
  };





  const { configuredGoCardless } = useGoCardlessStatus();
  useEffect(() => {
    setIsGoCardlessSetupComplete(configuredGoCardless);
  }, [configuredGoCardless]);

  const { configuredSimpleFin } = useSimpleFinStatus();
  useEffect(() => {
    setIsSimpleFinSetupComplete(configuredSimpleFin);
  }, [configuredSimpleFin]);

  let title = t('Add Account');
  const [loadingSimpleFinAccounts, setLoadingSimpleFinAccounts] =
    useState(false);

  if (upgradingAccountId != null) {
    title = t('Link Account');
  }

  const canSetSecrets =
    !multiuserEnabled || hasPermission(Permissions.ADMINISTRATOR);

  // LINK COMPONENT
  // Use Plaid Link and pass link token and onSuccess function
  // in configuration to initialize Plaid Link
  interface LinkProps {
    linkToken: string | null;
  }
  const Link: React.FC<LinkProps> = (props: LinkProps) => {
    const onSuccess = React.useCallback((public_token, metadata) => {
      // send public_token to server
      const response = fetch('/api/set_access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token }),
      });
      // Handle response ...
    }, []);
    const config: Parameters<typeof usePlaidLink>[0] = {
      token: props.linkToken!,
      onSuccess,
    };
    const { open, ready } = usePlaidLink(config);
    return (
      <button onClick={() => open()} disabled={!ready}>
        Link account
      </button>
    );
  };


  useEffect(() => {
    async function fetchAccounts() {
      try {
        setAccountsLoading(true);
        const results = await send('plaid-institutions');
        if (results.error_code) {
          throw new Error(results.reason);
        }
        
        const newAccounts = [];
        
        for (const oldAccount of results.institutions) {
          const newAccount = {
            name: oldAccount.name,
            item_id: oldAccount.item_id,
            accounts_count: oldAccount.accounts_count,
          };
          newAccounts.push(newAccount);
        }
        
        setAccounts(newAccounts);
        setAccountsError(null);
      } catch (err) {
        setAccountsError(err.message);
      } finally {
        setAccountsLoading(false);
      }
    }

    fetchAccounts();
  }, []);


  const handleUpdate = (account) => {
    // Implement update functionality
    console.log(`Update account: ${account}`);

    getPlaidLink(account.item_id)

  };

  const handleRemove = async (account) => {

    let accs = await send('bank-remove', { item_id: account.item_id });

    if (Array.isArray(accs)) {
      accs.forEach(acc => dispatch(unlinkAccount(acc.id)));
    }

    const results = await send('plaid-remove-institution', { item_id: account.item_id });

  };

  // Define styles
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1000px',
      margin: '0 auto',
      paddingTop: '10px',
    },
    title: {
      fontSize: '24px',
      color: '#333',
      marginBottom: '20px',
      textAlign: 'center',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '0px',
    },
    th: {
      padding: '12px 15px',
      textAlign: 'left',
      backgroundColor: '#f8f8f8',
      fontWeight: 'bold',
      color: '#333',
    },
    td: {
      padding: '12px 15px',
      textAlign: 'left',
    },
    actions: {
      display: 'flex',
      gap: '8px',
    },
    updateBtn: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background-color 0.3s',
      backgroundColor: '#4285f4',
      color: 'white',
    },
    removeBtn: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background-color 0.3s',
      backgroundColor: '#ea4335',
      color: 'white',
    },
    loading: {
      textAlign: 'center',
      fontSize: '18px',
      margin: '20px 0',
      color: '#666',
    },
    error: {
      color: '#ea4335',
      textAlign: 'center',
      fontSize: '18px',
      margin: '50px 0',
      padding: '15px',
      border: '1px solid #ea4335',
      borderRadius: '4px',
      backgroundColor: '#fff8f8',
    },
    noAccounts: {
      textAlign: 'center',
      fontSize: '16px',
      color: '#666',
      margin: '30px 0',
    }
  };

  const [cloudFileId] = useMetadataPref('cloudFileId');
  const allFiles = useSelector(state => state.budgets.allFiles || []);
  const remoteFiles = allFiles.filter(
    f => f.state === 'remote' || f.state === 'synced' || f.state === 'detached',
  ) as (SyncedLocalFile | RemoteFile)[];
  const currentFile = remoteFiles.find(f => f.cloudFileId === cloudFileId);
  const userData = useSelector((state: State) => state.user.data);

  console.log('currentFile')
  console.log(currentFile)

  let isOwner = false;

  if (currentFile && userData && currentFile.owner === userData.userId) {
    isOwner = true;
  }

  return (
    <Modal name="add-account">
      {({ state: { close } }) => (
        <>
          <ModalHeader
            title={title}
            rightContent={<ModalCloseButton onPress={close} />}
          />
          <View style={{ maxWidth: 500, gap: 30, color: theme.pageText }}>
            {isOwner && (
              <View style={{ gap: 10 }}>

                <View style={{ gap: 10, borderColor: theme.pageText, borderRadius: 10, borderWidth: 1, paddingLeft: 10, paddingRight: 10, paddingBottom: 15 }}>

                <Text>
                  <h2 style={{ textAlign: 'center' }}>{t('Bank Connections')}</h2>{' '}
                </Text>

                <Text style={{ textAlign: 'center', marginTop: -10 }}>
                  {t('MyBudgetCoach allows you to connect to your banks using Plaid. Connecting your bank will allow you to import transactions automatically, saving time. Click ‘Add a New Bank Connection’ to get started. Use the ‘Update‘ button to fix any syncing issues you are experiencing or include more accounts from a particular bank.')}
                </Text>

                <>
                  {accountsLoading ? (
                    <div style={styles.loading}>Loading connections...</div>
                  ) : accountsError ? (
                    <div style={styles.error}>Error: {accountsError}</div>
                  ) : (
                    <div style={styles.container}>
                      {accounts.length === 0 ? (
                        <p style={styles.noAccounts}>No bank connections found</p>
                      ) : (
                        <table style={styles.table}>
                          <tbody>
                            {accounts.map((account) => (
                              <tr key={account.account_id}>
                                <td style={styles.td}>{account.name}</td>
                                <td style={styles.td}>
                                  {account.accounts_count} account{account.accounts_count !== 1 ? 's' : ''}
                                </td>
                                <td style={{...styles.td, ...styles.actions}}>
                                  <button 
                                    style={styles.updateBtn}
                                    onClick={() => handleUpdate(account)}
                                  >
                                    Update
                                  </button>
                                  <button 
                                    style={styles.removeBtn} 
                                    onClick={() => handleRemove(account)}
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </>

                <ButtonWithLoading
                  isDisabled={false}
                  isLoading={false}
                  style={{
                    padding: '10px 0',
                    fontSize: 15,
                    fontWeight: 600,
                    flex: 1,
                    width: 300,
                    alignSelf: 'center',
                    marginBottom: 10,
                    marginTop: 10,
                  }}
                  onPress={() => getPlaidLink(null)}
                >
                  Add a New Bank Connection
                </ButtonWithLoading>

                </View>

                <Text style={{ textAlign: 'center', marginTop: 10, marginBottom: 10 }}>
                  {t('After setting up your bank connections in the above section you will be ready to associate specific accounts from each bank with accounts here in MyBudgetCoach. Click ‘Next’ to get started:')}
                </Text>

                <Button
                  variant="primary"
                  style={{
                    padding: '10px 0',
                    fontSize: 15,
                    fontWeight: 600,
                    width: 200,
                    alignSelf: 'center',
                  }}
                  onPress={getPlaidAccounts}
                >
                  Next
                </Button>

                {upgradingAccountId == null && (
                  <>
                    <Text style={{ textAlign: 'center', marginTop: 10, marginBottom: 10 }}>
                      {t('Alternatively you can create a local account without connecting to a bank:')}
                    </Text>

                    <ButtonWithLoading
                      isDisabled={false}
                      isLoading={false}
                      style={{
                        padding: '10px 0',
                        fontSize: 15,
                        fontWeight: 600,
                        flex: 1,
                        width: 300,
                        alignSelf: 'center',
                        marginBottom: 10,
                      }}
                      onPress={onCreateLocalAccount}
                    >
                      {t('Create local account')}
                    </ButtonWithLoading>
                  </>
                )}

              </View>
            )}
            {!isOwner && (
              <Warning>
                <Trans>
                  Only the budget owner can set up and manage accounts.
                </Trans>
              </Warning>
            )}
          </View>
        </>
      )}
    </Modal>
  );
}
