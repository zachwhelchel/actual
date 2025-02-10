import React, { useState } from 'react';

import { colors } from '../../style';
import { Block } from '../common/Block';
import { Button } from '../common/Button';
import { Text } from '../common/Text';
import { View } from '../common/View';
import { useCoach } from '../coach/Coach';
import { BigInput } from '../common/Input';
import { REACT_APP_UI_MODE, testableCoachList, REACT_APP_COACH_FIRST_NAME } from '../../coaches/coachVariables';
import { SvgDownloadThickBottom, SvgRemove, SvgAlertTriangle } from '../../icons/v2';
import { send } from 'loot-core/src/platform/client/fetch';
import { Select } from '../common/Select';
import {
  Modal,
  ModalButtons,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
} from '../common/Modal';

export function UploadAvatarModal() {

    console.log("again?")
  console.log(useCoach())

  let { resetCoach, setDialogueId, allConversations, triggerFired, jumpToId } = useCoach();

  console.log("again?")
  let [currentInput, setCurrentInput] = useState("");

  let onImport = async () => {
    const res2 = await window.Actual.openFileDialog({
      filters: [
        {
          name: 'Financial Files',
          extensions: ['xml'],
        },
      ],
    });

    let filepath = res2[0];
    console.log("stuffgo on xml?");
    console.log(filepath);

    let stuff = await send('uploaded-avatar-parse-file', {
      filepath,
    });

    console.log("stuffgo on xml?");
    console.log(stuff);

    localStorage.removeItem("test_published_avatar");
    localStorage.setItem("uploaded_draw_io_file", stuff);
    resetCoach();
    location.reload();
  };

  const [coach, setCoach] = useState('select');

  function jumpToInput() {
    if (currentInput !== undefined && currentInput !== null) {
      if (currentInput.length > 0) {
        jumpToId(currentInput);
      } else {
        return
      }
    }
  }


  function handleOnChangeCoach(newValue) {
    localStorage.removeItem("uploaded_draw_io_file");
    localStorage.setItem("test_published_avatar", newValue);
    resetCoach();
    location.reload();
  }

  function onReset() {
    localStorage.removeItem("uploaded_draw_io_file");
    localStorage.removeItem("test_published_avatar");
    resetCoach();
    location.reload();
  }

  let usingAlready = false;

  let file = localStorage.getItem("uploaded_draw_io_file");
  let testPublishedAvatar = localStorage.getItem("test_published_avatar");
  if (file != null || testPublishedAvatar != null) {
    usingAlready = true;
  }


  let supportedTriggerTypes = [];




  allConversations.forEach((value, key) => {

    const conversation = value;
    conversation.triggerType;

    supportedTriggerTypes.push(conversation.triggerType);
  });


  return (
    <Modal name="upload-avatar">
      {({ state: { close } }) => (
        <>
          <ModalHeader
            title={
              <ModalTitle title={'Schedule Video Call'} shrinkOnOverflow />
            }
            rightContent={<ModalCloseButton onPress={close} />}
          />
        <View style={{ lineHeight: 1.5 }}>
          {usingAlready == true && (
            <Block>
              <h3 style={{ marginBottom: '-5px'}}>Remove Test Avatar</h3>
              <p>
              You are currently testing <b>{REACT_APP_COACH_FIRST_NAME}</b>. Ready to go back to your default experience?
              </p>
            </Block>
          )}
          {usingAlready == true && (
            <Block>
              <Button type="primary" onClick={onReset} style={{ marginTop: '0px', marginBottom: '20px' }}>
                <>
                  <SvgRemove
                    width={11}
                    height={11}
                    style={{ marginRight: 4 }}
                  />{' '}
                  Remove Test Avatar
                </>
              </Button>
            </Block>
          )}

          {REACT_APP_COACH_FIRST_NAME != null &&

          <Block>
            <h3 style={{ marginBottom: '-5px'}}>Reset Coach</h3>
            <p>
            Would you like to reset your coach's avatar? This will reset them to the beginning of their conversations.
            </p>
            <Button
              type="primary"
              style={{ marginBottom: '20px' }}
              onClick={() => {
                resetCoach();
                location.reload();
              }}
            >
              <>
                <SvgAlertTriangle
                  width={13}
                  height={13}
                  style={{ marginRight: 4 }}
                />{' '}
                Reset Coach
              </>
            </Button>

          </Block>
        }

          {REACT_APP_COACH_FIRST_NAME != null &&

            <Block>
              <h3 style={{ marginBottom: '-5px'}}>Switch Coaches</h3>
              <p>
              Interested in switching to another coach? Reach out and we can help you transition.
              </p>
              <Button
                type="primary"
                style={{ marginBottom: '20px' }}
                onClick={() => {
                  window.location.href = "mailto:admin@mybudgetcoach.com";
                  //modalProps.onClose();
                }}
              >
                <>
                  <SvgAlertTriangle
                    width={13}
                    height={13}
                    style={{ marginRight: 4 }}
                  />{' '}
                  Request to Switch Coach
                </>
              </Button>
            </Block>
          }


          {REACT_APP_UI_MODE === 'coach' && REACT_APP_COACH_FIRST_NAME != null &&
            <>
              <Block>
                <h3 style={{ marginBottom: '-5px'}}>Jump To Id</h3>
                <p>
                  Want to jump straight to a specific part of a conversation? This is helpful for longer testing sessions.
                </p>
              <View
                style={{
                  marginTop: -10,
                }}
              >
                <BigInput
                  autoFocus={true}
                  placeholder=""
                  value={currentInput || ''}
                  onChangeValue={setCurrentInput}
                />
              </View>
              </Block>
              <Block>

                <Button
                  type="primary"
                  onClick={() => jumpToInput()}
                  style={{ marginTop: '15px', marginBottom: '20px' }}
                >
                  Jump To Id
                </Button>
              </Block>

            </>
          }


          {REACT_APP_UI_MODE === 'coach' &&

            <Block style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '-5px'}}>Test a Published Coach's Avatar</h3>
              <p>
              Want to test out another coach&apos;s avatar to get inspired? Select a coach below:
              </p>
              <Select options={testableCoachList} value={coach} onChange={newValue => handleOnChangeCoach(newValue)}/>
            </Block>
          }

          {REACT_APP_UI_MODE === 'coach' &&
            <>
            <Block>
              <h3>Upload a Draw.io File</h3>
              <p>
              Want to test out your latest draw.io updates before publishing them? Upload your file following these instructions:
              </p>
              <ol>
              <li>Go to draw.io and open your file</li>
              <li>File {'–>'} Export as {'–>'} XML</li>
              <li>Check 'All Pages' only and click Export</li>
              <li>Save the file to your computer</li>
              <li>Use the Import button below to upload the saved file</li>
              </ol>
            </Block>
            <Block>
              <Button type="primary" onClick={onImport} style={{ marginTop: '0px', marginBottom: '20px' }}>
                <>
                  <SvgDownloadThickBottom
                    width={13}
                    height={13}
                    style={{ marginRight: 4 }}
                  />{' '}
                  Import
                </>
              </Button>
            </Block>
            </>
          }

          {REACT_APP_UI_MODE === 'coach' && REACT_APP_COACH_FIRST_NAME != null &&
            <>

              <Block>
                <h3 style={{ marginBottom: '-5px'}}>Simulate a Conversation Starter</h3>
                <p>
                Want to test a conversation starter without having to wait for the right conditions to arise? Select one supported by this avatar below:
                </p>
              </Block>

              {supportedTriggerTypes.includes('paycheck_received') && (
                <Button type="normal" onClick={() => {triggerFired('paycheck_received')}} style={{ marginTop: '0px' }}>
                  Paycheck Received
                </Button>
              )}
              {supportedTriggerTypes.includes('paycheck_received') == false && (
                <Button type="normal" style={{ marginTop: '0px' }}>
                  <strike>Paycheck Received</strike>
                </Button>
              )}

              {supportedTriggerTypes.includes('not_seen_for_1_week') && (
                <Button type="normal" onClick={() => triggerFired('not_seen_for_1_week')} style={{ marginTop: '5px' }}>
                  Hasn't Logged In For 1 Week
                </Button>
              )}
              {supportedTriggerTypes.includes('not_seen_for_1_week') == false && (
                <Button type="normal" style={{ marginTop: '5px' }}>
                  <strike>Hasn't Logged In For 1 Week</strike>
                </Button>
              )}

              {supportedTriggerTypes.includes('not_seen_for_2_weeks') && (
                <Button type="normal" onClick={() => triggerFired('not_seen_for_2_weeks')} style={{ marginTop: '5px' }}>
                  Hasn't Logged In For 2 Weeks
                </Button>
              )}
              {supportedTriggerTypes.includes('not_seen_for_2_weeks') == false && (
                <Button type="normal" style={{ marginTop: '5px' }}>
                  <strike>Hasn't Logged In For 2 Weeks</strike>
                </Button>
              )}

              {supportedTriggerTypes.includes('middle_of_month') && (
                <Button type="normal" onClick={() => triggerFired('middle_of_month')} style={{ marginTop: '5px' }}>
                  Middle of Month
                </Button>
              )}
              {supportedTriggerTypes.includes('middle_of_month') == false && (
                <Button type="normal" style={{ marginTop: '5px' }}>
                  <strike>Middle of Month</strike>
                </Button>
              )}

              {supportedTriggerTypes.includes('end_of_month') && (
                <Button type="normal" onClick={() => triggerFired('end_of_month')} style={{ marginTop: '5px' }}>
                  End of Month
                </Button>
              )}
              {supportedTriggerTypes.includes('end_of_month') == false && (
                <Button type="normal" style={{ marginTop: '5px' }}>
                  <strike>End of Month</strike>
                </Button>
              )}

              {supportedTriggerTypes.includes('one_week_since_sign_up') && (
                <Button type="normal" onClick={() => triggerFired('one_week_since_sign_up')} style={{ marginTop: '5px' }}>
                  1 Week Since Sign Up
                </Button>
              )}
              {supportedTriggerTypes.includes('one_week_since_sign_up') == false && (
                <Button type="normal" style={{ marginTop: '5px' }}>
                  <strike>1 Week Since Sign Up</strike>
                </Button>
              )}

              {supportedTriggerTypes.includes('one_month_since_sign_up') && (
                <Button type="normal" onClick={() => triggerFired('one_month_since_sign_up')} style={{ marginTop: '5px' }}>
                  1 Month Since Sign Up
                </Button>
              )}
              {supportedTriggerTypes.includes('one_month_since_sign_up') == false && (
                <Button type="normal" style={{ marginTop: '5px' }}>
                  <strike>1 Month Since Sign Up</strike>
                </Button>
              )}

              {supportedTriggerTypes.includes('no_reconciliation_for_one_week') && (
                <Button type="normal" onClick={() => triggerFired('no_reconciliation_for_one_week')} style={{ marginTop: '5px' }}>
                  Haven't Reconciled in 1 Week
                </Button>
              )}
              {supportedTriggerTypes.includes('no_reconciliation_for_one_week') == false && (
                <Button type="normal" style={{ marginTop: '5px' }}>
                  <strike>Haven't Reconciled in 1 Week</strike>
                </Button>
              )}

              {supportedTriggerTypes.includes('no_reconciliation_for_one_month') && (
                <Button type="normal" onClick={() => triggerFired('no_reconciliation_for_one_month')} style={{ marginTop: '5px' }}>
                  Haven't Reconciled in 1 Month
                </Button>
              )}
              {supportedTriggerTypes.includes('no_reconciliation_for_one_month') == false && (
                <Button type="normal" style={{ marginTop: '5px' }}>
                  <strike>Haven't Reconciled in 1 Month</strike>
                </Button>
              )}

              {supportedTriggerTypes.includes('positive_credit_card_balance') && (
                <Button type="normal" onClick={() => triggerFired('positive_credit_card_balance')} style={{ marginTop: '5px' }}>
                  Credit Card Balance is Positive
                </Button>
              )}
              {supportedTriggerTypes.includes('positive_credit_card_balance') == false && (
                <Button type="normal" style={{ marginTop: '5px' }}>
                  <strike>Credit Card Balance is Positive</strike>
                </Button>
              )}

              {supportedTriggerTypes.includes('more_than_ten_uncategorized_transactions') && (
                <Button type="normal" onClick={() => triggerFired('more_than_ten_uncategorized_transactions')} style={{ marginTop: '5px' }}>
                  More Than 10 Uncategorized Transactions
                </Button>
              )}
              {supportedTriggerTypes.includes('more_than_ten_uncategorized_transactions') == false && (
                <Button type="normal" style={{ marginTop: '5px' }}>
                  <strike>More Than 10 Uncategorized Transactions</strike>
                </Button>
              )}

              <div style={{ paddingTop: '15px' }}></div>
            </>
          }

        </View>
        </>
      )}
    </Modal>
  );
}