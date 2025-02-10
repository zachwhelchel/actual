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
import * as colorPalette from '../../../style/palette';

function PasswordLogin({ setError, dispatch }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  async function onSubmitPassword() {
    if (password === '' || loading) {
      return;
    }

    setError(null);
    setLoading(true);
    const { error } = await send('subscribe-sign-in', {
      password,
      loginMethod: 'password',
    });
    setLoading(false);

    if (error) {
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


function EmbeddedOpenIdLogin({ setError }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const lock = new Auth0Lock(
      'id',
      'domain',
      {
        container: 'auth0-login-container',
        allowSignUp: true,
        initialScreen: 'login', // or 'signUp'
         languageDictionary: {
           title: 'MyBudgetCoach', 
           signUpTitle: 'Create Account',
           signUpLabel: 'Sign Up',
           loginLabel: 'Sign In'
         },
         // Full style customization
         theme: {
           labeledSubmitButton: true,
           logo: '/public/logo_circle.png',
           primaryColor: '#112a43',
          headerColor: '#ffffff',     // Change header background
          container: {
            headerBackground: 'none'  // Style override
          }
         },
          auth: {
           redirect: false,
           responseType: 'token',
           redirectUrl: 'http://localhost:3001/openid/callback'
         },

      }
    );

    lock.on('authenticated', async (authResult) => {


      const { error, redirect_url } = await send('subscribe-sign-in', {
        return_url: window.location.origin,
        loginMethod: 'openid',
        code: authResult.code
      });

      if (error) {
        setError(error);
      } else {
        window.location.href = redirect_url;
      }
    });

    lock.show();

    return () => lock.destroy();
  }, []);

  return (
    <div>
      <div id="auth0-login-container" style={{ width: '100%', height: 600 }} />
      {isLoading && <div>Logging in...</div>}
    </div>
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
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
          </View>
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
    <View style={{ color: theme.pageText, marginTop: -43 }}>

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

      <EmbeddedOpenIdLogin setError={setError} />
    </View>
  );
}
