import React, { useState, useEffect } from 'react';

import { View } from '../common/View';
import { styles } from '../../style';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Select } from '../common/Select';

import { App as SendbirdApp } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';
import { REACT_APP_CHAT_USER_ID, REACT_APP_CHAT_ACCESS_TOKEN } from '../../coaches/coachVariables';



import type { User, ChannelSort, ChannelFilters, ChannelOptions } from 'stream-chat';
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

import { EmojiPicker } from 'stream-chat-react/emojis';
import { init, SearchIndex } from 'emoji-mart';
import data from '@emoji-mart/data';

import './layout.css'; // Tell webpack that Button.js uses these styles


export function CoachMessageCenter() {

// your Stream app information
const apiKey = '4q98r9p2kn2g';
const userId = REACT_APP_CHAT_USER_ID;
const userName = 'round';
const userToken = REACT_APP_CHAT_ACCESS_TOKEN;

console.log("userId:" + userId);
console.log("userToken:" + userToken);


const user: User = {
  id: userId,
};

const sort: ChannelSort = { last_message_at: -1 };
const filters: ChannelFilters = {
  type: 'messaging',
  members: { $in: [userId] },
};
const options: ChannelOptions = {
  limit: 10,
};


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

  useEffect(() => {
    // removeElementsByClass('sendbird-ui-header__right');
    // removeElementsByClass('sendbird-chat-header__right__info');
  }, [])

  const removeElementsByClass = className => {
    const elements = document.getElementsByClassName(className);
    Array.from(elements).forEach(el => el.parentNode.removeChild(el));
  };




  const [channel, setChannel] = useState<StreamChannel>();
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: user,
  });

  if (!client) return <div></div>;

  return (
    <Chat client={client} theme='str-chat__theme-custom'>
      <ChannelList filters={filters} sort={sort} options={options} />
      <Channel EmojiPicker={EmojiPicker} emojiSearchIndex={SearchIndex}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );


  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          ...styles.page,
          ...{ paddingLeft: 40, paddingRight: 40, minWidth: 700 },
        }}
      >
        {/*<View
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
              userId={REACT_CHAT_USER_ID}
              accessToken={REACT_CHAT_ACCESS_TOKEN}
              allow_group_channel_create_from_sdk= "off"
            />
            
          </div>
        </View>*/}

      </View>
    </View>
  );
}
