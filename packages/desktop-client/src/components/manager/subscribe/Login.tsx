// @ts-strict-ignore
import React, { useState, useMemo, useEffect } from 'react';
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
import { v4 as uuidv4 } from 'uuid';

import { useBootstrapped, Title } from './common';
import { OpenIdForm } from './OpenIdForm';
import ReactPixel from 'react-facebook-pixel';

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
    // if (window.ReactNativeWebView) {
    //   window.ReactNativeWebView.postMessage(
    //     JSON.stringify({
    //       type: 'login_flow'
    //     }),
    //   );
    // }

    send('owner-created').then(created => setWarnMasterCreation(!created));
  }, []);

  // Updated onSubmitOpenId function that takes a signUp boolean parameter
  async function onSubmitOpenId(signUp = false) {
    const { error, redirect_url } = await send('subscribe-sign-in', {
      return_url: isElectron()
        ? await window.Actual.startOAuthServer()
        : window.location.origin,
      loginMethod: 'openid',
    });

    if (error) {
      setError(error);
    } else {
      let finalRedirectUrl = redirect_url;

      // If this is a sign-up action, modify the URL for Auth0
      if (signUp) {
        // Check if it's an Auth0 URL (contains auth0.com)
        finalRedirectUrl = finalRedirectUrl.replace(
          'prompt=login',
          'prompt=login&screen_hint=signup',
        );
      }

      if (isElectron()) {
        window.Actual?.openURLInBrowser(finalRedirectUrl);
      } else {
        window.location.href = finalRedirectUrl;
      }
    }
  }

  const primaryButtonStyle = {
    padding: 10,
    fontSize: 14,
    width: 170,
    marginTop: 5,
  };

  // Styles for the secondary (small) button
  const secondaryButtonStyle = {
    padding: 6,
    fontSize: 12,
    marginTop: 8,
    backgroundColor: 'transparent',
    color: '#4285F4', // Assuming a blue color for the text link
    border: 'none',
    cursor: 'pointer',
  };

  // Container styles
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const [likelyHereForSignUp, setLikelyHereForSignUp] = useState(true);

  useEffect(() => {
    // Get the current URL
    const url = new URL(window.location.href);
    // Check if 'coach' parameter exists
    const hasCoachParam = url.searchParams.has('coach');
    // Set state based on coach parameter presence
    setLikelyHereForSignUp(hasCoachParam);
  }, []);

  // if (window.ReactNativeWebView) {
  //   return (
  //     <View
  //       style={{
  //         width: '100%',
  //         height: '100%',
  //         backgroundColor: colorPalette.navy100,
  //         marginTop: 0,
  //       }}
  //     >
  //     </View>
  //   );
  // }

  const urlParams = new URLSearchParams(window.location.search);
  const sevenDay = urlParams.get('landing') === 'seven_day';

  const offer = urlParams.get('offer');
  const purchasedAlready = urlParams.get('plan_purchased') != null;

  if (true) {
    return (
      <View>
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              minHeight: '100vh',
            }}
          >
            <div
              style={{
                width: '380px', // Slightly wider for more content
                padding: '32px 24px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
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

              {/* Welcome Text with Social Proof */}
              <div style={{ textAlign: 'center' }}>
                <h2
                  style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: 'black',
                  }}
                >
                  MyBudgetCoach
                </h2>
              </div>

              {/* Social Proof Stats */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  backgroundColor: '#f8f9fa',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}
              >
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#22c55e',
                    }}
                  >
                    $500+
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Monthly Savings
                  </div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#3b82f6',
                    }}
                  >
                    4.9★
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Average Rating
                  </div>
                </div>

                {!purchasedAlready && (
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#8b5cf6',
                      }}
                    >
                      {offer === '35'
                        ? '35'
                        : offer === '35_no_card'
                          ? '35'
                          : offer === '7'
                            ? '7'
                            : '7'}{' '}
                      Day
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Free Trial
                    </div>
                  </div>
                )}
              </div>

              {/* Testimonial Quote */}
              <div
                style={{
                  backgroundColor: '#fef3c7',
                  padding: '12px',
                  borderRadius: '6px',
                  borderLeft: '3px solid #f59e0b',
                  marginBottom: '8px',
                  width: '100%',
                }}
              >
                <p
                  style={{
                    fontSize: '13px',
                    fontStyle: 'italic',
                    color: '#92400e',
                    margin: 0,
                    textAlign: 'center',
                  }}
                >
                  "I finally feel like I am in control of my financial future."
                </p>
                <p
                  style={{
                    fontSize: '11px',
                    color: '#92400e',
                    margin: '4px 0 0 0',
                    textAlign: 'center',
                    fontWeight: '500',
                  }}
                >
                  - Brendan G.
                </p>
              </div>

              {/* CTA Buttons */}
              <div style={containerStyle}>
                <>
                  <Button
                    variant="primary"
                    style={{
                      ...primaryButtonStyle,
                      fontSize: '16px',
                      fontWeight: '600',
                    }}
                    onPress={() => onSubmitOpenId(true)}
                  >
                    <Trans>Sign Up</Trans>
                  </Button>
                  <button
                    style={{
                      ...secondaryButtonStyle,
                      fontSize: '14px',
                    }}
                    onClick={() => onSubmitOpenId(false)}
                  >
                    <Trans>Already have an account? Log in</Trans>
                  </button>
                </>
              </div>

              {/* Final reassurance */}
              <p
                style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  textAlign: 'center',
                  margin: '8px 0 0 0',
                }}
              >
                No charge until end of trial • Cancel anytime
              </p>
            </div>
          </div>
        </>
      </View>
    );
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
                  Continue to your account:
                </p>
              </div>

              <div style={containerStyle}>
                {likelyHereForSignUp ? (
                  // Sign Up is the primary action
                  <>
                    <Button
                      variant="primary"
                      style={primaryButtonStyle}
                      onPress={() => onSubmitOpenId(true)}
                    >
                      <Trans>Sign Up</Trans>
                    </Button>
                    <button
                      style={secondaryButtonStyle}
                      onClick={() => onSubmitOpenId(false)}
                    >
                      <Trans>Already have an account? Log in</Trans>
                    </button>
                  </>
                ) : (
                  // Log In is the primary action
                  <>
                    <Button
                      variant="primary"
                      style={primaryButtonStyle}
                      onPress={() => onSubmitOpenId(false)}
                    >
                      <Trans>Log In</Trans>
                    </Button>
                    <button
                      style={secondaryButtonStyle}
                      onClick={() => onSubmitOpenId(true)}
                    >
                      <Trans>New here? Sign up</Trans>
                    </button>
                  </>
                )}
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

  const [isPremiumLanding, setIsPremiumLanding] = useState(false);
  const [isPremiumLanding50, setIsPremiumLanding50] = useState(false);

  const [isSevenDay, setIsSevenDay] = useState(false);

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    const isLanding = urlParams.get('landing') === 'premium_offer';
    setIsPremiumLanding(isLanding);

    const isLanding50 = urlParams.get('landing') === 'premium_offer_50';
    setIsPremiumLanding50(isLanding50);

    const sevenDay = urlParams.get('landing') === 'seven_day';
    localStorage.setItem('seven_day', sevenDay);

    const offer = urlParams.get('offer');
    localStorage.setItem('offer', offer);

    // Create an object to store the parameters
    const urlParamsObject = {
      coach: urlParams.get('coach') || '',
      coach_selection_source: urlParams.get('coach_selection_source') || '',
      fprom_tid: urlParams.get('fprom_tid') || '',
      fprom_ref: urlParams.get('fprom_ref') || '',
      utm_campaign: urlParams.get('utm_campaign') || '',
      utm_medium: urlParams.get('utm_medium') || '',
      utm_source: urlParams.get('utm_source') || '',
      utm_term: urlParams.get('utm_term') || '',
      utm_content: urlParams.get('utm_content') || '',
      plan_purchased: urlParams.get('plan_purchased') || '',
      anonymous_purchaser: urlParams.get('anonymous_purchaser') || '',
      hide_premium: urlParams.get('hide_premium') || '',
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

  // Show premium landing if parameter is present
  if (isPremiumLanding) {
    return <PremiumLanding setError={setError} />;
  }

  if (isPremiumLanding50) {
    return <PremiumLanding50 setError={setError} />;
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
            borderRadius: 0,
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
      {/*      <PasswordLogin dispatch={dispatch} />
       */}{' '}
    </View>
  );
}

function PremiumLanding({ setError }) {
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    // Navigate to payment form or signup
    // You can adjust this URL to match your payment form route
    //navigate('/payment?plan=premium');

    const url = String(window.location.href);

    // const customerInfo = await Purchases.getCustomerInfo();
    // const userId = customerInfo.originalAppUserId; // This is the anonymous user ID
    // console.log('RevenueCat User ID:', userId);

    let userId = 'anon_' + uuidv4();

    // Build success URL with plan_purchased parameter
    let successUrl = new URL(url);
    successUrl.searchParams.set('plan_purchased', 'premium');
    successUrl.searchParams.set('anonymous_purchaser', userId);
    successUrl.searchParams.delete('landing');

    // Build cancel URL (current URL without changes)
    let cancelUrl = url;

    successUrl = successUrl.toString();

    //FIX THISSSSSSS
    cancelUrl = cancelUrl.toString();

    let premium = true;

    //the return url is just that they purchased premium... and that they have an anonid to set.

    //that way I could pass that in from the web too, right?

    //so on login it sets the anon id, then sets the real id on login actual. and it also sets premium is purchased so we put that into the flow.

    let discount = null;

    const storedParams = localStorage.getItem('urlParams');
    const params = storedParams ? JSON.parse(storedParams) : null;
    let fp_tid = params?.fprom_tid;

    const results = await send('airtable-create-checkout-session', {
      url,
      userId,
      successUrl,
      cancelUrl,
      premium,
      discount,
      fp_tid,
    });

    console.log('airtable-create-checkout-session');
    console.log(results);

    if (!window.location.hostname.includes('localhost')) {
      ReactPixel.init('476212184832855');
      ReactPixel.track('InitiateCheckout', {
        value: 64.99,
        currency: 'USD',
        content_ids: ['premium_subscription'],
        content_type: 'product',
        content_name: 'Premium Monthly Subscription',
      });
    }

    // Add small delay before redirect
    setTimeout(() => {
      window.location.href = results;
    }, 200); // 100ms is usually enough
  };

  const handleSignIn = async () => {
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
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        margin: 0,
        padding: 0,
      }}
    >
      {/* Add CSS for glow animation */}
      <style>
        {`
          @keyframes glow {
            0% { 
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
            }
            100% { 
              box-shadow: 0 0 30px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3);
            }
          }
        `}
      </style>
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #8719e0 0%, #0c3966 100%)',
          zIndex: 0,
        }}
      />

      {/* Scrollable Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          margin: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px 16px 40px 16px',
            color: 'white',
            boxSizing: 'border-box',
          }}
        >
          {/* Facebook Traffic Banner */}
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.9)',
              padding: '12px 16px',
              textAlign: 'center',
              marginBottom: '20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            🎯 Saw us on Facebook? Welcome! Here's your exclusive offer below ⬇️
          </div>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img
              src="/logo_circle.png"
              alt="MyBudgetCoach Logo"
              style={{
                width: '64px',
                height: '64px',
                marginBottom: '16px',
              }}
            />
            <h1
              style={{
                fontSize: window.innerWidth < 768 ? '32px' : '52px',
                fontWeight: 'bold',
                marginBottom: '12px',
                lineHeight: '1.2',
              }}
            >
              Eliminate Financial Stress in 30 Days
            </h1>
            <p
              style={{
                fontSize: window.innerWidth < 768 ? '18px' : '24px',
                opacity: 0.9,
                marginBottom: '24px',
                lineHeight: '1.4',
                maxWidth: '600px',
                margin: '0 auto 24px auto',
                fontWeight: '500',
              }}
            >
              Stop worrying about money. Get personalized coaching + powerful
              apps to finally feel secure about your finances.
            </p>
          </div>

          {/* Top CTA */}
          <div
            style={{
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '24px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              marginBottom: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: window.innerWidth < 768 ? '32px' : '42px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              $64.99
              <span
                style={{
                  fontSize: window.innerWidth < 768 ? '16px' : '20px',
                  opacity: 0.8,
                }}
              >
                /month
              </span>
            </div>
            <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '16px' }}>
              Everything you need to master your money
            </p>

            {/* Star Rating */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    style={{
                      color:
                        star <= 4
                          ? '#fbbf24'
                          : star === 6
                            ? '#d1d5db'
                            : '#fbbf24',
                      fontSize: '18px',
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span
                style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}
              >
                5/5 (23 reviews)
              </span>
            </div>

            <Button
              variant="primary"
              onPress={handleGetStarted}
              style={{
                fontSize: window.innerWidth < 768 ? '20px' : '18px',
                padding: window.innerWidth < 768 ? '20px 32px' : '16px 32px',
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                minWidth: '280px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                alignSelf: 'center',
              }}
            >
              <Trans>🚀 Yes, I Want to Stop Money Stress</Trans>
            </Button>
          </div>

          {/* Coach Matching Section */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '3px solid #3b82f6',
              borderRadius: '16px',
              padding: '32px 24px',
              marginBottom: '32px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Animated glow effect */}
            <div
              style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                background:
                  'linear-gradient(45deg, #3b82f6, #2563eb, #3b82f6, #2563eb)',
                borderRadius: '16px',
                zIndex: -1,
                animation: 'glow 2s ease-in-out infinite alternate',
              }}
            />

            <div
              style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}
            >
              🎯
            </div>

            <h3
              style={{
                fontSize: window.innerWidth < 768 ? '24px' : '28px',
                fontWeight: 'bold',
                marginBottom: '16px',
                color: 'white',
              }}
            >
              We'll Match You With Your Perfect Coach
            </h3>

            <p
              style={{
                fontSize: window.innerWidth < 768 ? '16px' : '18px',
                lineHeight: '1.5',
                marginBottom: '20px',
                opacity: 0.95,
              }}
            >
              No waiting around! Based on your goals and personality, we'll pair
              you with a certified financial coach who specializes in your exact
              situation.
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                padding: '16px 24px',
                borderRadius: '8px',
                marginTop: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <span style={{ fontSize: '24px' }}>⚡</span>
              <span
                style={{
                  fontSize: window.innerWidth < 768 ? '16px' : '18px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                Your first 60-minute session booked today for this week!
              </span>
            </div>
          </div>

          {/* Value Proposition */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '24px',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                💆‍♀️ Personal Peace of Mind
              </h3>
              <ul
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  opacity: 0.9,
                  paddingLeft: '16px',
                }}
              >
                <li>Sleep better knowing your finances are handled</li>
                <li>60-minute sessions that fit your busy schedule</li>
                <li>Coaches who specialize in helping beginners</li>
                <li>Personalized approach - not generic advice</li>
              </ul>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '24px',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                📱 Effortless Money Management
              </h3>
              <ul
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  opacity: 0.9,
                  paddingLeft: '16px',
                }}
              >
                <li>Simple apps that actually work</li>
                <li>Automated tracking so you don't forget</li>
                <li>See exactly where your money goes</li>
                <li>Build confidence with every dollar</li>
              </ul>
            </div>
          </div>

          {/* Testimonials */}
          <div style={{ marginBottom: '32px' }}>
            <h2
              style={{
                fontSize: window.innerWidth < 768 ? '24px' : '28px',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              Real Results From Real Members
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  window.innerWidth < 768
                    ? '1fr'
                    : 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    fontSize: '10px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  ✓ VERIFIED
                </div>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  H
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    fontStyle: 'italic',
                    marginBottom: '12px',
                    lineHeight: '1.5',
                  }}
                >
                  "Money was a big stressor in our household. After the birth of
                  our third kid my wife has stayed home for a season. We found
                  ourselves spending more than we were bringing in with no real
                  way to get a hold of it. Budgeting gave us a new hope. We now
                  track our money and make a plan for every dollar before we
                  spend it. I'm happy to say we are now cash flow positive and
                  saving a little each month towards our future goals. Working
                  with a budget coach has been an absolute life changing
                  experience for us. Cannot recommend it enough."
                </p>
                <p style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  - Heath C.
                </p>
                <p style={{ fontSize: '12px', opacity: 0.7 }}>December 2024</p>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    fontSize: '10px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  ✓ VERIFIED
                </div>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  S
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    fontStyle: 'italic',
                    marginBottom: '12px',
                    lineHeight: '1.5',
                  }}
                >
                  "Before budgeting we tried to spend money according to our
                  individual priorities. I'm more of a spender and my husband is
                  more of a saver. This resulted in a lot of friction between
                  us. Now that we budget it's a night and day difference. We
                  worked with our coach and came up with a set of categories and
                  amounts that reflect our shared priorities. I feel confident
                  in the money I spend because we've already agreed to the plan
                  together."
                </p>
                <p style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  - Sharayah W.
                </p>
                <p style={{ fontSize: '12px', opacity: 0.7 }}>January 2025</p>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    fontSize: '10px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  ✓ VERIFIED
                </div>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  N
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    fontStyle: 'italic',
                    marginBottom: '12px',
                    lineHeight: '1.5',
                  }}
                >
                  "I use MyBudgetCoach to track all my accounts in one place.
                  I've linked my bank accounts and no longer have to manually
                  enter my transactions. Before using a budgeting app I had to
                  keep track of everything in my head. It got pretty
                  overwhelming and I didn't know where my money was going. Now I
                  track each transaction and know exactly where my money is
                  being allocated. Categorizing is simple and the rules make it
                  a mostly automated process for me now."
                </p>
                <p style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  - Nick S.
                </p>
                <p style={{ fontSize: '12px', opacity: 0.7 }}>November 2024</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div
            style={{
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '32px 24px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              marginBottom: '40px',
            }}
          >
            <h2
              style={{
                fontSize: window.innerWidth < 768 ? '28px' : '36px',
                fontWeight: 'bold',
                marginBottom: '12px',
              }}
            >
              Ready to Transform Your Finances?
            </h2>
            <p
              style={{
                fontSize: window.innerWidth < 768 ? '16px' : '18px',
                marginBottom: '8px',
                opacity: 0.9,
              }}
            >
              Join hundreds who've already taken control of their financial
              future
            </p>

            {/* Price Display */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  fontSize: window.innerWidth < 768 ? '36px' : '48px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                }}
              >
                $64.99
                <span
                  style={{
                    fontSize: window.innerWidth < 768 ? '18px' : '24px',
                    opacity: 0.8,
                  }}
                >
                  /month
                </span>
              </div>
              <p style={{ fontSize: '14px', opacity: 0.8 }}>
                Everything you need to master your money
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                gap: '12px',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <Button
                variant="primary"
                onPress={handleGetStarted}
                style={{
                  fontSize: '20px',
                  padding: '18px 36px',
                  backgroundColor: '#10b981',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  width: window.innerWidth < 768 ? '100%' : 'auto',
                  minWidth: '280px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                }}
              >
                <Trans>🚀 Start Your Transformation - $64.99/mo</Trans>
              </Button>
            </div>

            <p
              style={{
                fontSize: '13px',
                opacity: 0.7,
                lineHeight: '1.4',
              }}
            >
              ✅ 30-day money-back guarantee
              <br />
              ✅ Cancel anytime
              <br />✅ No setup fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PremiumLanding50({ setError }) {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({});

  // Set countdown to 24 hours from now (you can adjust this)
  const countdownEndTime = useMemo(() => {
    const now = new Date().getTime();
    return now + 24 * 60 * 60 * 1000; // 24 hours from now
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownEndTime - now;

      if (distance > 0) {
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownEndTime]);

  const handleGetStarted = async () => {
    const url = String(window.location.href);
    let userId = 'anon_' + uuidv4();

    // Build success URL with plan_purchased parameter and discount info
    let successUrl = new URL(url);
    successUrl.searchParams.set('plan_purchased', 'premium');
    successUrl.searchParams.set('anonymous_purchaser', userId);
    successUrl.searchParams.delete('landing');

    let cancelUrl = url;
    successUrl = successUrl.toString();
    cancelUrl = cancelUrl.toString();

    let premium = true;

    let discount = '50_off_first_month';

    const storedParams = localStorage.getItem('urlParams');
    const params = storedParams ? JSON.parse(storedParams) : null;
    let fp_tid = params?.fprom_tid;

    const results = await send('airtable-create-checkout-session', {
      url,
      userId,
      successUrl,
      cancelUrl,
      premium,
      discount,
      fp_tid,
    });

    console.log('airtable-create-checkout-session');
    console.log(results);

    localStorage.setItem('discount_code', discount);

    if (!window.location.hostname.includes('localhost')) {
      ReactPixel.init('476212184832855');
      ReactPixel.track('InitiateCheckout', {
        value: 32.5, // Discounted price
        currency: 'USD',
        content_ids: ['premium_subscription_50_percent_off_first_month'],
        content_type: 'product',
        content_name: 'Premium Monthly Subscription - 50% Off First Month',
      });
    }

    setTimeout(() => {
      window.location.href = results;
    }, 200);
  };

  const handleSignIn = async () => {
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
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        margin: 0,
        padding: 0,
      }}
    >
      <style>
        {`
          @keyframes glow {
            0% { 
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
            }
            100% { 
              box-shadow: 0 0 30px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3);
            }
          }
          @keyframes pulse {
            0% { 
              transform: scale(1);
              opacity: 1;
            }
            50% { 
              transform: scale(1.05);
              opacity: 0.9;
            }
            100% { 
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes flash {
            0%, 100% { 
              background-color: #dc2626;
            }
            50% { 
              background-color: #ef4444;
            }
          }
        `}
      </style>

      {/* Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #8719e0 0%, #0c3966 100%)',
          zIndex: 0,
        }}
      />

      {/* Scrollable Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          margin: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px 16px 40px 16px',
            color: 'white',
            boxSizing: 'border-box',
          }}
        >
          {/* Urgency Banner with Countdown */}
          <div
            style={{
              background: 'linear-gradient(90deg, #dc2626, #ef4444)',
              padding: '16px',
              textAlign: 'center',
              marginBottom: '20px',
              borderRadius: '12px',
              border: '2px solid #fbbf24',
              animation: 'flash 2s infinite',
              boxShadow: '0 4px 20px rgba(220, 38, 38, 0.4)',
            }}
          >
            <div
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              🚨 LIMITED TIME: 50% OFF FIRST MONTH! 🚨
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: '600' }}>
                Offer expires in:
              </span>
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    minWidth: '50px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {String(timeLeft.hours || 0).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '12px' }}>HRS</div>
                </div>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>:</span>
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    minWidth: '50px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {String(timeLeft.minutes || 0).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '12px' }}>MIN</div>
                </div>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>:</span>
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    minWidth: '50px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {String(timeLeft.seconds || 0).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '12px' }}>SEC</div>
                </div>
              </div>
            </div>
          </div>

          {/* Facebook Traffic Banner */}
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.9)',
              padding: '12px 16px',
              textAlign: 'center',
              marginBottom: '20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            🎯 Saw us on Facebook? Perfect timing - grab this exclusive 50%
            discount! ⬇️
          </div>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img
              src="/logo_circle.png"
              alt="MyBudgetCoach Logo"
              style={{
                width: '64px',
                height: '64px',
                marginBottom: '16px',
              }}
            />
            <h1
              style={{
                fontSize: window.innerWidth < 768 ? '32px' : '52px',
                fontWeight: 'bold',
                marginBottom: '12px',
                lineHeight: '1.2',
              }}
            >
              Eliminate Financial Stress in 30 Days
            </h1>
            <p
              style={{
                fontSize: window.innerWidth < 768 ? '18px' : '24px',
                opacity: 0.9,
                marginBottom: '24px',
                lineHeight: '1.4',
                maxWidth: '600px',
                margin: '0 auto 24px auto',
                fontWeight: '500',
              }}
            >
              Stop worrying about money. Get personalized coaching + powerful
              apps to finally feel secure about your finances.
            </p>
          </div>

          {/* Top CTA with Discount Pricing */}
          <div
            style={{
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '24px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              marginBottom: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '3px solid #fbbf24',
              boxShadow: '0 4px 20px rgba(251, 191, 36, 0.3)',
            }}
          >
            {/* Discount Badge */}
            <div
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '12px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)',
              }}
            >
              🔥 50% OFF FIRST MONTH
            </div>

            {/* Pricing */}
            <div style={{ marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: window.innerWidth < 768 ? '20px' : '24px',
                  textDecoration: 'line-through',
                  opacity: 0.6,
                  marginRight: '12px',
                }}
              >
                $64.99
              </span>
              <span
                style={{
                  fontSize: window.innerWidth < 768 ? '36px' : '48px',
                  fontWeight: 'bold',
                  color: '#10b981',
                }}
              >
                $32.50
              </span>
              <span
                style={{
                  fontSize: window.innerWidth < 768 ? '16px' : '20px',
                  opacity: 0.8,
                }}
              >
                /first month
              </span>
            </div>

            <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
              Then $64.99/month - Cancel anytime
            </p>
            <p
              style={{
                fontSize: '14px',
                opacity: 0.9,
                marginBottom: '16px',
                fontWeight: '600',
              }}
            >
              Everything you need to master your money
            </p>

            {/* Star Rating */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    style={{
                      color: '#fbbf24',
                      fontSize: '18px',
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span
                style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}
              >
                5/5 (23 reviews)
              </span>
            </div>

            <Button
              variant="primary"
              onPress={handleGetStarted}
              style={{
                fontSize: window.innerWidth < 768 ? '20px' : '18px',
                padding: window.innerWidth < 768 ? '20px 32px' : '16px 32px',
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                minWidth: '320px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                alignSelf: 'center',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
            >
              <Trans>🚀 Get 50% Off - Start for $32.50!</Trans>
            </Button>

            <p
              style={{
                fontSize: '12px',
                opacity: 0.8,
                marginTop: '8px',
                fontStyle: 'italic',
              }}
            >
              💡 Save $32.49 on your first month!
            </p>
          </div>

          {/* Coach Matching Section */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '3px solid #3b82f6',
              borderRadius: '16px',
              padding: '32px 24px',
              marginBottom: '32px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                background:
                  'linear-gradient(45deg, #3b82f6, #2563eb, #3b82f6, #2563eb)',
                borderRadius: '16px',
                zIndex: -1,
                animation: 'glow 2s ease-in-out infinite alternate',
              }}
            />

            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>

            <h3
              style={{
                fontSize: window.innerWidth < 768 ? '24px' : '28px',
                fontWeight: 'bold',
                marginBottom: '16px',
                color: 'white',
              }}
            >
              We'll Match You With Your Perfect Coach
            </h3>

            <p
              style={{
                fontSize: window.innerWidth < 768 ? '16px' : '18px',
                lineHeight: '1.5',
                marginBottom: '20px',
                opacity: 0.95,
              }}
            >
              No waiting around! Based on your goals and personality, we'll pair
              you with a certified financial coach who specializes in your exact
              situation.
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                padding: '16px 24px',
                borderRadius: '8px',
                marginTop: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <span style={{ fontSize: '24px' }}>⚡</span>
              <span
                style={{
                  fontSize: window.innerWidth < 768 ? '16px' : '18px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                Your first 60-minute session booked today for this week!
              </span>
            </div>
          </div>

          {/* Value Proposition */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '24px',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                💆‍♀️ Personal Peace of Mind
              </h3>
              <ul
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  opacity: 0.9,
                  paddingLeft: '16px',
                }}
              >
                <li>Sleep better knowing your finances are handled</li>
                <li>60-minute sessions that fit your busy schedule</li>
                <li>Coaches who specialize in helping beginners</li>
                <li>Personalized approach - not generic advice</li>
              </ul>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '24px',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                📱 Effortless Money Management
              </h3>
              <ul
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  opacity: 0.9,
                  paddingLeft: '16px',
                }}
              >
                <li>Simple apps that actually work</li>
                <li>Automated tracking so you don't forget</li>
                <li>See exactly where your money goes</li>
                <li>Build confidence with every dollar</li>
              </ul>
            </div>
          </div>

          {/* Testimonials */}
          <div style={{ marginBottom: '32px' }}>
            <h2
              style={{
                fontSize: window.innerWidth < 768 ? '24px' : '28px',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              Real Results From Real Members
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  window.innerWidth < 768
                    ? '1fr'
                    : 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
              }}
            >
              {/* Testimonials remain the same */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    fontSize: '10px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  ✓ VERIFIED
                </div>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  H
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    fontStyle: 'italic',
                    marginBottom: '12px',
                    lineHeight: '1.5',
                  }}
                >
                  "Money was a big stressor in our household. After the birth of
                  our third kid my wife has stayed home for a season. We found
                  ourselves spending more than we were bringing in with no real
                  way to get a hold of it. Budgeting gave us a new hope. We now
                  track our money and make a plan for every dollar before we
                  spend it. I'm happy to say we are now cash flow positive and
                  saving a little each month towards our future goals. Working
                  with a budget coach has been an absolute life changing
                  experience for us. Cannot recommend it enough."
                </p>
                <p style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  - Heath C.
                </p>
                <p style={{ fontSize: '12px', opacity: 0.7 }}>December 2024</p>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    fontSize: '10px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  ✓ VERIFIED
                </div>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  S
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    fontStyle: 'italic',
                    marginBottom: '12px',
                    lineHeight: '1.5',
                  }}
                >
                  "Before budgeting we tried to spend money according to our
                  individual priorities. I'm more of a spender and my husband is
                  more of a saver. This resulted in a lot of friction between
                  us. Now that we budget it's a night and day difference. We
                  worked with our coach and came up with a set of categories and
                  amounts that reflect our shared priorities. I feel confident
                  in the money I spend because we've already agreed to the plan
                  together."
                </p>
                <p style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  - Sharayah W.
                </p>
                <p style={{ fontSize: '12px', opacity: 0.7 }}>January 2025</p>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    fontSize: '10px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  ✓ VERIFIED
                </div>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  N
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    fontStyle: 'italic',
                    marginBottom: '12px',
                    lineHeight: '1.5',
                  }}
                >
                  "I use MyBudgetCoach to track all my accounts in one place.
                  I've linked my bank accounts and no longer have to manually
                  enter my transactions. Before using a budgeting app I had to
                  keep track of everything in my head. It got pretty
                  overwhelming and I didn't know where my money was going. Now I
                  track each transaction and know exactly where my money is
                  being allocated. Categorizing is simple and the rules make it
                  a mostly automated process for me now."
                </p>
                <p style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  - Nick S.
                </p>
                <p style={{ fontSize: '12px', opacity: 0.7 }}>November 2024</p>
              </div>
            </div>
          </div>

          {/* Final CTA Section with Discount */}
          <div
            style={{
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '32px 24px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              marginBottom: '40px',
              border: '3px solid #fbbf24',
            }}
          >
            <h2
              style={{
                fontSize: window.innerWidth < 768 ? '28px' : '36px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Ready to Transform Your Finances?
            </h2>

            <div
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '16px',
                display: 'inline-block',
              }}
            >
              🚨 Limited Time: 50% OFF First Month
            </div>

            <p
              style={{
                fontSize: window.innerWidth < 768 ? '16px' : '18px',
                marginBottom: '8px',
                opacity: 0.9,
              }}
            >
              Join hundreds who've already taken control of their financial
              future
            </p>

            {/* Price Display with Discount */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: window.innerWidth < 768 ? '24px' : '32px',
                    textDecoration: 'line-through',
                    opacity: 0.6,
                    marginRight: '12px',
                  }}
                >
                  $64.99
                </span>
                <span
                  style={{
                    fontSize: window.innerWidth < 768 ? '40px' : '56px',
                    fontWeight: 'bold',
                    color: '#10b981',
                  }}
                >
                  $32.50
                </span>
                <span
                  style={{
                    fontSize: window.innerWidth < 768 ? '18px' : '24px',
                    opacity: 0.8,
                  }}
                >
                  /first month
                </span>
              </div>
              <p style={{ fontSize: '14px', opacity: 0.8 }}>
                Then $64.99/month - Everything you need to master your money
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                gap: '12px',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <Button
                variant="primary"
                onPress={handleGetStarted}
                style={{
                  fontSize: '20px',
                  padding: '18px 36px',
                  backgroundColor: '#10b981',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  width: window.innerWidth < 768 ? '100%' : 'auto',
                  minWidth: '320px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  animation: 'pulse 2s infinite',
                }}
              >
                <Trans>🚀 Get 50% Off - Start for $32.50!</Trans>
              </Button>
            </div>

            <p
              style={{
                fontSize: '13px',
                opacity: 0.7,
                lineHeight: '1.4',
              }}
            >
              ✅ 30-day money-back guarantee
              <br />
              ✅ Cancel anytime
              <br />✅ No setup fees
              <br />
              💰 <strong>Save $32.49 on your first month!</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
