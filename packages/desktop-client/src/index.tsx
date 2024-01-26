// This file will initialize the app if we are in a real browser
// environment (not electron)
import './browser-preload';

// A hack for now: this makes sure it's appended before glamor
import '@reach/listbox/styles.css';

import './fonts.scss';

import React from 'react';
import { Provider } from 'react-redux';

import { createRoot } from 'react-dom/client';
import {
  createStore,
  combineReducers,
  applyMiddleware,
  bindActionCreators,
} from 'redux';
import thunk from 'redux-thunk';

import * as actions from 'loot-core/src/client/actions';
import * as constants from 'loot-core/src/client/constants';
import q, { runQuery } from 'loot-core/src/client/query-helpers';
import reducers from 'loot-core/src/client/reducers';
import { initialState as initialAppState } from 'loot-core/src/client/reducers/app';
import { send } from 'loot-core/src/platform/client/fetch';

import App from './components/App';
import { ServerProvider } from './components/ServerContext';
import { handleGlobalEvents } from './global-events';
import { REACT_APP_BILLING_STATUS, REACT_APP_TRIAL_END_DATE, REACT_APP_ZOOM_RATE, REACT_APP_ZOOM_LINK, REACT_APP_COACH, REACT_APP_COACH_FIRST_NAME, REACT_APP_USER_FIRST_NAME } from './coaches/coachVariables';

// See https://github.com/WICG/focus-visible. Only makes the blue
// focus outline appear from keyboard events.
import 'focus-visible';

const appReducer = combineReducers(reducers);
function rootReducer(state, action) {
  if (action.type === constants.CLOSE_BUDGET) {
    // Reset the state and only keep around things intentionally. This
    // blows away everything else
    state = {
      budgets: state.budgets,
      user: state.user,
      prefs: { local: null, global: state.prefs.global },
      app: {
        ...initialAppState,
        updateInfo: state.updateInfo,
        showUpdateNotification: state.showUpdateNotification,
        managerHasInitialized: state.app.managerHasInitialized,
        loadingText: state.app.loadingText,
      },
    };
  }

  return appReducer(state, action);
}

const store = createStore(rootReducer, undefined, applyMiddleware(thunk));
const boundActions = bindActionCreators(actions, store.dispatch);

// Listen for global events from the server or main process
handleGlobalEvents(boundActions, store);

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    __actionsForMenu: typeof actions;

    $send: typeof send;
    $query: typeof runQuery;
    $q: typeof q;
  }
}

// Expose this to the main process to menu items can access it
window.__actionsForMenu = boundActions;

// Expose send for fun!
window.$send = send;
window.$query = runQuery;
window.$q = q;

//Set up the coach dialogues.
let coachSrc = "/avatars/" + REACT_APP_COACH + ".drawio.xml";

//coachSrc = "https://firebasestorage.googleapis.com/v0/b/mybudgetcoach-3c977.appspot.com/o/%20KristinWade.drawio-24.xml?alt=media&token=c20c8ead-89b9-4c1c-8a32-b59ced6f7f87"
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

let someDialogues = new Map();
let initialDialogueId = undefined;

await fetch(coachSrc)
.then((res) => res.text())
.then(xmlString => {
  console.log("go on xml?");
  return new window.DOMParser().parseFromString(xmlString, "text/xml")
})
.then(data => {
  // I guess you could just set the dialogue id here... and run checks for triggers and such. idk.

  console.log("good on xml?");
  //console.log(data.getElementsByTagName("mxCell")[3].getAttribute("value"));

  let items = data.getElementsByTagName("mxCell");

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

      value = value.replaceAll('<br style="border-color: var(--border-color);">', '<br>');

      value = value.replaceAll('<font style="font-size: 12px;">', '');
      value = value.replaceAll('<font style="font-size: 10px;">', '');
      value = value.replaceAll('</font>', '');
      value = value.replaceAll('<p>', '');
      value = value.replaceAll('</p>', '');


      let sIndex = value.indexOf("&lt;&lt;") + 8; 
      let tIndex = value.indexOf("&gt;&gt;<br><br>"); 


//&amp;lt;&amp;lt;Budget&amp;gt;&amp;gt;&lt;br style=&quot;border-color: var(--border-color);&quot;&gt;&lt;br&gt;
      if (value.includes("&lt;&lt;")) {

        console.log("dumb");
        console.log(value);

        let substringToReplace = value.substring(sIndex, tIndex);
        value = value.replace("&lt;&lt;" + substringToReplace + "&gt;&gt;<br><br>", "");
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
      else if (style.startsWith('rounded=1')) {


//Ok I think this might work... but... we need the <br> for the value saving.
//Also the fact that labels are sometimes on the arrows themselves... are those set up to split and save variables too?
// let div = document.createElement("div");
// div.innerHTML = value;
// value = div.textContent || div.innerText || "";
value = value.replaceAll("</div><div>", "<br>")
value = value.replaceAll("<div>", "")
value = value.replaceAll("</div>", "")

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
  initialDialogueId = firstId;

})
.catch((err) => {
  console.log("err on xml?");
  console.log(err);
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <ServerProvider>
      <App someDialogues={someDialogues} initialDialogueId={initialDialogueId}/>
    </ServerProvider>
  </Provider>,
);
