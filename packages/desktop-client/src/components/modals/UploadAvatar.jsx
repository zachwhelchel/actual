import React, { useState } from 'react';

import { colors } from '../../style';
import { Block } from '../common/Block';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Text } from '../common/Text';
import { View } from '../common/View';
import { useCoach } from '../coach/Coach';
import { BigInput } from '../common/Input';
import { REACT_APP_UI_MODE, testableCoachList } from '../../coaches/coachVariables';
import { SvgDownloadThickBottom, SvgRemove } from '../../icons/v2';
import { send } from 'loot-core/src/platform/client/fetch';
import { Select } from '../common/Select';

export function UploadAvatar({
  modalProps,
}) {
  let { resetCoach, setDialogueId } = useCoach();

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



  return (
    <Modal title="Manage Avatar" {...modalProps} style={{ flex: 0 }}>
      {() => (
        <View style={{ lineHeight: 1.5 }}>
          {usingAlready == true && (
            <Block>
              <p>
              `You are currently testing another Avatar. Ready to go back to your default experience?`
              </p>
            </Block>
          )}
          {usingAlready == true && (
            <Button type="primary" onClick={onReset} style={{ marginTop: '0px' }}>
              <>
                <SvgRemove
                  width={13}
                  height={13}
                  style={{ marginRight: 4 }}
                />{' '}
                Remove Test Avatar
              </>
            </Button>
          )}
          <Block>
            <p>
            Want to test out another coach&apos;s Avatar to get inspired? Select a coach below:
            </p>
            <Select options={testableCoachList} value={coach} onChange={newValue => handleOnChangeCoach(newValue)}/>
          </Block>

          <Block>
            <p>
            Want to test out your latest draw.io updates before publishing them? Upload your file following these instructions:
            </p>
            <ol>
            <li>Go to draw.io and open your file</li>
            <li>File {'–>'} Export as {'–>'} XML</li>
            <li>Uncheck all boxes and click Export</li>
            <li>Save the file to your computer</li>
            <li>Use the Import button below to upload the saved file</li>
            </ol>
          </Block>
          <Button type="primary" onClick={onImport} style={{ marginTop: '0px' }}>
            <>
              <SvgDownloadThickBottom
                width={13}
                height={13}
                style={{ marginRight: 4 }}
              />{' '}
              Import
            </>
          </Button>

        </View>
      )}
    </Modal>
  );
}