import React, { useState, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { moveAccount } from 'loot-core/src/client/actions';
import * as queries from 'loot-core/src/client/queries';
import { type State } from 'loot-core/src/client/state-types';
import { type AccountEntity } from 'loot-core/types/models';

import {
  REACT_APP_BILLING_STATUS,
  REACT_APP_TRIAL_END_DATE,
  REACT_APP_START_PAYING_DATE,
  REACT_APP_ZOOM_RATE,
  REACT_APP_ZOOM_LINK,
  REACT_APP_COACH,
  REACT_APP_COACH_FIRST_NAME,
  REACT_APP_USER_FIRST_NAME,
  REACT_APP_UI_MODE,
  REACT_APP_COACH_PHOTO,
} from '../../coaches/coachVariables';
import { useAccounts } from '../../hooks/useAccounts';
import { useClosedAccounts } from '../../hooks/useClosedAccounts';
import { useFailedAccounts } from '../../hooks/useFailedAccounts';
import { useLocalPref } from '../../hooks/useLocalPref';
import { useOffBudgetAccounts } from '../../hooks/useOffBudgetAccounts';
import { useOnBudgetAccounts } from '../../hooks/useOnBudgetAccounts';
import { useUpdatedAccounts } from '../../hooks/useUpdatedAccounts';
import {
  SvgAdd,
  SvgEducation,
  SvgBadge,
  SvgReload,
  SvgBolt,
  SvgChatBubbleDots,
} from '../../icons/v1';
import { theme } from '../../style';
import Coach, { CoachProvider, useCoach } from '../coach/Coach';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Link } from '../common/Link';
import { View } from '../common/View';
import { type OnDropCallback } from '../sort';
import { type Binding } from '../spreadsheet';

import { Account } from './Account';
import { SecondaryItem } from './SecondaryItem';

const fontWeight = 600;

type AccountsProps = {
  onAddAccount: () => void;
  onScheduleZoom: () => void;
  onFreeTrial: () => void;
  onManageSubscription: () => void;
  onResetAvatar: () => void;
  onUploadAvatar: () => void;
  onStartNewConversation: () => void;
};

export function Accounts({
  onAddAccount,
  onScheduleZoom,
  onFreeTrial,
  onManageSubscription,
  onResetAvatar,
  onUploadAvatar,
  onStartNewConversation,
}: AccountsProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const accounts = useAccounts();
  const failedAccounts = useFailedAccounts();
  const updatedAccounts = useUpdatedAccounts();
  const offbudgetAccounts = useOffBudgetAccounts();
  const onBudgetAccounts = useOnBudgetAccounts();
  const closedAccounts = useClosedAccounts();
  const syncingAccountIds = useSelector(
    (state: State) => state.account.accountsSyncing,
  );

  const getAccountPath = (account: AccountEntity) => `/accounts/${account.id}`;

  const [showClosedAccounts, setShowClosedAccountsPref] = useLocalPref(
    'ui.showClosedAccounts',
  );

  function onDragChange(drag: { state: string }) {
    setIsDragging(drag.state === 'start');
  }

  const makeDropPadding = (i: number) => {
    if (i === 0) {
      return {
        paddingTop: isDragging ? 15 : 0,
        marginTop: isDragging ? -15 : 0,
      };
    }
    return undefined;
  };

  async function onReorder(
    id: string,
    dropPos: 'top' | 'bottom',
    targetId: unknown,
  ) {
    let targetIdToMove = targetId;
    if (dropPos === 'bottom') {
      const idx = accounts.findIndex(a => a.id === targetId) + 1;
      targetIdToMove = idx < accounts.length ? accounts[idx].id : null;
    }

    dispatch(moveAccount(id, targetIdToMove));
  }

  const onToggleClosedAccounts = () => {
    setShowClosedAccountsPref(!showClosedAccounts);
  };

  const {
    commonElementsRef,
    conversationDeck,
    openConversation,
    setOpenConversation,
    allConversations,
  } = useCoach(); // this is causing the errors.

  const coachFirstNameZoom = 'Zoom with ' + REACT_APP_COACH_FIRST_NAME;
  const coachFirstNameReset = 'Reset ' + REACT_APP_COACH_FIRST_NAME;
  const imgSrc = REACT_APP_COACH_PHOTO;
  const myCoach = 'My Coach: ' + REACT_APP_COACH_FIRST_NAME;

  let mode = 'subscribed';
  let freeTrialDaysLeft = 0;
  let daysUntilDeletion = 0;

  const supportedTriggerTypes = [];

  allConversations.forEach((value, key) => {
    const conversation = value;
    conversation.triggerType;
    if (conversation.canBeUserInitiated == true) {
      supportedTriggerTypes.push({
        title: conversation.title,
        triggerType: conversation.triggerType,
      });
    }
  });

  const oneDay = 24 * 60 * 60 * 1000;

  if (
    REACT_APP_START_PAYING_DATE !== null &&
    REACT_APP_START_PAYING_DATE !== undefined
  ) {
    const startPayingDate = Date.parse(REACT_APP_START_PAYING_DATE);
    console.log('startPayingDate:' + startPayingDate);

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (startPayingDate >= now) {
      console.log('free');
      mode = 'free_trial';
      freeTrialDaysLeft = Math.round(
        Math.abs((startPayingDate - now) / oneDay),
      );
    } else {
      console.log('deletion_soon');

      mode = 'deletion_soon';
      daysUntilDeletion = Math.round(
        Math.abs((now - startPayingDate) / oneDay),
      );
    }
  }

  if (REACT_APP_BILLING_STATUS === 'paid') {
    console.log('subscribed');
    console.log(REACT_APP_BILLING_STATUS);

    mode = 'subscribed';
  }

  const messageCenterText = 'Message Center';

  return (
    <View>
      <div
        ref={element => {
          commonElementsRef.current['all_accounts'] = element;
        }}
      >
        <Account
          name="All accounts"
          to="/accounts"
          query={queries.allAccountBalance()}
          style={{ fontWeight, marginTop: 15 }}
        />
      </div>

      {onBudgetAccounts.length > 0 && (
        <div
          ref={element => {
            commonElementsRef.current['for_budget_accounts'] = element;
          }}
        >
          <Account
            name="For budget"
            to="/accounts/budgeted"
            query={queries.onBudgetAccountBalance()}
            style={{
              fontWeight,
              marginTop: 13,
              marginBottom: 5,
            }}
          />
        </div>
      )}

      {onBudgetAccounts.map((account, i) => (
        <Account
          key={account.id}
          name={account.name}
          account={account}
          connected={!!account.bank}
          pending={syncingAccountIds.includes(account.id)}
          failed={failedAccounts && failedAccounts.has(account.id)}
          updated={updatedAccounts && updatedAccounts.includes(account.id)}
          to={getAccountPath(account)}
          query={queries.accountBalance(account)}
          onDragChange={onDragChange}
          onDrop={onReorder}
          outerStyle={makeDropPadding(i)}
        />
      ))}

      {offbudgetAccounts.length > 0 && (
        <Account
          name="Off budget"
          to="/accounts/offbudget"
          query={queries.offBudgetAccountBalance()}
          style={{
            fontWeight,
            marginTop: 13,
            marginBottom: 5,
          }}
        />
      )}

      {offbudgetAccounts.map((account, i) => (
        <Account
          key={account.id}
          name={account.name}
          account={account}
          connected={!!account.bank}
          pending={syncingAccountIds.includes(account.id)}
          failed={failedAccounts && failedAccounts.has(account.id)}
          updated={updatedAccounts && updatedAccounts.includes(account.id)}
          to={getAccountPath(account)}
          query={queries.accountBalance(account)}
          onDragChange={onDragChange}
          onDrop={onReorder}
          outerStyle={makeDropPadding(i)}
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
        closedAccounts.map(account => (
          <Account
            key={account.id}
            name={account.name}
            account={account}
            to={getAccountPath(account)}
            query={queries.accountBalance(account)}
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
          Icon={SvgAdd}
          title="Add account"
        />
      </div>

      <View
        style={{
          height: 1,
          backgroundColor: theme.sidebarItemBackgroundHover,
          marginTop: 6,
          flexShrink: 0,
        }}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          width: '100%',
          marginTop: 22,
        }}
      >
        {openConversation == null && REACT_APP_COACH_FIRST_NAME != null && (
          <img
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              width: '70px',
              height: '70px',
              borderRadius: '50px',
            }}
            src={imgSrc}
            alt="coach"
          />
        )}
        {openConversation != null && REACT_APP_COACH_FIRST_NAME != null && (
          <img
            style={{
              opacity: 0.4,
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              width: '70px',
              height: '70px',
              borderRadius: '50px',
            }}
            src={imgSrc}
            alt="coach"
          />
        )}
      </div>

      <View
        style={{
          marginLeft: '16',
          marginRight: '16',
          marginTop: '-9',
          textAlign: 'center',
          flexShrink: '0',
        }}
      >
        {openConversation == null && REACT_APP_COACH_FIRST_NAME != null && (
          <h4
            style={{
              marginBottom: '0',
              paddingBottom: '0',
            }}
          >
            {myCoach}
          </h4>
        )}
        {openConversation != null && REACT_APP_COACH_FIRST_NAME != null && (
          <h4
            style={{
              opacity: 0.4,
              marginBottom: '0',
              paddingBottom: '0',
            }}
          >
            {myCoach}
          </h4>
        )}
      </View>

      <div
        style={{
          marginTop: 5,
          marginLeft: 11,
          marginRight: 11,
          flexShrink: '0',
        }}
      >
        {conversationDeck.map(conversation => (
          <>
            {conversation.id === openConversation && (
              <Card
                style={{
                  opacity: 0.4,
                  marginTop: 15,
                  marginBottom: 7,
                  paddingLeft: 10,
                  paddingTop: 8,
                  paddingRight: 10,
                  paddingBottom: 8,
                  color: theme.pageText,
                }}
                onClick={() => setOpenConversation(null)}
              >
                <h4
                  style={{
                    marginTop: 0,
                    marginBottom: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    color: theme.pageText,
                  }}
                >
                  {conversation.title}
                </h4>
                <p
                  style={{
                    marginTop: 0,
                    marginBottom: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    color: theme.pageText,
                  }}
                >
                  In progress...
                </p>
              </Card>
            )}
            {conversation.id !== openConversation && (
              <Card
                style={{
                  opacity: 1.0,
                  marginTop: 15,
                  marginBottom: 7,
                  paddingLeft: 10,
                  paddingTop: 8,
                  paddingRight: 10,
                  paddingBottom: 8,
                  color: theme.pageText,
                }}
                onClick={() => setOpenConversation(conversation.id)}
              >
                <h4
                  style={{
                    marginTop: 0,
                    marginBottom: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    color: theme.pageText,
                  }}
                >
                  {conversation.title}
                </h4>
                <p
                  style={{
                    marginTop: 0,
                    marginBottom: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    color: theme.pageText,
                  }}
                >
                  Continue conversation...
                </p>
              </Card>
            )}
          </>
        ))}

        {supportedTriggerTypes.length > 0 && (
          <p
            style={{
              marginTop: 15,
              marginLeft: 15,
              marginRight: 15,
              paddingBottom: 0,
              flexShrink: '1',
              textAlign: 'center',
              color: 'white',
            }}
            onClick={() => onStartNewConversation()}
          >
            <u>Start a New Conversation</u>
          </p>
        )}
      </div>

      <View
        style={{
          marginLeft: '16',
          marginRight: '16',
          marginTop: 20,
          paddingTop: '20',
          flexShrink: '0',
        }}
      >
        {REACT_APP_COACH != undefined && (
          <div
            ref={element => {
              commonElementsRef.current['zoom_link'] = element;
            }}
          >
            <Button
              type="primary"
              onClick={() => onScheduleZoom()}
              style={{
                flex: 1,
                display: 'flex',
                width: '90%',
                marginLeft: '5%',
                marginRight: '5%',
                marginTop: 0,
              }}
            >
              Schedule Video Call
            </Button>
          </div>
        )}

        <Button
          type="primary"
          onClick={() => onUploadAvatar()}
          style={{
            width: '90%',
            marginLeft: '5%',
            marginRight: '5%',
            marginTop: 10,
          }}
        >
          Manage Coach
        </Button>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: theme.sidebarItemBackgroundHover,
          marginTop: 26,
          flexShrink: 0,
        }}
      />

      {REACT_APP_UI_MODE === 'user' && mode === 'subscribed' && (
        <p
          style={{
            marginTop: 15,
            marginLeft: 15,
            marginRight: 15,
            paddingBottom: 15,
            flexShrink: '1',
          }}
        >
          You are currently subscribed. Manage your subscription{' '}
          <Link
            variant="external"
            linkColor="white"
            to="https://mybudgetcoach.app/subscription"
          >
            here
          </Link>
          .
        </p>
      )}

      {REACT_APP_UI_MODE === 'user' && mode === 'free_trial' && (
        <p
          style={{
            marginTop: 15,
            marginLeft: 15,
            marginRight: 15,
            paddingBottom: 15,
            flexShrink: '1',
          }}
        >
          Your Free Trial has {freeTrialDaysLeft} days remaining.{' '}
          <Link
            variant="external"
            linkColor="white"
            to="https://mybudgetcoach.app/subscription"
          >
            Subscribe at any time
          </Link>{' '}
          to keep your budget beyond your trial.
        </p>
      )}

      {REACT_APP_UI_MODE === 'user' && mode === 'deletion_soon' && (
        <>
          <p
            style={{
              marginTop: 15,
              marginLeft: 15,
              marginRight: 15,
              paddingBottom: 15,
              flexShrink: '1',
              color: theme.errorText,
            }}
          >
            Your Free Trial ended {daysUntilDeletion} days ago.{' '}
            <Link
              variant="external"
              linkColor="white"
              to="https://mybudgetcoach.app/subscription"
            >
              Subscribe now
            </Link>{' '}
            to avoid losing your budget.
          </p>
          <p
            style={{
              marginTop: 0,
              marginLeft: 15,
              marginRight: 15,
              paddingBottom: 15,
              flexShrink: '1',
              color: theme.errorText,
            }}
          >
            Note: Once subscribed this warning will disapear within 2 business
            days.
          </p>
        </>
      )}
    </View>
  );
}
