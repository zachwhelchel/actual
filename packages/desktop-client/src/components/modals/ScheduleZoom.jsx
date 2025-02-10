import React, { useState } from 'react';

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
import { REACT_APP_BILLING_STATUS, REACT_APP_TRIAL_END_DATE, REACT_APP_ZOOM_RATE, REACT_APP_ZOOM_LINK, REACT_APP_COACH, REACT_APP_COACH_FIRST_NAME, REACT_APP_USER_FIRST_NAME } from '../../coaches/coachVariables';

export function ScheduleZoom({
  modalProps,
}) {
  return (

    <Modal name="schedule-zoom">
      {({ state: { close } }) => (
        <>
          <ModalHeader
            title={
              <ModalTitle title={'Schedule Video Call'} shrinkOnOverflow />
            }
            rightContent={<ModalCloseButton onPress={close} />}
          />

        <View style={{ lineHeight: 1.5 }}>
          <Block>
            You can schedule a video call with your coach (or their team) at any time ({REACT_APP_ZOOM_RATE}). You will be billed seperately. Click the button below to schedule a time that works for you.
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
                  window.location.href = "mailto:admin@mybudgetcoach.com?subject=Support";
                }}
              >
                Contact Support
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  window.open(REACT_APP_ZOOM_LINK, "_blank");
                }}
              >
                Schedule a Video Call
              </Button>
            </View>
          </View>
        </View>
      </>

      )}
    </Modal>
  );
}