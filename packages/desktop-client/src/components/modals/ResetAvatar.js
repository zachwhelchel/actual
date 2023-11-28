import React, { useState } from 'react';

import { colors } from '../../style';
import Block from '../common/Block';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Text from '../common/Text';
import View from '../common/View';
import Coach, { useCoach } from '../Coach';

export default function ResetAvatar({
  modalProps,
}) {
  let { resetCoach } = useCoach();

  return (
    <Modal title="Reset Avatar" {...modalProps} style={{ flex: 0 }}>
      {() => (
        <View style={{ lineHeight: 1.5 }}>
          <Block>
            Would you like to reset your coach avatar? This will reset them to the beginning of their prompts here on the app.
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
                  resetCoach();
                  location.reload();
                }}
              >
                Reset
              </Button>
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
}