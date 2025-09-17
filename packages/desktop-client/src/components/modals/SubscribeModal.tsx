import React, { useState } from 'react';

import { send } from 'loot-core/src/platform/client/fetch';
import { useDispatch, useSelector } from 'react-redux';

import {
  REACT_APP_UI_MODE,
  testableCoachList,
  REACT_APP_COACH,
} from '../../coaches/coachVariables';
import { SvgWallet } from '../../icons/v1';
import {
  SvgDownloadThickBottom,
  SvgRemove,
  SvgAlertTriangle,
} from '../../icons/v2';
import { colors } from '../../style';
import { useCoach } from '../coach/Coach';
import { Block } from '../common/Block';
import { Button } from '../common/Button';
import { BigInput } from '../common/Input';
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

export function SubscribeModal({}) {
  const userData = useSelector(state => state.user.data);

  const basicSelected = async () => {
    console.log('basicSelected');

    const url = String(window.location.href);
    console.log('go pay...');

    // Build success URL with plan_purchased parameter
    let successUrl = new URL(url);
    //successUrl.searchParams.set('plan_purchased', 'premium');

    // THIS MEANS ILL MANUALLY NEED TO SET THE PURCHASED PLAN AND PAID FOR NOW STILL.

    // Build cancel URL (current URL without changes)
    let cancelUrl = url;

    successUrl = successUrl.toString();
    cancelUrl = cancelUrl.toString();

    if (userData?.userId) {
    } else {
      return;
    }

    let userId = userData.userId;
    let premium = false;
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

    window.location.href = results;
  };

  const premiumSelected = async () => {
    console.log('premiumSelected');

    const url = String(window.location.href);
    console.log('go pay...');

    // Build success URL with plan_purchased parameter
    let successUrl = new URL(url);
    //successUrl.searchParams.set('plan_purchased', 'premium');

    // THIS MEANS ILL MANUALLY NEED TO SET THE PURCHASED PLAN AND PAID FOR NOW STILL.

    // Build cancel URL (current URL without changes)
    let cancelUrl = url;

    successUrl = successUrl.toString();
    cancelUrl = cancelUrl.toString();

    if (userData?.userId) {
    } else {
      return;
    }

    let userId = userData.userId;
    let premium = true;
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

    window.location.href = results;
  };

  return (
    <Modal name="subscribe" containerProps={{ style: { width: 800 } }}>
      {({ state: { close } }) => (
        <>
          <ModalHeader
            title={<ModalTitle title={`Choose A Plan`} shrinkOnOverflow />}
            rightContent={<ModalCloseButton onPress={close} />}
          />
          <View style={{ lineHeight: 1.5 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                overflow: 'auto',
                paddingTop: 20,
                paddingBottom: 20,
                backgroundColor: '#f5f5f5',
              }}
            >
              <div
                style={{
                  width: '90%',
                  maxWidth: '600px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  padding: '1.5rem',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  boxShadow:
                    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    marginTop: '2rem',
                  }}
                >
                  {/* Premium Plan */}

                  {[
                    'emilyblain',
                    'kristinwade',
                    'nicksmith',
                    'zachwhelchel',
                    'jonathanakerman',
                  ].includes(REACT_APP_COACH) && (
                    <div
                      style={{
                        border: '2px solid #8b5cf6',
                        borderRadius: '0.75rem',
                        padding: '2rem',
                        position: 'relative',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                      }}
                      onClick={premiumSelected}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '-12px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: '#8b5cf6',
                          color: 'white',
                          padding: '0.25rem 1rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Popular
                      </div>

                      <div
                        style={{
                          textAlign: 'center',
                          marginBottom: '1.5rem',
                        }}
                      >
                        <h3
                          style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '0.5rem',
                          }}
                        >
                          Premium
                        </h3>
                        <div
                          style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#1f2937',
                            marginBottom: '0.5rem',
                          }}
                        >
                          $64.99
                          <span
                            style={{
                              fontSize: '1rem',
                              fontWeight: 'normal',
                              color: '#6b7280',
                            }}
                          >
                            /month
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          marginBottom: '1.5rem',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '0.75rem',
                          }}
                        >
                          <div
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: '#8b5cf6',
                              marginRight: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <div
                              style={{
                                width: '6px',
                                height: '6px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                              }}
                            ></div>
                          </div>
                          <span
                            style={{
                              color: '#4b5563',
                              fontSize: '0.9rem',
                            }}
                          >
                            1 hour session included monthly
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: '#6b7280',
                              marginRight: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <div
                              style={{
                                width: '6px',
                                height: '6px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                              }}
                            ></div>
                          </div>
                          <span
                            style={{
                              color: '#4b5563',
                              fontSize: '0.9rem',
                            }}
                          >
                            Extra sessions $55 each
                          </span>
                        </div>
                      </div>

                      <button
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          backgroundColor: '#8b5cf6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                        }}
                      >
                        Choose Premium
                      </button>
                    </div>
                  )}

                  {/* Basic Plan */}
                  <div
                    style={{
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      padding: '2rem',
                      position: 'relative',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                    }}
                    onClick={basicSelected}
                  >
                    <div
                      style={{
                        textAlign: 'center',
                        marginBottom: '1.5rem',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Basic
                      </h3>
                      <div
                        style={{
                          fontSize: '2rem',
                          fontWeight: 'bold',
                          color: '#1f2937',
                          marginBottom: '0.5rem',
                        }}
                      >
                        $14.99
                        <span
                          style={{
                            fontSize: '1rem',
                            fontWeight: 'normal',
                            color: '#6b7280',
                          }}
                        >
                          /month
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        marginBottom: '1.5rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: '#6b7280',
                            marginRight: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: '6px',
                              height: '6px',
                              backgroundColor: 'white',
                              borderRadius: '50%',
                            }}
                          ></div>
                        </div>
                        <span
                          style={{
                            color: '#4b5563',
                            fontSize: '0.9rem',
                          }}
                        >
                          No included sessions
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: '#6b7280',
                            marginRight: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: '6px',
                              height: '6px',
                              backgroundColor: 'white',
                              borderRadius: '50%',
                            }}
                          ></div>
                        </div>
                        <span
                          style={{
                            color: '#4b5563',
                            fontSize: '0.9rem',
                          }}
                        >
                          Sessions priced separately
                        </span>
                      </div>
                    </div>

                    <button
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      Start Free Trial
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </View>
        </>
      )}
    </Modal>
  );
}
