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



/////////

let url = window.location.href;

let REACT_APP_BILLING_STATUS = process.env.REACT_APP_BILLING_STATUS;
let REACT_APP_TRIAL_END_DATE = process.env.REACT_APP_TRIAL_END_DATE;
let REACT_APP_ZOOM_RATE = process.env.REACT_APP_ZOOM_RATE;
let REACT_APP_ZOOM_LINK = process.env.REACT_APP_ZOOM_LINK;
let REACT_APP_COACH = process.env.REACT_APP_COACH;
let REACT_APP_COACH_FIRST_NAME = process.env.REACT_APP_COACH_FIRST_NAME;
let REACT_APP_USER_FIRST_NAME = process.env.REACT_APP_USER_FIRST_NAME;

if (url.includes("kristinwade")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "49.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://www.fiscal-bliss.com/booking-calendar/mybudgetcoach-meeting"
  REACT_APP_COACH = "kristinwade"
  REACT_APP_COACH_FIRST_NAME = "Kristin"
  REACT_APP_USER_FIRST_NAME = "Kristin"
} 
else if (url.includes("nicksmith")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 28th, 2023"
  REACT_APP_ZOOM_RATE = "40.00 USD / hour"
  REACT_APP_ZOOM_LINK = "https://calendly.com/personalwealthadventures/one-hour-session"
  REACT_APP_COACH = "nicksmith"
  REACT_APP_COACH_FIRST_NAME = "Nick"
  REACT_APP_USER_FIRST_NAME = "Nick"
}
else if (url.includes("jordanjung")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "39.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://calendly.com/jordan_denae/1-hour-meeting"
  REACT_APP_COACH = "jordanjung"
  REACT_APP_COACH_FIRST_NAME = "Jordan"
  REACT_APP_USER_FIRST_NAME = "Jordan"
}
else if (url.includes("randidegraw")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "39.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://meetings.hubspot.com/randi-degraw/mybudgetcoach"
  REACT_APP_COACH = "randidegraw"
  REACT_APP_COACH_FIRST_NAME = "Randi"
  REACT_APP_USER_FIRST_NAME = "Randi"
}
else if (url.includes("zachwhelchel")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "39.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://calendly.com/jordan_denae/1-hour-meeting"
  REACT_APP_COACH = "jordanjung"
  REACT_APP_COACH_FIRST_NAME = "Jordan"
  REACT_APP_USER_FIRST_NAME = "Zach"
}
else if (url.includes("melodybarthelemy")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "35.00 USD / hour"
  REACT_APP_ZOOM_LINK = "https://calendly.com/frugallymelody/my-budget-coach"
  REACT_APP_COACH = "melodybarthelemy"
  REACT_APP_COACH_FIRST_NAME = "Melody"
  REACT_APP_USER_FIRST_NAME = "Melody"
}
else if (url.includes("alfredomatos")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "49.00 USD / hour"
  REACT_APP_ZOOM_LINK = "https://calendly.com/cashviewpoint/mybudgetcoach"
  REACT_APP_COACH = "alfredomatos"
  REACT_APP_COACH_FIRST_NAME = "Alfredo"
  REACT_APP_USER_FIRST_NAME = "Alfredo"
}
else if (url.includes("aitzarelysnegron")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "47.00 USD / 45 Minute Session"
  REACT_APP_ZOOM_LINK = "https://StrategiesandTEA.as.me/MBC"
  REACT_APP_COACH = "aitzanegron"
  REACT_APP_COACH_FIRST_NAME = "Aitzarelys"
  REACT_APP_USER_FIRST_NAME = "Aitzarelys"
}
else if (url.includes("georgewu")) {
  REACT_APP_BILLING_STATUS = "free_trial"
  REACT_APP_TRIAL_END_DATE = "February 14th, 2024"
  REACT_APP_ZOOM_RATE = "49.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://www.fiscal-bliss.com/booking-calendar/mybudgetcoach-meeting"
  REACT_APP_COACH = "kristinwade"
  REACT_APP_COACH_FIRST_NAME = "Kristin"
  REACT_APP_USER_FIRST_NAME = "George"
}
else if (url.includes("elizabethmckay")) {
  REACT_APP_BILLING_STATUS = "free_trial"
  REACT_APP_TRIAL_END_DATE = "February 18th, 2024"
  REACT_APP_ZOOM_RATE = "49.99 USD / hour"
  REACT_APP_ZOOM_LINK = "https://www.fiscal-bliss.com/booking-calendar/mybudgetcoach-meeting"
  REACT_APP_COACH = "kristinwade"
  REACT_APP_COACH_FIRST_NAME = "Kristin"
  REACT_APP_USER_FIRST_NAME = "Elizabeth"
} 
else if (url.includes("enidnegron")) {
  REACT_APP_BILLING_STATUS = "free_trial"
  REACT_APP_TRIAL_END_DATE = "February 18th, 2024"
  REACT_APP_ZOOM_RATE = "47.00 USD / 45 Minute Session"
  REACT_APP_ZOOM_LINK = "https://StrategiesandTEA.as.me/MBC"
  REACT_APP_COACH = "aitzanegron"
  REACT_APP_COACH_FIRST_NAME = "Aitzarelys"
  REACT_APP_USER_FIRST_NAME = "Enid"
}
else if (url.includes("mirlandepetitraymond")) {
  REACT_APP_BILLING_STATUS = "free_trial"
  REACT_APP_TRIAL_END_DATE = "February 21st, 2024"
  REACT_APP_ZOOM_RATE = "47.00 USD / 45 Minute Session"
  REACT_APP_ZOOM_LINK = "https://StrategiesandTEA.as.me/MBC"
  REACT_APP_COACH = "aitzanegron"
  REACT_APP_COACH_FIRST_NAME = "Aitzarelys"
  REACT_APP_USER_FIRST_NAME = "Mirlande"
}
else if (url.includes("reynaperdomo")) {
  REACT_APP_BILLING_STATUS = "free_trial"
  REACT_APP_TRIAL_END_DATE = "February 21st, 2024"
  REACT_APP_ZOOM_RATE = "47.00 USD / 45 Minute Session"
  REACT_APP_ZOOM_LINK = "https://StrategiesandTEA.as.me/MBC"
  REACT_APP_COACH = "aitzanegron"
  REACT_APP_COACH_FIRST_NAME = "Aitzarelys"
  REACT_APP_USER_FIRST_NAME = "Reyna"
}
else if (url.includes("jacquelinekeeley")) {
  REACT_APP_BILLING_STATUS = "paid"
  REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
  REACT_APP_ZOOM_RATE = "40.00 USD / hour"
  REACT_APP_ZOOM_LINK = "https://calendly.com/personalwealthadventures/one-hour-session"
  REACT_APP_COACH = "nicksmith"
  REACT_APP_COACH_FIRST_NAME = "Nick"
  REACT_APP_USER_FIRST_NAME = "Jacqueline"
}
// else {
//   REACT_APP_BILLING_STATUS = "paid"
//   REACT_APP_TRIAL_END_DATE = "December 31st, 2024"
//   REACT_APP_ZOOM_RATE = "40.00 USD / hour"
//   REACT_APP_ZOOM_LINK = "https://calendly.com/personalwealthadventures/one-hour-session"
//   REACT_APP_COACH = "nicksmith"
//   REACT_APP_COACH_FIRST_NAME = "Nick"
//   REACT_APP_USER_FIRST_NAME = "Jacqueline"
// } 

//////////


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
