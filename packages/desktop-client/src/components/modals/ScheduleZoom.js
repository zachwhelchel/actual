import React, { useState } from 'react';

import { colors } from '../../style';
import Block from '../common/Block';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Text from '../common/Text';
import View from '../common/View';

export default function ScheduleZoom({
  modalProps,
}) {
  return (
    <Modal title="Schedule Zoom" {...modalProps} style={{ flex: 0 }}>
      {() => (
        <View style={{ lineHeight: 1.5 }}>
          <Block>
            You can schedule a Zoom call with your coach at any time. The coaching fee for Zach is currently discounted to $39.99 an hour. You will be billed seperately via PayPal. Click the button below to schedule a time that works for you.
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
                  window.open("https://calendly.com/zach-whelchel/1-hour", "_blank");
                  modalProps.onClose();
                }}
              >
                Schedule a Zoom Call
              </Button>
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
}