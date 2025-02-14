// @ts-strict-ignore
import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  ErrorBoundary,
  useErrorBoundary,
  type FallbackProps,
} from 'react-error-boundary';
import { HotkeysProvider } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import {
  closeBudget,
  loadBudget,
  loadGlobalPrefs,
  setAppState,
  sync,
} from 'loot-core/client/actions';
import { SpreadsheetProvider } from 'loot-core/client/SpreadsheetProvider';
import { type State } from 'loot-core/client/state-types';
import * as Platform from 'loot-core/src/client/platform';
import {
  init as initConnection,
  send,
} from 'loot-core/src/platform/client/fetch';

import { useActions } from '../hooks/useActions';
import { useMetadataPref } from '../hooks/useMetadataPref';
import { installPolyfills } from '../polyfills';
import { styles, hasHiddenScrollbars, ThemeStyle, useTheme } from '../style';
import { ExposeNavigate } from '../util/router-tools';

import { AppBackground } from './AppBackground';
import { BudgetMonthCountProvider } from './budget/BudgetMonthCountContext';
import { View } from './common/View';
import { DevelopmentTopBar } from './DevelopmentTopBar';
import { FatalError } from './FatalError';
import { FinancesApp } from './FinancesApp';
import { ManagementApp } from './manager/ManagementApp';
import { NeedStuffApp } from './manager/NeedStuffApp';
import { Modals } from './Modals';
import { ResponsiveProvider } from './responsive/ResponsiveProvider';
import { SidebarProvider } from './sidebar/SidebarProvider';
import { UpdateNotification } from './UpdateNotification';
//import { REACT_APP_BILLING_STATUS, REACT_APP_TRIAL_END_DATE, REACT_APP_ZOOM_RATE, REACT_APP_ZOOM_LINK, REACT_APP_COACH, REACT_APP_COACH_FIRST_NAME, REACT_APP_USER_FIRST_NAME } from '../coaches/coachVariables';
import { getCoach } from '../coaches/coachVariables';

type AppInnerProps = {
  someDialogues: Map;
  initialDialogueId: string;
};

function AppInner({ someDialogues, initialDialogueId }: AppInnerProps) {
  const [budgetId] = useMetadataPref('id');
  const [cloudFileId] = useMetadataPref('cloudFileId');
  const { t } = useTranslation();
  const { showBoundary: showErrorBoundary } = useErrorBoundary();
  const dispatch = useDispatch();
  const userData = useSelector((state: State) => state.user.data);
  const { signOut, addNotification } = useActions();

  const maybeUpdate = async <T,>(cb?: () => T): Promise<T> => {
    if (global.Actual.isUpdateReadyForDownload()) {
      dispatch(
        setAppState({
          loadingText: t('Downloading and applying update...'),
        }),
      );
      await global.Actual.applyAppUpdate();
    }
    return cb?.();
  };


  const [stateSomeDialogues, setStateSomeDialogues] = useState(new Map());
  const [stateInitialDialogueId, setStateInitialDialogueId] = useState(null);

  //let newSomeDialogues = new Map();
  //let newInitialDialogueId = null;

  async function init() {
    const socketName = await maybeUpdate(() => global.Actual.getServerSocket());

    dispatch(
      setAppState({
        loadingText: null,
      }),
    );
    await initConnection(socketName);

    // Load any global prefs
    dispatch(
      setAppState({
        loadingText: null,
      }),
    );
    await dispatch(loadGlobalPrefs());

    // Open the last opened budget, if any
    dispatch(
      setAppState({
        loadingText: null,
      }),
    );
    const budgetId = await send('get-last-opened-backup');
    if (budgetId) {
      await dispatch(loadBudget(budgetId));

      // Check to see if this file has been remotely deleted (but
      // don't block on this in case they are offline or something)
      dispatch(
        setAppState({
          loadingText: null,
        }),
      );

      const files = await send('get-remote-files');
      if (files) {
        const remoteFile = files.find(f => f.fileId === cloudFileId);
        if (remoteFile && remoteFile.deleted) {
          dispatch(closeBudget());
        }
      }

      await maybeUpdate();
    }

    //await initAvatar();
  }



  useEffect(() => {
    async function initAll() {
      await Promise.all([installPolyfills(), init()]);
      dispatch(setAppState({ loadingText: null }));
    }

    initAll().catch(showErrorBoundary);
  }, []);

  useEffect(() => {
    global.Actual.updateAppMenu(budgetId);
  }, [budgetId]);

  useEffect(() => {
    if (userData?.tokenExpired) {
      addNotification({
        type: 'error',
        id: 'login-expired',
        title: t('Login expired'),
        sticky: true,
        message: t('Login expired, please login again.'),
        button: {
          title: t('Go to login'),
          action: signOut,
        },
      });
    }
  }, [userData, userData?.tokenExpired]);


  let imgSrc = "/maskable-192x192.png";

  let bg = (

    <View style={{ height: '100%' }}>
      <AppBackground />
      <View
        style={{
          height: '100%'
        }}
      >
        <img
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '75px',
            position: 'absolute',
            margin: 'auto',
            top: '0px',
            left: '0px',
            bottom: '0px',
            right: '0px',

          }}
          src={imgSrc}
          alt="coach"
        />
      </View>
    </View>
  )

  if (userData === null) {
    return <ManagementApp />;
  }


  if (stateSomeDialogues.size === 0) {
    return (
      <NeedStuffApp
        userData={userData}
        setStateSomeDialogues={setStateSomeDialogues}
        setStateInitialDialogueId={setStateInitialDialogueId}
      />
    );
  }

  if (!budgetId) {
    return <ManagementApp />;
  }

  if (stateSomeDialogues.size !== 0) {
    return (
      <FinancesApp 
        budgetId={budgetId}
        someDialogues={stateSomeDialogues}
        initialDialogueId={stateInitialDialogueId}
      />
    );
  }

  return (
    <bg/>
  );

  //return budgetId ? stateSomeDialogues.size !== 0 ? <FinancesApp budgetId={budgetId} someDialogues={stateSomeDialogues} initialDialogueId={stateInitialDialogueId} /> : <NeedStuffApp setStateSomeDialogues={setStateSomeDialogues} setStateInitialDialogueId={setStateInitialDialogueId} /> : <ManagementApp />;
}

function ErrorFallback({ error }: FallbackProps) {
  return (
    <>
      <AppBackground />
      <FatalError error={error} />
    </>
  );
}

export function App({someDialogues, initialDialogueId}) {
  const [hiddenScrollbars, setHiddenScrollbars] = useState(
    hasHiddenScrollbars(),
  );
  const dispatch = useDispatch();

  useEffect(() => {
    function checkScrollbars() {
      if (hiddenScrollbars !== hasHiddenScrollbars()) {
        setHiddenScrollbars(hasHiddenScrollbars());
      }
    }

    let isSyncing = false;

    async function onVisibilityChange() {
      if (!isSyncing) {
        console.debug('triggering sync because of visibility change');
        isSyncing = true;
        await dispatch(sync());
        isSyncing = false;
      }
    }

    window.addEventListener('focus', checkScrollbars);
    window.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('focus', checkScrollbars);
      window.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [dispatch]);

  const [theme] = useTheme();

  return (
    <BrowserRouter>
      <ExposeNavigate />
      <HotkeysProvider initiallyActiveScopes={['*']}>
        <ResponsiveProvider>
          <SpreadsheetProvider>
            <SidebarProvider>
              <BudgetMonthCountProvider>
                <DndProvider backend={HTML5Backend}>
                  <View
                    data-theme={theme}
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <View
                      key={
                        hiddenScrollbars ? 'hidden-scrollbars' : 'scrollbars'
                      }
                      style={{
                        flexGrow: 1,
                        overflow: 'hidden',
                        ...styles.lightScrollbar,
                      }}
                    >
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        {process.env.REACT_APP_REVIEW_ID &&
                          !Platform.isPlaywright && <DevelopmentTopBar />}
                        <AppInner someDialogues={someDialogues} initialDialogueId={initialDialogueId} />
                      </ErrorBoundary>
                      <ThemeStyle />
                      <UpdateNotification />
                    </View>
                  </View>
                </DndProvider>
              </BudgetMonthCountProvider>
            </SidebarProvider>
          </SpreadsheetProvider>
        </ResponsiveProvider>
      </HotkeysProvider>
    </BrowserRouter>
  );
}


