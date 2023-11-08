import React, { createContext, useContext, useState } from 'react';

//import { useActions } from '../hooks/useActions';

import Button from './common/Button';
import Card from './common/Card';
import View from './common/View';

let CoachContext = createContext();

export function CoachProvider({ children }) {
  let [top, setTop] = useState(window.innerHeight - 20 - 30);
  let [left, setLeft] = useState(window.innerWidth - 20 - 240);
  let [offset, setOffset] = useState(100);
  let [dialogueId, setDialogueId] = useState('nicksmith_1'); //nicktrue_1

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
    transform: `translate(-${offset}%,-${offset}%)`,
    transition: 'all 0.3s ease',
  };

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
          onClick={() => setDialogueId('nicktrue_2')}
        >
          Get Started
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
              width: '200px',
            }}
          >
            {content}
          </Card>
        </div>
      </View>
    </View>
  );
}
