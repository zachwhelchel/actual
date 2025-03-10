import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../common/Button2';
import { InitialFocus } from '../common/InitialFocus';
import { Modal, ModalCloseButton, ModalHeader } from '../common/Modal';
import { Paragraph } from '../common/Paragraph';
import { View } from '../common/View';

type ConfirmUpdateAccountProps = {
  accountName: string;
  onConfirm: () => void;
};

export function ConfirmUpdateAccountModal({
  accountName,
  onConfirm,
}: ConfirmUpdateAccountProps) {
  const { t } = useTranslation();

  return (
    <Modal
      name="confirm-update-account"
      containerProps={{ style: { width: '30vw' } }}
    >
      {({ state: { close } }) => (
        <>
          <ModalHeader
            title={t('Update Plaid Connection')} // Use translation for title
            rightContent={<ModalCloseButton onPress={close} />}
          />
          <View style={{ lineHeight: 1.5 }}>
            <Paragraph>
              Are you looking to expand your connection to{' '}
              <strong>{accountName}</strong> to include more accounts? Or are
              you experiencing sync issues? Is so continue on to update this
              connection with Plaid.
            </Paragraph>

            <Paragraph>
              If you are wanting to link an account you've already set up with{' '}
              <strong>{accountName}</strong> to an account here in MyBudgetCoach
              go back and select the "Link Connected Accounts" button on the
              previous screen.
            </Paragraph>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              <Button style={{ marginRight: 10 }} onPress={close}>
                {t('Cancel')}
              </Button>
              <InitialFocus>
                <Button
                  variant="primary"
                  onPress={() => {
                    onConfirm();
                    close();
                  }}
                >
                  {t('Continue To Update Plaid Connection')}
                </Button>
              </InitialFocus>
            </View>
          </View>
        </>
      )}
    </Modal>
  );
}
