// @ts-strict-ignore
import { type FormEvent, useState } from 'react';
import { Form } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { closeModal, createAccount } from 'loot-core/client/actions';
import { toRelaxedNumber } from 'loot-core/src/shared/util';

import * as useAccounts from '../../hooks/useAccounts';
import { useNavigate } from '../../hooks/useNavigate';
import { theme } from '../../style';
import { Button } from '../common/Button2';
import { FormError } from '../common/FormError';
import { InitialFocus } from '../common/InitialFocus';
import { InlineField } from '../common/InlineField';
import { Input } from '../common/Input';
import { Link } from '../common/Link';
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
import { Checkbox } from '../forms';
import { validateAccountName } from '../util/accountValidation';

export function CreateLocalAccountModal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accounts = useAccounts.useAccounts();
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('0');
  const [typeError, setTypeError] = useState(false);

  const [nameError, setNameError] = useState(null);
  const [balanceError, setBalanceError] = useState(false);

  const validateBalance = balance => !isNaN(parseFloat(balance));

  const validateAndSetName = (name: string) => {
    const nameError = validateAccountName(name, '', accounts);
    if (nameError) {
      setNameError(nameError);
    } else {
      setName(name);
      setNameError(null);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nameError = validateAccountName(name, '', accounts);

    const balanceError = !validateBalance(balance);
    setBalanceError(balanceError);

    const typeError = type === 'select';
    setTypeError(typeError);

    let offBudget = false;

    if (
      type === 'mortgage' ||
      type === 'autoLoan' ||
      type === 'studentLoan' ||
      type === 'personalLoan' ||
      type === 'medicalDebt' ||
      type === 'otherDebt' ||
      type === 'otherAsset' ||
      type === 'otherLiability'
    ) {
      offBudget = true;
    }

    let lintedBalance = toRelaxedNumber(balance);

    if (
      type === 'creditCard' ||
      type === 'lineOfCredit' ||
      type === 'mortgage' ||
      type === 'autoLoan' ||
      type === 'studentLoan' ||
      type === 'personalLoan' ||
      type === 'medicalDebt' ||
      type === 'otherDebt' ||
      type === 'otherLiability'
    ) {
      lintedBalance = Math.abs(lintedBalance) * -1;
    }

    if (!nameError && !balanceError && !typeError) {
      dispatch(closeModal());
      const id = await dispatch(createAccount(name, lintedBalance, offBudget));
      navigate('/accounts/' + id);
    }
  };

  const [type, setType] = useState('select');
  const typeList = [
    ['select', 'Select a Type...'],
    ['checking', 'For Budget: Checking'],
    ['savings', 'For Budget: Savings'],
    ['cash', 'For Budget: Cash'],
    ['creditCard', 'For Budget: Credit Card'],
    ['lineOfCredit', 'For Budget: Line of Credit'],
    ['mortgage', 'Off Budget: Mortgage'],
    ['autoLoan', 'Off Budget: Auto Loan'],
    ['studentLoan', 'Off Budget: Student Loan'],
    ['personalLoan', 'Off Budget: Personal Loan'],
    ['medicalDebt', 'Off Budget: Medical Debt'],
    ['otherDebt', 'Off Budget: Other Debt'],
    ['otherAsset', 'Off Budget: Other Asset'],
    ['otherLiability', 'Off Budget: Other Liability'],
  ];

  function handleTypeChange(newValue) {
    setType(newValue);
  }

  return (
    <Modal name="add-local-account">
      {({ state: { close } }) => (
        <>
          <ModalHeader
            title={
              <ModalTitle title={t('Create Local Account')} shrinkOnOverflow />
            }
            rightContent={<ModalCloseButton onPress={close} />}
          />
          <View>
            <Form onSubmit={onSubmit}>
              <InlineField label="Name" width="100%">
                <InitialFocus>
                  <Input
                    name="name"
                    value={name}
                    onChange={event => setName(event.target.value)}
                    onBlur={event => {
                      const name = event.target.value.trim();
                      validateAndSetName(name);
                    }}
                    style={{ flex: 1 }}
                  />
                </InitialFocus>
              </InlineField>
              {nameError && (
                <FormError style={{ marginLeft: 75, color: theme.warningText }}>
                  {nameError}
                </FormError>
              )}

              <InlineField label="Type">
                <Select
                  options={typeList}
                  value={type}
                  onChange={newValue => handleTypeChange(newValue)}
                />
              </InlineField>
              {typeError && (
                <FormError style={{ marginLeft: 75, color: theme.warningText }}>
                  Select a type
                </FormError>
              )}

              <InlineField label="Balance" width="100%">
                <Input
                  name="balance"
                  inputMode="decimal"
                  value={balance}
                  onChange={event => setBalance(event.target.value)}
                  onBlur={event => {
                    const balance = event.target.value.trim();
                    setBalance(balance);
                    if (validateBalance(balance) && balanceError) {
                      setBalanceError(false);
                    }
                  }}
                  style={{ flex: 1 }}
                />
              </InlineField>
              {balanceError && (
                <FormError style={{ marginLeft: 75 }}>
                  {t('Balance must be a number')}
                </FormError>
              )}

              <ModalButtons>
                <Button onPress={close}>{t('Back')}</Button>
                <Button
                  type="submit"
                  variant="primary"
                  style={{ marginLeft: 10 }}
                >
                  {t('Create')}
                </Button>
              </ModalButtons>
            </Form>
          </View>
        </>
      )}
    </Modal>
  );
}
