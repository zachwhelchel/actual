import React, { useState } from 'react';

import { View } from '../common/View';
import { styles } from '../../style';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Select } from '../common/Select';

export function CoachDashboard() {

  const [coach, setCoach] = useState('select');

  let testableCoachList = [['select', 'Select a User...'], 
  ['kristinwade', 'Purple Mist'],
  ['nicksmith', 'Large Turtle'],
  ['jordanjung', 'Thrifty Elephant'],
  ['randidegraw', 'Spendy Snake'],
  ['melodybarthelemy', 'Red Star'],
  ['alfredomatos', 'Old Tree'],
  ['aitzanegron', 'Tough Lake'],
  ['zachdemo', 'Wise Grape'],
  ['highlights', 'Strong Leaf'],
  ];

  function handleOnChangeCoach(newValue) {
    setCoach(newValue)
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          ...styles.page,
          ...{ paddingLeft: 40, paddingRight: 40, minWidth: 700 },
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            flex: '0 0 auto',
          }}
        >
          <Card style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ marginBottom: 0, marginTop: 30 }}>113</h1>
            <h3 style={{ marginBottom: 0, marginTop: 15 }}>Directory Views</h3>
            <p style={{ marginBottom: 0, marginTop: 5 }}><i>Last 14 Days</i></p>
            <Button
              type="normal"
              onClick={() => jumpToInput()}
              style={{ marginLeft: '15px', marginRight: '15px', marginTop: '15px', marginBottom: '15px' }}
            >
              Share My Directory Page
            </Button>
          </Card>
          <Card style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ marginBottom: 0, marginTop: 30 }}>22</h1>
            <h3 style={{ marginBottom: 0, marginTop: 15 }}>Free Trial Users</h3>
            <p style={{ marginBottom: 0, marginTop: 5 }}><i>Currently</i></p>
            <Button
              type="normal"
              onClick={() => jumpToInput()}
              style={{ marginLeft: '15px', marginRight: '15px', marginTop: '15px', marginBottom: '15px' }}
            >
              Share My Directory Page
            </Button>
          </Card>
          <Card style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ marginBottom: 0, marginTop: 30 }}>48</h1>
            <h3 style={{ marginBottom: 0, marginTop: 15 }}>Paid Users</h3>
            <p style={{ marginBottom: 0, marginTop: 5 }}><i>Currently</i></p>
            <Button
              type="normal"
              onClick={() => jumpToInput()}
              style={{ marginLeft: '15px', marginRight: '15px', marginTop: '15px', marginBottom: '15px' }}
            >
              Share My Directory Page
            </Button>
          </Card>
        </View>
        <View
          style={{
            flex: '0 0 auto',
            flexDirection: 'row',
          }}
        >
          <Card style={{ flex: 1, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 0, marginTop: 15 }}>Update My Avatar</h3>
            <Button
              type="normal"
              onClick={() => jumpToInput()}
              style={{ marginLeft: '15px', marginRight: '15px', marginTop: '15px', marginBottom: '10px' }}
            >
              Make Edits on Draw.io
            </Button>
            <Button
              type="normal"
              onClick={() => jumpToInput()}
              style={{ marginLeft: '15px', marginRight: '15px', marginTop: '0px', marginBottom: '15px' }}
            >
              Submit Latest Draw.io For Publishing
            </Button>
          </Card>
          <Card style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ marginBottom: 0, marginTop: 30 }}>$144.00</h1>
            <h3 style={{ marginBottom: 0, marginTop: 15 }}>Estimated Next Payout</h3>
            <p style={{ marginBottom: 0, marginTop: 5 }}><i>Friday, March 1st</i></p>

          </Card>
        </View>

        <View
          style={{
            flex: '0 0 auto',
            flexDirection: 'row',
          }}
        >
          <Card style={{ flex: 1, height: '400px', flexDirection: 'column' }}>
            <Select options={testableCoachList} value={coach} onChange={newValue => handleOnChangeCoach(newValue)}/>
            {coach !== 'select' &&

              <div style={{ flex: 1, overflowY: 'auto'}}>
                <ul>


                  <li>Yesterday @ 12:30pm: Introduction - Now let's practice adding transactions to your...</li>
                  <li>Yesterday @ 12:29pm: Introduction - Here's your progress: 1. Account Tour & Setup...</li>
                  <li>Yesterday @ 12:28pm: Introduction - That concludes the tour of your account page! Remember...</li>
                  <li>Yesterday @ 12:28pm: Introduction - "Close account": If you need to get this account out...</li>
                  <li>Yesterday @ 12:28pm: Introduction - "Link account": This feature is coming soon! You'll be...</li>
                  <li>Yesterday @ 12:22pm: Introduction - Reconcile" is a fancy word for making sure you're...</li>
                  <li>Yesterday @ 12:22pm: Introduction - With "Export" you can download all of your transactions...</li>
                  <li>Yesterday @ 12:21pm: Introduction - ""Hide "cleared" checkboxes" removes the column that...</li>
                  <li>Yesterday @ 12:21pm: Introduction - "By clicking "Show running balance", a new column is...</li>
                  <li>Yesterday @ 12:21pm: Introduction - "You've got even more options here. Click this and...</li>
                  <li>Yesterday @ 12:20pm: Introduction - "These arrows allow you to expand or collapse split...</li>
                  <li>Monday @ 9:45am: Introduction - "With MyBudgetCoach, you can enter this purchase as one...</li>
                  <li>Monday @ 9:45am: Introduction - "Sometimes you'll have a "split" transaction. Like those...</li>
                  <li>Monday @ 9:45am: Introduction - "The search bar helps you find transactions based on date...</li>
                  <li>Monday @ 9:44am: Introduction - "The Filter button lets you view transactions based on...</li>
                  <li>Monday @ 9:44am: Introduction - "This is where you manually add new transactions for this...</li>
                  <li>Monday @ 9:43am: Introduction - "If you get through setup and want to use this option, I...</li>
                  <li>Monday @ 9:43am: Introduction - "This button lets you upload an Excel or CSV file of your...</li>
                  <li>Monday @ 9:43am: Introduction - "I'll give more explanation as to why this is important...</li>
                  <li>Monday @ 9:42am: Introduction - "Below the name you can see the account balance. Click here...</li>
                  <li>Monday @ 9:42am: Introduction - "Click on your checking account."</li>
                  <li>Monday @ 9:42am: Introduction - "You're doing great! Now I'm going to give you a little...</li>
                  <li>Monday @ 9:42am: Introduction - "Great, you can move onto the next step!"</li>
                  <li>Monday @ 9:42am: Introduction - "But wait, what about your savings account? For now we...</li>
                  <li>Monday @ 9:41am: Introduction - "Now click "Create Local Account." Name your account and...</li>

                </ul>
              </div>
            }


          </Card>
        </View>

        <View
          style={{
            marginTop: 15,
            marginLeft: 5,
            flex: '0 0 auto',
            flexDirection: 'row',
          }}
        >
          Need help? Reach out anytime on Discord.
        </View>


      </View>
    </View>
  );
}
