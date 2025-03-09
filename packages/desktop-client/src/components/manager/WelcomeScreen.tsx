import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { createBudget, pushModal } from 'loot-core/client/actions';

import { styles, theme } from '../../style';
import * as colorPalette from '../../style/palette';
import { Button } from '../common/Button2';
import { Link } from '../common/Link';
import { Paragraph } from '../common/Paragraph';
import { Text } from '../common/Text';
import { View } from '../common/View';
import { Modals } from '../Modals';

export function WelcomeScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <View
      style={{
        gap: 10,
        maxWidth: 500,
        fontSize: 15,
        maxHeight: '100vh',
        marginBlock: 20,
        color: 'black',
        backgroundColor: colorPalette.navy100,
      }}
    >
      <Modals />

      <Text style={styles.veryLargeText}>{t('Let’s get started!')}</Text>
      <View style={{ overflowY: 'auto' }}>
        <Paragraph style={{ color: 'black' }}>
          <Trans>
            Finally make a budget you'll stick to with the guidance and
            encouragement you've been missing.{' '}
          </Trans>
        </Paragraph>
        <Paragraph style={{ color: 'black' }}>
          <Trans>
            Get started by importing an existing budget file from MyBudgetCoach
            or another budgeting app, create a demo budget file, or start fresh
            with an empty budget. You can always create or import another budget
            later.
          </Trans>
        </Paragraph>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexShrink: 0,
        }}
      >
        <Button onPress={() => dispatch(pushModal('import'))}>
          {t('Import my budget')}
        </Button>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <Button
            variant="primary"
            autoFocus
            onPress={() => dispatch(createBudget())}
          >
            {t('Start fresh')}
          </Button>
        </View>
      </View>
    </View>
  );
}
