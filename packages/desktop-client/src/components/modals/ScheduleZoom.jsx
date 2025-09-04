import React, { useState } from 'react';
import {
  REACT_APP_BILLING_STATUS,
  REACT_APP_TRIAL_END_DATE,
  REACT_APP_ZOOM_RATE,
  REACT_APP_ZOOM_LINK,
  REACT_APP_COACH,
  REACT_APP_COACH_FIRST_NAME,
  REACT_APP_USER_FIRST_NAME,
  REACT_APP_USER_PLAN,
  REACT_APP_COACH_CAL_ID,
} from '../../coaches/coachVariables';
import { colors } from '../../style';
import { Block } from '../common/Block';
import { Button } from '../common/Button';
import {
  Modal,
  ModalButtons,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
} from '../common/Modal';
import { Text } from '../common/Text';
import { View } from '../common/View';

export function ScheduleZoom({ modalProps }) {
  const isPremium = REACT_APP_USER_PLAN === 'premium';
  const isBasic = REACT_APP_USER_PLAN === 'basic';

  const getCalLink = sessionType => {
    // If no coach cal ID, use the original zoom link
    if (!REACT_APP_COACH_CAL_ID) {
      return REACT_APP_ZOOM_LINK;
    }

    return `https://cal.mybudgetcoach.com/${REACT_APP_COACH_CAL_ID}/${sessionType}`;
  };

  const handleScheduleClick = sessionType => {
    const link = getCalLink(sessionType);
    window.open(link, '_blank');
  };

  return (
    <Modal name="schedule-zoom">
      {({ state: { close } }) => (
        <>
          <ModalHeader
            title={<ModalTitle title="Schedule Video Call" shrinkOnOverflow />}
            rightContent={<ModalCloseButton onPress={close} />}
          />
          <View style={{ lineHeight: 1.5 }}>
            <Block>
              {isPremium ? (
                <>
                  You can schedule your included monthly video call with your
                  coach at any time, or schedule additional sessions.
                </>
              ) : (
                <>
                  You can schedule a video call with your coach at any time. You
                  will be billed separately. Click the button below to schedule
                  a time that works for you.
                </>
              )}
            </Block>

            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    window.location.href =
                      'mailto:admin@mybudgetcoach.com?subject=Support';
                  }}
                >
                  Contact Support
                </Button>

                {isPremium ? (
                  <>
                    <Button
                      type="primary"
                      style={{ marginRight: 10 }}
                      onClick={() => handleScheduleClick('premium-included')}
                    >
                      Schedule Included Call
                    </Button>
                    <Button
                      type="primary"
                      onClick={() =>
                        handleScheduleClick('premium-additional-session')
                      }
                    >
                      Schedule Additional Call
                    </Button>
                  </>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => handleScheduleClick('basic-session')}
                  >
                    Schedule a Video Call
                  </Button>
                )}
              </View>
            </View>
          </View>
        </>
      )}
    </Modal>
  );
}
