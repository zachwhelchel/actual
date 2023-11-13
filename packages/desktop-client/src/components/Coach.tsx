import React, { createContext, useContext, useState, useRef } from 'react';

//import { useActions } from '../hooks/useActions';

import Button from './common/Button';
import Card from './common/Card';
import View from './common/View';

let CoachContext = createContext();

export function CoachProvider({ children }) {
  let [top, setTop] = useState(window.innerHeight - 20);
  let [left, setLeft] = useState(window.innerWidth - 20 - 240);
  let [offset, setOffset] = useState(100);
  let [dialogueId, setDialogueId] = useState('nicksmith_1'); //nicktrue_1 //nicksmith_1
  let categoriesCoachRef = useRef([]);
  let [myBudgetCoachReason, setMyBudgetCoachReason] = useState('');
  let [accountStructure, setAccountStructure] = useState('');
  let [budgetWithPartner, setBudgetWithPartner] = useState('');
  let [moreCardsCount, setMoreCardsCount] = useState('');
  let [currentBalanceCalculation, setCurrentBalanceCalculation] = useState('');

  return (
    <CoachContext.Provider
      value={{
        top,
        setTop,
        left,
        setLeft,
        offset,
        setOffset,
        dialogueId,
        setDialogueId,
        categoriesCoachRef,
        myBudgetCoachReason,
        setMyBudgetCoachReason,
        accountStructure,
        setAccountStructure,
        budgetWithPartner,
        setBudgetWithPartner,
        moreCardsCount,
        setMoreCardsCount,
        currentBalanceCalculation,
        setCurrentBalanceCalculation,
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
  onSaveGroup,
  onSaveCategory,
  onSaveNewCategories,
  categoryGroups,
  categoriesRef,
}) {
  let {
    top,
    setTop,
    left,
    setLeft,
    offset,
    setOffset,
    dialogueId,
    setDialogueId,
    categoriesCoachRef,
    myBudgetCoachReason,
    setMyBudgetCoachReason,
    accountStructure,
    setAccountStructure,
    budgetWithPartner,
    setBudgetWithPartner,
    moreCardsCount,
    setMoreCardsCount,
    currentBalanceCalculation,
    setCurrentBalanceCalculation,
  } = useCoach();

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
    setMyBudgetCoachReason("notCloser");
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_6');
  };

  const nickSmithOption2 = async () => {
    setMyBudgetCoachReason("newBudget");
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
    setAccountStructure("noCC");
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_12');
  };

  const nickSmithOption6 = async () => {
    setAccountStructure("1and1");
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_12');
  };

  const nickSmithOption7 = async () => {
    setAccountStructure("moreThanOneCC");
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_12');
  };

  const nickSmithOption8 = async () => {
    setBudgetWithPartner("justMe");
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_13');
  };

  const nickSmithOption9 = async () => {
    setBudgetWithPartner("jointConsolidated");
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_13');
  };

  const nickSmithOption10 = async () => {
    setBudgetWithPartner("jointSeparate");
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    setDialogueId('nicksmith_13');
  };

  const nickSmithCCCheck = async () => {
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    if (accountStructure === "noCC") {
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
    if (accountStructure === "1and1") {
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
    setMoreCardsCount("one");
    setDialogueId('nicksmith_multicc_3');
  };

  const nickSmithOptionMultiCC2 = async () => {
    setMoreCardsCount("two");
    setDialogueId('nicksmith_multicc_4');
  };

  const nickSmithOptionMultiCC3 = async () => {
    setMoreCardsCount("three");
    setDialogueId('nicksmith_multicc_5');
  };

  const nickSmithCCCheck3 = async () => {
    setTop(window.innerHeight - 20);
    setLeft(window.innerWidth - 20 - 240);
    setOffset(100);
    if (moreCardsCount === "one") {
      setDialogueId('nicksmith_wrap_accounts');
    } else if (moreCardsCount === "two") {
      setDialogueId('nicksmith_multicc_9');
    } else if (moreCardsCount === "three") {
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
    if (moreCardsCount === "two") {
      setDialogueId('nicksmith_multicc_11');
    } else if (moreCardsCount === "three") {
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
    if (accountStructure === "1and1" || accountStructure === "moreThanOneCC") {
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
    setCurrentBalanceCalculation("yesPending");
    setDialogueId('nicksmith_vab_5');
  };

  const nickSmithOptionVAB2 = async () => {
    setCurrentBalanceCalculation("yesNoPending");
    setDialogueId('nicksmith_vab_24');
  };

  const nickSmithOptionVAB3 = async () => {
    setCurrentBalanceCalculation("no");
    setDialogueId('nicksmith_vab_29');
  };

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
  const style = {
    position: 'absolute',
    left: left,
    top: top,
    zIndex: 10001,
    transform: `translate(-${offset}%,-${offset}%)`
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
          onClick={() => showZoomCall()}
        >
          Get Started
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_2') {
    content = (
      <div>
        Before we begin the set-up process, I just want to let you know about some aspects of MyBudgetCoach. If at any time you reach a point where you would like a one-on-one coaching session with me, please select the link to the left and select a time that works for you. Please note, one-on-one coaching does have an additional hourly fee, in addition to your MyBudgetCoach subscription.
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
        <p>We will start off with the following steps for Account Set-Up stage.</p>
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
        {`Congratulations creating your first Budget! Please keep in mind you can create many budgets overtime. For example, if you have a big life event and want to start 'fresh' with the new financial reality, a new Budget can be a great way to have a re-set, knowing your prior budget will always be available for viewing at any time.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => nickSmithOption3()}
        >
          Next
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_9') {
    content = (
      <div>
        {`MyBudgetCoach allows you to name each budget. Since you may have multiple budgets long-term, I recommend to name the Budget something specific, and end with "..._MonthYear" that you start the budget. This will help you remember which Budget was used for which time period.`}
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
    if (accountStructure === "noCC" && (budgetWithPartner === "justMe" || budgetWithPartner === "jointSeparate")) {
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
    else if (accountStructure === "noCC" && budgetWithPartner === "jointConsolidated") {
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
    else if (accountStructure === "1and1" && (budgetWithPartner === "justMe" || budgetWithPartner === "jointSeparate")) {
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
    else if (accountStructure === "1and1" && budgetWithPartner === "jointConsolidated") {
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
    else if (accountStructure === "moreThanOneCC" && (budgetWithPartner === "justMe" || budgetWithPartner === "jointSeparate")) {
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
    else if (accountStructure === "moreThanOneCC" && budgetWithPartner === "jointConsolidated") {
      content = (
        <div>
          {`Based on your answers, I recommend adding your joint checking account first and then your main credit card account.`}
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
    if (budgetWithPartner === "jointConsolidated") {
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
    if (budgetWithPartner === "jointConsolidated") {
      content = (
        <div>
          {`Please select the Create Local Account option. Name your joint account, and then enter the current balance of your checking account.`}
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
    if (budgetWithPartner === "noCC") {
      content = (
        <div>
          {`Great job adding your account! You may be thinking: Let me add in my savings account next.`}
          <p>{`Let's wait on adding that account for now.`}</p>
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
          <p>{`Let's wait on adding that account for now.`}</p>
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
  } else if (dialogueId === 'nicksmith_nocc_2') {
    content = (
      <div>
        {`Although you may have a savings account, as you first start using MyBudgetCoach, I recommend to not link the Savings account at this stage. If at a later point, once you are a routine user, you want to add your savings account, go for it!`}
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
        {`If you want to further understand the use of saving accounts, please schedule a live coaching session with me and I would be happy to walk you through best practices.`}
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
          onClick={() => setDialogueId('nicksmith_nocc_5')}
        >
          Next
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_nocc_5') {
    content = (
      <div>
        {`Let's now walk through the features and use of the Account screen.`}
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
    if (budgetWithPartner === "jointConsolidated") {
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
        {`Please select the Create Local Account option. Name your account, and then enter the current balance of your credit card.`} 
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
        {`You selected earlier that you have more than one credit card. Let me ask a question to understand more about your current financial structure.`} 
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
  } else if (dialogueId === 'nicksmith_multicc_3') {
    content = (
      <div>
        {`Thanks for your answer! Let's add one more account to capture your total expenses.`} 
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_multicc_6')}
        >
          {`Ask Away`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_4') {
    content = (
      <div >
        {`Thanks for your answer! Let's now add the credit card account that is used the most often of your remaining accounts.`} 
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_multicc_6')}
        >
          {`Ask Away`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_5') {
    content = (
      <div >
        {`Thanks for your answer! Let's now add the credit card account that is used the most often of your remaining accounts.`} 
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_multicc_6')}
        >
          {`Ask Away`}
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
        {`Please select the Create Local Account option. Name your account, and then enter the current balance of your credit card, including a leading '-' to make the amount entered negative.`} 
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
        {`Please select the Create Local Account option. Name your account, and then enter the current balance of your credit card, including a leading '-' to make the amount entered negative.`} 
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
    content = (
      <div >
        {`Based on the number of transactions that occur per week, I would recommend leaving out the remainder of your credit card accounts for now, and then if you would like to add additional ones on a future date, feel free!`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_wrap_accounts')}
        >
          {`I Added My Account`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_19') {
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
        {`Please select the Create Local Account option. Name your account, and then enter the current balance of your credit card, including a leading '-' to make the amount entered negative.`}
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
          onClick={() => setDialogueId('nicksmith_multicc_23')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_multicc_23') {
    content = (
      <div >
        {`Prior to linking a fifth account, I am going to ask you the same question as before, for the frequency of transactions.`}
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
  } else if (dialogueId === 'nicksmith_multicc_27') {
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
        {`Now that we have completed the overview of the account screen, let's now add two hypothetical transactions to the checking account and two transactions to a credit card account, if applicable.`}
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
          onClick={() => setDialogueId('nicksmith_at_4')}
        >
          {`I Added A New Transaction`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_4') {
    content = (
      <div >
        {`Please select today's date for the transaction date. Although the system allows you to select a date in the future, I strongly recommend you don't add transactions with future dates, unless they are scheduled. We will review scheduled transactions at a later point.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_5')}
        >
          {`I Selected Today`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_5') {
    content = (
      <div >
        {`For the Payee, let's enter 'Grocery Store.'`}
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
          {`I Added 50 As A Payment`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_11') {
    content = (
      <div >
        {`Actually, this transaction is entered as a Payment. Let me explain. A Deposit is income coming into your checking account. For example, your paycheck would be a Deposit. Any outflow for purchases or paying bills would be entered as Payment. Let's do that now.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_12')}
        >
          {`I Added 50 As A Payment`}
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
          onClick={() => setDialogueId('nicksmith_at_15')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_15') {
    content = (
      <div >
        {`Let's now add a transaction for an inflow. Please select today's date. For the Payee enter 'Employer,' Category is Income, Deposit is 500, and select 'Add.'`}
        <p>{`Any income received, including returns or rebates, should all be entered with a Category as 'Income.'`}</p>
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
        {`The payment to the grocery store has been cleared, but the income has not been cleared.`}
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
        {`Please select the Account Balance in green text to expand the Cleared total and Uncleared total. As you can see, the Uncleared total is 500. If you were to clear the transaction, the Cleared total would match the account balance and the Uncleared total would be 0.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_at_19')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_at_19') {
    // This doesnt always make sense.
    content = (
      <div >
        {`Great work! Let's now add two transactions to a credit card account.`}
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
        {`The important difference between the credit card account compared to the checking account is that Payments increase the balance, and Deposits decrease the balance.`}
        <p>{`This is because a credit card balance is negative and the checking account balance is positive.`}</p>
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
        {`Please select your main credit card account.`}
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
        {`Please select '+ Add New', select today's date, and enter a Payee of 'Verizon.'`}
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
        {`For the category, please select 'Bills', enter a Payment amount of 100, and clear the transaction.`}
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
        {`Notice how the credit card balance, a red negative number, increased by 100.`}
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
        {`Please select '+ Add New', select today's date, and select 'Make Transfer' for the Payee.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_act_8')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_act_8') {
    content = (
      <div >
        {`Select the checking account under the 'Transfer To/From'.`}
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
        {`Please notice how the Category field is now populated with 'Transfer'. Enter 100 in the 'Deposit' field to reduce the balance.`}
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
        {`Since you selected 'Make Transfer' as the Payee, this automatically added a transaction to your checking account as well.`}
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
        {`Please notice the difference between your checking account transfer is a Payment lowering the balance but the credit card account has the payment entered as a Deposit lowering the balance.`}
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
        {`KUDOS on creating transactions for both accounts.`}
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
        {`Before we flip over to the Budget and start building out your categories, let's first validate your starting balances for your checking account.`}
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
        {`When re-creating a copy of your financial institution transactions and balance in MyBudgetCoach, one of the most important pieces is you understand how the amount you see when you login to your bank account is calculated. Let me explain.`}
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
        {`Some financial institutions calculate the balance shown after taking into account pending transactions. Others calculate the current balance only taking into account cleared transactions.`}
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
        {`Ok; This likely means that MyBudgetCoach may not match your current balance in your financial institution.`}
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
          onClick={() => setDialogueId('nicksmith_vab_7')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_7') {
    content = (
      <div >
        {`First, please log in to your bank account. Once logged in, please let me know.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_8')}
        >
          {`I Am Logged In`}
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
        {`Excellent! This means your current balance in MyBudgetCoach is correct. You now have a solid financial foundation to build on for your Budget.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_20')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_12') {
    content = (
      <div >
        {`Ok; understood. Please pull up a calculator. Time to complete some quick math!`}
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
        {`Ok great. Take that amount and SUBTRACT it from your current bank balance.`}
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
        {`This means if your pending transactions are negative, you would be adding them back to increase your balance. If your pending transactions were positive, it would reduce your balance.`}
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
        {`Please enter this new amount into your Starting Balance transaction field for your account.`}
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
          onClick={() => setDialogueId('nicksmith_vab_19')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_19') {
    content = (
      <div >
        {`Different financial institutions calculate the current balance differently, so it is possible a different account on your profile won't need to complete these steps.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_20')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_20') {
    content = (
      <div >
        {`Once you select your next account, we will walk through the same exercise together to determine how best to calculate your starting balance.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_21') {
    content = (
      <div >
        {`Understood; Let's work together to adjust the Starting Balance amount.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_22')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_21') {
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
        {`OK! Please adjust your starting balance amount to the balance you see in your bank account.`}
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
        {`Please confirm once you have adjusted the starting balance.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_11')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_24') {
    content = (
      <div >
        {`Ok; This likely means that MyBudgetCoach will match your financial institution.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_25')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_25') {
    content = (
      <div >
        {`First, please log in to your bank account. Once logged in, please let me know.`}
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
        {`Understood; Please adjust your starting balance amount to the balance you see in your bank account.`}
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
        {`Please confirm once you have adjusted the starting balance.`}
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
        {`Ok; I am here to help and I am confident we can solve this question together!`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_30')}
        >
          {`Next`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_30') {
    content = (
      <div >
        {`First, please log in to your bank account. Once logged in, please let me know.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_31')}
        >
          {`I'm Logged In`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_31') {
    content = (
      <div >
        {`Reviewing your account, are there any pending transactions?`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_32')}
        >
          {`No`}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('')}
        >
          {`Yes`}
        </Button>
      </div>
    );
  } else if (dialogueId === 'nicksmith_vab_32') {
    content = (
      <div >
        {`Ok! Thanks for that information.`}
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => setDialogueId('nicksmith_vab_26')}
        >
          {`Next`}
        </Button>
      </div>
    );
  }



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
            src="/coach-icon-nicksmith-200x200.png"
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
