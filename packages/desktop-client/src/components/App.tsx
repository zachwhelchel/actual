// @ts-strict-ignore
import React, { useEffect, useState } from 'react';
import {
  ErrorBoundary,
  useErrorBoundary,
  type FallbackProps,
} from 'react-error-boundary';
import { useSelector } from 'react-redux';

import * as Platform from 'loot-core/src/client/platform';
import {
  init as initConnection,
  send,
} from 'loot-core/src/platform/client/fetch';
import { type GlobalPrefs } from 'loot-core/src/types/prefs';

import { useActions } from '../hooks/useActions';
import { installPolyfills } from '../polyfills';
import { ResponsiveProvider } from '../ResponsiveProvider';
import { styles, hasHiddenScrollbars, ThemeStyle } from '../style';

import { AppBackground } from './AppBackground';
import { View } from './common/View';
import { DevelopmentTopBar } from './DevelopmentTopBar';
import { FatalError } from './FatalError';
import { FinancesApp } from './FinancesApp';
import { ManagementApp } from './manager/ManagementApp';
import { MobileWebMessage } from './MobileWebMessage';
import { UpdateNotification } from './UpdateNotification';
//import { REACT_APP_BILLING_STATUS, REACT_APP_TRIAL_END_DATE, REACT_APP_ZOOM_RATE, REACT_APP_ZOOM_LINK, REACT_APP_COACH, REACT_APP_COACH_FIRST_NAME, REACT_APP_USER_FIRST_NAME } from '../coaches/coachVariables';

type AppInnerProps = {
  budgetId: string;
  cloudFileId: string;
  loadingText: string;
  loadBudget: (
    id: string,
    loadingText?: string,
    options?: object,
  ) => Promise<void>;
  closeBudget: () => Promise<void>;
  loadGlobalPrefs: () => Promise<GlobalPrefs>;
  someDialogues: Map;
  initialDialogueId: string;
};

function AppInner({
  budgetId,
  cloudFileId,
  loadingText,
  loadBudget,
  closeBudget,
  loadGlobalPrefs,
  someDialogues,
  initialDialogueId,
}: AppInnerProps) {
  const [initializing, setInitializing] = useState(true);
  const { showBoundary: showErrorBoundary } = useErrorBoundary();

  const [stateSomeDialogues, setStateSomeDialogues] = useState(new Map());
  const [stateInitialDialogueId, setStateInitialDialogueId] = useState(null);

  //let newSomeDialogues = new Map();
  //let newInitialDialogueId = null;

  async function init() {
    const socketName = await global.Actual.getServerSocket();

    await initConnection(socketName);

    // Load any global prefs
    await loadGlobalPrefs();

    // Open the last opened budget, if any
    const budgetId = await send('get-last-opened-backup');
    if (budgetId) {
      await loadBudget(budgetId);

      // Check to see if this file has been remotely deleted (but
      // don't block on this in case they are offline or something)
      send('get-remote-files').then(files => {
        if (files) {
          const remoteFile = files.find(f => f.fileId === cloudFileId);
          if (remoteFile && remoteFile.deleted) {
            closeBudget();
          }
        }
      });
    }

    await initAvatar();
  }

  async function initAvatar() {

    let url = String(window.location.href);
    //url = "https://zackwhelchel.mybudgetcoach.app/";

    const results = await send('env-variables', url);
    var myobj = JSON.parse(results);

    let REACT_APP_BILLING_STATUS = myobj.data.REACT_APP_BILLING_STATUS;
    let REACT_APP_TRIAL_END_DATE = myobj.data.REACT_APP_TRIAL_END_DATE;
    let REACT_APP_START_PAYING_DATE = myobj.data.REACT_APP_START_PAYING_DATE;
    let REACT_APP_ZOOM_RATE = myobj.data.REACT_APP_ZOOM_RATE;
    let REACT_APP_ZOOM_LINK = myobj.data.REACT_APP_ZOOM_LINK;
    let REACT_APP_COACH = myobj.data.REACT_APP_COACH;
    let REACT_APP_COACH_FIRST_NAME = myobj.data.REACT_APP_COACH_FIRST_NAME;
    let REACT_APP_USER_FIRST_NAME = myobj.data.REACT_APP_USER_FIRST_NAME;
    let REACT_APP_UI_MODE = myobj.data.REACT_APP_UI_MODE;

    if (REACT_APP_BILLING_STATUS != null) {
      localStorage.setItem('REACT_APP_BILLING_STATUS', REACT_APP_BILLING_STATUS);
    } else {
      localStorage.removeItem('REACT_APP_BILLING_STATUS');
    }

    if (REACT_APP_TRIAL_END_DATE != null) {
      localStorage.setItem('REACT_APP_TRIAL_END_DATE', REACT_APP_TRIAL_END_DATE);
    } else {
      localStorage.removeItem('REACT_APP_TRIAL_END_DATE');
    }

    if (REACT_APP_START_PAYING_DATE != null) {
      localStorage.setItem('REACT_APP_START_PAYING_DATE', REACT_APP_START_PAYING_DATE);
    } else {
      localStorage.removeItem('REACT_APP_START_PAYING_DATE');
    }

    if (REACT_APP_ZOOM_RATE != null) {
      localStorage.setItem('REACT_APP_ZOOM_RATE', REACT_APP_ZOOM_RATE);
    } else {
      localStorage.removeItem('REACT_APP_ZOOM_RATE');
    }

    if (REACT_APP_ZOOM_LINK != null) {
      localStorage.setItem('REACT_APP_ZOOM_LINK', REACT_APP_ZOOM_LINK);
    } else {
      localStorage.removeItem('REACT_APP_ZOOM_LINK');
    }

    if (REACT_APP_COACH != null) {
      localStorage.setItem('REACT_APP_COACH', REACT_APP_COACH);
    } else {
      localStorage.removeItem('REACT_APP_COACH');
    }

    if (REACT_APP_COACH_FIRST_NAME != null) {
      localStorage.setItem('REACT_APP_COACH_FIRST_NAME', REACT_APP_COACH_FIRST_NAME);
    } else {
      localStorage.removeItem('REACT_APP_COACH_FIRST_NAME');
    }

    if (REACT_APP_USER_FIRST_NAME != null) {
      localStorage.setItem('REACT_APP_USER_FIRST_NAME', REACT_APP_USER_FIRST_NAME);
    } else {
      localStorage.removeItem('REACT_APP_USER_FIRST_NAME');
    }

    if (REACT_APP_UI_MODE != null) {
      localStorage.setItem('REACT_APP_UI_MODE', REACT_APP_UI_MODE);
    } else {
      localStorage.removeItem('REACT_APP_UI_MODE');
    }

    //Set up the coach dialogues.
    let coachSrc = "/avatars/" + REACT_APP_COACH + ".drawio.xml";

    //coachSrc = "https://firebasestorage.googleapis.com/v0/b/mybudgetcoach-3c977.appspot.com/o/%20KristinWade.drawio-24.xml?alt=media&token=c20c8ead-89b9-4c1c-8a32-b59ced6f7f87"

    type Conversation = {
      id: string;
      title: string;
      dialogues: Map;
      firstDialogueId: string;
      triggerType: string;
    };

    type Dialogue = {
      id: string;
      text: string;
      dialogueOptions: [DialogueOption];
      type: string; // choose, autoPush
      action: string;
      gif: string;
      context: string;
    };

    type DialogueOption = {
      toId: string;
      text: string;
      variableToSet: string;
      valueToSet: string;
      and: [Condition];
      or: [Condition];
      y: number;
    };

    type Condition = {
      and: [Condition];
      or: [Condition];
      variable: string;
      value: string;
      test: string;
    };

    //let someDialogues = new Map();
    let someConversations = new Map();
    let initialDialogueId = undefined;

    let file = localStorage.getItem("uploaded_draw_io_file");

    console.log("I have a file here at setup");
    console.log(file);

    // if (file != null) {
    //   coachSrc = file;
    // }

    await fetch(coachSrc)
    .then((res) => res.text())
    .then(xmlString => {

      let stringToUse = xmlString;
      let file = localStorage.getItem("uploaded_draw_io_file");

      if (file != null) {
          console.log("still a file?????");

        stringToUse = file;
      }

      console.log("go on xml?");
      console.log(stringToUse);
      return new window.DOMParser().parseFromString(stringToUse, "text/xml")
    })
    .then(data => {
      // I guess you could just set the dialogue id here... and run checks for triggers and such. idk.

      //console.log(data.getElementsByTagName("mxCell")[3].getAttribute("value"));

      //ok, how do I split these up based on tabs?

      let diagrams = data.getElementsByTagName("diagram");


      if (diagrams.length === 1) {

        console.log("Um... hello");

        let items = diagrams[0].getElementsByTagName("mxCell");
        let [dialogues, firstDialogueId, triggerType] = dialoguesForConversation(items);

        console.log("Um... hello");

        const id = diagrams[0].getAttribute("id");
        const name = diagrams[0].getAttribute("name");

        console.log("Um... hello");

        const conversation: Conversation = {
          id: id,
          title: "Introduction",
          dialogues: dialogues,
          firstDialogueId: firstDialogueId,
          triggerType: triggerType,
        };
        someConversations.set(conversation.id, conversation);

        console.log("Um... hello" + conversation.id);

      } else {

        for (let i = 0; i < diagrams.length; i++) {
          const diagram = diagrams[i];

          const id = diagram.getAttribute("id");
          const name = diagram.getAttribute("name");

          let items = diagram.getElementsByTagName("mxCell");
          let [dialogues, firstDialogueId, triggerType] = dialoguesForConversation(items);

          const conversation: Conversation = {
            id: id,
            title: name,
            dialogues: dialogues,
            firstDialogueId: firstDialogueId,
            triggerType: triggerType,
          };
          someConversations.set(conversation.id, conversation);

          console.log("ousters sss " + conversation);
        }

      }

      //console.log(data);

      //someDialogues = dialoguesForConversation(data);
      

    })
    .catch((err) => {
      console.log("err on xml?");
      console.log(err);
    });

    someDialogues = someConversations;
    setStateSomeDialogues(someDialogues);
    setStateInitialDialogueId(initialDialogueId);
  }

  useEffect(() => {
    async function initAll() {
      await Promise.all([installPolyfills(), init()]);
      setInitializing(false);
    }

    initAll().catch(showErrorBoundary);
  }, []);

  useEffect(() => {
    global.Actual.updateAppMenu(!!budgetId);
  }, [budgetId]);

  return (
    <>
      {initializing ? (
        <AppBackground initializing={initializing} loadingText={loadingText} />
      ) : budgetId ? (
        <FinancesApp budgetId={budgetId} someDialogues={stateSomeDialogues} initialDialogueId={stateInitialDialogueId} />
      ) : (
        <>
          <AppBackground
            initializing={initializing}
            loadingText={loadingText}
          />
          <ManagementApp isLoading={loadingText != null} />
        </>
      )}

      <UpdateNotification />
      <MobileWebMessage />
    </>
  );
}

function ErrorFallback({ error }: FallbackProps) {
  return (
    <>
      <AppBackground />
      <FatalError error={error} buttonText="Restart app" />
    </>
  );
}

export function App({someDialogues, initialDialogueId}) {
  let budgetId = useSelector(
    state => state.prefs.local && state.prefs.local.id,
  );
  const cloudFileId = useSelector(
    state => state.prefs.local && state.prefs.local.cloudFileId,
  );
  const loadingText = useSelector(state => state.app.loadingText);
  const { loadBudget, closeBudget, loadGlobalPrefs, sync } = useActions();
  const [hiddenScrollbars, setHiddenScrollbars] = useState(
    hasHiddenScrollbars(),
  );

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
        await sync();
        isSyncing = false;
      }
    }

    window.addEventListener('focus', checkScrollbars);
    window.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('focus', checkScrollbars);
      window.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [sync]);

  return (
    <ResponsiveProvider>
      <View
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <View
          key={hiddenScrollbars ? 'hidden-scrollbars' : 'scrollbars'}
          style={{
            flexGrow: 1,
            overflow: 'hidden',
            ...styles.lightScrollbar,
          }}
        >
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            {process.env.REACT_APP_REVIEW_ID && !Platform.isPlaywright && (
              <DevelopmentTopBar />
            )}
            <AppInner
              budgetId={budgetId}
              cloudFileId={cloudFileId}
              loadingText={loadingText}
              loadBudget={loadBudget}
              closeBudget={closeBudget}
              loadGlobalPrefs={loadGlobalPrefs}
              someDialogues={someDialogues}
              initialDialogueId={initialDialogueId}
            />
          </ErrorBoundary>
          <ThemeStyle />
        </View>
      </View>
    </ResponsiveProvider>
  );
}


function dialoguesForConversation(items) : [Map, string, string] {

let someDialogues = new Map();


  let triggerType = null;


  let firstId = undefined;
  let firstIdXYTotal = 100000000;


  let actions = new Map();
  let gifs = new Map();


  for (let i = 0; i < items.length; i++) {
    const child = items[i];

    const id = child.getAttribute("id");
    let value = child.getAttribute("value");

//Ok I think this might work... but... we need the <br> for the value saving.
//Also the fact that labels are sometimes on the arrows themselves... are those set up to split and save variables too?
//let div = document.createElement("div");
//div.innerHTML = value;
//value = div.innerHTML;//div.textContent || div.innerText || "";





    const style = child.getAttribute("style");

    let context = "Anywhere";




    if (value !== undefined && value !== null && style !== undefined && style !== null) {

      //value = value.replaceAll(" style=\"([\\s\\S]+?)\"", "");

      // value = value.replaceAll('<br style="border-color: var(--border-color);">', '<br>');
      // value = value.replaceAll('<br style="border-color: var(--border-color); text-align: left;">', '<br>');
      // value = value.replaceAll('<br style="border-color: var(--border-color); font-style: normal;">', '<br>');
      // value = value.replaceAll('<div style="border-color: var(--border-color); font-style: normal;">', '<div>');
      // value = value.replaceAll('<i style="border-color: var(--border-color);">', '<i>');
      // value = value.replaceAll('<span style="border-color: var(--border-color);">', '<span>');
      // value = value.replaceAll('<div style="border-color: var(--border-color);">', '<div>');
      // value = value.replaceAll('<span style="font-style: normal; border-color: var(--border-color);">', '<span>');
      // value = value.replaceAll('<div style="">', '<div>');
      // value = value.replaceAll('<br style="border-color: var(--border-color);">', '<br>');
      // value = value.replaceAll('<div style="border-color: var(--border-color); text-align: left;">', '<div>');
      // value = value.replaceAll('<span style="border-color: var(--border-color); text-align: center;">', '<span>');
      // value = value.replaceAll('<span style="border-color: var(--border-color); background-color: initial;">', '<span>');
      // value = value.replaceAll('<div style="text-align: left;">', '<div>');
      // value = value.replaceAll('<span style="background-color: initial;">', '<span>');
      // value = value.replaceAll('<span style="text-align: left;">', '<span>');
      // value = value.replaceAll('<span style="">', '<span>');


      value = value.replaceAll(' style="border-color: var(--border-color);"', '');
      value = value.replaceAll(' style="border-color: var(--border-color); text-align: left;"', '');
      value = value.replaceAll(' style="border-color: var(--border-color); font-style: normal;"', '');
      value = value.replaceAll(' style="border-color: var(--border-color); font-style: normal;"', '');
      value = value.replaceAll(' style="border-color: var(--border-color);"', '');
      value = value.replaceAll(' style="border-color: var(--border-color);"', '');
      value = value.replaceAll(' style="border-color: var(--border-color);"', '');
      value = value.replaceAll(' style="font-style: normal; border-color: var(--border-color);"', '');
      value = value.replaceAll(' style=""', '');
      value = value.replaceAll(' style="border-color: var(--border-color);"', '');
      value = value.replaceAll(' style="border-color: var(--border-color); text-align: left;"', '');
      value = value.replaceAll(' style="border-color: var(--border-color); text-align: center;"', '');
      value = value.replaceAll(' style="border-color: var(--border-color); background-color: initial;"', '');
      value = value.replaceAll(' style="text-align: left;"', '');
      value = value.replaceAll(' style="background-color: initial;"', '');
      value = value.replaceAll(' style="text-align: left;"', '');
      value = value.replaceAll(' style="font-size: 12px;"', '');
      value = value.replaceAll(' style="font-size: 10px;"', '');


      // value = value.replaceAll('border-color: var(--border-color);', '');
      // value = value.replaceAll('font-size: 12px;', '');
      // value = value.replaceAll('font-size: 10px;', '');
      // value = value.replaceAll('background-color: initial;', '');
      // value = value.replaceAll('font-style: normal;', '');




      // value = value.replaceAll('<font style="font-size: 12px;">', '');
      // value = value.replaceAll('<font style="font-size: 10px;">', '');
      // value = value.replaceAll('</font>', '');
      // value = value.replaceAll('<p>', '');
      // value = value.replaceAll('</p>', '');
      // value = value.replaceAll('<i>', '');
      // value = value.replaceAll('</i>', '');
      // value = value.replaceAll('<font>', '');
      // value = value.replaceAll('</font>', '');
      // value = value.replaceAll('<span>', '');
      // value = value.replaceAll('</span>', '');
      // value = value.replaceAll('<div>', '');
      // value = value.replaceAll('</div>', '');

      // if (value.endsWith("<br>")) {
      //   value = value.substring(0, value.length - 4);
      // }
      // if (value.endsWith("<br>")) {
      //   value = value.substring(0, value.length - 4);
      // }
      // if (value.endsWith("<br>")) {
      //   value = value.substring(0, value.length - 4);
      // }
      // if (value.endsWith("<br>")) {
      //   value = value.substring(0, value.length - 4);
      // }
      // if (value.endsWith("<br>")) {
      //   value = value.substring(0, value.length - 4);
      // }

      //end any trailing <br> s, this is so dumb...


      console.log(value);


      let sIndex = value.indexOf("&lt;&lt;") + 8; 
      let tIndex = value.indexOf("&gt;&gt;"); 


//&amp;lt;&amp;lt;Budget&amp;gt;&amp;gt;&lt;br style=&quot;border-color: var(--border-color);&quot;&gt;&lt;br&gt;
      if (value.includes("&lt;&lt;")) {

        console.log("dumb");
        console.log(value);

        let substringToReplace = value.substring(sIndex, tIndex);
        value = value.replace("&lt;&lt;" + substringToReplace + "&gt;&gt;", "");
        value = value.replace("<br>", "");
        value = value.replace("<br>", "");
        context = substringToReplace;
      }

      value = value.replaceAll("&nbsp;", " ");

      if (style.includes('shape=mxgraph.flowchart.decision;') || style.startsWith('rounded=0;') || style.startsWith('whiteSpace=wrap;html=1;') || style.startsWith('rhombus;') || style.startsWith('html=1;whiteSpace=wrap;aspect=fixed;shape=isoRectangle;')) {


        let moreChilds = child.getElementsByTagName("mxGeometry");

        for (let i = 0; i < moreChilds.length; i++) {
          const moreChild = moreChilds[i];

          let xxx = moreChild.getAttribute("x");
          let yyy = moreChild.getAttribute("y");

          if (xxx !== null && xxx !== undefined && yyy !== null && yyy !== undefined) {
            let xyTotal = Number(xxx) + Number(yyy);

            console.log("id xy total:" + id + " " + xyTotal);

            if (xyTotal < firstIdXYTotal) {
              firstIdXYTotal = xyTotal;
              firstId = id;
            }
          }
        }


        const dia: Dialogue = {
          id: id,
          text: value,
          dialogueOptions: [],
          type: "choose",
          context: context,
        };
        someDialogues.set(dia.id, dia);

        console.log(value);
      }
      else if (style.startsWith('shape=cylinder3;')) {


        let moreChilds = child.getElementsByTagName("mxGeometry");

        for (let i = 0; i < moreChilds.length; i++) {
          const moreChild = moreChilds[i];

          let xxx = moreChild.getAttribute("x");
          let yyy = moreChild.getAttribute("y");

          if (xxx !== null && xxx !== undefined && yyy !== null && yyy !== undefined) {
            let xyTotal = Number(xxx) + Number(yyy);

            console.log("id xy total:" + id + " " + xyTotal);

            if (xyTotal < firstIdXYTotal) {
              firstIdXYTotal = xyTotal;
              firstId = id;
            }
          }
        }


        const dia: Dialogue = {
          id: id,
          text: "",
          dialogueOptions: [],
          type: "autoPush",
          context: context,
        };
        someDialogues.set(dia.id, dia);

        console.log(value);
      }
      else if (style.startsWith('shape=step;perimeter=stepPerimeter;')) {

        let xxx = child.getAttribute("value");
        console.log('thetriggerthing' + xxx);
        triggerType = xxx;

      }

      else if (style.startsWith('rounded=1')) {


        //Ok I think this might work... but... we need the <br> for the value saving.
        //Also the fact that labels are sometimes on the arrows themselves... are those set up to split and save variables too?
        // let div = document.createElement("div");
        // div.innerHTML = value;
        // value = div.textContent || div.innerText || "";
        value = value.replaceAll("</div><div>", "<br>")
        value = value.replaceAll("<div>", "")
        value = value.replaceAll("</div>", "")

        value = value.replaceAll('<font>', '');
        value = value.replaceAll('</font>', '');
        value = value.replaceAll('<p>', '');
        value = value.replaceAll('</p>', '');
        value = value.replaceAll('<i>', '');
        value = value.replaceAll('</i>', '');
        value = value.replaceAll('<font>', '');
        value = value.replaceAll('</font>', '');
        value = value.replaceAll('<span>', '');
        value = value.replaceAll('</span>', '');
        value = value.replaceAll('<div>', '');
        value = value.replaceAll('</div>', '');



        actions.set(id, value);

        // save this as an action.
      }
      else if (style.startsWith('triangle')) {

        gifs.set(id, value);

        // save this as an action.
      }



    }

  }


  let optionInfo = new Map();
  for (let i = 0; i < items.length; i++) {
    const child = items[i];

    const id = child.getAttribute("id");
    const style = child.getAttribute("style");
    let value = child.getAttribute("value");
    const parent = child.getAttribute("parent");

    if (parent !== undefined && parent !== null && style !== undefined && style !== null && value !== undefined && value !== null) {

      value = value.replaceAll("&nbsp;", " ");

      if (style.startsWith('edgeLabel;')) {
        optionInfo.set(parent, value);
      }
    }
  }


  for (let i = 0; i < items.length; i++) {
    const child = items[i];

    const id = child.getAttribute("id");
    let value = child.getAttribute("value");
    const style = child.getAttribute("style");
    const source = child.getAttribute("source");
    const target = child.getAttribute("target");


//mxGeometry -> mxPoint -> y; //idk, maybe.

    let y = 0;

    let moreChilds = child.getElementsByTagName("mxPoint");


    for (let i = 0; i < moreChilds.length; i++) {
      const moreChild = moreChilds[i];

      let newy = moreChild.getAttribute("y");
      if (newy > y) {
        y = newy;

      }



    }


if (source === "iygmyBO8lgVPopkCsqYT-73") {
      console.log("y: " + y + " _ " + id);

}




    if (source !== undefined && source !== null && style !== undefined && style !== null) {

      //should conditionally put this here too...
      // value = value.replaceAll("&nbsp;", " ");

      if (style.startsWith('edgeStyle=orthogonalEdgeStyle;') || style.startsWith('edgeStyle=elbowEdgeStyle;shape=connector;') || style.startsWith('edgeStyle=none;shape=connector;') || style.startsWith('rounded=0;orthogonalLoop=1') || style.startsWith('endArrow=classic;') || style.startsWith('edgeStyle=none;rounded=0;orthogonalLoop=1') || style.startsWith('edgeStyle=none;curved=1;rounded=0;orthogonalLoop=1;')) {
        if (style.includes('dashed=1;')) {

        } else {

          let sourceAction = actions.get(source);
          if (sourceAction !== undefined && sourceAction !== null) {
            let dialogue = someDialogues.get(target);

            if (dialogue !== undefined && dialogue !== null) {
              dialogue.action = sourceAction;
            }

          }


          let sourceGif = gifs.get(source);
          if (sourceGif !== undefined && sourceGif !== null) {
            let dialogue = someDialogues.get(target);

            if (dialogue !== undefined && dialogue !== null) {
              dialogue.gif = sourceGif;
            }

          }





          let dialogue = someDialogues.get(source);




          if (dialogue !== undefined) {

          // ok so we have an arrow... does the dialogue it comes from have a type of auto? because then we'll interpret a bit differently...

            if (dialogue.type === "choose") {






              let stuff = optionInfo.get(id);

              if (value !== null && value !== undefined && value.length > 0) {
                stuff = value;
              } 


              if (stuff !== null && stuff !== undefined) {

                //ok we need to see if there is a second line here...
                if (stuff.includes('<br')) {

                  let stuff1 = "";
                  let stuff2 = "";

                  let longStr = '<br style="border-color: var(--border-color);">';

                  if (stuff.includes('<br>')) {
                    stuff1 = stuff.substring(0, stuff.indexOf('<br>'));
                    stuff2 = stuff.substring(stuff.indexOf('<br>') + 4);
                  } else if (stuff.includes(longStr)) {
                    console.log("ever made it here?")
                    stuff1 = stuff.substring(0, stuff.indexOf(longStr));
                    stuff2 = stuff.substring(stuff.indexOf(longStr) + longStr.length);
                  } 

                  let stuff1div = document.createElement("div");
                  stuff1div.innerHTML = stuff1;
                  stuff1 = stuff1div.textContent || stuff1div.innerText || "";

                  let stuff2div = document.createElement("div");
                  stuff2div.innerHTML = stuff2;
                  stuff2 = stuff2div.textContent || stuff2div.innerText || "";


                  let stuff3 = stuff2.substring(0, stuff2.indexOf(' = '));
                  let stuff4 = stuff2.substring(stuff2.indexOf(' = ') + 3);

                  const dia: DialogueOption = {
                    toId: target,
                    text: stuff1,
                    variableToSet: stuff3,
                    valueToSet: stuff4,
                    y: y,
                  };
                  dialogue.dialogueOptions.push(dia);
                  console.log("Adding " + source + " to " + target + " and setting: " + stuff3 + " to " + stuff4);

                } else {

                  let stuffdiv = document.createElement("div");
                  stuffdiv.innerHTML = stuff;
                  stuff = stuffdiv.textContent || stuffdiv.innerText || "";

                  const dia: DialogueOption = {
                    toId: target,
                    text: stuff,
                    y: y,
                  };
                  dialogue.dialogueOptions.push(dia);
                  console.log("Adding " + source + " to " + target);
                }

              } else {

                const dia: DialogueOption = {
                  toId: target,
                  text: "Next",
                  y: y,
                };
                dialogue.dialogueOptions.push(dia);
                console.log("Adding " + source + " to " + target);

              }


            } else if (dialogue.type === "autoPush") {



              let stuff = optionInfo.get(id);
              if (stuff !== null && stuff !== undefined) {



                const dialogueOption: DialogueOption = {
                  toId: target,
                  and: [],
                  or: [],
                  y: y,
                };

                // stuff -> parsed into ands and ors...

                if(stuff.includes('AND')) {

                  let stuff1 = stuff.substring(0, stuff.indexOf(' AND '));
                  let stuff2 = stuff.substring(stuff.indexOf(' AND ') + 5);


                  if(!stuff1.includes('(')) {
                    //we know its an expression only.

                    let more1 = stuff1.substring(0, stuff1.indexOf(' = '));
                    let more2 = stuff1.substring(stuff1.indexOf(' = ') + 3);

                    const condition: Condition = {
                      and: [],
                      or: [],
                      variable: more1,
                      value: more2,
                      test: "=",
                    };

                    dialogueOption.and.push(condition);

                  } else {
                    //need to drill it more.

                    stuff1 = stuff1.replaceAll("(", "");
                    stuff1 = stuff1.replaceAll(")", "");


                    const conditionA: Condition = {
                      and: [],
                      or: [],
                    };

                    let more1 = stuff1.substring(0, stuff1.indexOf(' OR '));
                    let more2 = stuff1.substring(stuff1.indexOf(' OR ') + 4);

                    let mas1 = more1.substring(0, more1.indexOf(' = '));
                    let mas2 = more1.substring(more1.indexOf(' = ') + 3);

                    let mas3 = more2.substring(0, more2.indexOf(' = '));
                    let mas4 = more2.substring(more2.indexOf(' = ') + 3);

                    const conditionB: Condition = {
                      and: [],
                      or: [],
                      variable: mas1,
                      value: mas2,
                      test: "=",
                    };

                    const conditionC: Condition = {
                      and: [],
                      or: [],
                      variable: mas3,
                      value: mas4,
                      test: "=",
                    };

                    conditionA.or.push(conditionB);
                    conditionA.or.push(conditionC);
                    dialogueOption.and.push(conditionA);


                  }

                  if(!stuff2.includes('(')) {
                    //we know its an expression only.

                    let more1 = stuff2.substring(0, stuff2.indexOf(' = '));
                    let more2 = stuff2.substring(stuff2.indexOf(' = ') + 3);

                    const condition: Condition = {
                      and: [],
                      or: [],
                      variable: more1,
                      value: more2,
                      test: "=",
                    };

                    dialogueOption.and.push(condition);



                  } else {
                    //need to drill it more.

                    stuff2 = stuff2.replaceAll("(", "");
                    stuff2 = stuff2.replaceAll(")", "");


                    const conditionA: Condition = {
                      and: [],
                      or: [],
                    };

                    let more1 = stuff2.substring(0, stuff2.indexOf(' OR '));
                    let more2 = stuff2.substring(stuff2.indexOf(' OR ') + 4);

                    let mas1 = more1.substring(0, more1.indexOf(' = '));
                    let mas2 = more1.substring(more1.indexOf(' = ') + 3);

                    let mas3 = more2.substring(0, more2.indexOf(' = '));
                    let mas4 = more2.substring(more2.indexOf(' = ') + 3);

                    const conditionB: Condition = {
                      and: [],
                      or: [],
                      variable: mas1,
                      value: mas2,
                      test: "=",
                    };

                    const conditionC: Condition = {
                      and: [],
                      or: [],
                      variable: mas3,
                      value: mas4,
                      test: "=",
                    };

                    conditionA.or.push(conditionB);
                    conditionA.or.push(conditionC);
                    dialogueOption.and.push(conditionA);




                  }

                } else {
                  // the simple case needs covered too.

                  let more1 = stuff.substring(0, stuff.indexOf(' = '));
                  let more2 = stuff.substring(stuff.indexOf(' = ') + 3);

                  const condition: Condition = {
                    and: [],
                    or: [],
                    variable: more1,
                    value: more2,
                    test: "=",
                  };

                  dialogueOption.and.push(condition);

                }



                dialogue.dialogueOptions.push(dialogueOption);
                console.log("Adding " + source + " to " + target + " and CONDITIONS FOR AUTOPUSH");
                console.log(dialogue);
              }



            }
          }
        }
      }
    }
  }


  let keys = someDialogues.keys();

    console.log("I'm sorting soon"); 
  console.log(keys); 

  for (let [key, value] of  someDialogues.entries()) {
    let dialogue = value;
    console.log("I'm sorting " + key); 
    dialogue.dialogueOptions.sort( function(a, b) {
      return a.y - b.y // no idea why the minus is used here but it worked.
    });
  }


  //go through all of these someDialogues
  //and resort their dialogue options by ys.



  console.log("someDialogues");
  console.log("firstId:" + firstId);
  //setAllDialogues(someDialogues);
  let initialDialogueId = firstId;

  //return someDialogues;

    return [someDialogues, initialDialogueId, triggerType];

}

