import React, { useState } from 'react';

import {
  REACT_APP_BILLING_STATUS,
  REACT_APP_TRIAL_END_DATE,
  REACT_APP_ZOOM_RATE,
  REACT_APP_ZOOM_LINK,
  REACT_APP_COACH,
  REACT_APP_COACH_FIRST_NAME,
  REACT_APP_USER_FIRST_NAME,
} from '../../coaches/coachVariables';
import { colors } from '../../style';
import { Block } from '../common/Block';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Text } from '../common/Text';
import { View } from '../common/View';

export function FreeTrial({ modalProps }) {
  /////////

  return (
    <Modal title="Free Trial" {...modalProps} style={{ flex: 0 }}>
      {() => (
        <View style={{ lineHeight: 1.5 }}>
          <Block>
            You are currently using a 35-day free trial of the MyBudgetCoach
            app. Your trial expires on {REACT_APP_TRIAL_END_DATE}. To upgrade
            your plan please contact support.
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
              <Button style={{ marginRight: 10 }} onClick={modalProps.onClose}>
                Close
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  window.location.href = 'mailto:admin@mybudgetcoach.com';
                  modalProps.onClose();
                }}
              >
                Contact Support
              </Button>
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
}
