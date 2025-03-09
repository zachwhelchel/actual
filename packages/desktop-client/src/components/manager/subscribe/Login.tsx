// @ts-strict-ignore
import React, { useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { Auth0Lock } from 'auth0-lock';

import { isElectron } from 'loot-core/shared/environment';
import { loggedIn } from 'loot-core/src/client/actions/user';
import { send } from 'loot-core/src/platform/client/fetch';
import { type OpenIdConfig } from 'loot-core/types/models/openid';

import { useNavigate } from '../../../hooks/useNavigate';
import { AnimatedLoading } from '../../../icons/AnimatedLoading';
import { styles, theme } from '../../../style';
import * as colorPalette from '../../../style/palette';
import { Button, ButtonWithLoading } from '../../common/Button2';
import { BigInput } from '../../common/Input';
import { Label } from '../../common/Label';
import { Link } from '../../common/Link';
import { Select } from '../../common/Select';
import { Text } from '../../common/Text';
import { View } from '../../common/View';
import { useAvailableLoginMethods, useLoginMethod } from '../../ServerContext';

import { useBootstrapped, Title } from './common';
import { OpenIdForm } from './OpenIdForm';

function PasswordLogin({ setError, dispatch }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  async function onSubmitPassword() {
    if (password === '' || loading) {
      return;
    }

    //setError(null);
    setLoading(true);
    const { error } = await send('subscribe-sign-in', {
      password,
      loginMethod: 'password',
    });
    setLoading(false);

    if (error) {
      console.log('hhhhhhh');
      console.log(error);
      setError(error);
    } else {
      dispatch(loggedIn());
    }
  }

  return (
    <View style={{ flexDirection: 'row', marginTop: 5 }}>
      <BigInput
        autoFocus={true}
        placeholder={t('Password')}
        type="password"
        onChangeValue={newValue => setPassword(newValue)}
        style={{ flex: 1, marginRight: 10 }}
        onEnter={onSubmitPassword}
      />
      <ButtonWithLoading
        variant="primary"
        isLoading={loading}
        style={{ fontSize: 15, width: 170 }}
        onPress={onSubmitPassword}
      >
        <Trans>Sign in</Trans>
      </ButtonWithLoading>
    </View>
  );
}

function OpenIdLogin({ setError }) {
  const [warnMasterCreation, setWarnMasterCreation] = useState(false);
  const [reviewOpenIdConfiguration, setReviewOpenIdConfiguration] =
    useState(false);
  const navigate = useNavigate();

  async function onSetOpenId(config: OpenIdConfig) {
    setError(null);
    const { error } = await send('subscribe-bootstrap', { openId: config });

    if (error) {
      setError(error);
    } else {
      navigate('/');
    }
  }

  useEffect(() => {
    send('owner-created').then(created => setWarnMasterCreation(!created));
  }, []);

  async function onSubmitOpenId() {
    const { error, redirect_url } = await send('subscribe-sign-in', {
      return_url: isElectron()
        ? await window.Actual.startOAuthServer()
        : window.location.origin,
      loginMethod: 'openid',
    });

    if (error) {
      setError(error);
    } else {
      if (isElectron()) {
        window.Actual?.openURLInBrowser(redirect_url);
      } else {
        window.location.href = redirect_url;
      }
    }
  }

  return (
    <View>
      {!reviewOpenIdConfiguration && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              minHeight: '100vh', // This ensures the parent takes full viewport height
            }}
          >
            <div
              style={{
                width: '300px',
                padding: '24px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                alignSelf: 'center',
              }}
            >
              {/* Logo */}
              <img
                src="/logo_circle.png"
                alt="Logo"
                style={{
                  width: '64px',
                  height: '64px',
                }}
              />

              {/* Welcome Text */}
              <div style={{ textAlign: 'center' }}>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: 'black',
                  }}
                >
                  MyBudgetCoach
                </h2>
                <p
                  style={{
                    color: '#666',
                    fontSize: '14px',
                  }}
                >
                  Sign in to continue to your account:
                </p>
              </div>

              {/* Button Container */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="primary"
                  style={{
                    padding: 10,
                    fontSize: 14,
                    width: 170,
                    marginTop: 5,
                  }}
                  onPress={onSubmitOpenId}
                >
                  <Trans>Sign In</Trans>
                </Button>
              </div>
            </div>
          </div>
          {warnMasterCreation && (
            <>
              <label style={{ color: theme.warningText, marginTop: 10 }}>
                <Trans>
                  The first user to login with OpenID will be the{' '}
                  <Text style={{ fontWeight: 'bold' }}>server owner</Text>. This
                  can&apos;t be changed using UI.
                </Trans>
              </label>
              <Button
                variant="bare"
                onPress={() => setReviewOpenIdConfiguration(true)}
                style={{ marginTop: 5 }}
              >
                <Trans>Review OpenID configuration</Trans>
              </Button>
            </>
          )}
        </>
      )}
      {reviewOpenIdConfiguration && (
        <OpenIdForm
          loadData={true}
          otherButtons={[
            <Button
              key="cancel"
              variant="bare"
              style={{ marginRight: 10 }}
              onPress={() => setReviewOpenIdConfiguration(false)}
            >
              <Trans>Cancel</Trans>
            </Button>,
          ]}
          onSetOpenId={async config => {
            onSetOpenId(config);
          }}
        />
      )}
    </View>
  );
}

function HeaderLogin({ error }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
      }}
    >
      {error ? (
        <Link
          variant="button"
          type="button"
          style={{ fontSize: 15 }}
          to={'/login/password?error=' + error}
        >
          <Trans>Login with Password</Trans>
        </Link>
      ) : (
        <span>
          <Trans>Checking Header Token Login ...</Trans>{' '}
          <AnimatedLoading style={{ width: 20, height: 20 }} />
        </span>
      )}
    </View>
  );
}

export function Login() {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const defaultLoginMethod = useLoginMethod();
  const [method, setMethod] = useState(defaultLoginMethod);
  const [searchParams, _setSearchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const { checked } = useBootstrapped();
  const loginMethods = useAvailableLoginMethods();

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Create an object to store the parameters
    const urlParamsObject = {
      coach: urlParams.get('coach') || '',
      fprom_tid: urlParams.get('fprom_tid') || '',
      fprom_ref: urlParams.get('fprom_ref') || '',
      utm_campaign: urlParams.get('utm_campaign') || '',
      utm_medium: urlParams.get('utm_medium') || '',
      utm_source: urlParams.get('utm_source') || '',
      utm_term: urlParams.get('utm_term') || '',
      utm_content: urlParams.get('utm_content') || '',
    };

    // Store in localStorage for persistence
    localStorage.setItem('urlParams', JSON.stringify(urlParamsObject));

    console.log('saving some url params');
    console.log(JSON.stringify(urlParamsObject));
  }, []);

  useEffect(() => {
    if (checked && !searchParams.has('error')) {
      (async () => {
        if (method === 'header') {
          setError(null);
          const { error } = await send('subscribe-sign-in', {
            password: '',
            loginMethod: method,
          });

          if (error) {
            setError(error);
          } else {
            dispatch(loggedIn());
          }
        }
      })();
    }
  }, [loginMethods, checked, searchParams, method, dispatch]);

  function getErrorMessage(error) {
    switch (error) {
      case 'invalid-header':
        return t('Auto login failed - No header sent');
      case 'proxy-not-trusted':
        return t('Auto login failed - Proxy not trusted');
      case 'invalid-password':
        return t('Invalid password');
      case 'network-failure':
        return t('Unable to contact the server');
      case 'internal-error':
        return t('Internal error');
      default:
        return t(`An unknown error occurred: {{error}}`, { error });
    }
  }

  if (!checked) {
    return null;
  }

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        color: theme.pageText,
        marginTop: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colorPalette.navy100,
        }}
      >
        <svg
          viewBox="0 0 642 535"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            borderRadius: 5,
          }}
        >
          <path fill="url(#paint0_linear)" d="M0 0h642v535H0z" />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="162"
              y1="23.261"
              x2="468.904"
              y2="520.44"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8719e0" />
              <stop offset="1" stopColor="#0c3966" stopOpacity="1.0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {error && (
        <Text
          style={{
            marginTop: 20,
            color: theme.errorText,
            borderRadius: 4,
            fontSize: 15,
          }}
        >
          {getErrorMessage(error)}
        </Text>
      )}

      <OpenIdLogin setError={setError} />
      <PasswordLogin dispatch={dispatch} />
    </View>
  );
}
