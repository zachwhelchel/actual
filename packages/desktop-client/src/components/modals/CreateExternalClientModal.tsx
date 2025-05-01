// @ts-strict-ignore
import { type FormEvent, useState } from 'react';
import { Form } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { closeModal, createAccount } from 'loot-core/client/actions';
import { send } from 'loot-core/platform/client/fetch';
import { useNavigate } from '../../hooks/useNavigate';
import { Button } from '../common/Button2';
import { InitialFocus } from '../common/InitialFocus';
import { InlineField } from '../common/InlineField';
import { Input } from '../common/Input';
import {
  Modal,
  ModalButtons,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
} from '../common/Modal';
import { Select } from '../common/Select';
import { View } from '../common/View';
import type { Client } from "loot-core/types/client";
import { clientFactory } from "loot-core/types/factories/clientFactory";

export function CreateExternalClientModal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coachNotes, setCoachNotes] = useState('');
  const [status, setStatus] = useState('select');

  const createClient = async (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    coachNotes: string,
    status: string,
  ) => {
    try {
      const results = await send('airtable-create-client', {
        firstName,
        lastName,
        email,
        phone,
        coachNotes,
        status,
      });
      if (results.error_code) {
        throw new Error(results.reason);
      }
      const client = results.client;
      const factoriedClient: Client = clientFactory({
        ...client,
        budget: undefined,
      });
      return factoriedClient;
    } catch (error) {
      console.error('Failed to create client:', error);
      return;
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(closeModal());
    const client = await createClient(firstName, lastName, email, phone, coachNotes, status);
    console.log('Created client:', client);
    navigate('/coachdashboard');
  };

  const statusList = [
    ['select', 'Select a Status...'],
    ['lead', 'Lead'],
    ['external_client', 'External Client'],
  ];

  function handleStatusChange(newValue) {
    setStatus(newValue);
  }

  return (
    <Modal name="add-client">
      {({ state: { close } }) => (
        <>
          <ModalHeader
            title={
              <ModalTitle title={t('Create Client')} shrinkOnOverflow />
            }
            rightContent={<ModalCloseButton onPress={close} />}
          />
          <View>
            <Form onSubmit={onSubmit}>
              <InlineField label="firstName" width="100%">
                <InitialFocus>
                  <Input
                    name="firstName"
                    value={firstName}
                    onChange={event => setFirstName(event.target.value)}
                    onBlur={event => {
                      const name = event.target.value.trim();
                      setFirstName(name);
                    }}
                    style={{ flex: 1 }}
                  />
                </InitialFocus>
              </InlineField>
              <InlineField label="lastName" width="100%">
                <InitialFocus>
                  <Input
                    name="lastName"
                    value={lastName}
                    onChange={event => setLastName(event.target.value)}
                    onBlur={event => {
                      const name = event.target.value.trim();
                      setLastName(name);
                    }}
                    style={{ flex: 1 }}
                  />
                </InitialFocus>
              </InlineField>

              <InlineField label="email" width="100%">
                <InitialFocus>
                  <Input
                    name="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    onBlur={event => {
                      const trimmedEmail = event.target.value.trim();
                      setEmail(trimmedEmail);
                    }}
                    style={{ flex: 1 }}
                  />
                </InitialFocus>
              </InlineField>

              <InlineField label="phone" width="100%">
                <InitialFocus>
                  <Input
                    name="phone"
                    value={phone}
                    onChange={event => setPhone(event.target.value)}
                    onBlur={event => {
                      const trimmedPhone = event.target.value.trim();
                      setPhone(trimmedPhone);
                    }}
                    style={{ flex: 1 }}
                  />
                </InitialFocus>
              </InlineField>

              <InlineField label="coachNotes" width="100%">
                <InitialFocus>
                  <Input
                    name="coachNotes"
                    value={coachNotes}
                    onChange={event => setCoachNotes(event.target.value)}
                    onBlur={event => {
                      const trimmedCoachNotes = event.target.value.trim();
                      setCoachNotes(trimmedCoachNotes);
                    }}
                    style={{ flex: 1 }}
                  />
                </InitialFocus>
              </InlineField>

              <InlineField label="Type" width="100%">
                <Select
                  options={statusList}
                  value={status}
                  onChange={newValue => handleStatusChange(newValue)}
                />
              </InlineField>

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
