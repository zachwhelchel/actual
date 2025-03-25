import React, { useCallback, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import type { File, RemoteFile, SyncedLocalFile } from 'loot-core/types/file';

import {
  SvgCloudCheck,
  SvgCloudDownload,
  SvgDotsHorizontalTriple,
  SvgFileDouble,
  SvgUser,
  SvgUserGroup,
} from '../../icons/v1';
import { SvgCloudUnknown, SvgKey } from '../../icons/v2';
import { styles, theme } from '../../style';
import { useMultiuserEnabled } from '../ServerContext';

import { Button } from './Button2';
import { Text } from './Text';
import { Tooltip } from './Tooltip';
import { View } from './View';

// Duplicates FileState in BudgetList.tsx
function MBCFileState({ file }: { file: File }) {
  const { t } = useTranslation();

  let Icon;
  let status;
  let color;

  switch (file.state) {
    case 'unknown':
      Icon = SvgCloudUnknown;
      status = t('Network unavailable');
      color = theme.buttonNormalDisabledText;
      break;
    case 'remote':
      Icon = SvgCloudDownload;
      status = t('Available for download');
      break;
    case 'local':
      Icon = SvgFileDouble;
      status = 'Local';
      break;
    case 'broken':
      Icon = SvgFileDouble;
      status = t('Local');
      break;
    default:
      Icon = SvgCloudCheck;
      status = t('Syncing');
      break;
  }

  return (
    <View style={{ width: '100%' }}>
      <View
        style={{
          color,
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 8,
        }}
      >
        <Icon
          style={{
            width: 18,
            height: 18,
            color: 'currentColor',
          }}
        />

        <Text style={{ marginLeft: 5 }}>{status}</Text>
      </View>
    </View>
  );
}

type UserAccessForFileProps = {
  fileId: string;
  currentUserId: string;
};

function UserAccessForFile({ fileId, currentUserId }: UserAccessForFileProps) {
  const allFiles = useSelector(state => state.budgets.allFiles || []);
  const remoteFiles = allFiles.filter(
    f => f.state === 'remote' || f.state === 'synced' || f.state === 'detached',
  ) as (SyncedLocalFile | RemoteFile)[];
  const currentFile = remoteFiles.find(f => f.cloudFileId === fileId);
  const multiuserEnabled = useMultiuserEnabled();

  let usersAccess = currentFile?.usersWithAccess ?? [];
  usersAccess = usersAccess?.filter(user => user.userName !== '') ?? [];

  const sortedUsersAccess = [...usersAccess].sort((a, b) => {
    const textA =
      a.userId === currentUserId ? 'You' : (a.displayName ?? a.userName);
    const textB =
      b.userId === currentUserId ? 'You' : (b.displayName ?? b.userName);
    return textA.localeCompare(textB);
  });

  return (
    <View>
      {multiuserEnabled &&
        usersAccess.length > 0 &&
        !(sortedUsersAccess.length === 1 && sortedUsersAccess[0].owner) && (
          <View
            style={{
              marginLeft: '5px',
              alignSelf: 'center',
            }}
          >
            <Tooltip
              content={
                <View
                  style={{
                    margin: 5,
                  }}
                >
                  <Text
                    style={{
                      ...styles.altMenuHeaderText,
                      ...styles.verySmallText,
                      color: theme.pageTextLight,
                    }}
                  >
                    File shared with:
                  </Text>
                  <View
                    style={{
                      padding: 0,
                    }}
                  >
                    {sortedUsersAccess.map(user => (
                      <View key={user.userId} style={{ flexDirection: 'row' }}>
                        <SvgUser
                          style={{
                            width: 10,
                            height: 10,
                            opacity: 0.7,
                            marginTop: 3,
                            marginRight: 5,
                          }}
                        />
                        <View
                          style={{
                            ...styles.verySmallText,
                            color: theme.pageTextLight,
                            margin: 0,
                            listStylePosition: 'inside',
                          }}
                        >
                          {user.userId === currentUserId
                            ? 'You'
                            : (user.displayName ?? user.userName)}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              }
              placement="bottom end"
            >
              <SvgUserGroup
                style={{
                  width: 15,
                  height: 15,
                  alignSelf: 'flex-end',
                  opacity: 0.7,
                }}
              />
            </Tooltip>
          </View>
        )}
    </View>
  );
}

// Similar to FileItem in BudgetList.tsx, but removes display of owner
export function MBCFileItem({
  file,
  onSelect,
  currentUserId,
}: {
  file: File;
  onSelect: (file: File) => void;
  currentUserId: string;
}) {
  const { t } = useTranslation();
  const multiuserEnabled = useMultiuserEnabled();

  const selecting = useRef(false);

  async function _onSelect(file: File) {
    // Never allow selecting the file while uploading/downloading, and
    // make sure to never allow duplicate clicks
    if (!selecting.current) {
      selecting.current = true;
      onSelect(file);
      selecting.current = false;
    }
  }

  function getFileDescription(file: File, t: (key: string) => string) {
    if (file.state === 'unknown') {
      return t(
        'This is a cloud-based file but its state is unknown because you ' +
          'are offline.',
      );
    }

    if (file.encryptKeyId) {
      if (file.hasKey) {
        return t('This file is encrypted and you have key to access it.');
      }
      return t('This file is encrypted and you do not have the key for it.');
    }

    return null;
  }

  return (
    <Button
      onPress={() => _onSelect(file)}
      style={{
        ...styles.shadow,
        padding: '12px 15px',
        cursor: 'pointer',
        borderRadius: 6,
        borderColor: 'black',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View
          title={getFileDescription(file, t) || ''}
          style={{ alignItems: 'flex-start', width: '100%' }}
        >
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <Text style={{ fontSize: 16, fontWeight: 700 }}>{file.name}</Text>
            {multiuserEnabled && 'cloudFileId' in file && (
              <UserAccessForFile
                fileId={file.cloudFileId}
                currentUserId={currentUserId}
              />
            )}
          </View>

          <MBCFileState file={file} />
        </View>

        <View
          style={{
            flex: '0 0 auto',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {file.encryptKeyId && (
            <SvgKey
              style={{
                width: 13,
                height: 13,
                marginRight: 8,
                color: file.hasKey
                  ? theme.formLabelText
                  : theme.buttonNormalDisabledText,
              }}
            />
          )}
        </View>
      </View>
    </Button>
  );
}
