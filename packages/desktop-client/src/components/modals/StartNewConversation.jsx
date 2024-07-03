import React, { useState } from 'react';

import { colors } from '../../style';
import { Block } from '../common/Block';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Text } from '../common/Text';
import { View } from '../common/View';
import { useCoach } from '../coach/Coach';
import { BigInput } from '../common/Input';
import { REACT_APP_UI_MODE, testableCoachList, REACT_APP_COACH_FIRST_NAME } from '../../coaches/coachVariables';
import { SvgDownloadThickBottom, SvgRemove, SvgAlertTriangle } from '../../icons/v2';
import { send } from 'loot-core/src/platform/client/fetch';
import { Select } from '../common/Select';

export function StartNewConversation({
  modalProps,
}) {
  let { resetCoach, setDialogueId, allConversations, triggerFired, jumpToId } = useCoach();


  let supportedTriggerTypes = [];

  allConversations.forEach((value, key) => {

    const conversation = value;
    conversation.triggerType;

    if (conversation.canBeUserInitiated == true) {
      supportedTriggerTypes.push({title: conversation.title, triggerType: conversation.triggerType});
    }
  });


  return (
    <Modal title="Start a New Conversation" {...modalProps} style={{ flex: 0, height: 'auto', overflowY: 'auto' }}>
      {() => (
        <View style={{ lineHeight: 1.5 }}>


          {supportedTriggerTypes.map((conversation) => (
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
      )}
    </Modal>
  );
}