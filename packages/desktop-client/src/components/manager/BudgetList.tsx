import React, {
  useState,
  useEffect,
  type CSSProperties,
  useCallback,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import {
  closeAndDownloadBudget,
  closeAndLoadBudget,
  createBudget,
  downloadBudget,
  getUserData,
  loadAllFiles,
  loadBudget,
  pushModal,
} from 'loot-core/client/actions';
import { isElectron } from 'loot-core/src/shared/environment';
import {
  type File,
  type LocalFile,
  type SyncableLocalFile,
  type SyncedLocalFile,
} from 'loot-core/types/file';

import { useInitialMount } from '../../hooks/useInitialMount';
import { useMetadataPref } from '../../hooks/useMetadataPref';
import { AnimatedLoading } from '../../icons/AnimatedLoading';
import { SvgCog } from '../../icons/v1';
import { SvgRefreshArrow } from '../../icons/v2';
import { styles, theme } from '../../style';
import * as colorPalette from '../../style/palette';
import { tokens } from '../../tokens';
import { Button } from '../common/Button2';
import { FileItem } from '../common/FileItem';
import { Text } from '../common/Text';
import { View } from '../common/View';
import { Modals } from '../Modals';
import { useResponsive } from '../responsive/ResponsiveProvider';
import { useMultiuserEnabled } from '../ServerContext';

function isLocalFile(file: File): file is LocalFile {
  return file.state === 'local';
}

function BudgetFiles({
  files,
  quickSwitchMode,
  onSelect,
  onDelete,
  onDuplicate,
  currentUserId,
}: {
  files: File[];
  quickSwitchMode: boolean;
  onSelect: (file: File) => void;
  onDelete: (file: File) => void;
  onDuplicate: (file: File) => void;
  currentUserId: string;
}) {
  return (
    <View
      style={{
        flexGrow: 1,
        [`@media (min-width: ${tokens.breakpoint_small})`]: {
          flexGrow: 0,
        },
        maxHeight: '100%',
        overflow: 'auto',
        '& *': { userSelect: 'none' },
      }}
    >
      {!files || files.length === 0 ? (
        <Text
          style={{
            ...styles.mediumText,
            textAlign: 'center',
            color: theme.pageTextSubdued,
          }}
        >
          <Trans>No budget files</Trans>
        </Text>
      ) : (
        files.map(file => (
          <FileItem
            key={isLocalFile(file) ? file.id : file.cloudFileId}
            file={file}
            currentUserId={currentUserId}
            quickSwitchMode={quickSwitchMode}
            onSelect={onSelect}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
        ))
      )}
    </View>
  );
}

function RefreshButton({
  style,
  onRefresh,
}: {
  style?: CSSProperties;
  onRefresh: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function _onRefresh() {
    setLoading(true);
    await onRefresh();
    setLoading(false);
  }

  const Icon = loading ? AnimatedLoading : SvgRefreshArrow;

  return (
    <Button
      variant="bare"
      aria-label="Refresh"
      style={{ padding: 10, ...style }}
      onPress={_onRefresh}
    >
      <Icon style={{ width: 18, height: 18 }} />
    </Button>
  );
}

function SettingsButton({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { t } = useTranslation();

  return (
    <View>
      <Button
        variant="bare"
        aria-label={t('Settings')}
        onPress={() => {
          onOpenSettings();
        }}
        style={{ padding: 10 }}
      >
        <SvgCog style={{ width: 18, height: 18 }} />
      </Button>
    </View>
  );
}

function BudgetListHeader({
  quickSwitchMode,
  onRefresh,
  onOpenSettings,
}: {
  quickSwitchMode: boolean;
  onRefresh: () => void;
  onOpenSettings: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20,
      }}
    >
      <Text
        style={{
          ...styles.veryLargeText,
          color: 'black',
        }}
      >
        <Trans>Budgets</Trans>
      </Text>
      {!quickSwitchMode && (
        <View
          style={{
            flexDirection: 'row',
            gap: '0.2rem',
          }}
        >
          <RefreshButton onRefresh={onRefresh} />
          {isElectron() && <SettingsButton onOpenSettings={onOpenSettings} />}
        </View>
      )}
    </View>
  );
}

export function BudgetList({ showHeader = true, quickSwitchMode = false }) {
  const dispatch = useDispatch();
  const allFiles = useSelector(state => state.budgets.allFiles || []);
  const multiuserEnabled = useMultiuserEnabled();
  const [id] = useMetadataPref('id');
  const [currentUserId, setCurrentUserId] = useState('');
  const userData = useSelector(state => state.user.data);

  const fetchUsers = useCallback(async () => {
    try {
      setCurrentUserId(userData?.userId ?? '');
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, [userData?.userId]);

  useEffect(() => {
    if (multiuserEnabled && !userData?.offline) {
      fetchUsers();
    }
  }, [multiuserEnabled, userData?.offline, fetchUsers]);

  // Remote files do not have the 'id' field
  function isNonRemoteFile(
    file: File,
  ): file is LocalFile | SyncableLocalFile | SyncedLocalFile {
    return file.state !== 'remote';
  }

  const nonRemoteFiles = allFiles.filter(isNonRemoteFile);
  const files = id ? nonRemoteFiles.filter(f => f.id !== id) : allFiles;

  const [creating, setCreating] = useState(false);
  const { isNarrowWidth } = useResponsive();
  const narrowButtonStyle = isNarrowWidth
    ? {
        height: styles.mobileMinHeight,
      }
    : {};

  const onCreate = ({ testMode = false } = {}) => {
    if (!creating) {
      setCreating(true);
      dispatch(createBudget({ testMode }));
    }
  };

  const refresh = () => {
    dispatch(getUserData());
    dispatch(loadAllFiles());
  };

  const initialMount = useInitialMount();
  if (initialMount && quickSwitchMode) {
    refresh();
  }

  const onSelect = async (file: File): Promise<void> => {
    const isRemoteFile = file.state === 'remote';

    if (!id) {
      if (isRemoteFile) {
        dispatch(downloadBudget(file.cloudFileId));
      } else {
        dispatch(loadBudget(file.id));
      }
    } else if (!isRemoteFile && file.id !== id) {
      dispatch(closeAndLoadBudget(file.id));
    } else if (isRemoteFile) {
      dispatch(closeAndDownloadBudget(file.cloudFileId));
    }
  };

  return (
    <View
      style={{
        maxHeight: '100%',
        flex: 1,
        justifyContent: 'center',
        ...(!quickSwitchMode && {
          marginTop: 20,
          width: '100vw',
        }),
        [`@media (min-width: ${tokens.breakpoint_small})`]: {
          maxWidth: tokens.breakpoint_small,
          width: '100%',
        },
        backgroundColor: colorPalette.navy100,
      }}
    >
      <Modals />

      {showHeader && (
        <BudgetListHeader
          quickSwitchMode={quickSwitchMode}
          onRefresh={refresh}
          onOpenSettings={() => dispatch(pushModal('files-settings'))}
        />
      )}
      <BudgetFiles
        files={files}
        currentUserId={currentUserId}
        quickSwitchMode={quickSwitchMode}
        onSelect={onSelect}
        onDelete={(file: File) =>
          // dispatch(
          //   deleteBudget(
          //     'id' in file ? file.id : undefined,
          //     file.cloudFileId,
          //   ),
          // )

          dispatch(pushModal('delete-budget', { file }))
        }
        onDuplicate={(file: File) => {
          if (file && 'id' in file) {
            dispatch(pushModal('duplicate-budget', { file, managePage: true }));
          } else {
            console.error(
              'Attempted to duplicate a cloud file - only local files are supported. Cloud file:',
              file,
            );
          }
        }}
      />
      {!quickSwitchMode && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: 25,
          }}
        >
          <Button
            variant="bare"
            style={{
              ...narrowButtonStyle,
              marginLeft: 10,
              color: theme.pageTextLight,
            }}
            onPress={() => {
              dispatch(pushModal('import'));
            }}
          >
            <Trans>Import file</Trans>
          </Button>

          <Button
            variant="primary"
            onPress={() => onCreate()}
            style={{
              ...narrowButtonStyle,
              marginLeft: 10,
            }}
          >
            <Trans>Create new file</Trans>
          </Button>
        </View>
      )}
    </View>
  );
}
