import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

//import { useActions } from '../hooks/useActions';

import Button from '../common/Button';
import Card from '../common/Card';
import View from '../common/View';
//import Dialogue from './Dialogue';
//import { kristinwade } from './kristinwade';
import { BigInput } from '../common/Input';

let CoachContext = createContext();

export function CoachProvider({ budgetId, allDialogues, initialDialogueId, children }) {
  let [top, setTop] = useState(window.innerHeight - 20);
  let [left, setLeft] = useState(window.innerWidth - 20 - 240);
  let [offset, setOffset] = useState(100);
  let categoriesCoachRef = useRef([]);

  let commonElementsRef = useRef([]);


  let dialogueId_key = "dialogueId_" + budgetId

  let nickSmith_myBudgetCoachReason_key = "nickSmith_myBudgetCoachReason_" + budgetId
  let nickSmith_accountStructure_key = "nickSmith_accountStructure_" + budgetId
  let nickSmith_budgetWithPartner_key = "nickSmith_budgetWithPartner_" + budgetId
  let nickSmith_moreCardsCount_key = "nickSmith_moreCardsCount_" + budgetId
  let nickSmith_currentBalanceCalculation_key = "nickSmith_currentBalanceCalculation_" + budgetId
  let nickSmith_runningBalance_key = "nickSmith_runningBalance_" + budgetId
  //a lot of these need to be per account as well.

  let storedId = localStorage.getItem(dialogueId_key);
  if (storedId === undefined || storedId === null) {
    storedId = initialDialogueId;
  }

  let [dialogueId, setDialogueId] = useState(storedId);

  let [dialogueStack, setDialogueStack] = useState([]);
  let [topStack, setTopStack] = useState([]);
  let [leftStack, setLeftStack] = useState([]);
  let [offsetStack, setOffsetStack] = useState([]);


  let [nickSmith_myBudgetCoachReason, setNickSmith_myBudgetCoachReason] = useState(localStorage.getItem(nickSmith_myBudgetCoachReason_key) ?? '');
  let [nickSmith_accountStructure, setNickSmith_accountStructure] = useState(localStorage.getItem(nickSmith_accountStructure_key) ?? '');
  let [nickSmith_budgetWithPartner, setNickSmith_budgetWithPartner] = useState(localStorage.getItem(nickSmith_budgetWithPartner_key) ?? '');
  let [nickSmith_moreCardsCount, setNickSmith_moreCardsCount] = useState(localStorage.getItem(nickSmith_moreCardsCount_key) ?? '');
  let [nickSmith_currentBalanceCalculation, setNickSmith_currentBalanceCalculation] = useState(localStorage.getItem(nickSmith_currentBalanceCalculation_key) ?? '');
  let [nickSmith_runningBalance, setNickSmith_runningBalance] = useState(localStorage.getItem(nickSmith_runningBalance_key) ?? '');

  let coachState_key = "coachState_" + process.env.REACT_APP_COACH + "_" + budgetId

  let newObject = JSON.parse(localStorage.getItem(coachState_key));

  let [coachState, setCoachState] = useState(newObject ?? {});

  const resetCoach = () => {
    console.log('reseeeeeeet');
    localStorage.removeItem(dialogueId_key);
    localStorage.removeItem(nickSmith_myBudgetCoachReason_key);
    localStorage.removeItem(nickSmith_accountStructure_key);
    localStorage.removeItem(nickSmith_budgetWithPartner_key);
    localStorage.removeItem(nickSmith_moreCardsCount_key);
    localStorage.removeItem(nickSmith_currentBalanceCalculation_key);
    localStorage.removeItem(nickSmith_runningBalance_key);

    localStorage.removeItem(coachState_key);
  };

  useEffect(() => {
    localStorage.setItem(dialogueId_key, dialogueId);
  }, [dialogueId]);

  useEffect(() => {
    localStorage.setItem(nickSmith_myBudgetCoachReason_key, nickSmith_myBudgetCoachReason);
  }, [nickSmith_myBudgetCoachReason]);

  useEffect(() => {
    localStorage.setItem(nickSmith_accountStructure_key, nickSmith_accountStructure);
  }, [nickSmith_accountStructure]);

  useEffect(() => {
    localStorage.setItem(nickSmith_budgetWithPartner_key, nickSmith_budgetWithPartner);
  }, [nickSmith_budgetWithPartner]);

  useEffect(() => {
    localStorage.setItem(nickSmith_moreCardsCount_key, nickSmith_moreCardsCount);
  }, [nickSmith_moreCardsCount]);

  useEffect(() => {
    localStorage.setItem(nickSmith_currentBalanceCalculation_key, nickSmith_currentBalanceCalculation);
  }, [nickSmith_currentBalanceCalculation]);

  useEffect(() => {
    localStorage.setItem(nickSmith_runningBalance_key, nickSmith_runningBalance);
  }, [nickSmith_runningBalance]);

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
        dialogueId,
        setDialogueId,
        categoriesCoachRef,
        commonElementsRef,
        nickSmith_myBudgetCoachReason,
        setNickSmith_myBudgetCoachReason,
        nickSmith_accountStructure,
        setNickSmith_accountStructure,
        nickSmith_budgetWithPartner,
        setNickSmith_budgetWithPartner,
        nickSmith_moreCardsCount,
        setNickSmith_moreCardsCount,
        nickSmith_currentBalanceCalculation,
        setNickSmith_currentBalanceCalculation,
        nickSmith_runningBalance,
        setNickSmith_runningBalance,
        allDialogues,
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
    dialogueId,
    setDialogueId,
    categoriesCoachRef,
    commonElementsRef,
    nickSmith_myBudgetCoachReason,
    setNickSmith_myBudgetCoachReason,
    nickSmith_accountStructure,
    setNickSmith_accountStructure,
    nickSmith_budgetWithPartner,
    setNickSmith_budgetWithPartner,
    nickSmith_moreCardsCount,
    setNickSmith_moreCardsCount,
    nickSmith_currentBalanceCalculation,
    setNickSmith_currentBalanceCalculation,
    nickSmith_runningBalance,
    setNickSmith_runningBalance,
    allDialogues,
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
  } = useCoach();


  // if (dialogueId === undefined) {
  // }
  // setDialogueId(initialDialogueId);


  // parse this thing to make all the dialogues only...

  //mxfile -> diagram -> mxGraphModel -> root -> mxCell (style="rounded=0) -> value




  //then loop it again for arrows to make connections, that would give us a back and forward too...






  //const { createGroup } = useActions();
  let typeALevel = null;

  const onMouseOverCaptureHandler = () => {
    console.log('onMouseOverCapture Event!');
  };

  const addBillsCategoryGroupLevel0 = () => {
    typeALevel = 0;
    addBillsCategoryGroup();
  };

  const addBillsCategoryGroupLevel1 = () => {
    typeALevel = 1;
    addBillsCategoryGroup();
  };

  const addBillsCategoryGroupLevel2 = () => {
    typeALevel = 2;
    addBillsCategoryGroup();
  };

  const addBillsCategoryGroup = async () => {
    let group = { id: 'new', name: 'Bills' };

    let id = await onSaveGroup(group);
    await moveTo(id);

    setDialogueId('nicktrue_3');
  };

  const setupAsRenter = async () => {
    let group = categoryGroups.find(g => g.name === 'Bills');

    let category = {
      name: 'Utilities',
      cat_group: group.id,
      is_income: false,
      id: 'new',
    };

    let id = await onSaveCategory(category, true);
    await moveTo(id);

    setDialogueId('nicktrue_4');
  };

  const setupAsOwner = async () => {
    let group = categoryGroups.find(g => g.name === 'Bills');

    let category = {
      name: '🏡 Mortgage',
      cat_group: group.id,
      is_income: false,
      id: 'new',
    };

    let id = await onSaveCategory(category);
    await moveTo(id);

    setDialogueId('nicktrue_escrow');
  };

  const showZoomCall = async () => {
    setTop(288);
    setLeft(10);
    setOffset(0);
    setDialogueId('nicksmith_2');
  };

  const nick3 = async () => {
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_3');
  };

  const nickSmithOption1 = async () => {
    setNickSmith_myBudgetCoachReason("notCloser");
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_6');
  };

  const nickSmithOption2 = async () => {
    setNickSmith_myBudgetCoachReason("newBudget");
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_6');
  };

  const nickSmithOption3 = async () => {
    setTop(10);
    setLeft(10);
    setOffset(0);
    setDialogueId('nicksmith_9');
  };

  const nickSmithOption4 = async () => {
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_10');
  };

  const nickSmithOption5 = async () => {
    setNickSmith_accountStructure("noCC");
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_12');
  };

  const nickSmithOption6 = async () => {
    setNickSmith_accountStructure("1and1");
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_12');
  };

  const nickSmithOption7 = async () => {
    setNickSmith_accountStructure("moreThanOneCC");
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_12');
  };

  const nickSmithOption8 = async () => {
    setNickSmith_budgetWithPartner("justMe");
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_13');
  };

  const nickSmithOption9 = async () => {
    setNickSmith_budgetWithPartner("jointConsolidated");
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_13');
  };

  const nickSmithOption10 = async () => {
    setNickSmith_budgetWithPartner("jointSeparate");
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_13');
  };

  const nickSmithCCCheck = async () => {
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    if (nickSmith_accountStructure === "noCC") {
      setDialogueId('nicksmith_wrap_accounts');
    } else {
      setDialogueId('nicksmith_cc_1');
    }
  };

  const moveToAccountCreate = async () => {
    setTop(242);
    setLeft(10);
    setOffset(0);
    setDialogueId('nicksmith_16');
  };

  const moveToAccountCreate2 = async () => {
    setTop(242);
    setLeft(10);
    setOffset(0);
    setDialogueId('nicksmith_cc_2');
  };

  const nickSmithCCCheck2 = async () => {
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    if (nickSmith_accountStructure === "1and1") {
      setDialogueId('nicksmith_wrap_accounts');
    } else {
      setDialogueId('nicksmith_multicc_1');
    }
  };

  const moveToAccountCreate3 = async () => {
    setTop(242);
    setLeft(10);
    setOffset(0);
    setDialogueId('nicksmith_multicc_7');
  };

  const nickSmithOptionMultiCC1 = async () => {
    setNickSmith_moreCardsCount("one");
    setDialogueId('nicksmith_multicc_3');
  };

  const nickSmithOptionMultiCC2 = async () => {
    setNickSmith_moreCardsCount("two");
    setDialogueId('nicksmith_multicc_4');
  };

  const nickSmithOptionMultiCC3 = async () => {
    setNickSmith_moreCardsCount("three_or_more");
    setDialogueId('nicksmith_multicc_5');
  };

  const nickSmithOptionMultiCC4 = async () => {
    setNickSmith_moreCardsCount("one");
    setDialogueId('nicksmith_multicc_3');
  };

  const nickSmithOptionMultiCC5 = async () => {
    setNickSmith_moreCardsCount("two_or_more");
    setDialogueId('nicksmith_multicc_4');
  };



  const nickSmithCCCheck3 = async () => {
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    if (nickSmith_moreCardsCount === "one") {
      if (nickSmith_budgetWithPartner === "jointConsolidated") {
        setDialogueId('nicksmith_wrap_accounts_jc');
      } else {
        setDialogueId('nicksmith_wrap_accounts');
      }
    } else if (nickSmith_moreCardsCount === "two") {
      setDialogueId('nicksmith_multicc_9');
    } else if (nickSmith_moreCardsCount === "two_or_more") {
      setDialogueId('nicksmith_multicc_9');
    } else if (nickSmith_moreCardsCount === "three_or_more") {
      setDialogueId('nicksmith_multicc_9');
    }
  };

  const moveToAccountCreate4 = async () => {
    setTop(242);
    setLeft(10);
    setOffset(0);
    setDialogueId('nicksmith_multicc_15');
  };

  const nickSmithCCCheck4 = async () => {
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    if (nickSmith_moreCardsCount === "two") {
      setDialogueId('nicksmith_multicc_11');
    } else if (nickSmith_moreCardsCount === "three_or_more") {
      setDialogueId('nicksmith_multicc_17');
    } else if (nickSmith_moreCardsCount === "two_or_more") {
      setDialogueId('nicksmith_multicc_17');
    }
  };

  const moveToAccountCreate5 = async () => {
    setTop(242);
    setLeft(10);
    setOffset(0);
    setDialogueId('nicksmith_multicc_21');
  };

  const nickSmithCCCheckNope = async () => {
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_multicc_22');
  };

  const nickSmithAN1 = async () => {
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_an_2');
  };

  const nickSmithAT1 = async () => {
    setTop(242);
    setLeft(10);
    setOffset(0);
    setDialogueId('nicksmith_at_2');
  };

  const nickSmithAT2 = async () => {
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_at_3');
  };

  const nickSmithACT1 = async () => {
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    if (nickSmith_accountStructure === "1and1" || nickSmith_accountStructure === "moreThanOneCC") {
      setDialogueId('nicksmith_act_1');
    } else {
      setDialogueId('');
    }
  };

  const nickSmithACT2 = async () => {
    setTop(242);
    setLeft(10);
    setOffset(0);
    setDialogueId('nicksmith_act_2');
  };

  const nickSmithACT3 = async () => {
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_act_3');
  };

  const nickSmithOptionVAB1 = async () => {
    setNickSmith_currentBalanceCalculation("yesPending");
    setDialogueId('nicksmith_vab_5');
  };

  const nickSmithOptionVAB2 = async () => {
    setNickSmith_currentBalanceCalculation("yesNoPending");
    setDialogueId('nicksmith_vab_24');
  };

  const nickSmithOptionVAB3 = async () => {
    setNickSmith_currentBalanceCalculation("no");
    setDialogueId('nicksmith_vab_29');
  };

  const nickSmithOptionNov1 = async () => {
    setNickSmith_currentBalanceCalculation("no");
    setDialogueId('nicksmith_vab_26');
  };

  const nickSmithOptionNov2 = async () => {
    setNickSmith_runningBalance("yes");
    setDialogueId('nicksmith_nov_1');
  };

  const nickSmithOptionNov3 = async () => {
    setNickSmith_runningBalance("no");
    setDialogueId('nicksmith_nov_2');
  };

  const nickSmithOptionNov4 = async () => {
    setNickSmith_currentBalanceCalculation("yesNoPending");
    setDialogueId('nicksmith_nov_4');
  };

  const nickSmithOptionNov5 = async () => {
    setNickSmith_currentBalanceCalculation("yesPending");
    setDialogueId('nicksmith_nov_5');
  };

  const nickSmithOptionNE1 = async () => {
    setDialogueId('nicksmith_dec_1');
  };


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
    let nextDialogue = allDialogues.get(nextId);

    performDialogue(nextDialogue);

  }

  //and writes need to be persisted now dynamic.
  //and everything should be prefixed too then I'd think.

  function back() {
    let pastDialogue = allDialogues.get(dialogueStack[dialogueStack.length-1]);
    let pastLeft = leftStack[leftStack.length-1];
    let pastTop = topStack[topStack.length-1];
    let pastOffset = offsetStack[offsetStack.length-1];
    setDialogueStack(dialogueStack.slice(0, -1));
    setLeftStack(leftStack.slice(0, -1));
    setTopStack(topStack.slice(0, -1));
    setOffsetStack(offsetStack.slice(0, -1));


    setTop(pastTop);
    setLeft(pastLeft);
    setOffset(pastOffset);
    performDialogue(pastDialogue, true);
  }

  async function performDialogue(dialogue, wasBackwards = false) {

    console.log("heyooo my dudes.");
    console.log(dialogue);

    //clear this out for now.
    setCurrentInput("");


    if (dialogue !== null && dialogue !== undefined) {



      if (dialogue.type === "autoPush") {

        // notice how none of this sets the actual setDialogueId because that would mess with back stack stuff, etc.
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

        let currentDialogueId = dialogueId;

        if (wasBackwards === false) {
          if (currentDialogueId !== null) {
            setDialogueStack([...dialogueStack, currentDialogueId]);
            setLeftStack([...leftStack, left]);
            setTopStack([...topStack, top]);
            setOffsetStack([...offsetStack, offset]);
          }
        }


        setDialogueId(dialogue.id);

        let action = dialogue.action;
        if (action !== undefined && action !== null) {


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
      }
    } else {
      setDialogueId(null);
    }

  }


  function moveToActions(dialogue) {

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
      console.log("I should do this:" + action);
      if (action === "move_to: zoom_link") {
        if (
          commonElementsRef.current['zoom_link'] !== undefined &&
          commonElementsRef.current['zoom_link'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['zoom_link'].getBoundingClientRect();
          const centerY = t;
          setTop(centerY - 25);
          setLeft(l + 10);
          setOffset(0);

          commonElementsRef.current['zoom_link'].style.outlineColor = "yellow";
          commonElementsRef.current['zoom_link'].style.outlineStyle = "dashed";
          commonElementsRef.current['zoom_link'].style.outlineWidth = 5;

        } else {
          setTop(0);
          setLeft(100);
          setOffset(0);
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
          setTop(10);
          setLeft(10);
          setOffset(0);

          commonElementsRef.current['budget_name'].style.outlineColor = "yellow";
          commonElementsRef.current['budget_name'].style.outlineStyle = "dashed";
          commonElementsRef.current['budget_name'].style.outlineWidth = 5;

        } else {
          setTop(10);
          setLeft(10);
          setOffset(0);
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
          setTop(centerY - 25);
          setLeft(l + 10);
          setOffset(0);

          commonElementsRef.current['add_account'].style.outlineColor = "yellow";
          commonElementsRef.current['add_account'].style.outlineStyle = "dashed";
          commonElementsRef.current['add_account'].style.outlineWidth = 5;

        } else {
          setTop(0);
          setLeft(100);
          setOffset(0);
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
          setTop(0);
          setLeft(100);
          setOffset(0);
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
          setTop(0);
          setLeft(100);
          setOffset(0);
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
          setTop(0);
          setLeft(100);
          setOffset(0);
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
          setTop(0);
          setLeft(100);
          setOffset(0);
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
          setTop(0);
          setLeft(100);
          setOffset(0);
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
          setTop(0);
          setLeft(100);
          setOffset(0);
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
          setTop(0);
          setLeft(100);
          setOffset(0);
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
          setTop(centerY + 10);
          setLeft(l - 240);
          setOffset(0);

          commonElementsRef.current['select_payee'].style.backgroundColor = "yellow";
          commonElementsRef.current['select_payee'].style.outlineColor = "black";
          commonElementsRef.current['select_payee'].style.outlineStyle = "dashed";
          commonElementsRef.current['select_payee'].style.outlineWidth = 5;

        } else {
          setTop(window.innerHeight - 20);
          setLeft(window.innerWidth - 20 - 240);
          setOffset(100);
        }
      }
      else if (action === "move_to: select_category") {
        setTop(window.innerHeight - 20);
        setLeft(window.innerWidth - 20 - 240);
        setOffset(100);
      }
      else if (action === "move_to: payment_input") {
        setTop(window.innerHeight - 20);
        setLeft(window.innerWidth - 20 - 240);
        setOffset(100);
      }
      else if (action === "move_to: save_transaction") {
        setTop(window.innerHeight - 20);
        setLeft(window.innerWidth - 20 - 240);
        setOffset(100);
      }
      else if (action === "move_to: cleared_status_icon") {
        setTop(window.innerHeight - 20);
        setLeft(window.innerWidth - 20 - 240);
        setOffset(100);
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
          setTop(0);
          setLeft(100);
          setOffset(0);
        }

      }
      else if (action === "move_to: calendar_icons") {
        setTop(10);
        setLeft(10);
        setOffset(0);
      }
      else if (action === "move_to: budget_header") {
        if (
          commonElementsRef.current['budget_header'] !== undefined &&
          commonElementsRef.current['budget_header'] !== null
        ) {
          const { top: t, left: l } =
            commonElementsRef.current['budget_header'].getBoundingClientRect();
          const centerY = t + commonElementsRef.current['budget_header'].offsetHeight;
          setTop(centerY + 10 - 20);
          setLeft(l - 740);
          setOffset(0);

          commonElementsRef.current['budget_header'].style.backgroundColor = "yellow";
          commonElementsRef.current['budget_header'].style.outlineColor = "black";
          commonElementsRef.current['budget_header'].style.outlineStyle = "dashed";
          commonElementsRef.current['budget_header'].style.outlineWidth = 5;

        } else {
          setTop(0);
          setLeft(100);
          setOffset(0);
        }

      }
      else if (action === "move_to: budget_table") {

      }
      else if (action === "move_to: category_column") {

      }
      else if (action === "move_to: budgeted_column") {

      }
      else if (action === "move_to: spent_column") {

      }
      else if (action === "move_to: balance_column") {

      }
      else if (action === "move_to: budget_more_button") {

      }









      //would be great to highlight these too...




    } 

  }


  function evaluate(item) {
    let variable = item.variable;
    let value = item.value;

    if (variable !== undefined && variable !== null && value !== undefined && value !== null) {

      console.log ("EVAL: " + variable + " = " + value + " state:");

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

  const addTaxesAndInsuranceAsOwner = async () => {
    let group = categoryGroups.find(g => g.name === 'Bills');

    let category = {
      name: '💸 Property Taxes',
      cat_group: group.id,
      is_income: false,
      id: 'new',
    };

    //await onSaveCategory(category, true);
    //await timeout(500);

    let category2 = {
      name: '🌪️ Homeowners Insurance',
      cat_group: group.id,
      is_income: false,
      id: 'new',
    };

    let ids = await onSaveNewCategories([category, category2], true);
    //let id = await onSaveCategory(category2, true);
    await moveTo(ids[1]);

    setDialogueId('nicktrue_utilities');
  };

  const addUtilities = async () => {
    let group = categoryGroups.find(g => g.name === 'Bills');

    if (typeALevel === 0) {
      let category = {
        name: 'Utilities',
        cat_group: group.id,
        is_income: false,
        id: 'new',
      };

      let id = await onSaveCategory(category, true);
      await moveTo(id);
    } else {
      let category = {
        name: '🔌 Electric',
        cat_group: group.id,
        is_income: false,
        id: 'new',
      };

      let category2 = {
        name: '♨️ Gas',
        cat_group: group.id,
        is_income: false,
        id: 'new',
      };

      let category3 = {
        name: '🚰 Water',
        cat_group: group.id,
        is_income: false,
        id: 'new',
      };

      let ids = await onSaveNewCategories(
        [category, category2, category3],
        true,
      );
      await moveTo(ids[2]);
    }

    setDialogueId('nicktrue_utilities_done');
  };

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
  if (dialogueId === 'nicktrue_1') {
    content = (
      <div>
        Do not fear. I got you.
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicktrue_2')}
        >
          Get Started
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicktrue_2') {
    content = (
      <div>
        Lets get to know each other. How Type A are you?
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={addBillsCategoryGroupLevel0}
        >
          Not Type A
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={addBillsCategoryGroupLevel1}
        >
          Somewhat Type A
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={addBillsCategoryGroupLevel2}
        >
          Very Type A
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicktrue_3') {
    content = (
      <div>
        Great, lets talk about Bills. Do you own or rent?
        <Button type="primary" style={{ marginTop: 8 }} onClick={setupAsOwner}>
          Own
        </Button>
        <Button type="primary" style={{ marginTop: 8 }} onClick={setupAsRenter}>
          Rent
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicktrue_4') {
    content = (
      <div>
        Cool, I got your utilities added. Lets look at the next thing.
        <Button type="primary" style={{ marginTop: 8 }} onClick={setupAsRenter}>
          Ok
        </Button>
        <Button type="primary" style={{ marginTop: 8 }} onClick={setupAsOwner}>
          Sounds Good
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicktrue_escrow') {
    content = (
      <div>
        Are your taxes and home owners insurance included in your mortgage
        payment as part of escrow?
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={addTaxesAndInsuranceAsOwner}
        >
          No
        </Button>
        <Button type="primary" style={{ marginTop: 8 }} onClick={setupAsRenter}>
          Yes
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicktrue_utilities') {
    content = (
      <div>
        Lets add your utilities.
        <Button type="primary" style={{ marginTop: 8 }} onClick={addUtilities}>
          Ok
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicktrue_utilities_done') {
    content = <div>You are off to a great start.</div>;
  } else if (dialogueId === 'nicksmith_1') {
    content = (
      <div>
        Welcome to MyBudgetCoach! MyBudgetCoach is a unique budgeting software that comes along with a virtual avatar. You selected, me, Nick Smith, as your personal coach. I look forward to helping you start a new phase of your journey to financial wellness!
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_1.1')}
        >
          Get Started
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_1.1') {
    content = (
      <div>
        Before we begin the set-up process, I just want to let you know about some aspects of MyBudgetCoach.
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => showZoomCall()}
        >
          Got It
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_2') {
    content = (
      <div>
         If at any time you reach a point where you would like a one-on-one coaching session with me, please select the link to the left and select a time that works for you. Please note, one-on-one coaching does have an additional hourly fee, in addition to your MyBudgetCoach subscription.
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nick3()}
        >
          Got It
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_3') {
    content = (
      <div>
        As your virtual coach, I will be available whenever you are. You can complete set-up steps all at once, or you can complete them over time. Please move at your pace, and whenever you are ready for the next step of our work together, I will be here to help you out.
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_4')}
        >
          {`I'm Ready`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_4') {
    content = (
      <div>
        To personalize your experience setting up MyBudgetCoach, I will ask you questions along the way. These questions will shift my coaching approach so I am helping you the best way for your specific goals.
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_5')}
        >
          Sounds Good
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_5') {
    content = (
      <div>
        What brought you to sign up for MyBudgetCoach?
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={nickSmithOption1}
        >
          {`My current budgeting system isn't bringing me closer to my financial wellness goals.`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={nickSmithOption2}
        >
          {`I haven't created a routine budget process and am looking to get started.`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_6') {
    content = (
      <div>
        Thanks for your response!
        <p>We will start off with the following steps for the Account Set-Up stage.</p>
        <ol>
          <li>Renaming Budget</li>
          <li>Adding Accounts</li>
          <li>Overview of Account screen</li>
          <li>Adding a transaction</li>
          <li>Verifying Starting Balance</li>
        </ol>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_7')}
        >
          Next
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_7') {
    content = (
      <div>
        {`This Account Set-Up stage takes 10-15 minutes on average. Let's get started!`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_8')}
        >
          Set Up Accounts
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_8') {
    content = (
      <div>
        {`You can set-up multiple budgets in your MyBudgetCoach account. An example for when a new budget can be helpful is when you have a big life event, such as a change in job, and want to start 'fresh' with your new financial reality.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_8.1')}
        >
          Next
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_8.1') {
    content = (
      <div>
        {`MyBudgetCoach allows you to name each budget. I recommend to name the Budget something specific, and end with "..._MonthYear" that you start the budget. This will help you remember which Budget was used for which time period.`}
        <p>OK, please rename your first Budget!</p>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOption3()}
        >
          Sounds Good
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_9') {
    content = (
      <div>
        {`Select your Budget Name in the top left and select 'Rename budget' to adjust the name.`}
        <p>OK, please rename your first Budget!</p>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOption4()}
        >
          I Renamed My Budget
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_10') {
    content = (
      <div>
        {`Before we start adding accounts, please answer two questions so I can tailor my guidance to your financial infrastructure.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_11')}
        >
          Ask Away
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_11') {
    content = (
      <div>
        Which account structure accurately represents your current financial set-up?
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={nickSmithOption5}
        >
          {`I primarily use a bank card. I don't use credit cards.`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={nickSmithOption6}
        >
          {`I use my credit card for day-to-day spending and my bank account for routine bills.`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={nickSmithOption7}
        >
          {`I have more than one credit card routinely used.`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_12') {
    content = (
      <div>
        Do you budget with a partner?
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={nickSmithOption8}
        >
          {`It's just me!`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={nickSmithOption9}
        >
          {`Yes and we have consolidated finances and expenses are paid out of joint accounts.`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={nickSmithOption10}
        >
          {`Yes and we have separate financial households. I'm just going to set up my part of the financial household.`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_13') {
    content = (
      <div>
        {`Thanks for your response!`}
        <p>{`Let's start adding accounts!`}</p>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_14')}
        >
          {`Let's Go`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_14') {
    if (nickSmith_accountStructure === "noCC" && (nickSmith_budgetWithPartner === "justMe" || nickSmith_budgetWithPartner === "jointSeparate")) {
      content = (
        <div>
          {`Based on your answers, I recommend adding just your checking account.`}
          <p>{`Since you don't have any other accounts where expenses are paid out of, one account is enough!`}</p>
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_15')}
          >
            {`Let's Go`}
          </Button>
        </div>
      );
    }
    else if (nickSmith_accountStructure === "noCC" && nickSmith_budgetWithPartner === "jointConsolidated") {
      content = (
        <div>
          {`Based on your answers, I recommend adding just your joint checking account.`}
          <p>{`Since you don't have any other accounts where expenses are paid out of, one account is enough!`}</p>
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_15')}
          >
            {`Let's Go`}
          </Button>
        </div>
      );
    }
    else if (nickSmith_accountStructure === "1and1" && (nickSmith_budgetWithPartner === "justMe" || nickSmith_budgetWithPartner === "jointSeparate")) {
      content = (
        <div>
          {`Based on your answers, I recommend adding your checking account first and then your main credit card account.`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_15')}
          >
            {`Let's Go`}
          </Button>
        </div>
      );
    }
    else if (nickSmith_accountStructure === "1and1" && nickSmith_budgetWithPartner === "jointConsolidated") {
      content = (
        <div>
          {`Based on your answers, I recommend adding your joint checking account first and then your main joint credit card account.`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_15')}
          >
            {`Let's Go`}
          </Button>
        </div>
      );
    }
    else if (nickSmith_accountStructure === "moreThanOneCC" && (nickSmith_budgetWithPartner === "justMe" || nickSmith_budgetWithPartner === "jointSeparate")) {
      content = (
        <div>
          {`Based on your answers, I recommend adding your checking account first and then your main credit card account.`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_15')}
          >
            {`Let's Go`}
          </Button>
        </div>
      );
    }
    else if (nickSmith_accountStructure === "moreThanOneCC" && nickSmith_budgetWithPartner === "jointConsolidated") {
      content = (
        <div>
          {`Based on your answers, I recommend adding your joint checking account first and then your main joint credit card account.`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_15')}
          >
            {`Let's Go`}
          </Button>
        </div>
      );
    }
    else {
      content = (
        <div>
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_15')}
          >
            {`Next`}
          </Button>
        </div>
      );
    }
  } else if (dialogueId === 'nicksmith_15') {
    if (nickSmith_budgetWithPartner === "jointConsolidated") {
      content = (
        <div>
          {`Please login to your bank now so you can gather your current balance of your joint checking account.`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => moveToAccountCreate()}
          >
            {`I'm Logged In`}
          </Button>
        </div>
      );
    } else {
      content = (
        <div>
          {`Please login to your bank now so you can gather your current balance of your checking account.`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => moveToAccountCreate()}
          >
            {`I'm Logged In`}
          </Button>
        </div>
      );
    }
  } else if (dialogueId === 'nicksmith_16') {
    content = (
      <div>
        {`Please select + Add account.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_16.1')}
        >
          {`Done`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_16.1') {
    if (nickSmith_budgetWithPartner === "jointConsolidated") {
      content = (
        <div>
          {`Please select Create Local Account. Name your joint account, and then enter the current balance of your joint checking account.`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => nickSmithCCCheck()}
          >
            {`I Added My Account`}
          </Button>
        </div>
      );
    } else {
      content = (
        <div>
          {`Please select the Create Local Account option. Name your account, and then enter the current balance of your checking account.`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => nickSmithCCCheck()}
          >
            {`I Added My Account`}
          </Button>
        </div>
      );
    }
  } else if (dialogueId === 'nicksmith_wrap_accounts') {
    if (nickSmith_accountStructure === "noCC") {
      content = (
        <div>
          {`Great job adding your account! You may be thinking: Let me add in my savings account next.`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_nocc_2')}
          >
            Next
          </Button>
        </div>
      );
    } else {
      content = (
        <div>
          {`Great job adding your accounts! You may be thinking: Let me add in my savings account next.`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_nocc_2')}
          >
            Next
          </Button>
        </div>
      );
    }    
  } else if (dialogueId === 'nicksmith_wrap_accounts_jc') {
    content = (
      <div>
        {`Great job adding your joint accounts! Let me ask another question.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_wrap_accounts_jc_1')}
        >
          Ask Away
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_wrap_accounts_jc_1') {
    content = (
      <div>
        Do you have your own credit card?
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_wrap_accounts_jc_2')}
        >
          {`Yes`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_wrap_accounts_jc_3')}
        >
          {`No`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_wrap_accounts_jc_2') {
    content = (
      <div>
        {`Understood; For now, we are going to hold off adding account(s) that are owned and managed only by you. The budget we will be establishing is for your joint income and expenses.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_wrap_accounts_jc_4')}
        >
          Next
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_wrap_accounts_jc_4') {
    content = (
      <div>
        {`If at a later point you would like to add your own accounts, please schedule a one-on-one session with me and I would be happy to help you add the account and discuss strategies for organizing the budget.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_wrap_accounts_jc_5')}
        >
          Next
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_wrap_accounts_jc_3') {
    content = (
      <div>
        {`Ok! Thanks for your response.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_wrap_accounts_jc_5')}
        >
          Next
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_wrap_accounts_jc_5') {
    content = (
      <div>
        {`You may be thinking: Let me add the joint savings account next.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_wrap_accounts_jc_6')}
        >
          Next
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_wrap_accounts_jc_6') {
    content = (
      <div>
        {`Although you may have a joint savings account, as you first start using MyBudgetCoach, I recommend to not link the Savings account at this stage.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_nocc_3')}
        >
          Next
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nocc_2') {
    content = (
      <div>
        {`Although you may have a savings account, as you first start using MyBudgetCoach, I recommend to not link the Savings account at this stage.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_nocc_3')}
        >
          Next
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nocc_3') {
    content = (
      <div>
        {`If you want to further understand how to easily use saving accounts in MyBudgetCoach, please schedule a one-on-one coaching session with me.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_nocc_4')}
        >
          Next
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nocc_4') {
    content = (
      <div>
        {`You are all done adding accounts. Do you feel the momentum building towards achieving your goals!?`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_an_1')}
        >
          Next
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_cc_1') {
    if (nickSmith_budgetWithPartner === "jointConsolidated") {
      content = (
        <div>
          {`Let's now add your joint credit card account.`}
          <p>{`Please login to your bank so you can gather your current credit card balance.`}</p>
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => moveToAccountCreate2()}
          >
            {`I'm Logged In`}
          </Button>
        </div>
      );
    } else {
      content = (
        <div>
          {`Let's now add your credit card account.`}
          <p>{`Please login to your bank so you can gather your current credit card balance.`}</p>
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => moveToAccountCreate2()}
          >
            {`I'm Logged In`}
          </Button>
        </div>
      );
    }
  } else if (dialogueId === 'nicksmith_cc_2') {
    content = (
      <div>
        {`Please select + Add account and then Create Local Account. Name your account, and then enter the current balance of your credit card.`} 
        <p>{`NOTE: Since a credit card balance represents debt, when you enter the balance, add a leading '-' to make the amount entered negative.`}</p>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithCCCheck2()}
        >
          {`I Added My Account`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_1') {
    content = (
      <div>
        {`You selected earlier that you have more than one credit card. Let me ask some questions to understand more about your current financial structure.`} 
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_multicc_2')}
        >
          {`Ask Away`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_2') {
    if (nickSmith_budgetWithPartner === "jointConsolidated") {
      content = (
        <div>
          How many additional joint credit cards do you actively use each week?
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => nickSmithOptionMultiCC4()}
          >
            {`1`}
          </Button>
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => nickSmithOptionMultiCC5()}
          >
            {`2 or more`}
          </Button>
        </div>
      );

    } else {
      content = (
        <div>
          How many additional credit cards do you actively use each week?
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => nickSmithOptionMultiCC1()}
          >
            {`1`}
          </Button>
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => nickSmithOptionMultiCC2()}
          >
            {`2`}
          </Button>
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => nickSmithOptionMultiCC3()}
          >
            {`3 or more`}
          </Button>
        </div>
      );
    }    
  } else if (dialogueId === 'nicksmith_multicc_3') {
    if (nickSmith_budgetWithPartner === "jointConsolidated") {
      content = (
        <div>
          {`Thanks for your answer! Let's add one more joint account to capture your total expenses.`} 
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_multicc_6')}
          >
            {`Next`}
          </Button>
        </div>
      );
    } else {
      content = (
        <div>
          {`Thanks for your answer! Let's add one more account to capture your total expenses.`} 
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_multicc_6')}
          >
            {`Next`}
          </Button>
        </div>
      );
    }    
  } else if (dialogueId === 'nicksmith_multicc_4') {
    if (nickSmith_budgetWithPartner === "jointConsolidated") {
      content = (
        <div >
          {`Thanks for your answer! Let's add the joint credit card account that is used the most often of the remaining joint accounts.`} 
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_multicc_6')}
          >
            {`Next`}
          </Button>
        </div>
      );
    } else {
      content = (
        <div >
          {`Thanks for your answer! Let's now add the credit card account that is used the most often of your remaining accounts.`} 
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_multicc_6')}
          >
            {`Next`}
          </Button>
        </div>
      );
    }    
  } else if (dialogueId === 'nicksmith_multicc_5') {
    content = (
      <div >
        {`Thanks for your answer! Let's now add the credit card account that is used the most often of your remaining accounts.`} 
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_multicc_6')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_6') {
    content = (
      <div >
        {`Please login to your bank so you can gather your current credit card balance.`} 
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => moveToAccountCreate3()}
        >
          {`I'm Logged In`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_7') {
    content = (
      <div >
        {`Please select + Add account and then Create Local Account. Name your account, and then enter the current balance of your credit card.`} 
        <p>{`NOTE: Since a credit card balance represents debt, when you enter the balance, add a leading '-' to make the amount entered negative.`}</p>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithCCCheck3()}
        >
          {`I Added My Account`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_9') {
    if (nickSmith_budgetWithPartner === "jointConsolidated") {
      content = (
        <div >
          {`Congratulations on adding three joint accounts! As you continue to use MyBudgetCoach, please keep in mind each account requires reconciliation, a few times a week, and categorizing of transactions.`} 
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_multicc_10')}
          >
            {`I Understand`}
          </Button>
        </div>
      );
    } else {
      content = (
        <div >
          {`Congratulations on adding three accounts! As you continue to use MyBudgetCoach, please keep in mind each account requires reconciliation, a few times a week, and categorizing of transactions.`} 
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_multicc_10')}
          >
            {`I Understand`}
          </Button>
        </div>
      );
    }    
  } else if (dialogueId === 'nicksmith_multicc_10') {
    content = (
      <div >
        {`Before we link a fourth account, let me ask a follow-up question.`} 
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithCCCheck4()}
        >
          {`Ask Away`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_11') {
    content = (
      <div>
        How many transactions per week occur on your remaining credit card account?
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_multicc_12')}
        >
          {`5 or less transactions`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_multicc_13')}
        >
          {`More than 5 transactions`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_12') {
    content = (
      <div >
        {`Based on the number of transactions that occur per week, I would recommend leaving out the additional account for now, and then if you would like to add it on a future date, feel free!`} 
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_wrap_accounts')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_13') {
    content = (
      <div >
        {`Based on the number of transactions that occur per week, let's add one more account so your expenses can be accurately captured each month.`} 
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_multicc_14')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_14') {
    content = (
      <div >
        {`Please login to your bank so you can gather your current credit card balance.`} 
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => moveToAccountCreate4()}
        >
          {`I'm Logged In`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_15') {
    content = (
      <div >
        {`Please select + Add account and then Create Local Account. Name your account, and then enter the current balance of your credit card.`} 
        <p>{`NOTE: Since a credit card balance represents debt, when you enter the balance, add a leading '-' to make the amount entered negative.`}</p>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_multicc_16')}
        >
          {`I Added My Account`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_16') {
    content = (
      <div >
        {`To summarize, you have now added a total of four accounts.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_wrap_accounts')}
        >
          {`I Added My Account`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_17') {
    content = (
      <div>
        {`How many transactions per week occur on your next most highly used credit card of your remaining accounts?`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_multicc_18')}
        >
          {`5 or less transactions`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_multicc_19')}
        >
          {`More than 5 transactions`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_18') {
    if (nickSmith_budgetWithPartner === "jointConsolidated") {
      content = (
        <div >
          {`Based on the number of transactions that occur per week, I would recommend not adding the remainder of your joint credit card accounts for now.`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_wrap_accounts_jc')}
          >
            {`Got It`}
          </Button>
        </div>
      );
    } else {
      content = (
        <div >
          {`Based on the number of transactions that occur per week, I would recommend leaving out the remainder of your credit card accounts for now, and then if you would like to add additional ones on a future date, feel free!`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_wrap_accounts')}
          >
            {`Got It`}
          </Button>
        </div>
      );
    }    

  } else if (dialogueId === 'nicksmith_multicc_19') {

    if (nickSmith_budgetWithPartner === "jointConsolidated") {
      content = (
        <div >
          {`Based on the number of transactions that occur per week, let's add the next most used joint credit card account so your joint expenses can be accurately captured each month.`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_multicc_20')}
          >
            {`Next`}
          </Button>
        </div>
      );
    } else {
      content = (
        <div >
          {`Based on the number of transactions that occur per week, let's add the next most used credit card account so your expenses can be accurately captured each month.`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_multicc_20')}
          >
            {`Next`}
          </Button>
        </div>
      );
    }    

  } else if (dialogueId === 'nicksmith_multicc_20') {
    content = (
      <div >
        {`Please login to your bank so you can gather your current credit card balance.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => moveToAccountCreate5()}
        >
          {`I'm Logged In`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_21') {
    content = (
      <div >
        {`Please select + Add account and then Create Local Account. Name your account, and then enter the current balance of your credit card.`} 
        <p>{`NOTE: Since a credit card balance represents debt, when you enter the balance, add a leading '-' to make the amount entered negative.`}</p>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithCCCheckNope()}
        >
          {`I Added My Account`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_22') {
    content = (
      <div >
        {`To summarize, you have now added a total of four accounts. Prior to linking a fifth account, I am going to ask you the same question as before, for the frequency of transactions.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_multicc_24')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_24') {
    content = (
      <div >
        {`Please note that linking many accounts leads to a complicated use of MyBudgetCoach and could lead to feeling overwhelmed each time you log in.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_multicc_25')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_25') {
    content = (
      <div>
        {`How many transactions per week occur on your next most highly used credit card of your remaining accounts?`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_multicc_26')}
        >
          {`5 or less transactions`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_multicc_27')}
        >
          {`More than 5 transactions`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_26') {
    if (nickSmith_budgetWithPartner === "jointConsolidated") {
      content = (
        <div >
          {`Based on the number of transactions that occur per week, I would recommend leaving out the additional joint account.`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_wrap_accounts_jc')}
          >
            {`Next`}
          </Button>
        </div>
      );
    } else {
      content = (
        <div >
          {`Based on the number of transactions that occur per week, I would recommend leaving out the additional account for now, and then if you would like to add it on a future date, feel free!`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_wrap_accounts')}
          >
            {`Next`}
          </Button>
        </div>
      );
    }    
  } else if (dialogueId === 'nicksmith_multicc_27') {
    if (nickSmith_budgetWithPartner === "jointConsolidated") {
      content = (
        <div >
          {`Thanks for your response. I understand you have many accounts that you use routinely. To ensure we don't over complicate your account structure, let's hold off adding any additional joint accounts.`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_wrap_accounts_jc')}
          >
            {`Next`}
          </Button>
        </div>
      );
    } else {
      content = (
        <div >
          {`Thanks for your response. I understand you have many accounts that you use routinely. To ensure we don't over complicate your account structure, let's hold off adding any additional accounts for now. If later on in your MyBudgetCoach use you determine additional accounts should be added to capture all your expense transactions, feel free to add additional accounts!`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('nicksmith_wrap_accounts')}
          >
            {`Next`}
          </Button>
        </div>
      );
    }    
  } else if (dialogueId === 'nicksmith_an_1') {
    content = (
      <div>
        So far, you have completed steps 1 and 2 of the Account Set-Up stage.
        <ol>
          <li><s>Renaming Budget</s></li>
          <li><s>Adding Accounts</s></li>
          <li>Overview of Account screen</li>
          <li>Adding a transaction</li>
          <li>Verifying Starting Balance</li>
        </ol>
        We will now work through the features of the Account screen.
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithAN1()}
        >
          Sounds Good
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_an_2') {
    content = (
      <div >
        {`Alright! That completes the overview of the account screen. Are you starting to feel like a MyBudgetCoach expert!?`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_1')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_1') {
    content = (
      <div >
        {`To verify your understanding of the account screen, I will now walk you through adding two test transactions to the checking account.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithAT1()}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_2') {
    content = (
      <div >
        {`Please select your checking account.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithAT2()}
        >
          {`I've Selected My Checking Account`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_3') {
    content = (
      <div >
        {`Please select the '+ Add New' option under the account balance to add a new transaction.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_5')}
        >
          {`I Added A New Transaction`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_5') {
    content = (
      <div >
        {`For the Payee, let's enter 'Grocery Store.' Since this is a new Payee, select + Create Payee.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_6')}
        >
          {`I Set The Payee To Grocery Store`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_6') {
    content = (
      <div >
        {`For the Notes, let's leave blank for now.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_7')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_7') {
    content = (
      <div >
        {`For the Category, select 'Food'. You can type 'F' and watch the available categories filter down accordingly.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_8')}
        >
          {`I Set The Category`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_8') {
    content = (
      <div >
        {`Let's assume an outflow of 50 for groceries.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_9')}
        >
          {`But First A Question`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_9') {
    content = (
      <div>
        {`KNOWLEDGE CHECK`}
        <p>{`Should the 50 be entered in the 'Payment' or 'Deposit' column?`}</p>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_10')}
        >
          {`Payment`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_11')}
        >
          {`Deposit`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_10') {
    content = (
      <div >
        {`Correct! Since this is an outflow for the checking account, this purchase is entered into the Payment column. Let's do that now.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_12')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_11') {
    content = (
      <div >
        {`Actually, this transaction is entered as a Payment. A Deposit is income coming into your checking account. For example, your paycheck would be a Deposit. Any outflow for purchases or paying bills would be entered as Payment. Let's do that now.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_12')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_12') {
    content = (
      <div >
        {`To add the transaction, select the 'Add' button.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_13')}
        >
          {`I Added It`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_13') {
    content = (
      <div >
        {`Notice that when you add a new transaction, the system defaults the checkmark symbol to a non-filled color which means the transaction is not yet cleared.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_14')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_14') {
    content = (
      <div >
        {`For this example, the transaction happened earlier in the day, so please select the checkmark to turn it green and 'Clear' the transaction.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_14.1')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_14.1') {
    content = (
      <div >
        {`MyBudgetCoach predicts you want to add another transaction each time you add a new transaction. You are going to add another test transaction shortly. In the future, if you don't need to add another transaction, select Cancel to remove the blank row.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_15')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_15') {
    content = (
      <div >
        {`Let's now add a transaction for an inflow. For the Payee enter 'Employer,' select a Category of Income, enter 500 in the Deposit field, and select 'Add.'`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_16')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_16') {
    content = (
      <div >
        {`Please note, any income received, including returns or rebates, should all be entered with a Category as 'Income.'`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_17')}
        >
          {`I Added The Transaction`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_17') {
    content = (
      <div >
        {`Now that you have added two transactions, please take note that the payment to the grocery store has been cleared, but the income has not been cleared.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_18')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_18') {
    content = (
      <div >
        {`Please select the Account Balance to view the Cleared and Uncleared total.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_18.1')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_18.1') {
    content = (
      <div >
        {`Notice that the Uncleared total is 500.`}
        <p>{`Please select the grey check mark to make it green to clear the transaction.`}</p>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_18.2')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_18.2') {
    content = (
      <div >
        {`The Cleared total now matches the account balance and the Uncleared total was updated to 0.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_18.3')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_18.3') {
    content = (
      <div >
        {`There may be times when you want to add an upcoming transaction, but the transaction hasn't cleared at your bank yet.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_18.4')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_18.4') {
    content = (
      <div >
        {`In this case, you could add the transaction but leave the checkmark grey, uncleared, until a later date when the transaction has cleared at your bank.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_18.5')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_18.5') {
    content = (
      <div >
        {`Before we move to the next step, let's delete those two hypothetical transactions you added.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_18.6')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_18.6') {
    content = (
      <div >
        {`Please select each of the two transactions using the box to the left of the date. Then select the link named '2 transactions' to the right of the search bar and choose Delete.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_19')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } 
  else if (dialogueId === 'nicksmith_at_19') {
    // this needs to be conditional. wait 
    content = (
      <div >
        {`Now that we have walked through how to add transactions in your checking account, let's complete a similar exercise for your main credit card account.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithACT1()}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_act_1') {
    content = (
      <div >
        {`The important difference between the two types of accounts is that in a credit card account, Payments increase the balance, and Deposits decrease the balance. This is because a credit card balance is negative.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithACT2()}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_act_2') {
    content = (
      <div >
        {`Please select your main credit card account to add two hypothetical transactions.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithACT3()}
        >
          {`I've Selected My Credit Card Account`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_act_3') {
    content = (
      <div >
        {`Please select '+ Add New' and enter a Payee of 'Cell Phone Company.'`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_act_4')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_act_4') {
    content = (
      <div >
        {`For the category, please select 'Bills', enter a Payment amount of 100, select Add, and Clear the transaction.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_act_5')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_act_5') {
    content = (
      <div >
        {`The credit card balance, a red negative number, has now increased by 100.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_act_6')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_act_6') {
    content = (
      <div >
        {`Let's now add a transaction for a credit card payment. Credit Card payments are Transfers and entered as a Deposit.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_act_7')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_act_7') {
    content = (
      <div >
        {`Please select '+ Add New' and for the Payee, select 'Make Transfer' and select the checking account under the 'Transfer To/From' list of accounts.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_act_9')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_act_9') {
    content = (
      <div >
        {`The Category field is now populated with Transfer. Enter 100 in the 'Deposit' field since this is a payment to reduce the credit card balance.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_act_10')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_act_10') {
    content = (
      <div >
        {`Let's now jump over to the checking account.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_act_11')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_act_11') {
    content = (
      <div >
        {`Since you selected 'Make Transfer' as the Payee in your credit card account, this automatically added a transaction to your checking account as well. `}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_act_12')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_act_12') {
    content = (
      <div >
        {`Please take note that the Payment field is populated for the checking account, which reduces the balance. However, the credit card account has the Deposit field populated because an inflow to a negative balance reduces the negative balance.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_act_13')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_act_13') {
    content = (
      <div >
        {`KUDOS on creating transactions for both accounts!`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_act_13.1')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_act_13.1') {
    content = (
      <div >
        {`Before we move to the next step, let's delete those two credit card transactions you added.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_act_13.2')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_act_13.2') {
    content = (
      <div >
        {`Please select each of the two transactions using the box to the left of the date. Then select the link named '2 transactions' to the right of the search bar and choose Delete.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_act_14')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_act_14') {
    content = (
      <div >
        {`The last step of the Account overview phase is to confirm the amount of the starting balance for each added account.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_1')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_1') {
    content = (
      <div >
        {`Before I give an overview of the Budget, let's first validate your starting balance for your checking account you entered not too long ago.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_2')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_2') {
    content = (
      <div >
        {`When re-creating a copy of your financial institution transactions and balance in MyBudgetCoach, one of the most important pieces is knowing how the amount you see when you login to your bank account is calculated. Let me explain.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_3')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_3') {
    content = (
      <div >
        {`Some financial institutions calculate the balance shown in a bank account after taking into account pending transactions. Others calculate the current balance by only including transactions that have cleared.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_3.1')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_3.1') {
    content = (
      <div >
        {`Please login to your bank account to research your current balance.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_3.2')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_3.2') {
    content = (
      <div >
        {`Ok great! For this portion of the account set-up, I will be asking you questions along the way. Your responses will be used to tailor my guidance.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_4')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_4') {
    content = (
      <div>
        {`Do you know what your current balance represents?`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOptionVAB1()}
        >
          {`Yes; it takes into account pending transactions`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOptionVAB2()}
        >
          {`Yes; it doesn't take into account pending transactions`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOptionVAB3()}
        >
          {`No`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_5') {
    content = (
      <div >
        {`Ok; This means that the account balance in MyBudgetCoach may not match your current balance.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_6')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_6') {
    content = (
      <div >
        {`But, that's OK! I will explain how you can complete a simple process to gain trust that the number in MyBudgetCoach matches your financial institution.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_8')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_8') {
    content = (
      <div>
        {`Does your current balance match the amount in your MyBudgetCoach account, which is the amount entered for the Starting Balance?`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_9')}
        >
          {`Yes`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_21')}
        >
          {`No`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_9') {
    content = (
      <div >
        {`Ok! Please verify if there are any pending transactions.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_10')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_10') {
    content = (
      <div>
        {`Are there pending transactions?`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_11')}
        >
          {`No`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_12')}
        >
          {`Yes`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_11') {
    content = (
      <div >
        {`Excellent! This means your Starting Balance in MyBudgetCoach is correct.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOptionNE1()}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_12') {
    content = (
      <div >
        {`Understood. Please pull up a calculator. Time to complete a little math!`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_13')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_13') {
    content = (
      <div >
        {`Please first total up your pending transactions. For outflows, please total as a negative number.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_14')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_14') {
    content = (
      <div >
        {`Take that amount and SUBTRACT it from your current bank balance.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_15')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_15') {
    content = (
      <div >
        {`This means if your pending transactions are negative, you would be adding them to increase your balance. If your pending transactions were positive, it would reduce your balance.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_16')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_16') {
    content = (
      <div >
        {`Please enter this new amount into the Starting Balance transaction for your checking account.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_17')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_17') {
    content = (
      <div >
        {`Now, when you import those pending transactions at a later date, your starting balance will remain in-synch with your bank, versus double counting the pending transactions.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_18')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_18') {
    content = (
      <div >
        {`Please remember, you will need to complete this small math exercise each time you reconcile this account if there are any pending transactions.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOptionNE1()}
        >
          {`Next`}
        </Button>
      </div>
    );
  } 
  else if (dialogueId === 'nicksmith_vab_21') {
    content = (
      <div >
        {`Understood; Let's work together to adjust the Starting Balance amount.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_21.1')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_21.1') {
    content = (
      <div>
        {`Are there pending transactions?`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_22')}
        >
          {`No`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_12')}
        >
          {`Yes`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_22') {
    content = (
      <div >
        {`Please adjust your starting balance amount to the balance you see in your bank account.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_23')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_23') {
    content = (
      <div >
        {`Great work! Correcting your Starting Balance now will save much time later on during future reconciliation processes.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOptionNE1()}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_24') {
    content = (
      <div >
        {`Ok; This means that the account balance in MyBudgetCoach should match your financial institution. This  assumes all transactions cleared in the bank account are entered in MyBudgetCoach.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_26')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_26') {
    content = (
      <div>
        {`Does your current balance match the amount in your MyBudgetCoach account that you entered for the Starting Balance?`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_11')}
        >
          {`Yes`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_27')}
        >
          {`No`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_27') {
    content = (
      <div >
        {`Understood; Let's work together to adjust the Starting Balance amount.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_28')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_28') {
    content = (
      <div >
        {`Please adjust your starting balance amount to the balance you see in your bank account.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_11')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_29') {
    content = (
      <div >
        {`I completely understand. This is a question you may have not considered before. Let me ask some questions to learn more about your specific bank.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_31')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_31') {
    content = (
      <div >
        {`Please review your account.`}
        <p>{`Are there any pending transactions?`}</p>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOptionNov1()}
        >
          {`No`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_32')}
        >
          {`Yes`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_32') {
    content = (
      <div >
        {`Does your bank have the option to show a running balance?`}
        <p>{`If you aren't sure, try searching in the help section for instructions on how to show the additional column.`}</p>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOptionNov2()}
        >
          {`Yes`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOptionNov3()}
        >
          {`No`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nov_1') {
    content = (
      <div >
        {`Please locate the running balance for the last cleared transaction. Please exclude any pending transactions.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_nov_3')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nov_2') {
    content = (
      <div >
        {`Thanks for answering the questions.`}
        <p>{`I don't recommend any adjustments to your Starting Balance right now. If in the future your MyBudgetCoach account balance doesn't match your bank and you aren't sure what to do, please select the link to the left to schedule a one-on-one call with me and I would be happy to help you troubleshoot the inconsistency in the balance.`}</p>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOptionNE1()}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nov_3') {
    content = (
      <div >
        {`Is your current bank balance equal to the running balance listed for your most recent cleared transaction? `}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOptionNov4()}
        >
          {`Yes`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOptionNov5()}
        >
          {`No`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nov_4') {
    content = (
      <div >
        {`Thanks for this answer. This means that your bank account balance does not take into account pending transactions.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_26')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nov_5') {
    content = (
      <div >
        {`Thanks for this answer. This means that your bank account balance does take into account pending transactions.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_nov_6')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nov_6') {
    content = (
      <div >
        {`Does your current balance match the amount in your MyBudgetCoach account that you entered for the Starting Balance?`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_nov_7')}
        >
          {`Yes`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_nov_11')}
        >
          {`No`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nov_7') {
    content = (
      <div >
        {`Understood; This means we need to update your Starting Balance. The MyBudgetCoach Starting Balance should be equal to the account balance shown after the most recent cleared transaction.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_nov_8')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nov_8') {
    content = (
      <div >
        {`If the Starting Balance is equal to the current balance (which includes adjustments for pending transactions) those transactions will be 'double counted' on a future date when you add the pending transactions to MyBudgetCoach after they have cleared.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_nov_9')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nov_9') {
    content = (
      <div >
        {`Please adjust your starting balance amount to the running balance amount shown as of the most recent cleared transaction.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_nov_10')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nov_10') {
    content = (
      <div >
        {`Great work! Correcting your Starting Balance now will save much time later on during future reconciliation processes.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOptionNE1()}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nov_11') {
    content = (
      <div >
        {`Does the balance shown after the most recent cleared transaction match the amount you entered for the Starting Balance in MyBudgetCoach?`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_nov_12')}
        >
          {`Yes`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_nov_13')}
        >
          {`No`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nov_12') {
    content = (
      <div >
        {`Excellent! This means your Starting Balance in MyBudgetCoach is correct.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOptionNE1()}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nov_13') {
    content = (
      <div >
        {`Understood; This means we need to update your Starting Balance. The MyBudgetCoach Starting Balance should be equal to the account balance shown after the most recent cleared transaction.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_nov_14')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nov_14') {
    content = (
      <div >
        {`Please adjust your starting balance amount to the running balance amount shown as of the most recent cleared transaction.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_nov_15')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nov_15') {
    content = (
      <div >
        {`Great work! Correcting your Starting Balance now will save much time later on during future reconciliation processes.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOptionNE1()}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_dec_1') {
    content = (
      <div >
        {`You now have a solid financial foundation to build on for your Budget.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('')}
        >
          {`Done`}
        </Button>
      </div>
    );
  } 

  let dialogue = allDialogues.get(dialogueId);
  let pastDialogue = allDialogues.get(dialogueStack[dialogueStack.length-1]);




  console.log("the oneeee:" + dialogueId);
  console.log(dialogue);
  if (dialogue !== undefined) {


    moveToActions(dialogue);


    if (dialogue.context !== context && dialogue.context !== "Anywhere") {

      let dialogueText = "Please navigate to the " + dialogue.context + " to continue our conversation (click the button to the left to continue).";


// UM WOW this is the basis for moving all of this to the point of render, solves a lot of our weird issues where we were setting it up top.

      if (dialogue.context === "Accounts") {

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
          let userFirstName = process.env.REACT_APP_USER_FIRST_NAME
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
          let userFirstName = process.env.REACT_APP_USER_FIRST_NAME
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
  {/*            <img src="https://media.giphy.com/media/CjmvTCZf2U3p09Cn0h/giphy.gif" width="100%" style={{ marginTop: 8 }} alt="gif" />
  */}            <Button
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
      } else {
        content = (
          <div>
            <div dangerouslySetInnerHTML={{__html: dialogueText}}></div>
            {backContent}
          </div>
        );
      }
    }


  } 

  let imgSrc = "/coach-icon-" + process.env.REACT_APP_COACH + "-200x200.png";

  if (content === undefined) {
    return (
      <View>
      </View>
    );
  } else {
    return (
      <View>
        <View onMouseLeave={onMouseOverCaptureHandler} style={style}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              position: 'relative',
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
