import React, { useState } from 'react';

import { send } from 'loot-core/src/platform/client/fetch';
import { useDispatch, useSelector } from 'react-redux';

import {
  REACT_APP_UI_MODE,
  testableCoachList,
  REACT_APP_COACH,
} from '../../coaches/coachVariables';
import { SvgWallet } from '../../icons/v1';
import {
  SvgDownloadThickBottom,
  SvgRemove,
  SvgAlertTriangle,
} from '../../icons/v2';
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
import { Link } from '../common/Link';

export function PortalModal({}) {
  const userData = useSelector(state => state.user.data);

  const basicSelected = async () => {
    console.log('basicSelected');

    const url = String(window.location.href);
    console.log('go pay...');

    let successUrl = new URL(url);
    successUrl = successUrl.toString();

    if (userData?.userId) {
    } else {
      return;
    }

    let userId = userData.userId;

    console.log(url);
    console.log(userId);
    console.log(successUrl);

    const results = await send('airtable-create-portal-session', {
      url,
      userId,
      successUrl,
    });

    console.log('airtable-create-portal-session');
    console.log(results);

    window.location.href = results;
  };

  const contactSelected = async () => {
    console.log('contactSelected');
    window.location.href = 'mailto:admin@mybudgetcoach.com?subject=Cancel';
  };

  return (
    <Modal name="portal" containerProps={{ style: { width: 800 } }}>
      {({ state: { close } }) => (
        <>
          <ModalHeader
            title={
              <ModalTitle title={`Manage Your Subscription`} shrinkOnOverflow />
            }
            rightContent={<ModalCloseButton onPress={close} />}
          />
          <View style={{ lineHeight: 1.5 }}>
            <p>
              Most users are able to manage their subscription on Stripe{' '}
              <Link variant="text" linkColor="white" onClick={basicSelected}>
                here
              </Link>
              {''}. If your subscription is on Paddle or the App Store please
              reach out to us{' '}
              <Link variant="text" linkColor="white" onClick={contactSelected}>
                here
              </Link>
              {''}.
            </p>
          </View>
        </>
      )}
    </Modal>
  );
}
