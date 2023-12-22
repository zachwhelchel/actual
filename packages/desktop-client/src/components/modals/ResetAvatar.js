import React, { useState } from 'react';

import { colors } from '../../style';
import Block from '../common/Block';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Text from '../common/Text';
import View from '../common/View';
import Coach, { useCoach } from '../coach/Coach';
import { BigInput } from '../common/Input';

export default function ResetAvatar({
  modalProps,
}) {
  let { resetCoach, setDialogueId } = useCoach();

  let [currentInput, setCurrentInput] = useState("");

  //this has implications for the back track for back buttons that need to be considered.
  function jumpToInput() {
    if (currentInput !== undefined && currentInput !== null) {
      if (currentInput.length > 0) {
        setDialogueId(currentInput);
        console.log("move it to: " + currentInput);
      } else {
        return
      }
    }
  }

  return (
    <Modal title="Reset Avatar" {...modalProps} style={{ flex: 0 }}>
      {() => (
        <View style={{ lineHeight: 1.5 }}>
          <Block>
            Would you like to reset your coach avatar? This will reset them to the beginning of their prompts here on the app. Alternatively you can use the <b>Jump To Id</b> button to jump straight to a specific dialogue.
          </Block>

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <BigInput
              autoFocus={true}
              placeholder=""
              value={currentInput || ''}
              onUpdate={setCurrentInput}
              style={{ flex: 1, marginRight: 10 }}
            />

            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => jumpToInput()}
            >
              Jump To Id
            </Button>
          </View>

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