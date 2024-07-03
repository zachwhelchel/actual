import React from 'react';

import { useActions } from '../../hooks/useActions';
import { styles, theme } from '../../style';
import { Button } from '../common/Button';
import { Link } from '../common/Link';
import { Paragraph } from '../common/Paragraph';
import { Text } from '../common/Text';
import { View } from '../common/View';

export function WelcomeScreen() {
  const { createBudget, pushModal } = useActions();

  return (
    <View
      style={{
        gap: 10,
        maxWidth: 500,
        fontSize: 15,
        maxHeight: '100vh',
        marginBlock: 20,
      }}
    >
      <Text style={styles.veryLargeText}>Let’s get started!</Text>
      <View style={{ overflowY: 'auto' }}>
        <Paragraph>
          Finally make a budget you'll stick to with the guidance and encouragement you've been missing.
        </Paragraph>
        <Paragraph style={{ color: theme.pageTextLight }}>
          Get started by importing an existing budget file from MyBudgetCoach or
          another budgeting app, or start fresh with an empty budget. You can
          always create or import another budget later.
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
        <Button onClick={() => pushModal('import')}>Import my budget</Button>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <Button type="primary" onClick={() => createBudget()}>
            Get started
          </Button>
        </View>
      </View>
    </View>
  );
}
