import React, { type ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { css } from '@emotion/css';

import { closeBudget, loadPrefs } from 'loot-core/client/actions';
import { isElectron } from 'loot-core/shared/environment';
import { listen } from 'loot-core/src/platform/client/fetch';

import { useGlobalPref } from '../../hooks/useGlobalPref';
import { useIsOutdated, useLatestVersion } from '../../hooks/useLatestVersion';
import { useMetadataPref } from '../../hooks/useMetadataPref';
import { theme } from '../../style';
import { tokens } from '../../tokens';
import { Button } from '../common/Button2';
import { Input } from '../common/Input';
import { Link } from '../common/Link';
import { Text } from '../common/Text';
import { View } from '../common/View';
import { FormField, FormLabel } from '../forms';
import { MOBILE_NAV_HEIGHT } from '../mobile/MobileNavTabs';
import { Page } from '../Page';
import { useResponsive } from '../responsive/ResponsiveProvider';
import { useServerVersion } from '../ServerContext';

import { AuthSettings } from './AuthSettings';
import { Backups } from './Backups';
import { BudgetTypeSettings } from './BudgetTypeSettings';
import { EncryptionSettings } from './Encryption';
import { ExperimentalFeatures } from './Experimental';
import { ExportBudget } from './Export';
import { FixSplits } from './FixSplits';
import { FormatSettings } from './Format';
import { ResetCache, ResetSync } from './Reset';
import { ThemeSettings } from './Themes';
import { AdvancedToggle, Setting } from './UI';

function About() {
  const { t } = useTranslation();
  const version = useServerVersion();
  const latestVersion = useLatestVersion();
  const isOutdated = useIsOutdated();

  return (
    <Setting>
        <Text>Client version: v{window.Actual?.ACTUAL_VERSION}</Text>
        <Text>Server version: {version}</Text>
    </Setting>
  );
}

function IDName({ children }: { children: ReactNode }) {
  return <Text style={{ fontWeight: 500 }}>{children}</Text>;
}

function AdvancedAbout() {
  const { t } = useTranslation();
  const [budgetId] = useMetadataPref('id');
  const [groupId] = useMetadataPref('groupId');

  return (
    <Setting>
      <Text>
        <strong>{t('IDs')}</strong>
        {t(
          ' are the names Actual uses to identify your budget internally. There are several different IDs associated with your budget. The Budget ID is used to identify your budget file. The Sync ID is used to access the budget on the server.',
        )}
      </Text>
      <Text>
        <IDName>{t('Budget ID:')}</IDName> {budgetId}
      </Text>
      <Text style={{ color: theme.pageText }}>
        <IDName>{t('Sync ID:')}</IDName> {groupId || '(none)'}
      </Text>
      {/* low priority todo: eliminate some or all of these, or decide when/if to show them */}
      {/* <Text>
        <IDName>Cloud File ID:</IDName> {prefs.cloudFileId || '(none)'}
      </Text>
      <Text>
        <IDName>User ID:</IDName> {prefs.userId || '(none)'}
      </Text> */}
    </Setting>
  );
}

export function Settings() {
  const { t } = useTranslation();
  const [floatingSidebar] = useGlobalPref('floatingSidebar');
  const [budgetName] = useMetadataPref('budgetName');
  const dispatch = useDispatch();

  const onCloseBudget = () => {
    dispatch(closeBudget());
  };

  useEffect(() => {
    const unlisten = listen('prefs-updated', () => {
      dispatch(loadPrefs());
    });

    dispatch(loadPrefs());
    return () => unlisten();
  }, [dispatch]);

  const { isNarrowWidth } = useResponsive();

  return (
    <Page
      header={t('Settings')}
      style={{
        marginInline: floatingSidebar && !isNarrowWidth ? 'auto' : 0,
        paddingBottom: MOBILE_NAV_HEIGHT,
      }}
    >
      <View
        style={{
          marginTop: 10,
          flexShrink: 0,
          maxWidth: 530,
          gap: 30,
        }}
      >
        {isNarrowWidth && (
          <View
            style={{ gap: 10, flexDirection: 'row', alignItems: 'flex-end' }}
          >
            {/* The only spot to close a budget on mobile */}
            <FormField>
              <FormLabel title={t('Budget Name')} />
              <Input
                value={budgetName}
                disabled
                style={{ color: theme.buttonNormalDisabledText }}
              />
            </FormField>
            <Button onPress={onCloseBudget}>{t('Close Budget')}</Button>
          </View>
        )}
        <About />
        <ThemeSettings />
        <FormatSettings />
        <AuthSettings />

        
{/*        <EncryptionSettings />
        <BudgetTypeSettings />*/}
        {isElectron() && <Backups />}
        <ExportBudget />
        
        <AdvancedToggle>
          <AdvancedAbout />
          <ResetCache />
          <ResetSync />
          <FixSplits />
          <ExperimentalFeatures />
        </AdvancedToggle>

      </View>
    </Page>
  );
}
