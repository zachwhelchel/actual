import React, { useState } from 'react';

import { View } from '../common/View';
import { styles } from '../../style';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Select } from '../common/Select';

import { App as SendbirdApp } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';

export function CoachMessageCenter() {

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
            paddingTop: 14,
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          <div style={{ width:'100vw', height:'calc(100vh - 80px)' }}>
            <SendbirdApp
              // You can find your Sendbird application ID on the Sendbird dashboard. 
              appId={'F689C5BE-0587-44F8-916B-66A51801CC8C'}
              // Specify the user ID you've created on the dashboard.
              // Or you can create a user by specifying a unique userId.  
              userId={'test_zachary'}
            />
          </div>
        </View>

      </View>
    </View>
  );
}
