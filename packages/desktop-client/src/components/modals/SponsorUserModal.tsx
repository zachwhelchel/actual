import React, { useState } from 'react';

import { send } from 'loot-core/src/platform/client/fetch';

import {
  REACT_APP_UI_MODE,
  testableCoachList,
  REACT_APP_COACH_FIRST_NAME,
} from '../../coaches/coachVariables';
import {
  SvgDownloadThickBottom,
  SvgRemove,
  SvgAlertTriangle,
} from '../../icons/v2';

import {
  SvgWallet,
} from '../../icons/v1';

import { colors } from '../../style';
import { useCoach } from '../coach/Coach';
import { Block } from '../common/Block';
import { Button } from '../common/Button';
import { BigInput } from '../common/Input';
import {
  Modal,
  ModalButtons,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
} from '../common/Modal';
import { Select } from '../common/Select';
import { Text } from '../common/Text';
import { View } from '../common/View';

export function SponsorUserModal({ client, onSave: originalOnSave }) {

  async function sponsor(sponsorshipLength, close) {

    //make the call...
    const url = String(window.location.href);

    const accountId = client.userId

    const results = await send('airtable-sponsor-client', {
      url,
      accountId,
      sponsorshipLength,
    });

    console.log('airtable-sponsor-client');
    console.log(results);


      originalOnSave?.();
      close();

    //location.reload();
  }



  return (
    <Modal name="sponsor-user" containerProps={{ style: { width: 800 } }}>
      {({ state: { close } }) => (
        <>
          <ModalHeader
            title={<ModalTitle title={`Sponsor ${client.name}`} shrinkOnOverflow />}
            rightContent={<ModalCloseButton onPress={close} />}
          />
          <View style={{ lineHeight: 1.5 }}>

                <p>
                  Note: Sponsorships for a user don't pay commission to their coach. Instead the sponsorship price is discounted. You will be invoiced for your chosen sponsorships at the end of each month. These are one time extensions. There is no recurring sponsorship option currently.
                </p>

              <Block>
                <h3 style={{ marginBottom: '-5px' }}>1 Month</h3>
                <p>
                  This will extend your client's access to MyBudgetCoach for 1 month starting at the end of their current trial.
                </p>
                <Button
                  type="primary"
                  style={{ marginBottom: '20px' }}
                  onClick={() => {
                    sponsor("1_month", close);
                  }}
                >
                  <>
                    <SvgWallet
                      width={13}
                      height={13}
                      style={{ marginRight: 4 }}
                    />{' '}
                    Sponsor 1 Month for $11.99
                  </>
                </Button>
              </Block>

              <Block>
                <h3 style={{ marginBottom: '-5px' }}>3 Months</h3>
                <p>
                  This will extend your client's access to MyBudgetCoach for 3 months starting at the end of their current trial.
                </p>
                <Button
                  type="primary"
                  style={{ marginBottom: '20px' }}
                  onClick={() => {
                    sponsor("3_months", close);
                  }}
                >
                  <>
                    <SvgWallet
                      width={13}
                      height={13}
                      style={{ marginRight: 4 }}
                    />{' '}
                    Sponsor 3 Months for $35.98
                  </>
                </Button>
              </Block>

              <Block>
                <h3 style={{ marginBottom: '-5px' }}>5 Months</h3>
                <p>
                  This will extend your client's access to MyBudgetCoach for 5 months starting at the end of their current trial.
                </p>
                <Button
                  type="primary"
                  style={{ marginBottom: '20px' }}
                  onClick={() => {
                    sponsor("5_months", close);
                  }}
                >
                  <>
                    <SvgWallet
                      width={13}
                      height={13}
                      style={{ marginRight: 4 }}
                    />{' '}
                    Sponsor 5 Months for $59.96
                  </>
                </Button>
              </Block>

              <Block>
                <h3 style={{ marginBottom: '-5px' }}>1 Year</h3>
                <p>
                  This will extend your client's access to MyBudgetCoach for 1 year starting at the end of their current trial.
                </p>
                <Button
                  type="primary"
                  style={{ marginBottom: '20px' }}
                  onClick={() => {
                    sponsor("1_year", close);
                  }}
                >
                  <>
                    <SvgWallet
                      width={13}
                      height={13}
                      style={{ marginRight: 4 }}
                    />{' '}
                    Sponsor 1 Year for $79.19
                  </>
                </Button>
              </Block>

          </View>
        </>
      )}
    </Modal>
  );
}
