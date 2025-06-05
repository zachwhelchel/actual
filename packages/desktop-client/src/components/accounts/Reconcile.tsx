import React, { useState, useEffect } from 'react';
import { Trans } from 'react-i18next';

import * as queries from 'loot-core/src/client/queries';
import { type Query } from 'loot-core/src/shared/query';
import { currencyToInteger } from 'loot-core/src/shared/util';
import { type AccountEntity } from 'loot-core/types/models';

import { SvgCheckCircle1 } from '../../icons/v2';
import { styles, theme } from '../../style';
import { Button } from '../common/Button2';
import { InitialFocus } from '../common/InitialFocus';
import { Input } from '../common/Input';
import { Text } from '../common/Text';
import { View } from '../common/View';
import { useFormat } from '../spreadsheet/useFormat';
import { useSheetValue } from '../spreadsheet/useSheetValue';
import { runQuery } from 'loot-core/src/client/query-helpers';
import { q, type Query } from 'loot-core/src/shared/query';

type ReconcilingMessageProps = {
  balanceQuery: { name: `balance-query-${string}`; query: Query };
  targetBalance: number;
  onDone: () => void;
  onCreateTransaction: (targetDiff: number) => void;
};

export function ReconcilingMessage({
  balanceQuery,
  targetBalance,
  onDone,
  onCreateTransaction,
}: ReconcilingMessageProps) {
  const cleared =
    useSheetValue<'balance', `balance-query-${string}-cleared`>({
      name: (balanceQuery.name +
        '-cleared') as `balance-query-${string}-cleared`,
      value: 0,
      query: balanceQuery.query.filter({ cleared: true }),
    }) ?? 0;
  const format = useFormat();
  const targetDiff = targetBalance - cleared;

  const clearedBalance = format(cleared, 'financial');
  const bankBalance = format(targetBalance, 'financial');
  const difference =
    (targetDiff > 0 ? '+' : '') + format(targetDiff, 'financial');

  return (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: theme.tableBackground,
        ...styles.shadow,
        borderRadius: 4,
        marginTop: 5,
        marginBottom: 15,
        padding: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {targetDiff === 0 ? (
          <View
            style={{
              color: theme.noticeTextLight,
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SvgCheckCircle1
              style={{
                width: 13,
                height: 13,
                color: 'inherit',
                marginRight: 3,
              }}
            />
            <Trans>All reconciled!</Trans>
          </View>
        ) : (
          <View style={{ color: theme.tableText }}>
            <Text style={{ fontStyle: 'italic', textAlign: 'center' }}>
              <Trans>
                Your cleared balance <strong>{clearedBalance}</strong> needs{' '}
                <strong>{difference}</strong> to match
                <br /> your bank&apos;s balance of{' '}
                <Text style={{ fontWeight: 700 }}>{bankBalance}</Text>
              </Trans>
            </Text>
          </View>
        )}
        <View style={{ marginLeft: 15 }}>
          <Button variant="primary" onPress={onDone}>
            <Trans>Done Reconciling</Trans>
          </Button>
        </View>
        {targetDiff !== 0 && (
          <View style={{ marginLeft: 15 }}>
            <Button onPress={() => onCreateTransaction(targetDiff)}>
              <Trans>Create Reconciliation Transaction</Trans>
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}

type ReconcileMenuProps = {
  account: AccountEntity;
  onReconcile: (amount: number | null) => void;
  onClose: () => void;
};

export function accountBalances(acct: AccountEntity) {
  return q('accounts').filter({ id: acct.id }).select('*'); // Select all fields
}

export function ReconcileMenu({
  account,
  onReconcile,
  onClose,
}: ReconcileMenuProps) {
  const balanceQuery = queries.accountBalance(account);
  const [balances, setBalances] = useState({ current: null, available: null });

  useEffect(() => {
    async function fetchBalances() {
      const balanceQuery2 = accountBalances(account);
      const { data } = await runQuery(balanceQuery2);
      console.log('data');
      console.log(data);

      if (data && data.length > 0) {
        setBalances({
          current: data[0].balance_current,
          available: data[0].balance_available,
        });
        console.log(data[0].balance_current, data[0].balance_available);
      }
    }

    fetchBalances();
  }, [account]);

  const clearedBalance = useSheetValue<'account', `balance-${string}-cleared`>({
    name: (balanceQuery.name + '-cleared') as `balance-${string}-cleared`,
    value: null,
    query: balanceQuery.query.filter({ cleared: true }),
  });
  const format = useFormat();
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);

  function onSubmit() {
    if (inputValue === '') {
      setInputFocused(true);
      return;
    }

    const amount =
      inputValue != null ? currencyToInteger(inputValue) : clearedBalance;

    onReconcile(amount);
    onClose();
  }

  return (
    <View style={{ padding: '5px 8px' }}>
      <Text>
        <Trans>
          Enter the current balance of your bank account that you want to
          reconcile with:
        </Trans>
      </Text>
      {clearedBalance != null && (
        <InitialFocus>
          <Input
            defaultValue={format(clearedBalance, 'financial')}
            onChangeValue={setInputValue}
            style={{ margin: '7px 0' }}
            focused={inputFocused}
            onEnter={onSubmit}
          />
        </InitialFocus>
      )}
      <Button variant="primary" onPress={onSubmit}>
        <Trans>Reconcile</Trans>
      </Button>

      {(balances.current !== null || balances.available !== null) && (
        <View
          style={{
            marginTop: 15,
            padding: 12,
            backgroundColor:
              clearedBalance !== null && balances.current === clearedBalance
                ? '#f0f9f0'
                : '#fdf2f2',
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 12,
              marginBottom: 8,
              color: '#666',
              textAlign: 'center',
            }}
          >
            Current Balance From Your Bank
          </Text>
          {balances.current !== null && (
            <View style={{ marginBottom: 8 }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 14,
                  marginBottom: 4,
                  textAlign: 'center',
                }}
              >
                {format(balances.current, 'financial')}
              </Text>
              {clearedBalance !== null && (
                <>
                  <Text
                    style={{
                      fontSize: 12,
                      color:
                        balances.current === clearedBalance
                          ? '#22c55e'
                          : '#ef4444',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginTop: 10,
                    }}
                  >
                    {balances.current === clearedBalance
                      ? 'The current balance reported by your bank matches the cleared total here in your budget.'
                      : "The current balance reported by your bank doesn't match the cleared total here in your budget."}
                  </Text>

                  {balances.current !== clearedBalance && (
                    <View
                      style={{
                        border: '1.5px solid #ef4444',
                        borderRadius: 6,
                        padding: 8,
                        textAlign: 'center',
                        marginTop: 14,
                        marginLeft: 35,
                        marginRight: 35,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'normal',
                          color: '#ef4444',
                        }}
                      >
                        {format(
                          Math.abs(balances.current - clearedBalance),
                          'financial',
                        )}
                      </Text>
                      <Text
                        style={{ fontSize: 11, color: '#666', marginBottom: 2 }}
                      >
                        difference between the balances
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          )}
          <Text
            style={{
              fontSize: 11,
              color: '#999',
              fontStyle: 'italic',
              marginTop: 10,
            }}
          >
            Balances were received from your bank at the last successful bank
            sync. While current balances are used for reconciling, it might also
            be helpful to know that the last-reported available balance
            according to the bank was{' '}
            {balances.available !== null
              ? format(balances.available, 'financial')
              : 'not available'}
            .
          </Text>
        </View>
      )}
    </View>
  );
}
