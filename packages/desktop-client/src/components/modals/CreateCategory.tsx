// @ts-strict-ignore
import React, { useState } from 'react';

import { styles } from '../../style';
import { type CommonModalProps } from '../../types/modals';
import { Block } from '../common/Block';
import { Button } from '../common/Button';
import { FormError } from '../common/FormError';
import { InitialFocus } from '../common/InitialFocus';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { View } from '../common/View';

type CreateCategoryProps = {
  modalProps: Partial<CommonModalProps>;
  onConfirm: (string, string) => void;
  categoryGroups: any;
};

export function CreateCategory({
  modalProps,
  onConfirm,
  categoryGroups,
}: CreateCategoryProps) {
  const [currentGroup, setCurrentGroup] = useState(categoryGroups[0].id);
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  function handleOnChangeCoach(newValue) {
    setCurrentGroup(newValue);
  }

  const options = [];

  for (const [key, value] of Object.entries(categoryGroups)) {
    options.push([value.id, value.name]);
  }

  return (
    <Modal title="Create Category" {...modalProps} style={{ flex: 0 }}>
      {() => (
        <View style={{ lineHeight: 1.5 }}>
          <Block style={{ paddingTop: '0px', paddingBottom: '4px' }}>
            Category Name:
          </Block>

          <View style={{ flexDirection: 'column', flex: 1 }}>
            <InitialFocus>
              <Input style={{ ...styles.mediumText }} onUpdate={setValue} />
            </InitialFocus>
          </View>
          {errorMessage && (
            <FormError style={{ paddingTop: 5 }}>* {errorMessage}</FormError>
          )}

          <Block style={{ paddingTop: '8px', paddingBottom: '4px' }}>
            In Category Group:
          </Block>

          <Select
            options={options}
            value={currentGroup}
            onChange={newValue => handleOnChangeCoach(newValue)}
          />

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
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  const error = value == '';
                  if (error) {
                    setErrorMessage('Category must have a name.');
                    return;
                  }

                  modalProps.onClose();
                  onConfirm(currentGroup, value);
                }}
              >
                Confirm
              </Button>
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
}
