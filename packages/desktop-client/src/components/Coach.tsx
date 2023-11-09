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
  let [dialogueId, setDialogueId] = useState('nicksmith_1'); //nicktrue_1
  let categoriesCoachRef = useRef([]);
  let [myBudgetCoachReason, setMyBudgetCoachReason] = useState('');
  let [accountStructure, setAccountStructure] = useState('');
  let [budgetWithPartner, setBudgetWithPartner] = useState('');

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
            onClick={() => setDialogueId('')}
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
            onClick={() => setDialogueId('')}
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
            onClick={() => setDialogueId('')}
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
            onClick={() => setDialogueId('')}
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
            onClick={() => setDialogueId('')}
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
            onClick={() => setDialogueId('')}
          >
            {`Let's Go`}
          </Button>
        </div>
      );
    }
    else {
      content = (
        <div>
          {`Nothing`}
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={() => setDialogueId('')}
          >
            {`Bleh`}
          </Button>
        </div>
      );
    }
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
