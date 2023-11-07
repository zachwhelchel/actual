import React, { useState } from 'react';

import { colors } from '../../style';
import Block from '../common/Block';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Text from '../common/Text';
import View from '../common/View';

export default function FreeTrial({
  modalProps,
}) {
  return (
    <Modal title="Free Trial" {...modalProps} style={{ flex: 0 }}>
      {() => (
        <View style={{ lineHeight: 1.5 }}>
          <Block>
            You are currently using a 34-day free trial of the MyBudgetCoach app. To upgrade your plan please contact support.
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
                  window.location.href = "mailto:admin@mybudgetcoach.app";
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