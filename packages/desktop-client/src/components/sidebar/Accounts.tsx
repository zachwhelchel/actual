import React, { useState, useMemo } from 'react';

import { type AccountEntity } from 'loot-core/src/types/models';

import Add from '../../icons/v1/Add';
import Phone from '../../icons/v1/Education';
import Badge from '../../icons/v1/UserSolidCircle';
import Bolt from '../../icons/v1/Reload';
import View from '../common/View';
import { type OnDropCallback } from '../sort';
import { type Binding } from '../spreadsheet';

import Account from './Account';
import SecondaryItem from './SecondaryItem';

import Coach, { CoachProvider, useCoach } from '../coach/Coach';
import { REACT_APP_BILLING_STATUS, REACT_APP_TRIAL_END_DATE, REACT_APP_ZOOM_RATE, REACT_APP_ZOOM_LINK, REACT_APP_COACH, REACT_APP_COACH_FIRST_NAME, REACT_APP_USER_FIRST_NAME } from '../../coaches/coachVariables';

const fontWeight = 600;

type AccountsProps = {
  accounts: AccountEntity[];
  failedAccounts: Map<
    string,
    {
      type: string;
      code: string;
    }
  >;
  updatedAccounts: string[];
  getAccountPath: (account: AccountEntity) => string;
  allAccountsPath: string;
  budgetedAccountPath: string;
  offBudgetAccountPath: string;
  getBalanceQuery: (account: AccountEntity) => Binding;
  getAllAccountBalance: () => Binding;
  getOnBudgetBalance: () => Binding;
  getOffBudgetBalance: () => Binding;
  showClosedAccounts: boolean;
  onAddAccount: () => void;
  onScheduleZoom: () => void;
  onFreeTrial: () => void;
  onManageSubscription: () => void;
  onResetAvatar: () => void;
  onToggleClosedAccounts: () => void;
  onReorder: OnDropCallback;
};

function Accounts({
  accounts,
  failedAccounts,
  updatedAccounts,
  getAccountPath,
  allAccountsPath,
  budgetedAccountPath,
  offBudgetAccountPath,
  getBalanceQuery,
  getAllAccountBalance,
  getOnBudgetBalance,
  getOffBudgetBalance,
  showClosedAccounts,
  onAddAccount,
  onScheduleZoom,
  onFreeTrial,
  onManageSubscription,
  onResetAvatar,
  onToggleClosedAccounts,
  onReorder,
}: AccountsProps) {
  let [isDragging, setIsDragging] = useState(false);
  let offbudgetAccounts = useMemo(
    () =>
      accounts.filter(
        account => account.closed === 0 && account.offbudget === 1,
      ),
    [accounts],
  );
  let budgetedAccounts = useMemo(
    () =>
      accounts.filter(
        account => account.closed === 0 && account.offbudget === 0,
      ),
    [accounts],
  );
  let closedAccounts = useMemo(
    () => accounts.filter(account => account.closed === 1),
    [accounts],
  );

  function onDragChange(drag) {
    setIsDragging(drag.state === 'start');
  }

  let makeDropPadding = (i, length) => {
    if (i === 0) {
      return {
        paddingTop: isDragging ? 15 : 0,
        marginTop: isDragging ? -15 : 0,
      };
    }
    return null;
  };

  let { commonElementsRef } = useCoach(); // this is causing the errors.

  let coachFirstNameZoom = "Zoom with " + REACT_APP_COACH_FIRST_NAME;
  let coachFirstNameReset = "Reset " + REACT_APP_COACH_FIRST_NAME;

  return (
    <View>

      <div
        ref={element => {
          commonElementsRef.current['all_accounts'] = element;
        }}
      >
        <Account
          name="All accounts"
          to={allAccountsPath}
          query={getAllAccountBalance()}
          style={{ fontWeight, marginTop: 15 }}
        />
      </div>

      {budgetedAccounts.length > 0 && (
        <Account
          name="For budget"
          to={budgetedAccountPath}
          query={getOnBudgetBalance()}
          style={{ fontWeight, marginTop: 13 }}
        />
      )}

      {budgetedAccounts.map((account, i) => (
        <Account
          key={account.id}
          name={account.name}
          account={account}
          connected={!!account.bank}
          failed={failedAccounts && failedAccounts.has(account.id)}
          updated={updatedAccounts && updatedAccounts.includes(account.id)}
          to={getAccountPath(account)}
          query={getBalanceQuery(account)}
          onDragChange={onDragChange}
          onDrop={onReorder}
          outerStyle={makeDropPadding(i, budgetedAccounts.length)}
        />
      ))}

      {offbudgetAccounts.length > 0 && (
        <Account
          name="Off budget"
          to={offBudgetAccountPath}
          query={getOffBudgetBalance()}
          style={{ fontWeight, marginTop: 13 }}
        />
      )}

      {offbudgetAccounts.map((account, i) => (
        <Account
          key={account.id}
          name={account.name}
          account={account}
          connected={!!account.bank}
          failed={failedAccounts && failedAccounts.has(account.id)}
          updated={updatedAccounts && updatedAccounts.includes(account.id)}
          to={getAccountPath(account)}
          query={getBalanceQuery(account)}
          onDragChange={onDragChange}
          onDrop={onReorder}
          outerStyle={makeDropPadding(i, offbudgetAccounts.length)}
        />
      ))}

      {closedAccounts.length > 0 && (
        <SecondaryItem
          style={{ marginTop: 15 }}
          title={'Closed accounts' + (showClosedAccounts ? '' : '...')}
          onClick={onToggleClosedAccounts}
          bold
        />
      )}

      {showClosedAccounts &&
        closedAccounts.map((account, i) => (
          <Account
            key={account.id}
            name={account.name}
            account={account}
            to={getAccountPath(account)}
            query={getBalanceQuery(account)}
            onDragChange={onDragChange}
            onDrop={onReorder}
          />
        ))}

      <div
        ref={element => {
          commonElementsRef.current['add_account'] = element;
        }}
      >
        <SecondaryItem
          style={{
            marginTop: 15,
            marginBottom: 9,
          }}
          onClick={onAddAccount}
          Icon={Add}
          title="Add account"
        />
      </div>

      {REACT_APP_COACH != undefined && (
        <div
          ref={element => {
            commonElementsRef.current['zoom_link'] = element;
          }}
        >
          <SecondaryItem
            style={{
              marginTop: 15,
              marginBottom: 9,
            }}
            onClick={onScheduleZoom}
            Icon={Phone}
            title={coachFirstNameZoom}
          />
        </div>
      )}

      {REACT_APP_COACH != undefined && (
        <SecondaryItem
          style={{
            marginTop: 15,
            marginBottom: 9,
          }}
          onClick={onResetAvatar}
          Icon={Bolt}
          title={coachFirstNameReset}
        />
      )}

      {REACT_APP_BILLING_STATUS === "free_trial" && (
        <SecondaryItem
          style={{
            marginTop: 15,
            marginBottom: 9,
          }}
          onClick={onFreeTrial}
          Icon={Badge}
          title="Free Trial"
        />
      )}

      {REACT_APP_BILLING_STATUS === "paid" && (
        <SecondaryItem
          style={{
            marginTop: 15,
            marginBottom: 9,
          }}
          onClick={onManageSubscription}
          Icon={Badge}
          title="Manage Subscription"
        />
      )}

    </View>
  );
}

export default Accounts;
