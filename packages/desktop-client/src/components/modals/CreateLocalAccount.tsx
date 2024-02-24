// @ts-strict-ignore
import React, { useState } from 'react';

import { toRelaxedNumber } from 'loot-core/src/shared/util';

import { type BoundActions } from '../../hooks/useActions';
import { useNavigate } from '../../hooks/useNavigate';
import { theme } from '../../style';
import { type CommonModalProps } from '../../types/modals';
import { Button } from '../common/Button';
import { ExternalLink } from '../common/ExternalLink';
import { FormError } from '../common/FormError';
import { InitialFocus } from '../common/InitialFocus';
import { InlineField } from '../common/InlineField';
import { Input } from '../common/Input';
import { Modal, ModalButtons } from '../common/Modal';
import { Text } from '../common/Text';
import { View } from '../common/View';
import { Checkbox } from '../forms';
import { Select } from '../common/Select';

type CreateLocalAccountProps = {
  modalProps: CommonModalProps;
  actions: BoundActions;
};

export function CreateLocalAccount({
  modalProps,
  actions,
}: CreateLocalAccountProps) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('0');

  const [nameError, setNameError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [balanceError, setBalanceError] = useState(false);

  const validateBalance = balance => !isNaN(parseFloat(balance));

  const [type, setType] = useState('select');
  let typeList = [['select', 'Select a Type...'], 
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
    <Modal title="Create Local Account" {...modalProps}>
      {() => (
        <View>
          <form
            onSubmit={async event => {
              event.preventDefault();

              const nameError = !name;
              setNameError(nameError);

              const typeError = type === 'select';
              setTypeError(typeError);

              const balanceError = !validateBalance(balance);
              setBalanceError(balanceError);

              let offBudget = false;

              if (type === 'mortgage' || type === 'autoLoan' || type === 'studentLoan' || type === 'personalLoan' || type === 'medicalDebt' || type === 'otherDebt' || type === 'otherAsset' || type === 'otherLiability') {
                offBudget = true;
              }

              let lintedBalance = toRelaxedNumber(balance);

              if (type === 'creditCard' || type === 'lineOfCredit' || type === 'mortgage' || type === 'autoLoan' || type === 'studentLoan' || type === 'personalLoan' || type === 'medicalDebt' || type === 'otherDebt' || type === 'otherLiability') {
                lintedBalance = Math.abs(lintedBalance) * -1;
              }

              if (!nameError && !typeError && !balanceError) {
                actions.closeModal();
                const id = await actions.createAccount(
                  name,
                  lintedBalance,
                  offBudget,
                );
                navigate('/accounts/' + id);
              }
            }}
          >
            <InlineField label="Name" width="75%">
              <InitialFocus>
                <Input
                  name="name"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  onBlur={event => {
                    const name = event.target.value.trim();
                    setName(name);
                    if (name && nameError) {
                      setNameError(false);
                    }
                  }}
                  style={{ flex: 1 }}
                />
              </InitialFocus>
            </InlineField>
            {nameError && (
              <FormError style={{ marginLeft: 75 }}>Name is required</FormError>
            )}
            

            <InlineField label="Type" width="75%">
              <Select options={typeList} style={{ width: '100%' }} value={type} onChange={newValue => handleTypeChange(newValue)}/>
            </InlineField>
            {typeError && (
              <FormError style={{ marginLeft: 75 }}>
                Select a type
              </FormError>
            )}


            <InlineField label="Balance" width="75%">
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
                Balance must be a number
              </FormError>
            )}

            <ModalButtons>
              <Button onClick={() => modalProps.onBack()}>Back</Button>
              <Button type="primary" style={{ marginLeft: 10 }}>
                Create
              </Button>
            </ModalButtons>
          </form>
        </View>
      )}
    </Modal>
  );
}
