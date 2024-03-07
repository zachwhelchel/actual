// @ts-strict-ignore
import React, { useState, useMemo } from 'react';

import { type AccountEntity } from 'loot-core/src/types/models';
import { useNavigate } from "react-router-dom";

import { SvgAdd, SvgEducation, SvgBadge, SvgReload, SvgBolt } from '../../icons/v1';
import { View } from '../common/View';
import { Card } from '../common/Card';
import { type OnDropCallback } from '../sort';
import { type Binding } from '../spreadsheet';
import { theme } from '../../style';
import { Button } from '../common/Button';
import { ExternalLink } from '../common/ExternalLink';

import { Account } from './Account';
import { SecondaryItem } from './SecondaryItem';

import Coach, { CoachProvider, useCoach } from '../coach/Coach';
import { REACT_APP_BILLING_STATUS, REACT_APP_TRIAL_END_DATE, REACT_APP_START_PAYING_DATE, REACT_APP_ZOOM_RATE, REACT_APP_ZOOM_LINK, REACT_APP_COACH, REACT_APP_COACH_FIRST_NAME, REACT_APP_USER_FIRST_NAME, REACT_APP_UI_MODE } from '../../coaches/coachVariables';

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
  onUploadAvatar: () => void;
  onToggleClosedAccounts: () => void;
  onReorder: OnDropCallback;
};

export function Accounts({
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
  onUploadAvatar,
  onToggleClosedAccounts,
  onReorder,
}: AccountsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const offbudgetAccounts = useMemo(
    () =>
      accounts.filter(
        account => account.closed === 0 && account.offbudget === 1,
      ),
    [accounts],
  );
  const budgetedAccounts = useMemo(
    () =>
      accounts.filter(
        account => account.closed === 0 && account.offbudget === 0,
      ),
    [accounts],
  );
  const closedAccounts = useMemo(
    () => accounts.filter(account => account.closed === 1),
    [accounts],
  );

  function onDragChange(drag) {
    setIsDragging(drag.state === 'start');
  }

  const makeDropPadding = i => {
    if (i === 0) {
      return {
        paddingTop: isDragging ? 15 : 0,
        marginTop: isDragging ? -15 : 0,
      };
    }
    return null;
  };

  let { commonElementsRef, conversationDeck, openConversation, setOpenConversation } = useCoach(); // this is causing the errors.

  let coachFirstNameZoom = "Zoom with " + REACT_APP_COACH_FIRST_NAME;
  let coachFirstNameReset = "Reset " + REACT_APP_COACH_FIRST_NAME;
  let imgSrc = "/coach-icon-" + REACT_APP_COACH + "-200x200.png";
  let myCoach = "My Coach: " + REACT_APP_COACH_FIRST_NAME;
  const navigate = useNavigate();

  let mode = "subscribed";
  let freeTrialDaysLeft = 0;
  let daysUntilDeletion = 0;

  const oneDay = 24 * 60 * 60 * 1000;

  if (REACT_APP_START_PAYING_DATE !== null && REACT_APP_START_PAYING_DATE !== undefined) {
    const startPayingDate = Date.parse(REACT_APP_START_PAYING_DATE);
    console.log("startPayingDate:" + startPayingDate);

    var now = new Date();
    now.setHours(0,0,0,0);
    if (startPayingDate >= now) {
      mode = "free_trial";
      freeTrialDaysLeft = Math.round(Math.abs((startPayingDate - now) / oneDay));

    } else {
      mode = "deletion_soon"
      daysUntilDeletion = Math.round(Math.abs((now - startPayingDate) / oneDay));
    }
  }

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
        <div
          ref={element => {
            commonElementsRef.current['for_budget_accounts'] = element;
          }}
        >
          <Account
            name="For budget"
            to={budgetedAccountPath}
            query={getOnBudgetBalance()}
            style={{ fontWeight, marginTop: 13 }}
          />
        </div>
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
          outerStyle={makeDropPadding(i)}
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
          marginTop: 16,
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
              opacity: .4,
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
              opacity: .4,
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
          marginTop: 11,
          marginLeft: 11,
          marginRight: 11,
          flexShrink: '0',
        }}
      >
        {conversationDeck.map((conversation) => (

          <>
            {conversation.id === openConversation && (
              <Card
                style={{
                  opacity: .4,
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
                <h4 style={{
                  marginTop: 0,
                  marginBottom: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                  color: theme.pageText,
                }}>{conversation.title}</h4>
                <p style={{
                  marginTop: 0,
                  marginBottom: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                  color: theme.pageText,
                }}>In progress...</p>
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
                <h4 style={{
                  marginTop: 0,
                  marginBottom: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                  color: theme.pageText,
                }}>{conversation.title}</h4>
                <p style={{
                  marginTop: 0,
                  marginBottom: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                  color: theme.pageText,
                }}>Continue conversation...</p>
              </Card>
            )}

          </>
        ))}
      </div>

      <View
        style={{
          marginLeft: '16',
          marginRight: '16',
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
                width: '100%',
              }}
            >
              Schedule Zoom
            </Button>
          </div>
        )}

          <Button
            type="primary"
            onClick={() => onUploadAvatar()}
            style={{
              marginTop: '10',
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

      {REACT_APP_UI_MODE === "user" && mode === "subscribed" && (
        <p style={{
            marginTop: 15,
            marginLeft: 15,
            marginRight: 15,
            paddingBottom: 15,
            flexShrink: '1',
          }}>
            You are currently subscribed. Manage your subscription
            {" "}
            <ExternalLink
              linkColor="white"
              to={`https://mybudgetcoach.app/subscription`}
            >
            here
            </ExternalLink>
            .
        </p>
      )}

      {REACT_APP_UI_MODE === "user" && mode === "free_trial" && (
        <p style={{
            marginTop: 15,
            marginLeft: 15,
            marginRight: 15,
            paddingBottom: 15,
            flexShrink: '1',
          }}>
            Your Free Trial has {freeTrialDaysLeft} days remaining.
            {" "}
            <ExternalLink
              linkColor="white"
              to={`https://mybudgetcoach.app/subscription`}
            >
            Subscribe at any time
            </ExternalLink>
            {" "}
            to keep your budget beyond your trial.
        </p>
      )}

      {REACT_APP_UI_MODE === "user" && mode === "deletion_soon" && (
        <>
          <p style={{
              marginTop: 15,
              marginLeft: 15,
              marginRight: 15,
              paddingBottom: 15,
              flexShrink: '1',
              color: theme.errorText,
            }}>
              Your Free Trial ended {daysUntilDeletion} days ago.
              {" "}
              <ExternalLink
                linkColor="white"
                to={`https://mybudgetcoach.app/subscription`}
              >
              Subscribe now
              </ExternalLink>
              {" "}
              to avoid losing your budget.
          </p>
          <p style={{
              marginTop: 0,
              marginLeft: 15,
              marginRight: 15,
              paddingBottom: 15,
              flexShrink: '1',
              color: theme.errorText,
            }}>
            Note: Once subscribed this warning will disapear within 2 business days.
          </p>
        </>
      )}

      {REACT_APP_UI_MODE === "coach" && (
        <SecondaryItem
          style={{
            marginTop: 15,
            marginBottom: 9,
            paddingBottom: 10,
            flexShrink: '0',
          }}
          onClick={() => navigate("/coachdashboard")}
          Icon={SvgBadge}
          title="Coach Dashboard"
        />
      )}

    </View>
  );
}
