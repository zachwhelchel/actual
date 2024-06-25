import React, { useState, useEffect } from 'react';

import { View } from '../common/View';
import { styles } from '../../style';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Select } from '../common/Select';

import { App as SendbirdApp } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';
import { REACT_APP_CHAT_USER_ID, REACT_APP_UI_MODE } from '../../coaches/coachVariables';

import Coach, { useCoach } from '../coach/Coach';
import { theme, type CSSProperties } from '../../style';


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
  MessageStatus,
  Avatar,
  MessageOptions,
  ReactionsList,
  ReactionSelector,
  Attachment,
  MessageText,
  MML,
  MessageRepliesCountButton,
  MessageTimestamp,
  useMessageContext,
  MessageSimple,
  useChannelStateContext,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

import { EmojiPicker } from 'stream-chat-react/emojis';
import { init, SearchIndex } from 'emoji-mart';
import data from '@emoji-mart/data';

import { Avatar as DefaultAvatar } from 'stream-chat-react';
import type { EventComponentProps } from 'stream-chat-react';



import './layout.css'; // Tell webpack that Button.js uses these styles


export function CoachMessageCenter() {

// your Stream app information
const apiKey = '4skd9jkc6pyk';
const userId = REACT_APP_CHAT_USER_ID;
const userName = 'round';
// const userToken = REACT_APP_CHAT_ACCESS_TOKEN;



  let { chatAccessToken, channelWithMyCoach } = useCoach(); // this is causing the errors.

console.log("userId:" + userId);
console.log("chatAccessToken:" + chatAccessToken);


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
    tokenOrProvider: chatAccessToken,
    userData: user,
  });


  const CustomMessage = () => {
    const { message, isMyMessage } = useMessageContext();

    let marginLeft = '0px';
    if (isMyMessage(message)) {
      marginLeft = 'auto';
    }
    return (
      <div>
{/*        <div style={
          { borderWidth: '2px', marginLeft: marginLeft, marginBottom: '5px', backgroundColor: '#F0E8FD', color: '#000000', borderColor: '#8719E0', borderRadius: '10px', borderStyle: "solid", padding: '10px', width: '300px' }
        }>
          Check out this conversation.
        </div>
*/}        <MessageSimple />
      </div>
    );

  };

  const CustomSystemMessage = (props: EventComponentProps) => {
    const { Avatar = DefaultAvatar, message } = props;

    const { created_at = '', subtype = '', text, user, coach_text = '', client_text = '' } = message;
    const date = created_at.toString();


    const { channel } = useChannelStateContext();

    const coachId = channel.data.coach_id;

    console.log("channel.members");
    console.log(channel.state.members[coachId]?.user?.image);


    if (subtype == "avatar_interaction") {

      if (REACT_APP_CHAT_USER_ID === coachId) {

        return (
          <div className='grid-container' style={
                { paddingTop: "5px" }
            }>
              <div className="grid-item" style={
                {  }
              }>
              </div>

              <div className="grid-item" style={
                {  }
              }>
              </div>

              <div className="grid-item" style={
                {  }
              }>
                <div className="grid-content-right" style={
                  { borderWidth: '2px', float: 'right' }
                }>
                  {coach_text?.trim()}
                </div>
              </div>

              <div className="grid-item" style={
                { }
              }>
                <Avatar image={message.user?.image} name={message.user?.name || message.user?.id} />

                <div className="grid-content-left" style={
                  { borderWidth: '2px', float: 'left', marginLeft: '39px', marginTop: '-35px' }
                }>
                  {client_text?.trim()}
                </div>
              </div>

              <div className="grid-item" style={
                { }
              }>
              </div>

              <div className="grid-item" style={
                { }
              }>
              </div>


          </div>
        );

      } else {

        return (
          <div className='grid-container' style={
                { paddingTop: "5px" }
            }>

              <div className="grid-item" style={
                { }
              }>
                <Avatar image={channel.state.members[coachId]?.user?.image} name={channel.state.members[coachId]?.user?.name || channel.state.members[coachId]?.user?.id} />

                <div className="grid-content-left" style={
                  { borderWidth: '2px', float: 'left', marginLeft: '39px', marginTop: '-35px' }
                }>
                  {coach_text?.trim()}
                </div>
              </div>

              <div className="grid-item" style={
                {  }
              }>
              </div>

              <div className="grid-item" style={
                {  }
              }>
              </div>



              <div className="grid-item" style={
                { }
              }>
              </div>

              <div className="grid-item" style={
                { }
              }>
              </div>

              <div className="grid-item" style={
                {  }
              }>
                <div className="grid-content-right" style={
                  { borderWidth: '2px', float: 'right' }
                }>
                  {client_text?.trim()}
                </div>
              </div>

          </div>
        );


      }


    } else {

        return (
          <div style={
            { textAlign: 'center', marginTop: '10px', marginBottom: '10px' }
          }>
            {text?.trim()}
          </div>
        );
    }


    
  };


  function onAllowTwoWay(channel) {

    if (channel != null) {
      channel.update({
        randomNumberForSystemUpdates: '<RANDOM_STRING_GOES_HERE>',
        subtype: channel.data.subtype,
        coach_id: channel.data.coach_id,
        client_id: channel.data.client_id,
        client_can_message: true
      }, { 
        text: "Two-way messaging has been enabled.",
        silent: true,
      }, { skip_push: true });
    }

  }

  function onRemoveTwoWay(channel) {
    
    if (channel != null) {
      channel.update({
        randomNumberForSystemUpdates: '<RANDOM_STRING_GOES_HERE>',
        subtype: channel.data.subtype,
        coach_id: channel.data.coach_id,
        client_id: channel.data.client_id,
        client_can_message: false
      }, { 
        text: "Two-way messaging has been disabled.",
        silent: true,
      }, { skip_push: true });
    }

  }

  const CustomChannelHeader = (props: ChannelHeaderProps) => {

    const { channel } = useChannelStateContext();


    const coachId = channel.data.coach_id;



    if (REACT_APP_CHAT_USER_ID === coachId) {

      if (channel.data.client_can_message === true) {
        return (
          <div>
            <ChannelHeader/>
            <div style={
              { backgroundColor: theme.pillBackgroundSelected, color: theme.pageText, padding: '20px', textAlign: 'center' }
            }>
              Your client is able to message you and view past interactions with your avatar.


              <Button
                type="normal"
                onClick={() => onRemoveTwoWay(channel)}
                style={{
                  marginTop: '10',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                Disable Two-Way Messaging
              </Button>

            </div>
          </div>
        );
      } else {
        return (
          <div>
            <ChannelHeader/>
            <div style={
              { backgroundColor: theme.warningBackground, color: theme.warningText, padding: '20px', textAlign: 'center' }
            }>
              You don't allow your client to message you currently. They can only get in touch with you by scheduling a video call. They can still use this screen to view past interactions with your avatar and receive any messages from you.

              <Button
                type="normal"
                onClick={() => onAllowTwoWay(channel)}
                style={{
                  marginTop: '10',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                Allow Two-Way Messaging
              </Button>

            </div>
          </div>
        );
      }

    }
    else {

      if (channel.data.client_can_message === true) {
        return (
          <div>
            <ChannelHeader/>
            <div style={
              { backgroundColor: theme.pillBackgroundSelected, color: theme.pageText, padding: '20px', textAlign: 'center' }
            }>
              Directly message your coach and view past interactions with your coach's avatar.
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <ChannelHeader/>
            <div style={
              { backgroundColor: theme.warningBackground, color: theme.warningText, padding: '20px', textAlign: 'center' }
            }>
              Direct messaging isn't supported by your coach currently. To get in touch with your coach schedule a video call. You can still use this screen to view past interactions with your coach's avatar and receive any incoming messages from your coach.
            </div>
          </div>
        );
      }



    }



  };


  const CustomMessageInput = () => {
    const { channel } = useChannelStateContext();


    const coachId = channel.data.coach_id;

    if (REACT_APP_CHAT_USER_ID === coachId) {
      return (
        <MessageInput/>
      );
    }
    else {
      if (channel.data.client_can_message === true) {
        return (
          <MessageInput/>
        );
      } else {
        return (
          <div/>
        );
      }
    }



  };


  if (!client) return <div></div>;

  return (
    <Chat client={client} theme='str-chat__theme-custom'>
      <ChannelList filters={filters} sort={sort} options={options} />
      <Channel Message={CustomMessage} MessageSystem={CustomSystemMessage} EmojiPicker={EmojiPicker} emojiSearchIndex={SearchIndex} >
        <Window>
          <CustomChannelHeader />
          <MessageList />
          <MessageInput Input={CustomMessageInput} />
        </Window>
        <Thread Input={CustomMessageInput} />
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
