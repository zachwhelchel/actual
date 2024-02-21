import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

//import { useActions } from '../hooks/useActions';

import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { View } from '../common/View';
import { BigInput } from '../common/Input';
import { REACT_APP_BILLING_STATUS, REACT_APP_TRIAL_END_DATE, REACT_APP_ZOOM_RATE, REACT_APP_ZOOM_LINK, REACT_APP_COACH, REACT_APP_COACH_FIRST_NAME, REACT_APP_USER_FIRST_NAME } from '../../coaches/coachVariables';
import { SvgClose } from '../../icons/v1';

let CoachContext = createContext();

//initialDialogueId can be removed....
export function CoachProvider({ budgetId, allConversations, initialDialogueId, children }) {
  let [top, setTop] = useState(window.innerHeight - 20);
  let [left, setLeft] = useState(window.innerWidth - 20 - 240);
  let [offset, setOffset] = useState(100);
  let categoriesCoachRef = useRef([]);

  let commonElementsRef = useRef([]);


  let [dialogueStack, setDialogueStack] = useState([]);
  let [topStack, setTopStack] = useState([]);
  let [leftStack, setLeftStack] = useState([]);
  let [offsetStack, setOffsetStack] = useState([]);



    let conversationDeck_key = "conversationDeck_" + budgetId;


  let dss = new Map();

  let cd = [];


    console.log("ousters kanye" + Array(allConversations).length);



  // if we have some history on the conversation deck we need to use that too...


    let simpleConversationDeck = [];

    try {
      simpleConversationDeck = JSON.parse(localStorage.getItem(conversationDeck_key));
    } catch (error) {
      console.error(error);
    }

    if (simpleConversationDeck == null && allConversations != null) {
      let first = null;
      allConversations.forEach((value, key) => {
        if (first == null) {
          first = key;
          simpleConversationDeck = [first];
        }
      });
    }

    if (simpleConversationDeck == null) {
      simpleConversationDeck = [];
    }

    console.log("daysinsun" + simpleConversationDeck);


    let firstConvo = null;

if (allConversations != null) {
    simpleConversationDeck.forEach((convoId) => {
      let title = null;

      allConversations.forEach((value, key) => {
        if (key == convoId) {
          title = value.title;
        }
      });
      if (title != null) {

        if (firstConvo == null) {
          firstConvo = convoId;
        }

        cd.push({id: convoId, title: title});
      }
    });

}





  // so pull the deck parts out from below.

  // but a reset can do that.

  allConversations.forEach((value, key) => {
    console.log("ousters kanye" + key + value);

    const conversation = value;

    let dialogueStack_key = "dialogueStack_" + budgetId + "_" + conversation.id;

    let ds = null;

    try {
        ds = JSON.parse(localStorage.getItem(dialogueStack_key));
        console.log("well what did we get?" + ds);
                  console.log("well what did we get?" + ds[0]);
    } catch (error) {
      console.error(error);
    }

    if (ds == null) {
      ds = [conversation.firstDialogueId];
    }

    console.log("ousters blessme" + conversation.id);
    console.log("ousters blessme" + ds[0]);

    dss[conversation.id] = ds;

    //cd.push({id: key, title: conversation.title});
  });


  let [dialogueStacks, setDialogueStacks] = useState(dss);
  let [conversationDeck, setConversationDeck] = useState(cd);
  let [openConversation, setOpenConversation] = useState(firstConvo);



  let coachState_key = "coachState_" + REACT_APP_COACH + "_" + budgetId

  let newObject = JSON.parse(localStorage.getItem(coachState_key));

  let [coachState, setCoachState] = useState(newObject ?? {});

  const resetCoach = () => {
    console.log('reseeeeeeet');

    localStorage.removeItem(conversationDeck_key);

    allConversations.forEach((value, key) => {
      const conversation = value;
      let dialogueStack_key = "dialogueStack_" + budgetId + "_" + conversation.id;
      localStorage.removeItem(dialogueStack_key);
    });

    localStorage.removeItem(coachState_key);
  };

  const triggerFired = (id) => {

    let conversationId = null;
    let conversationTitle = null;

    allConversations.forEach((value, key) => {
      const conversation = value;
      conversation.triggerType;
      if (conversation.triggerType === id) {
        conversationId = conversation.id;
        conversationTitle = conversation.title;
      }
    });

    if (conversationId != null && conversationTitle != null) {

      let add = true;
      conversationDeck.forEach((convo) => {
        if (convo.id === conversationId) {
          add = false;
        }
      });

      if (add) {
        setConversationDeck([{id: conversationId, title: conversationTitle}, ...conversationDeck]);
      }
      setOpenConversation(conversationId);
    }
  };

  const jumpToId = (id) => {

    console.log("jump to id");
    let conversationId = null;
    let conversationTitle = null;


    allConversations.forEach((value, key) => {
      const conversation = value;

      let foundDialogue = conversation.dialogues.get(id);

      if (foundDialogue != null) {
        conversationId = conversation.id;
        conversationTitle = conversation.title;
      }
    });

    if (conversationId != null && conversationTitle != null) {
      let add = true;
      conversationDeck.forEach((convo) => {
        if (convo.id === conversationId) {
          add = false;
        }
      });

      if (add) {
        setConversationDeck([{id: conversationId, title: conversationTitle}, ...conversationDeck]);
      }
      setOpenConversation(conversationId);

      let newDialogueStacks = new Map();
      for (const key in dialogueStacks) {
        const value = dialogueStacks[key];
        if (key === conversationId) {
          newDialogueStacks[key] = [id];
        } else {
          newDialogueStacks[key] = value;
        }
      }
      setDialogueStacks(newDialogueStacks);

    }
  };

  useEffect(() => {
    for (const key in dialogueStacks) {
      const value = dialogueStacks[key];
      let dialogueStack_key = "dialogueStack_" + budgetId + "_" + key;
      console.log("and I saving thissss? " + dialogueStack_key);
      localStorage.setItem(dialogueStack_key, JSON.stringify(value));
    };
  }, [dialogueStacks]);


  useEffect(() => {
    let simpleConversationDeck = [];
    conversationDeck.forEach((convo) => {
      simpleConversationDeck.push(convo.id);
    });
    localStorage.setItem(conversationDeck_key, JSON.stringify(simpleConversationDeck));
  }, [conversationDeck]);


  useEffect(() => {
    localStorage.setItem(coachState_key, JSON.stringify(coachState));
    console.log("I should have stored the state here:");
    console.log(coachState_key);
    console.log(coachState);
  }, [coachState]);


  return (
    <CoachContext.Provider
      value={{
        resetCoach,
        top,
        setTop,
        left,
        setLeft,
        offset,
        setOffset,
        dialogueStacks,
        setDialogueStacks,
        openConversation,
        setOpenConversation,
        categoriesCoachRef,
        commonElementsRef,
        allConversations,
        coachState,
        setCoachState,
        dialogueStack,
        setDialogueStack,
        topStack, 
        setTopStack, 
        leftStack, 
        setLeftStack,
        offsetStack, 
        setOffsetStack,
        conversationDeck,
        setConversationDeck,
        triggerFired,
        jumpToId,
      }}
    >
      {children}
    </CoachContext.Provider>
  );
}

export function useCoach() {
  return useContext(CoachContext);
}

export default function Coach({
  context,
  onSaveGroup,
  onDeleteGroup,
  onSaveCategory,
  onSaveNewCategories,
  categoryGroups,
  categoriesRef,
}) {
  let {
    resetCoach,
    top,
    setTop,
    left,
    setLeft,
    offset,
    setOffset,
    dialogueStacks,
    setDialogueStacks,
    openConversation,
    setOpenConversation,
    categoriesCoachRef,
    commonElementsRef,
    allConversations,
    coachState,
    setCoachState,
    dialogueStack,
    setDialogueStack,
    topStack,
    setTopStack,
    leftStack,
    setLeftStack,
    offsetStack, 
    setOffsetStack,
    conversationDeck,
    setConversationDeck,
    triggerFired,
    jumpToId,
  } = useCoach();


              console.log("ousters nnnnmmm" + dialogueStacks["tutorial"]);

  //instead of setDialougeId we need to be setting the dialogueId for a conversation.
  //we need to have multiple conversations going, interupt, vs on hold, vs etc etc.





  let [currentInput, setCurrentInput] = useState("");

  function updateInputForDialogueOption(dialogueOption) {

    let variableToSet = dialogue.dialogueOptions[0].variableToSet;
    let valueToSet = dialogue.dialogueOptions[0].valueToSet;

    if (variableToSet !== undefined && variableToSet !== null && valueToSet !== undefined && valueToSet !== null) {

      if (coachState[variableToSet] !== valueToSet) {
        setCoachState({ ...coachState, [variableToSet]: valueToSet })
      }

    }

  }

  function back() {

    let pastDialogue = undefined;

    let conversation = allConversations.get(openConversation);
    if (conversation != null) {
      let ds = dialogueStacks[openConversation];
      if (ds != null) {
        if (ds.length > 1) {
          pastDialogue = conversation.dialogues.get(ds[ds.length-2]);
        }
      }
    }

    performDialogue(pastDialogue, true);

    if (pastDialogue != undefined) {
      let newDialogueStacks = new Map();
      for (const key in dialogueStacks) {
        const value = dialogueStacks[key];
        if (key === openConversation) {
          let popped = value.pop();
          newDialogueStacks[key] = value;

        } else {
          newDialogueStacks[key] = value;
        }
      }
      setDialogueStacks(newDialogueStacks);
    }

  }


  async function performDialogue(dialogue, wasBackwards = false) {

    if (dialogue !== null && dialogue !== undefined) {

      if (dialogue.type === "autoPush") {

        let winner = null;

        for (let i = 0; i < dialogue.dialogueOptions.length; i++) {
          let option = dialogue.dialogueOptions[i];

          let passes = true;
          let and = option.and;

          if (and !== undefined && and !== null) {
            for (let i = 0; i < and.length; i++) {
              let stuff = and[i];
              if (evaluate(stuff) === true) {
              } else {
                passes = false;
              }
            }
          }

          if (passes) {
            winner = option;
          }
        } 

        if (winner !== null) {
          performDialogueOption(winner);
        }
      }
      else {



        //let currentDialogueId = dialogueId;

        if (wasBackwards === false) {
          //if (currentDialogueId !== null) {
            //setDialogueStack([...dialogueStack, currentDialogueId]);
          //}

          let newDialogueStacks = new Map();
          for (const key in dialogueStacks) {
            const value = dialogueStacks[key];
            if (key === openConversation) {
              newDialogueStacks[key] = [...value, dialogue.id];

            } else {
              newDialogueStacks[key] = value;
            }
          }
          setDialogueStacks(newDialogueStacks);
        }





        let action = dialogue.action;

        if (action !== undefined && action !== null) {
          performAction(action);
        }
      }
    } else {
      //no more dialogue with the current open conversation... welp... we need to set it back to the start and remove it from the active conversations.

      let newDialogueStacks = new Map();
      for (const key in dialogueStacks) {
        const value = dialogueStacks[key];
        if (key === openConversation) {
          newDialogueStacks[key] = [value[0]];
        } else {
          newDialogueStacks[key] = value;
        }
      }

      let newConversationDeck = [];
      conversationDeck.forEach((convo) => {
        if (convo.id === openConversation) {
          
        } else {
          newConversationDeck.push(convo);
        }
      });

      setDialogueStacks(newDialogueStacks);
      setConversationDeck(newConversationDeck);
      setOpenConversation(null);
    }

  }

  function performDialogueOption(dialogueOption) {

    let variableToSet = dialogueOption.variableToSet;
    let valueToSet = dialogueOption.valueToSet;

    if (variableToSet !== undefined && variableToSet !== null && valueToSet !== undefined && valueToSet !== null) {
      // should this prefix to kristin, prob yes.

      if (valueToSet.startsWith('[')) {

        if (currentInput.length > 0) {
          setCoachState({ ...coachState, [variableToSet]: currentInput });
        } else {
          return
        }
      } else {
        setCoachState({ ...coachState, [variableToSet]: valueToSet });
      }
    }

    console.log ("COACHSTATE: ");
    console.log (coachState);

    let nextId = dialogueOption.toId;
    //let nextDialogue = allDialogues.get(nextId);

    let conversation = allConversations.get(openConversation);
    if (conversation != null) {
      let nextDialogue = conversation.dialogues.get(nextId);
      performDialogue(nextDialogue);
    }
  }


  async function performAction(action) {
    let catsToMake = [];
    let catGroupsJustMade = {};

    let actions = action.split("<br>");
    for (let i = 0; i < actions.length; i++) {
      let a = actions[i];


      if (a.startsWith("create_category_group:")) {

        let substring = a.substring(23, a.length);

        console.log("I found a substring to action on");
        console.log(substring);

        let existingGroup = categoryGroups.find(g => g.name === substring);

        if (existingGroup === null || existingGroup === undefined) {
          let group = { id: 'new', name: substring };
          console.log("About to save a group: " + substring);
          let id = await onSaveGroup(group);
          catGroupsJustMade[substring] = id;

          console.log("Did save a group: " + substring);
        }

      }
      else if (a.startsWith("delete_category_group:")) {

        let substring = a.substring(23, a.length);

        console.log("I found a substring to action on");
        console.log(substring);

        let existingGroup = categoryGroups.find(g => g.name === substring);

        if (existingGroup !== null && existingGroup !== undefined) {
          console.log(existingGroup);

          let id = await onDeleteGroup(existingGroup.id);
        }

      }
      else if (a.startsWith("create_category:")) {



        let substring = a.substring(17, a.length);

        let sIndex = substring.indexOf(": ") + 2; 

        let cg = substring.substring(0, sIndex - 2);
        let c = substring.substring(sIndex, substring.length);

        console.log("I found a category to add for a categoy group:");
        console.log(cg);
        console.log(c);






        let sIndex2 = c.indexOf("[[") + 2; 
        let tIndex2 = c.indexOf("]]"); 

        if (sIndex2 !== null && sIndex2 !== undefined && tIndex2 !== null && tIndex2 !== undefined) {
          console.log("I found a substring to replace");
          let substringToReplace = c.substring(sIndex2, tIndex2);
          console.log(substringToReplace);

          let replacement = coachState[substringToReplace];
          if (replacement !== null && replacement !== undefined) {
            console.log("And the value for it:");
            console.log(replacement);

            c = c.replace("[[" + substringToReplace + "]]", replacement);
            console.log("So here is the new text:");
            console.log(c);

          }
        }





        let existingGroup = categoryGroups.find(g => g.name === cg);

        let idOfCatGroupJustMade = catGroupsJustMade[cg];

          console.log("idOfCatGroupJustMade");
          console.log(idOfCatGroupJustMade);

        if (existingGroup !== null && existingGroup !== undefined) {
          console.log("existingGroup found");

          let existingCat = existingGroup.categories.find(g => g.name === c);
          if (existingCat !== null && existingCat !== undefined) {
            console.log("existingCat found");

          } else {
            console.log("existingCat not found");

            let category = {
              name: c,
              cat_group: existingGroup.id,
              is_income: false,
              id: 'new',
              hidden: false,
            };
            catsToMake.push(category);

          }
        } else if (idOfCatGroupJustMade !== null && idOfCatGroupJustMade !== undefined) {

          console.log("looppppphole");

          let category = {
            name: c,
            cat_group: idOfCatGroupJustMade,
            is_income: false,
            id: 'new',
            hidden: false,
          };
          catsToMake.push(category);

        }

      }



    }

    
    if (catsToMake.length > 0) {

      //need a timeout here...

      let ids = await onSaveNewCategories(catsToMake, true);
    }


  }

  function highlight(dialogue) {

    if (dialogue == null) {
      return;
    }

    let xOffset = 0;
    let yOffset = 0;

    if (context === "Budget") {
      xOffset = -9;
      yOffset = -36;
    } else if (context === "Accounts") {
    }

    setTop(window.innerHeight - 20 + yOffset);
    setLeft(window.innerWidth - 20 - 240 + xOffset);
    setOffset(100);

    if (
      commonElementsRef.current['account_balance'] !== undefined &&
      commonElementsRef.current['account_balance'] !== null
    ) {
      commonElementsRef.current['account_balance'].style.backgroundColor = null;
      commonElementsRef.current['account_balance'].style.outlineColor = null;
      commonElementsRef.current['account_balance'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['split_toggle_button'] !== undefined &&
      commonElementsRef.current['split_toggle_button'] !== null
    ) {
      commonElementsRef.current['split_toggle_button'].style.backgroundColor = null;
      commonElementsRef.current['split_toggle_button'].style.outlineColor = null;
      commonElementsRef.current['split_toggle_button'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['import_button'] !== undefined &&
      commonElementsRef.current['import_button'] !== null
    ) {
      commonElementsRef.current['import_button'].style.backgroundColor = null;
      commonElementsRef.current['import_button'].style.outlineColor = null;
      commonElementsRef.current['import_button'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['add_new_button'] !== undefined &&
      commonElementsRef.current['add_new_button'] !== null
    ) {
      commonElementsRef.current['add_new_button'].style.backgroundColor = null;
      commonElementsRef.current['add_new_button'].style.outlineColor = null;
      commonElementsRef.current['add_new_button'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['filter_button'] !== undefined &&
      commonElementsRef.current['filter_button'] !== null
    ) {
      commonElementsRef.current['filter_button'].style.backgroundColor = null;
      commonElementsRef.current['filter_button'].style.outlineColor = null;
      commonElementsRef.current['filter_button'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['search_bar'] !== undefined &&
      commonElementsRef.current['search_bar'] !== null
    ) {
      commonElementsRef.current['search_bar'].style.backgroundColor = null;
      commonElementsRef.current['search_bar'].style.outlineColor = null;
      commonElementsRef.current['search_bar'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['split_toggle_button'] !== undefined &&
      commonElementsRef.current['split_toggle_button'] !== null
    ) {
      commonElementsRef.current['split_toggle_button'].style.backgroundColor = null;
      commonElementsRef.current['split_toggle_button'].style.outlineColor = null;
      commonElementsRef.current['split_toggle_button'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['more_button'] !== undefined &&
      commonElementsRef.current['more_button'] !== null
    ) {
      commonElementsRef.current['more_button'].style.backgroundColor = null;
      commonElementsRef.current['more_button'].style.outlineColor = null;
      commonElementsRef.current['more_button'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['select_payee'] !== undefined &&
      commonElementsRef.current['select_payee'] !== null
    ) {
      commonElementsRef.current['select_payee'].style.backgroundColor = null;
      commonElementsRef.current['select_payee'].style.outlineColor = null;
      commonElementsRef.current['select_payee'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['select_category'] !== undefined &&
      commonElementsRef.current['select_category'] !== null
    ) {
      commonElementsRef.current['select_category'].style.backgroundColor = null;
      commonElementsRef.current['select_category'].style.outlineColor = null;
      commonElementsRef.current['select_category'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['payment_input'] !== undefined &&
      commonElementsRef.current['payment_input'] !== null
    ) {
      commonElementsRef.current['payment_input'].style.backgroundColor = null;
      commonElementsRef.current['payment_input'].style.outlineColor = null;
      commonElementsRef.current['payment_input'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['deposit_input'] !== undefined &&
      commonElementsRef.current['deposit_input'] !== null
    ) {
      commonElementsRef.current['deposit_input'].style.backgroundColor = null;
      commonElementsRef.current['deposit_input'].style.outlineColor = null;
      commonElementsRef.current['deposit_input'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['cleared_status_icon'] !== undefined &&
      commonElementsRef.current['cleared_status_icon'] !== null
    ) {
      commonElementsRef.current['cleared_status_icon'].style.backgroundColor = null;
      commonElementsRef.current['cleared_status_icon'].style.outlineColor = null;
      commonElementsRef.current['cleared_status_icon'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['budget_table'] !== undefined &&
      commonElementsRef.current['budget_table'] !== null
    ) {
      commonElementsRef.current['budget_table'].style.backgroundColor = null;
      commonElementsRef.current['budget_table'].style.outlineColor = null;
      commonElementsRef.current['budget_table'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['calendar_icons'] !== undefined &&
      commonElementsRef.current['calendar_icons'] !== null
    ) {
      commonElementsRef.current['calendar_icons'].style.backgroundColor = null;
      commonElementsRef.current['calendar_icons'].style.outlineColor = null;
      commonElementsRef.current['calendar_icons'].style.outlineStyle = null;
    }


    if (
      commonElementsRef.current['months_band'] !== undefined &&
      commonElementsRef.current['months_band'] !== null
    ) {
      commonElementsRef.current['months_band'].style.backgroundColor = null;
      commonElementsRef.current['months_band'].style.outlineColor = null;
      commonElementsRef.current['months_band'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['budget_header'] !== undefined &&
      commonElementsRef.current['budget_header'] !== null
    ) {
      commonElementsRef.current['budget_header'].style.backgroundColor = null;
      commonElementsRef.current['budget_header'].style.outlineColor = null;
      commonElementsRef.current['budget_header'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['budgeted_column'] !== undefined &&
      commonElementsRef.current['budgeted_column'] !== null
    ) {
      commonElementsRef.current['budgeted_column'].style.backgroundColor = null;
      commonElementsRef.current['budgeted_column'].style.outlineColor = null;
      commonElementsRef.current['budgeted_column'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['spent_column'] !== undefined &&
      commonElementsRef.current['spent_column'] !== null
    ) {
      commonElementsRef.current['spent_column'].style.backgroundColor = null;
      commonElementsRef.current['spent_column'].style.outlineColor = null;
      commonElementsRef.current['spent_column'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['balance_column'] !== undefined &&
      commonElementsRef.current['balance_column'] !== null
    ) {
      commonElementsRef.current['balance_column'].style.backgroundColor = null;
      commonElementsRef.current['balance_column'].style.outlineColor = null;
      commonElementsRef.current['balance_column'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['category_column'] !== undefined &&
      commonElementsRef.current['category_column'] !== null
    ) {
      commonElementsRef.current['category_column'].style.backgroundColor = null;
      commonElementsRef.current['category_column'].style.outlineColor = null;
      commonElementsRef.current['category_column'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['received_column'] !== undefined &&
      commonElementsRef.current['received_column'] !== null
    ) {
      commonElementsRef.current['received_column'].style.backgroundColor = null;
      commonElementsRef.current['received_column'].style.outlineColor = null;
      commonElementsRef.current['received_column'].style.outlineStyle = null;
    }

    if (
      commonElementsRef.current['budget_more_button'] !== undefined &&
      commonElementsRef.current['budget_more_button'] !== null
    ) {
      commonElementsRef.current['budget_more_button'].style.backgroundColor = null;
      commonElementsRef.current['budget_more_button'].style.outlineColor = null;
      commonElementsRef.current['budget_more_button'].style.outlineStyle = null;
    }


    // so this one is different when we refactor.
    if (
      commonElementsRef.current['zoom_link'] !== undefined &&
      commonElementsRef.current['zoom_link'] !== null
    ) {
      commonElementsRef.current['zoom_link'].style.outlineColor = null;
      commonElementsRef.current['zoom_link'].style.outlineStyle = null;
    }

        // so this one is different when we refactor.
    if (
      commonElementsRef.current['save_transaction'] !== undefined &&
      commonElementsRef.current['save_transaction'] !== null
    ) {
      commonElementsRef.current['save_transaction'].style.outlineColor = null;
      commonElementsRef.current['save_transaction'].style.outlineStyle = null;
    }


    // so this one is different when we refactor.
    if (
      commonElementsRef.current['budget_name'] !== undefined &&
      commonElementsRef.current['budget_name'] !== null
    ) {
      commonElementsRef.current['budget_name'].style.outlineColor = null;
      commonElementsRef.current['budget_name'].style.outlineStyle = null;
    }

    // so this one is different when we refactor.
    if (
      commonElementsRef.current['add_account'] !== undefined &&
      commonElementsRef.current['add_account'] !== null
    ) {
      commonElementsRef.current['add_account'].style.outlineColor = null;
      commonElementsRef.current['add_account'].style.outlineStyle = null;
    }

    // so this one is different when we refactor.
    if (
      commonElementsRef.current['budget_button'] !== undefined &&
      commonElementsRef.current['budget_button'] !== null
    ) {
      //commonElementsRef.current['budget_button'].style.backgroundColor = null;
    }

    //The code to set the style is below and we don't want to edit the state for it. So this stops that for now.
    //But maybe this should be on for when you switch contexts and want it to be in a different place... but I guess the highlighting wouldn't work?
    //Idk.
    if (dialogue.context !== context && dialogue.context !== "Anywhere") {
      return;
    }

    //only do the move to actions here:

    let action = dialogue.action;


    if (action !== undefined && action !== null) {
      action = action.replaceAll("highlight: ", "move_to: ");

      console.log("I should do this:" + action);
      if (action === "move_to: zoom_link") {
        if (
          commonElementsRef.current['zoom_link'] !== undefined &&
          commonElementsRef.current['zoom_link'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['zoom_link'].getBoundingClientRect();
          const centerY = t;
          setTop(centerY - 33 + yOffset);
          setLeft(14 + xOffset);
          setOffset(0);

          commonElementsRef.current['zoom_link'].style.outlineColor = "yellow";
          commonElementsRef.current['zoom_link'].style.outlineStyle = "dashed";
          commonElementsRef.current['zoom_link'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: center_screen") {
        setTop(window.innerHeight - 20);
        setLeft(window.innerWidth - 20 - 240);
        setOffset(100);
      }
      else if (action === "move_to: budget_name") {

        if (
          commonElementsRef.current['budget_name'] !== undefined &&
          commonElementsRef.current['budget_name'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['budget_name'].getBoundingClientRect();
          const centerY = t;
          setTop(10 + yOffset);
          setLeft(10 + xOffset);
          setOffset(0);

          commonElementsRef.current['budget_name'].style.outlineColor = "yellow";
          commonElementsRef.current['budget_name'].style.outlineStyle = "dashed";
          commonElementsRef.current['budget_name'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }


      }
      else if (action === "move_to: add_account") {
        if (
          commonElementsRef.current['add_account'] !== undefined &&
          commonElementsRef.current['add_account'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['add_account'].getBoundingClientRect();
          const centerY = t;
          setTop(centerY - 25 + yOffset);
          setLeft(l + 10 + xOffset);
          setOffset(0);

          commonElementsRef.current['add_account'].style.outlineColor = "yellow";
          commonElementsRef.current['add_account'].style.outlineStyle = "dashed";
          commonElementsRef.current['add_account'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: account_balance") {
        if (
          commonElementsRef.current['account_balance'] !== undefined &&
          commonElementsRef.current['account_balance'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['account_balance'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['account_balance'].offsetHeight;
          setTop(centerY + 10);
          setLeft(l - 240);
          setOffset(0);

          commonElementsRef.current['account_balance'].style.backgroundColor = "yellow";
          commonElementsRef.current['account_balance'].style.outlineColor = "black";
          commonElementsRef.current['account_balance'].style.outlineStyle = "dashed";
          commonElementsRef.current['account_balance'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: import_button") {
        if (
          commonElementsRef.current['import_button'] !== undefined &&
          commonElementsRef.current['import_button'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['import_button'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['import_button'].offsetHeight;
          setTop(centerY + 10);
          setLeft(l - 240);
          setOffset(0);

          commonElementsRef.current['import_button'].style.backgroundColor = "yellow";
          commonElementsRef.current['import_button'].style.outlineColor = "black";
          commonElementsRef.current['import_button'].style.outlineStyle = "dashed";
          commonElementsRef.current['import_button'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: add_new_button") {
        if (
          commonElementsRef.current['add_new_button'] !== undefined &&
          commonElementsRef.current['add_new_button'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['add_new_button'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['add_new_button'].offsetHeight;
          setTop(centerY + 10);
          setLeft(l - 240);
          setOffset(0);

          commonElementsRef.current['add_new_button'].style.backgroundColor = "yellow";
          commonElementsRef.current['add_new_button'].style.outlineColor = "black";
          commonElementsRef.current['add_new_button'].style.outlineStyle = "dashed";
          commonElementsRef.current['add_new_button'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: filter_button") {
        if (
          commonElementsRef.current['filter_button'] !== undefined &&
          commonElementsRef.current['filter_button'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['filter_button'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['filter_button'].offsetHeight;
          setTop(centerY - 100);
          setLeft(l + commonElementsRef.current['filter_button'].offsetWidth - 240 + 10);
          setOffset(0);

          commonElementsRef.current['filter_button'].style.backgroundColor = "yellow";
          commonElementsRef.current['filter_button'].style.outlineColor = "black";
          commonElementsRef.current['filter_button'].style.outlineStyle = "dashed";
          commonElementsRef.current['filter_button'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: search_bar") {
        if (
          commonElementsRef.current['search_bar'] !== undefined &&
          commonElementsRef.current['search_bar'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['search_bar'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['search_bar'].offsetHeight;
          setTop(centerY + 10);
          setLeft(l - 240 - 100);
          setOffset(0);

          commonElementsRef.current['search_bar'].style.backgroundColor = "yellow";
          commonElementsRef.current['search_bar'].style.outlineColor = "black";
          commonElementsRef.current['search_bar'].style.outlineStyle = "dashed";
          commonElementsRef.current['search_bar'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: split_toggle_button") {
        if (
          commonElementsRef.current['split_toggle_button'] !== undefined &&
          commonElementsRef.current['split_toggle_button'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['split_toggle_button'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['split_toggle_button'].offsetHeight;
          setTop(centerY + 10);
          setLeft(l - 240 - 350);
          setOffset(0);

          commonElementsRef.current['split_toggle_button'].style.backgroundColor = "yellow";
          commonElementsRef.current['split_toggle_button'].style.outlineColor = "black";
          commonElementsRef.current['split_toggle_button'].style.outlineStyle = "dashed";
          commonElementsRef.current['split_toggle_button'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: more_button") {
        if (
          commonElementsRef.current['more_button'] !== undefined &&
          commonElementsRef.current['more_button'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['more_button'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['more_button'].offsetHeight;
          setTop(t - 100);
          setLeft(l - 240 - 420);
          setOffset(0);

          commonElementsRef.current['more_button'].style.backgroundColor = "yellow";
          commonElementsRef.current['more_button'].style.outlineColor = "black";
          commonElementsRef.current['more_button'].style.outlineStyle = "dashed";
          commonElementsRef.current['more_button'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: select_payee") {
        if (
          commonElementsRef.current['select_payee'] !== undefined &&
          commonElementsRef.current['select_payee'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['select_payee'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['select_payee'].offsetHeight;
          setTop(window.innerHeight - 20);
          setLeft(window.innerWidth - 20 - 240);
          setOffset(100);

          commonElementsRef.current['select_payee'].style.backgroundColor = "yellow";
          commonElementsRef.current['select_payee'].style.outlineColor = "black";
          commonElementsRef.current['select_payee'].style.outlineStyle = "dashed";
          commonElementsRef.current['select_payee'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: select_category") {
        if (
          commonElementsRef.current['select_category'] !== undefined &&
          commonElementsRef.current['select_category'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['select_category'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['select_category'].offsetHeight;
          setTop(window.innerHeight - 20);
          setLeft(window.innerWidth - 20 - 240);
          setOffset(100);

          commonElementsRef.current['select_category'].style.backgroundColor = "yellow";
          commonElementsRef.current['select_category'].style.outlineColor = "black";
          commonElementsRef.current['select_category'].style.outlineStyle = "dashed";
          commonElementsRef.current['select_category'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: payment_input") {
        if (
          commonElementsRef.current['payment_input'] !== undefined &&
          commonElementsRef.current['payment_input'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['payment_input'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['payment_input'].offsetHeight;
          setTop(window.innerHeight - 20);
          setLeft(window.innerWidth - 20 - 240);
          setOffset(100);

          commonElementsRef.current['payment_input'].style.backgroundColor = "yellow";
          commonElementsRef.current['payment_input'].style.outlineColor = "black";
          commonElementsRef.current['payment_input'].style.outlineStyle = "dashed";
          commonElementsRef.current['payment_input'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: deposit_input") {
        if (
          commonElementsRef.current['deposit_input'] !== undefined &&
          commonElementsRef.current['deposit_input'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['deposit_input'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['deposit_input'].offsetHeight;
          setTop(window.innerHeight - 20);
          setLeft(window.innerWidth - 20 - 240);
          setOffset(100);

          commonElementsRef.current['deposit_input'].style.backgroundColor = "yellow";
          commonElementsRef.current['deposit_input'].style.outlineColor = "black";
          commonElementsRef.current['deposit_input'].style.outlineStyle = "dashed";
          commonElementsRef.current['deposit_input'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: save_transaction") {
        if (
          commonElementsRef.current['save_transaction'] !== undefined &&
          commonElementsRef.current['save_transaction'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['save_transaction'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['save_transaction'].offsetHeight;
          setTop(window.innerHeight - 20);
          setLeft(window.innerWidth - 20 - 240);
          setOffset(100);

          commonElementsRef.current['save_transaction'].style.outlineColor = "yellow";
          commonElementsRef.current['save_transaction'].style.outlineStyle = "dashed";
          commonElementsRef.current['save_transaction'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: cleared_status_icon") {
        if (
          commonElementsRef.current['cleared_status_icon'] !== undefined &&
          commonElementsRef.current['cleared_status_icon'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['cleared_status_icon'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['cleared_status_icon'].offsetHeight;
          setTop(window.innerHeight - 20);
          setLeft(window.innerWidth - 20 - 240);
          setOffset(100);

          commonElementsRef.current['cleared_status_icon'].style.backgroundColor = "yellow";
          commonElementsRef.current['cleared_status_icon'].style.outlineColor = "black";
          commonElementsRef.current['cleared_status_icon'].style.outlineStyle = "dashed";
          commonElementsRef.current['cleared_status_icon'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: months_band") {
        if (
          commonElementsRef.current['months_band'] !== undefined &&
          commonElementsRef.current['months_band'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['months_band'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['months_band'].offsetHeight;
          const centerX = l + (commonElementsRef.current['months_band'].offsetWidth / 2);
          setTop(centerY + 10 - 35);
          setLeft(centerX - 200 - 240);
          setOffset(0);

          commonElementsRef.current['months_band'].style.backgroundColor = "yellow";
          commonElementsRef.current['months_band'].style.outlineColor = "black";
          commonElementsRef.current['months_band'].style.outlineStyle = "dashed";
          commonElementsRef.current['months_band'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }

      }
      else if (action === "move_to: calendar_icons") {
        if (
          commonElementsRef.current['calendar_icons'] !== undefined &&
          commonElementsRef.current['calendar_icons'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['calendar_icons'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['calendar_icons'].offsetHeight;
          setTop(0);
          setLeft(3);
          setOffset(0);

          commonElementsRef.current['calendar_icons'].style.backgroundColor = "yellow";
          commonElementsRef.current['calendar_icons'].style.outlineColor = "black";
          commonElementsRef.current['calendar_icons'].style.outlineStyle = "dashed";
          commonElementsRef.current['calendar_icons'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: budget_header") {
        if (
          commonElementsRef.current['budget_header'] !== undefined &&
          commonElementsRef.current['budget_header'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['budget_header'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['budget_header'].offsetHeight;
          const centerX = l + (commonElementsRef.current['budget_header'].offsetWidth / 2);
          setTop(centerY + 10 - 35);
          setLeft(centerX - 200 - 240);
          setOffset(0);

          commonElementsRef.current['budget_header'].style.backgroundColor = "yellow";
          commonElementsRef.current['budget_header'].style.outlineColor = "black";
          commonElementsRef.current['budget_header'].style.outlineStyle = "dashed";
          commonElementsRef.current['budget_header'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }

      }
      else if (action === "move_to: budget_table") {
        if (
          commonElementsRef.current['budget_table'] !== undefined &&
          commonElementsRef.current['budget_table'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['budget_table'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['budget_table'].offsetHeight;
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);

          commonElementsRef.current['budget_table'].style.backgroundColor = "yellow";
          commonElementsRef.current['budget_table'].style.outlineColor = "black";
          commonElementsRef.current['budget_table'].style.outlineStyle = "dashed";
          commonElementsRef.current['budget_table'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: category_column") {
        if (
          commonElementsRef.current['category_column'] !== undefined &&
          commonElementsRef.current['category_column'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['category_column'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['category_column'].offsetHeight;
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);

          commonElementsRef.current['category_column'].style.backgroundColor = "yellow";
          commonElementsRef.current['category_column'].style.outlineColor = "black";
          commonElementsRef.current['category_column'].style.outlineStyle = "dashed";
          commonElementsRef.current['category_column'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: budgeted_column") {
        if (
          commonElementsRef.current['budgeted_column'] !== undefined &&
          commonElementsRef.current['budgeted_column'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['budgeted_column'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['budgeted_column'].offsetHeight;
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);

          commonElementsRef.current['budgeted_column'].style.backgroundColor = "yellow";
          commonElementsRef.current['budgeted_column'].style.outlineColor = "black";
          commonElementsRef.current['budgeted_column'].style.outlineStyle = "dashed";
          commonElementsRef.current['budgeted_column'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }
      }
      else if (action === "move_to: spent_column") {
        if (
          commonElementsRef.current['spent_column'] !== undefined &&
          commonElementsRef.current['spent_column'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['spent_column'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['spent_column'].offsetHeight;
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);

          commonElementsRef.current['spent_column'].style.backgroundColor = "yellow";
          commonElementsRef.current['spent_column'].style.outlineColor = "black";
          commonElementsRef.current['spent_column'].style.outlineStyle = "dashed";
          commonElementsRef.current['spent_column'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }

      }
      else if (action === "move_to: balance_column") {
        if (
          commonElementsRef.current['balance_column'] !== undefined &&
          commonElementsRef.current['balance_column'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['balance_column'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['balance_column'].offsetHeight;
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);

          commonElementsRef.current['balance_column'].style.backgroundColor = "yellow";
          commonElementsRef.current['balance_column'].style.outlineColor = "black";
          commonElementsRef.current['balance_column'].style.outlineStyle = "dashed";
          commonElementsRef.current['balance_column'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }

      }
      else if (action === "move_to: received_column") {
        if (
          commonElementsRef.current['received_column'] !== undefined &&
          commonElementsRef.current['received_column'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['received_column'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['received_column'].offsetHeight;
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);

          commonElementsRef.current['received_column'].style.backgroundColor = "yellow";
          commonElementsRef.current['received_column'].style.outlineColor = "black";
          commonElementsRef.current['received_column'].style.outlineStyle = "dashed";
          commonElementsRef.current['received_column'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }

      }

      else if (action === "move_to: budget_more_button") {
        if (
          commonElementsRef.current['budget_more_button'] !== undefined &&
          commonElementsRef.current['budget_more_button'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['budget_more_button'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['budget_more_button'].offsetHeight;
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);

          commonElementsRef.current['budget_more_button'].style.backgroundColor = "yellow";
          commonElementsRef.current['budget_more_button'].style.outlineColor = "black";
          commonElementsRef.current['budget_more_button'].style.outlineStyle = "dashed";
          commonElementsRef.current['budget_more_button'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20 + yOffset);
          setLeft(window.innerWidth - 20 - 240 + xOffset);
          setOffset(100);
        }

      }









      //would be great to highlight these too...




    } 

  }


  function evaluate(item) {
    let variable = item.variable;
    let value = item.value;

    if (variable !== undefined && variable !== null && value !== undefined && value !== null) {

      console.log ("EVAL: " + variable + " = " + value + " state:" + coachState[variable]);

      return coachState[variable] === value;
    } else {

      // ors only for now:

      let or = item.or;

      if (or !== undefined && or !== null) {
        let passes = false;
        for (let i = 0; i < item.or.length; i++) {
          let stuff = item.or[i];
          if (evaluate(stuff) === true) {
            passes = true;
          }
        }

        return passes;
      }
    }

    return false;
  }



  async function moveTo(id) {
    await timeout(250); // it is a race condition still then, ugh.
    if (
      categoriesRef.current[id] !== undefined &&
      categoriesRef.current[id] !== null
    ) {
      const { top: t, left: l } =
        categoriesRef.current[id].getBoundingClientRect();
      const centerY = t + categoriesRef.current[id].offsetHeight / 2;
      setTop(centerY - 50 - 30 - 5);
      setLeft(l + categoriesRef.current[id].offsetWidth - 240);
      setOffset(0);
    } else {
      setTop(0);
      setLeft(100);
      setOffset(0);
    }
  }

  function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
  }

  //const [left, setLeft] = useState(0);
  //maybe useEffect is how this should be done? And that covers window resizing too.
  let style = {
    position: 'absolute',
    left: left,
    top: top,
    zIndex: 10001,
    transform: `translate(-${offset}%,-${offset}%)`,
  };


// transition: 'all 0.3s ease',

  let content;

  let dialogue = null;
  let pastDialogue = undefined;

  let conversation = allConversations.get(openConversation);
  if (conversation != null) {
    let ds = dialogueStacks[openConversation];
    if (ds != null) {
      if (ds.length > 0) {
        dialogue = conversation.dialogues.get(ds[ds.length-1]);
      }
      if (ds.length > 1) {
        pastDialogue = conversation.dialogues.get(ds[ds.length-2]);
      }
    }
  }

   //allDialogues.get(dialogueStack[dialogueStack.length-1]);

  console.log(dialogue);
  if (dialogue != null) {


    highlight(dialogue);


    if (dialogue.context !== context && dialogue.context !== "Anywhere") {

      let dialogueText = "" 




// UM WOW this is the basis for moving all of this to the point of render, solves a lot of our weird issues where we were setting it up top.

      if (dialogue.context === "Accounts") {

        dialogueText = "Please navigate to " + dialogue.context + " to continue our conversation (select an account to the left to continue).";


        const { top: t, left: l } =
          commonElementsRef.current['all_accounts'].getBoundingClientRect();
        const centerY = t;




        style = {
          position: 'absolute',
          left: l + 10,
          top: centerY - 25 - 5 - 27,
          zIndex: 10001,
          transform: `translate(0%,0%)`,
        };


      } else if (dialogue.context === "Budget") {

        dialogueText = "Please navigate to the " + dialogue.context + " to continue our conversation (select Budget to the left to continue).";

        const { top: t, left: l } =
          commonElementsRef.current['budget_button'].getBoundingClientRect();
        const centerY = t;

        style = {
          position: 'absolute',
          left: l + 10,
          top: centerY - 25 - 5,
          zIndex: 10001,
          transform: `translate(0%,0%)`,
        };

      }

      content = (
        <div>
          {dialogueText}
        </div>
      );

    } else {

      let dialogueText = dialogue.text;

      let sIndex = dialogueText.indexOf("[[") + 2; 
      let tIndex = dialogueText.indexOf("]]"); 

      if (sIndex !== null && sIndex !== undefined && tIndex !== null && tIndex !== undefined) {
        console.log("I found a substring to replace");
        let substringToReplace = dialogueText.substring(sIndex, tIndex);
        console.log(substringToReplace);

        let replacement = coachState[substringToReplace];
        if (replacement !== null && replacement !== undefined) {
          console.log("And the value for it:");
          console.log(replacement);

          dialogueText = dialogueText.replace("[[" + substringToReplace + "]]", replacement);
          console.log("So here is the new text:");
          console.log(dialogueText);

        } else if (substringToReplace == "user_first_name") {
          let userFirstName = REACT_APP_USER_FIRST_NAME
          if (userFirstName !== null && userFirstName !== undefined) {
            dialogueText = dialogueText.replace("[[" + substringToReplace + "]]", userFirstName);
          }
          console.log("And no value found for it.");
        }
      }


      //again, LOLZ
      sIndex = dialogueText.indexOf("[[") + 2; 
      tIndex = dialogueText.indexOf("]]"); 

      if (sIndex !== null && sIndex !== undefined && tIndex !== null && tIndex !== undefined) {
        console.log("I found a substring to replace");
        let substringToReplace = dialogueText.substring(sIndex, tIndex);
        console.log(substringToReplace);

        let replacement = coachState[substringToReplace];
        if (replacement !== null && replacement !== undefined) {
          console.log("And the value for it:");
          console.log(replacement);

          dialogueText = dialogueText.replace("[[" + substringToReplace + "]]", replacement);
          console.log("So here is the new text:");
          console.log(dialogueText);

        } else if (substringToReplace == "user_first_name") {
          let userFirstName = REACT_APP_USER_FIRST_NAME
          if (userFirstName !== null && userFirstName !== undefined) {
            dialogueText = dialogueText.replace("[[" + substringToReplace + "]]", userFirstName);
          }
          console.log("And no value found for it.");
        }
      }




      let backContent;
      if (pastDialogue !== undefined) {
        backContent = (
          <div>
            <Button
              type="normal"
              style={{ marginTop: 8 }}
              onClick={() => back()}
            >
              Back
            </Button>
          </div>
        );
      } else {
        backContent = (
          <div>
          </div>
        );
      }


      let gifContent;
      if (dialogue.gif !== undefined) {
        let stringgg = "https://media.giphy.com/media/" + dialogue.gif + "/giphy.gif"
        gifContent = (
          <img src={stringgg} width="100%" style={{ marginTop: 8 }} alt="gif" />
        );
      } else {
        gifContent = (
          <div>
          </div>
        );
      }

      if (dialogue.dialogueOptions.length === 1) {
        let isInput = false;

        let variableToSet = dialogue.dialogueOptions[0].variableToSet;
        let valueToSet = dialogue.dialogueOptions[0].valueToSet;

        if (variableToSet !== undefined && variableToSet !== null && valueToSet !== undefined && valueToSet !== null) {
          if (valueToSet.startsWith('[')) {
            isInput = true;
          }
        }

        if (isInput === false) {
          content = (
            <div>
              <div dangerouslySetInnerHTML={{__html: dialogueText}}></div>
              {gifContent}
             <Button
                type="primary"
                style={{ marginTop: 8 }}
                onClick={() => performDialogueOption(dialogue.dialogueOptions[0])}
              >
                {dialogue.dialogueOptions[0].text}
              </Button>
              {backContent}
            </div>
          );
        } else {
          content = (
            <div>
              <div dangerouslySetInnerHTML={{__html: dialogueText}}></div>
              {gifContent}
              <BigInput
                autoFocus={true}
                placeholder=""
                value={currentInput || ''}
                onUpdate={setCurrentInput}
                style={{ flex: 1, marginRight: 10 }}
              />

              <Button
                type="primary"
                style={{ marginTop: 8 }}
                onClick={() => performDialogueOption(dialogue.dialogueOptions[0])}
              >
                {dialogue.dialogueOptions[0].text}
              </Button>
              {backContent}
            </div>
          );
        }

      } else if (dialogue.dialogueOptions.length === 2) {
        content = (
          <div>
            <div dangerouslySetInnerHTML={{__html: dialogueText}}></div>
            {gifContent}
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[0])}
            >
              {dialogue.dialogueOptions[0].text}
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[1])}
            >
              {dialogue.dialogueOptions[1].text}
            </Button>
            {backContent}
          </div>
        );
      } else if (dialogue.dialogueOptions.length === 3) {
        content = (
          <div>
            <div dangerouslySetInnerHTML={{__html: dialogueText}}></div>
            {gifContent}
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[0])}
            >
              {dialogue.dialogueOptions[0].text}
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[1])}
            >
              {dialogue.dialogueOptions[1].text}
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[2])}
            >
              {dialogue.dialogueOptions[2].text}
            </Button>
            {backContent}
          </div>
        );
      } else if (dialogue.dialogueOptions.length === 4) {
        content = (
          <div>
            <div dangerouslySetInnerHTML={{__html: dialogueText}}></div>
            {gifContent}
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[0])}
            >
              {dialogue.dialogueOptions[0].text}
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[1])}
            >
              {dialogue.dialogueOptions[1].text}
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[2])}
            >
              {dialogue.dialogueOptions[2].text}
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[3])}
            >
              {dialogue.dialogueOptions[3].text}
            </Button>
            {backContent}
          </div>
        );
      } else if (dialogue.dialogueOptions.length === 5) {
        content = (
          <div>
            <div dangerouslySetInnerHTML={{__html: dialogueText}}></div>
            {gifContent}
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[0])}
            >
              {dialogue.dialogueOptions[0].text}
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[1])}
            >
              {dialogue.dialogueOptions[1].text}
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[2])}
            >
              {dialogue.dialogueOptions[2].text}
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[3])}
            >
              {dialogue.dialogueOptions[3].text}
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[4])}
            >
              {dialogue.dialogueOptions[4].text}
            </Button>
            {backContent}
          </div>
        );
      }else if (dialogue.dialogueOptions.length === 6) {
        content = (
          <div>
            <div dangerouslySetInnerHTML={{__html: dialogueText}}></div>
            {gifContent}
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[0])}
            >
              {dialogue.dialogueOptions[0].text}
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[1])}
            >
              {dialogue.dialogueOptions[1].text}
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[2])}
            >
              {dialogue.dialogueOptions[2].text}
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[3])}
            >
              {dialogue.dialogueOptions[3].text}
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[4])}
            >
              {dialogue.dialogueOptions[4].text}
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={() => performDialogueOption(dialogue.dialogueOptions[5])}
            >
              {dialogue.dialogueOptions[5].text}
            </Button>
            {backContent}
          </div>
        );
      } else {
        content = (
          <div>
            <div dangerouslySetInnerHTML={{__html: dialogueText}}></div>
            {gifContent}
            {backContent}
          </div>
        );
      }
    }


  } 

  let imgSrc = "/coach-icon-" + REACT_APP_COACH + "-200x200.png";

  if (content === undefined) {
    return (
      <View>
      </View>
    );
  } else {
    return (
      <View>
        <View style={style}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100px',
                height: '100px',
              }}
            >

              <img
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50px',
                }}
                src={imgSrc}
                alt="coach"
              />
              <Button
                type="bare"
                style={{ marginTop: -105, marginLeft: -5, opacity: .5 }}
                onClick={() => setOpenConversation(null)}
              >
                <SvgClose width={10} height={10} />
              </Button>

            </div>
            

            <Card
              style={{
                marginTop: 7,
                marginBottom: 7,
                paddingLeft: 10,
                paddingTop: 8,
                paddingRight: 10,
                paddingBottom: 8,
                width: '300px',
              }}
            >
              {content}
            </Card>
          </div>
        </View>
      </View>
    );
  }

}