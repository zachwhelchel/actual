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

export function StartNewConversation({ modalProps }) {
  const {
    resetCoach,
    setDialogueId,
    allConversations,
    triggerFired,
    jumpToId,
  } = useCoach();

  const supportedTriggerTypes = [];

  allConversations.forEach((value, key) => {
    const conversation = value;
    conversation.triggerType;

    if (conversation.canBeUserInitiated == true) {
      supportedTriggerTypes.push({
        title: conversation.title,
        triggerType: conversation.triggerType,
      });
    }
  });

  return (
    <Modal name="start-new-conversation">
      {({ state: { close } }) => (
        <>
          <ModalHeader
            title={
              <ModalTitle title="Start a New Conversation" shrinkOnOverflow />
            }
            rightContent={<ModalCloseButton onPress={close} />}
          />

          <View style={{ lineHeight: 1.5 }}>
            {supportedTriggerTypes.map(conversation => (
              <Button
                type="normal"
                onClick={() => {
                  triggerFired(conversation.triggerType);
                  modalProps.onClose?.();
                }}
                style={{ marginTop: '5px' }}
              >
                {conversation.title}
              </Button>
            ))}
          </View>
        </>
      )}
    </Modal>
  );
}
